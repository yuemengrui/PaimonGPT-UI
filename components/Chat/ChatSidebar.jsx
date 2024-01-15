'use client'
import {SiOpenai} from "react-icons/si";
import {
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from "@chakra-ui/react";
import {PiBroom} from "react-icons/pi";
import {PiChatTeardropDotsThin} from "react-icons/pi";
import {IoIosClose} from "react-icons/io";
import {LiaThumbtackSolid} from "react-icons/lia";
import MyTooltip from "../Tooltip/Tooltip";
import {useToast} from '@chakra-ui/react'
import {useState} from "react";
import {delete_app_chat} from "../../api/app";


export default function ChatSidebar({appName, chatList, selectChatId, setSelectChatId, newChat, deleteChat}) {

    const toast = useToast()
    const [showDeleteChatModal, setShowDeleteChatModal] = useState(false)
    const [deleteChatId, setDeleteChatId] = useState(null)

    function delete_chat(e, chat_id) {
        e.stopPropagation()
        setShowDeleteChatModal(true)
        setDeleteChatId(chat_id)
    }

    async function confirmDeleteChat() {
        deleteChat(deleteChatId)
        setShowDeleteChatModal(false)

    }

    function topping(e, chat_id) {
        e.stopPropagation()
        toast({
            title: '该功能正在实现中，请稍等...',
            status: 'warning',
            position: 'top',
            duration: 2000,
        })
    }

    function deleteAllChat(chat_id) {
        toast({
            title: '该功能正在实现中，请稍等...',
            status: 'warning',
            position: 'top',
            duration: 2000,
        })
    }


    return (
        <div className='w-[256px] rounded-l-3xl px-6 py-6'>
            <Flex alignItems={'center'}>
                <div
                    className='text-3xl border rounded-lg border-gray-100 shadow-[2px_2px_2px_2px_rgba(0,0,0,0.2)]'>
                    <SiOpenai/></div>
                <div className='ml-4'>{appName}</div>
            </Flex>
            <Flex alignItems={'center'} mt={12}>
                <button onClick={newChat}
                        className='w-full border rounded-lg border-gray-100 shadow-[0_0_2px_2px_rgba(0,0,0,0.1)] px-4 py-1 hover:text-pink-400 hover:bg-pink-100'>
                    <Flex alignItems={'center'} textAlign={'center'} justifyContent={'center'}>
                        <PiChatTeardropDotsThin/>
                        <span className='ml-2'>新对话</span>
                    </Flex>
                </button>
                {/*<MyTooltip label='删除所有对话'>*/}
                {/*    <button*/}
                {/*        className='ml-4 bg-white border rounded-lg border-gray-100 shadow-[0_0_2px_2px_rgba(0,0,0,0.1)] px-2 py-2 hover:text-pink-400 hover:bg-pink-100'*/}
                {/*        onClick={deleteAllChat}*/}
                {/*    >*/}
                {/*        <PiBroom/>*/}
                {/*    </button>*/}
                {/*</MyTooltip>*/}
            </Flex>
            <Flex alignItems={'center'} mt={6} direction={"column"}>
                {chatList.map((item) => {
                    return (
                        <button
                            key={item.id}
                            className={`${selectChatId === item.id ? 'shadow-[0_0_1px_1px_rgba(244,114,182,0.2)] text-pink-400 bg-pink-100' : 'hover:text-pink-300 hover:bg-blue-100'} w-full rounded-lg px-2 py-2 mt-4`}
                            onClick={() => setSelectChatId(item.id)}
                        >
                            <Flex position={'relative'} alignItems={'center'}>
                                <PiChatTeardropDotsThin className='ml-2'/>
                                <span className='ml-2'>{item.name || '新对话'}</span>
                                <div
                                    onClick={(e) => {
                                        topping(e, item.id)
                                    }}
                                    className='absolute right-2'
                                >
                                    <MyTooltip label={item.isTopping ? '取消置顶' : '置顶'}>
                                        <LiaThumbtackSolid/>
                                    </MyTooltip>
                                </div>
                                <div
                                    onClick={(e) => {
                                        delete_chat(e, item.id)
                                    }}
                                    className='absolute -right-2 -top-2 text-sm hover:text-red-600'
                                >
                                    <IoIosClose/>
                                </div>
                            </Flex>
                        </button>
                    )
                })}
            </Flex>
            {showDeleteChatModal && (
                <Modal isOpen={true} onClose={() => setShowDeleteChatModal(false)}>
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalHeader>确认删除该聊天记录吗？</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                            <div className='text-center'>删除后数据将无法恢复</div>
                        </ModalBody>
                        <ModalFooter>
                            <Button border='1px' borderColor='gray.200' onClick={confirmDeleteChat}>确认删除</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </div>

    )
}
