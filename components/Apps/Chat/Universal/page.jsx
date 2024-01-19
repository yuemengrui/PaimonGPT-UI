'use client'
import {useEffect, useState} from "react";
import ChatSidebar from '/components/Chat/ChatSidebar';
import {get_app_chat_list, delete_app_chat} from "/api/app";
import {create_app_chat} from "/api/app";
import {useToast} from '@chakra-ui/react'
import UniversalChatPage from "/components/Chat/UniversalChatPage";


export default function UniversalChat({appInfo}) {
    const toast = useToast()
    const [chatList, setChatList] = useState([])
    const [selectChatId, setSelectChatId] = useState(null)

    async function getAppChatList() {
        const res = await get_app_chat_list(appInfo.id)
        if (res && res.length > 0) {
            setChatList(res)
            setSelectChatId(res[0].id)
        } else {
            setChatList([])
            setSelectChatId(null)
        }
    }


    useEffect(() => {
        getAppChatList()
    }, []);


    async function newChat() {
        const resp = await create_app_chat(appInfo.id)
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
        await getAppChatList()

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
        await getAppChatList()
    }

    return (
        <div className='flex h-full' style={{maxHeight: 'calc(100vh - 68px)', minHeight: 'calc(100vh - 76px)'}}>
            <div
                className='flex flex-1 border border-gray-200 bg-white rounded-3xl mt-1 mr-2 ml-2 mb-2 overflow-y-auto h-full'>
                <ChatSidebar appName={appInfo.name}
                             chatList={chatList} selectChatId={selectChatId} setSelectChatId={setSelectChatId}
                             newChat={newChat} deleteChat={deleteChat}/>
                <div className='w-[1px] h-full bg-gray-200'/>
                {selectChatId && (<UniversalChatPage appInfo={appInfo} chat_id={selectChatId}
                                                     chat_name={chatList.length ? chatList.filter((item) => item.id === selectChatId)[0].name || '新对话' : '新对话'}/>)}
            </div>
        </div>
    )
}
