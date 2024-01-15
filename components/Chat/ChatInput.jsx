import MyButton from "/components/common/MyButton"
import {PiLightningFill} from "react-icons/pi"
import {FiSend} from "react-icons/fi"
import TextareaAutoSize from "react-textarea-autosize"
import React, {useEffect, useState} from "react"
import {v4 as uuidv4} from "uuid"
import {fetchEventSource} from '@microsoft/fetch-event-source';
import {useToast} from '@chakra-ui/react'

export default function ChatInput({ appId, currentModel, selectChatId, addMessage, updateMessage}) {
    const toast = useToast()
    const [messageText, setMessageText] = useState("")

    const [custom, setCustom] = useState({})


    async function send() {
        const message = {
            id: uuidv4(),
            role: "user",
            type: 'text',
            content: messageText,
        }
        setMessageText("")
        addMessage(message)

        const responseMessage = {
            id: uuidv4(),
            role: "assistant",
            type: 'text',
            content: "正在思考中...",
            response: {},
        }
        addMessage(responseMessage)

        await fetchEventSource(process.env.NEXT_PUBLIC_LLM_CHAT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("Authorization")
            },
            body: JSON.stringify({
                "app_id": appId,
                "chat_id": selectChatId,
                "uid": message.id,
                "answer_uid": responseMessage.id,
                "prompt": message.content,
                "model_name": currentModel,
                "custom": custom
            }),
            onmessage(msg) {
                // 解码内容
                try {
                    const res = JSON.parse(msg.data)
                    updateMessage({
                        id: responseMessage.id,
                        role: responseMessage.role,
                        type: 'text',
                        content: res['answer'],
                        response: res,
                    })
                } catch (e) {
                    console.log(e)
                }

            },
            onerror(error) {
                updateMessage({
                    id: responseMessage.id,
                    role: responseMessage.role,
                    type: 'text',
                    content: '抱歉！服务繁忙！请稍后重试！',
                    response: {},
                })
                throw error
            }
        })

    }

    function handleEnter(e) {
        if (e.metaKey && e.code === 'Enter') {
            setMessageText(messageText + '\n')
        } else {
            if (e.code === 'Enter') {
                if (messageText) {
                    send()
                }
            }
        }
    }

    return (
        <div className='absolute bottom-6 inset-x-0'>
            <div className='w-full max-w-4xl mx-auto flex flex-col items-center px-4 space-y-4'>
                <div
                    className='flex items-end w-full border border-back/10 bg-blue-100 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] py-2'>
                    <div className='mx-3 mb-2.5'>
                        <PiLightningFill/>
                    </div>
                    <TextareaAutoSize
                        className='outline-none flex-1 max-h-64 mb-1.5 bg-transparent text-black resize-none border-0'
                        placeholder='输入一条消息...'
                        rows={1}
                        value={messageText}
                        maxLength={32 * 1024}
                        onKeyDown={handleEnter}
                        onChange={(e) => {
                            if (!(e.target.value === '\n')) {
                                setMessageText(e.target.value)
                            }
                        }}
                    />
                    <MyButton
                        className='mx-3 !rounded-lg text-blue-500'
                        icon={FiSend}
                        disabled={messageText.trim() === ""}
                        variant='primary'
                        onClick={send}
                    />
                </div>
            </div>
        </div>
    )
}
