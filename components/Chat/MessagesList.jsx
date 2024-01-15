'use client'
import Markdown from "/components/common/Markdown"
import {SiOpenai} from "react-icons/si"
import {useEffect, useRef, useState} from "react";
import Tag from "/components/Tag/Tag"
import {Flex, Button} from "@chakra-ui/react"
import MyTooltip from "/components/Tooltip/Tooltip";
import {GoCopy} from "react-icons/go";
import {RiDeleteBinLine} from "react-icons/ri";
import {BsArrowRepeat} from "react-icons/bs";
import {LuPenLine} from "react-icons/lu";
import {CiStar} from "react-icons/ci";
import ChatButton from "/components/Chat/ChatButton";
import {v4 as uuidv4} from "uuid";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import JsonView from 'react18-json-view'
import 'react18-json-view/src/style.css'
import {fetchEventSource} from "@microsoft/fetch-event-source";
import Image from "next/image";
import {useToast} from '@chakra-ui/react'


export default function MessageList({
                                        appId,
                                        currentModel,
                                        selectChatId,
                                        messageList,
                                        addMessage,
                                        delMessage,
                                        updateMessage
                                    }) {
    const toast = useToast()
    const [showFullResponseModal, setShowFullResponseModal] = useState(false)
    const [fullResponse, setFullResponse] = useState({})
    const [showAnswerLabelModal, setShowAnswerLabelModal] = useState(false)
    const listRef = useRef(null)
    const [showRetriever, setShowRetriever] = useState(false)
    const [retrieverData, setRetrieverData] = useState('')

    useEffect(() => {
        // 每当数据更新时，滚动到最新的数据
        if (listRef.current) {
            // @ts-ignore
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messageList])

    async function Regenerate(message_id, prompt) {
        delMessage()

        const responseMessage = {
            id: uuidv4(),
            role: "assistant",
            type: 'text',
            content: "正在思考中...",
            response: {}
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
                "uid": message_id,
                "answer_uid": responseMessage.id,
                "prompt": prompt,
                "model_name": currentModel
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

    async function copyTextToClipboard(text) {
        if ('clipboard' in navigator) {
            await navigator.clipboard.writeText(text);
        } else {
            document.execCommand('copy', true, text);
        }
        toast({
            title: '复制成功',
            status: 'success',
            position: 'top',
            duration: 2000,
        })
    }

    function showFullResponse(data) {
        setFullResponse(data)
        setShowFullResponseModal(true)
    }

    function showRetrieverData(data) {
        setRetrieverData(data)
        setShowRetriever(true)
    }

    function showAnswerLabel() {
        setShowAnswerLabelModal(true)
    }

    return (
        <>
            <div className='w-full max-w-4xl mx-auto'>
                <ul ref={listRef} style={{maxHeight: 'calc(100vh - 200px)'}} className='overflow-auto'>
                    {messageList.map((message) => {
                        const isAssistant = message.role === "assistant"
                        return (
                            <li
                                key={message.id}
                                className={`${
                                    isAssistant
                                        ? 'justify-start'
                                        : 'justify-end'
                                } w-full max-w-4xl mx-auto flex space-x-6 px-4 py-6`}
                            >
                                {message.role === 'user' && (
                                    <div>
                                        <div>
                                            <Flex gap={3} w={'100%'} alignItems={'center'} justifyContent={'flex-end'}>
                                                {message.type === 'text' && (
                                                    <>
                                                        <MyTooltip label='复制'>
                                                            <ChatButton
                                                                onClick={() => copyTextToClipboard(message.content)}>
                                                                <GoCopy/>
                                                            </ChatButton>
                                                        </MyTooltip>
                                                        <MyTooltip label='重新生成'>
                                                            <ChatButton
                                                                onClick={() => Regenerate(message.id, message.content)}>
                                                                <BsArrowRepeat/>
                                                            </ChatButton>
                                                        </MyTooltip>
                                                    </>
                                                )}
                                                <MyTooltip label='删除'>
                                                    <ChatButton>
                                                        <RiDeleteBinLine/>
                                                    </ChatButton>
                                                </MyTooltip>
                                                <div
                                                    className='text-3xl shadow-[0_0_1px_1px_rgba(0,0,0,0.2)] bg-white border rounded-lg border-gray-100'>😊
                                                </div>
                                            </Flex>
                                        </div>
                                        {message.type === 'image' ? (
                                            <Image src={message.url} alt='image' width={message.width || 600}
                                                   height={message.height || 600}/>) : (
                                            <div
                                                className='bg-blue-100 rounded-lg shadow-[0_2px_2px_2px_rgba(96,165,250,0.3)] text-sm mt-3 text-right px-2 py-2 max-w-fit ml-auto'>
                                                <Markdown>{message.content}</Markdown>
                                            </div>)}
                                    </div>
                                )}
                                {message.role === 'assistant' && (
                                    <div>
                                        <div>
                                            <Flex gap={3} w={'100%'} alignItems={'center'}
                                                  justifyContent={'flex-start'}>
                                                <div
                                                    className='text-3xl bg-white border rounded-lg border-gray-100 shadow-[0_0_1px_1px_rgba(0,0,0,0.2)]'>
                                                    <SiOpenai/></div>
                                                <MyTooltip label='复制'>
                                                    <ChatButton onClick={() => copyTextToClipboard(message.content)}>
                                                        <GoCopy/>
                                                    </ChatButton>
                                                </MyTooltip>
                                                <MyTooltip label='删除'>
                                                    <ChatButton>
                                                        <RiDeleteBinLine/>
                                                    </ChatButton>
                                                </MyTooltip>
                                                <MyTooltip label='标注预期答案'>
                                                    <ChatButton onClick={showAnswerLabel}>
                                                        <LuPenLine/>
                                                    </ChatButton>
                                                </MyTooltip>
                                                <MyTooltip label='给本次回答打个分'>
                                                    <ChatButton>
                                                        <CiStar/>
                                                    </ChatButton>
                                                </MyTooltip>
                                            </Flex>
                                        </div>
                                        {message.type === 'image' ? (
                                            <Image src={message.url} alt='image' width={message.width || 600}
                                                   height={message.height || 600}/>
                                        ) : (
                                            <div
                                                className='bg-pink-100 rounded-lg shadow-[0_2px_2px_2px_rgba(244,114,182,0.3)] text-sm mt-3 px-2 py-2'>
                                                <Markdown>{message.content}</Markdown>
                                                <Flex alignItems='center' mt='4' flexWrap='wrap' gap='2'>
                                                    <MyTooltip label='本次回答所关联的上下文对数'>
                                                        <Tag
                                                            text={`${message.response.history ? message.response.history.length : 0}对上下文`}/>
                                                    </MyTooltip>
                                                    <MyTooltip label='知识库中的引用'>
                                                        <Tag
                                                            text={`${message.response.retrieval ? message.response.retrieval.sources_len : 0}条引用`}
                                                            onClick={() => showRetrieverData(message.response.retrieval.sources)}/>
                                                    </MyTooltip>
                                                    <MyTooltip label='本次请求总共使用的token数量'>
                                                        <Tag
                                                            text={`${message.response.usage ? message.response.usage.total_tokens : 0} tokens`}/>
                                                    </MyTooltip>
                                                    <MyTooltip label='本次请求所用时间'>
                                                        <Tag
                                                            text={`${message.response.time_cost ? message.response.time_cost.total : '0s'}`}/>
                                                    </MyTooltip>
                                                    {message.response.retrieval && message.response.retrieval.MultiQueryRetriever && (
                                                        <MyTooltip label='MultiQueryRetriever'>
                                                            <Tag text='MultiQueryRetriever'
                                                                 onClick={() => showRetrieverData(message.response.retrieval.MultiQueryRetriever)}/>
                                                        </MyTooltip>
                                                    )}
                                                    <MyTooltip label='点击查看完整响应'>
                                                        <Tag text='完整响应'
                                                             onClick={() => showFullResponse(message.response)}/>
                                                    </MyTooltip>
                                                </Flex>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </li>
                        )
                    })}
                </ul>
            </div>
            {showFullResponseModal && (
                <Modal isOpen={true} onClose={() => setShowFullResponseModal(false)}>
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalHeader>完整响应</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                            <div className='border bg-orange-50 px-2 py-3'>
                                <JsonView src={fullResponse} theme={'atom'}/>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button border='1px' borderColor='gray.200'
                                    onClick={() => setShowFullResponseModal(false)}>关闭</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
            {showAnswerLabelModal && (
                <Modal isOpen={true} onClose={() => setShowAnswerLabelModal(false)}>
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalHeader>请输入期望的答案</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                            <textarea className='h-64 border bg-orange-50 w-full' placeholder='请输入期望的答案......'/>
                        </ModalBody>
                        <ModalFooter>
                            <Button border='1px' borderColor='gray.200'
                                    onClick={() => setShowAnswerLabelModal(false)}>确认</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
            {showRetriever && (
                <Modal isOpen={true} onClose={() => setShowRetriever(false)}>
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalHeader>详细数据</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                            <div className='border bg-orange-50 px-2 py-3'>
                                <JsonView src={retrieverData} theme={'atom'}/>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button border='1px' borderColor='gray.200'
                                    onClick={() => setShowRetriever(false)}>确认</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>
    )
}
