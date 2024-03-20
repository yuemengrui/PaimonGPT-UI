'use client'
import ChatInput from "/components/Chat/ChatInput";
import {useEffect, useState} from "react";
import Tag from "/components/Tag/Tag";
import {Flex} from "@chakra-ui/react";
import {get_app_chat_message_list} from "/api/app";
import {v4 as uuidv4} from "uuid"
import ChartChatMessageList from "./ChartChatMessageList";
import {chart_chat} from "/api/chart";


export default function ChartChatPage({appInfo, chat_id, chat_name}) {
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

    async function generate(query) {
        const message = {
            id: uuidv4(),
            role: "user",
            type: 'text',
            content: query,
        }
        addMessage(message)

        setWaitingReply(true)
        const responseMessage = {
            id: uuidv4(),
            role: "assistant",
            type: 'text',
            content: "正在思考中...",
            response: {},
        }
        addMessage(responseMessage)

        const response = await chart_chat({
            "app_id": appInfo.id,
            "chat_id": chat_id,
            "uid": message.id,
            "answer_uid": responseMessage.id,
            "prompt": message.content,
            "model_name": appInfo.llm_name
        })

        setWaitingReply(false)
        updateMessage({
            id: responseMessage.id,
            role: responseMessage.role,
            type: 'mermaid',
            content: response['answer'],
            response: response,
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
                <ChartChatMessageList messageList={messageList} stream_generate={generate} waitingReply={waitingReply}/>)}
            <ChatInput stream_generate={generate}/>
        </div>
    )
}
