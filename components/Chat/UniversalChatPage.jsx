'use client'
import ChatInput from "/components/Chat/ChatInput";
import MessageList from "/components/Chat/MessagesList";
import {useEffect, useState} from "react";
import Tag from "/components/Tag/Tag";
import {Flex} from "@chakra-ui/react";
import {get_app_chat_message_list} from "/api/app";
import {v4 as uuidv4} from "uuid"
import {fetchEventSource} from '@microsoft/fetch-event-source';


export default function UniversalChatPage({appInfo, chat_id, chat_name, prompt_instruction=''}) {
    const [messageList, setMessageList] = useState([])
    const [waitingReply, setWaitingReply] = useState(false)

    useEffect(() => {
        getAppChatMessageList()
    }, []);


    async function getAppChatMessageList() {
        const message_list = await get_app_chat_message_list(chat_id)
        if (message_list && message_list.length) {
            setMessageList(message_list)
        }
    }

    const addMessage = (msg) => {
        setMessageList((prevList) => [...prevList, msg])
    }

    const delMessage = (index = -1) => {
        setMessageList(prevList => [...prevList.slice(0, index)])
    }

    const updateMessage = (data) => {
        setMessageList(prevList => [...prevList.slice(0, -1), data])
    }

    async function stream_generate(query) {
        const message = {
            id: uuidv4(),
            role: "user",
            type: 'text',
            content: query,
        }
        addMessage(message)

        const responseMessage = {
            id: uuidv4(),
            role: "assistant",
            type: 'text',
            content: "正在思考中...",
            response: {},
        }
        addMessage(responseMessage)
        setWaitingReply(true)

        await fetchEventSource(process.env.NEXT_PUBLIC_LLM_CHAT, {
            openWhenHidden: true,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("Authorization")
            },
            body: JSON.stringify({
                "app_id": appInfo.id,
                "chat_id": chat_id,
                "uid": message.id,
                "answer_uid": responseMessage.id,
                "prompt": prompt_instruction + message.content,
                "model_name": appInfo.llm_name
            }),
            onmessage(msg) {
                // 解码内容
                try {
                    const res = JSON.parse(msg.data)
                    setWaitingReply(false)
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
                setWaitingReply(false)
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

    return (
        <div className='w-full relative'>
            <div className='h-[64px] px-6 py-5'>
                <Flex gap={3}>
                    <div>{chat_name}</div>
                    <Tag text={messageList.length + '条记录'}/>
                </Flex>
            </div>
            <div className='h-[1px] w-full bg-gray-200'/>
            {messageList.length && (
                <MessageList messageList={messageList} stream_generate={stream_generate} waitingReply={waitingReply}/>)}
            <ChatInput stream_generate={stream_generate}/>
        </div>
    )
}
