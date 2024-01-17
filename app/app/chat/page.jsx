'use client'
import ChatInput from "/components/Chat/ChatInput";
import MessageList from "/components/Chat/MessagesList";
import {useEffect, useState} from "react";
import Tag from "/components/Tag/Tag";
import {Flex} from "@chakra-ui/react";
import ChatSidebar from '/components/Chat/ChatSidebar';
import {get_app_chat_list, get_app_chat_message_list, delete_app_chat, get_app_info} from "/api/app";
import {create_app_chat} from "/api/app";
import {useToast} from '@chakra-ui/react'
import {useSearchParams} from 'next/navigation';


export default function Chat() {
    const searchParams = useSearchParams()
    const app_id = searchParams.get('appid')
    const toast = useToast()
    const [messageList, setMessageList] = useState([])
    const [chatList, setChatList] = useState([])
    const [selectChatId, setSelectChatId] = useState(null)
    const [currentModel, setCurrentModel] = useState(undefined)

    async function getAppInfo(app_id) {
        if (app_id) {
            const res = await get_app_info(app_id)
            if (res) {
                setCurrentModel(res.llm_name)
            }
        }
    }

    async function getAppChatList(app_id) {
        if (app_id) {
            const res = await get_app_chat_list(app_id)
            if (res && res.length > 0) {
                setChatList(res)
                setSelectChatId(res[0].id)
            } else {
                setChatList([])
                setSelectChatId(null)
            }
        }
    }

    async function getAppChatMessageList(chat_id) {
        if (chat_id) {
            const message_list = await get_app_chat_message_list(chat_id)
            if (message_list && message_list.length) {
                setMessageList(message_list)
            }
        }
    }


    useEffect(() => {
        getAppInfo(app_id)
        getAppChatList(app_id)
    }, []);

    useEffect(() => {
        setMessageList([])
        getAppChatMessageList(selectChatId)
    }, [selectChatId]);

    async function newChat() {
        const resp = await create_app_chat(app_id)
        if (resp) {
            if (resp.errmsg) {
                toast({
                    title: '失败',
                    description: resp.errmsg,
                    status: 'error',
                    position: 'top',
                    duration: 2000,
                })
            } else {
                toast({
                    title: '成功',
                    status: 'success',
                    position: 'top',
                    duration: 2000,
                })
            }
        } else {
            toast({
                title: '失败',
                status: 'error',
                position: 'top',
                duration: 2000,
            })
        }
        await getAppChatList(app_id)

    }

    async function deleteChat(chat_id) {
        const resp = await delete_app_chat(chat_id)
        if (resp) {
            if (resp.errmsg) {
                toast({
                    title: '删除失败',
                    description: resp.errmsg,
                    status: 'error',
                    position: 'top',
                    duration: 2000,
                })
            } else {
                toast({
                    title: '删除成功',
                    status: 'success',
                    position: 'top',
                    duration: 2000,
                })
            }

        } else {
            toast({
                title: '删除失败',
                status: 'error',
                position: 'top',
                duration: 2000,
            })
        }
        await getAppChatList(app_id)
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

    return (
        <div className='flex h-full' style={{maxHeight: 'calc(100vh - 68px)', minHeight: 'calc(100vh - 76px)'}}>
            <div
                className='flex flex-1 border border-gray-200 bg-white rounded-3xl mt-1 mr-2 ml-2 mb-2 overflow-y-auto h-full'>
                <ChatSidebar appName={'test'}
                             chatList={chatList} selectChatId={selectChatId} setSelectChatId={setSelectChatId}
                             newChat={newChat} deleteChat={deleteChat}/>
                <div className='w-[1px] h-full bg-gray-200'/>
                {selectChatId && (
                    <>
                        <div className='w-full relative'>
                            <div className='h-[64px] px-6 py-5'>
                                <Flex gap={3}>
                                    <div>{chatList.length ? chatList.filter((item) => item.id === selectChatId)[0].name || '新对话' : '新对话'}</div>
                                    <Tag text={messageList.length + '条记录'}/>
                                    {/*<Tag text={appList.filter((item) => item.id === selectApp.id)[0].llm_name}/>*/}
                                </Flex>
                            </div>
                            <div className='h-[1px] w-full bg-gray-200'/>
                            {messageList.length && (
                                <MessageList appId={app_id} currentModel={currentModel}
                                             selectChatId={selectChatId} messageList={messageList}
                                             addMessage={addMessage} delMessage={delMessage}
                                             updateMessage={updateMessage}/>)}
                            <ChatInput appId={app_id} currentModel={currentModel}
                                       selectChatId={selectChatId} addMessage={addMessage}
                                       updateMessage={updateMessage}/>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
