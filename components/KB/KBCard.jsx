'use client'
import Icon from "../Icon/Icon";
import {useState} from "react";
import {useRouter} from 'next/navigation';
import {RiDeleteBinLine} from "react-icons/ri";
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from "@chakra-ui/react";
import {useToast} from '@chakra-ui/react'
import {kb_delete} from "/api/knowledge_base";


export default function KBCard({kb, getKBList}) {
    const router = useRouter()
    const toast = useToast()
    const [showDeleteKBModal, setShowDeleteKBModal] = useState(false)

    function delete_kb(e) {
        e.stopPropagation()
        setShowDeleteKBModal(true)
    }

    async function confirmDeleteKB() {
        const resp = await kb_delete(kb.id)  // 调后台接口删除
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
        getKBList()
        setShowDeleteKBModal(false)
    }


    return (
        <>
            <div
                onClick={() => {
                    router.push(`/kb/info?kb_id=${kb.id}&kb_name=${kb.name}`)
                }}
                className='relative col-span-1 bg-white border-2 border-solid border-transparent rounded-lg shadow-xs min-h-[160px] flex flex-col transition-all duration-300 ease-in-out cursor-pointer hover:shadow-2xl group'
            >
                <div
                    onClick={e => delete_kb(e)}
                    className='absolute right-2 top-2 hover:text-red-600 hidden group-hover:block'
                >
                    <RiDeleteBinLine/>
                </div>
                <div className='flex pt-[14px] px-[14px] pb-3 h-[66px] items-center gap-3 grow-0 shrink-0'>
                    <Icon/>
                    <div className='relative h-8 text-sm font-medium leading-8 grow'>
                        <div
                            className='absolute top-0 left-2 w-full h-full overflow-hidden text-ellipsis whitespace-nowrap'>{kb.name}</div>
                    </div>
                </div>
                <div className='mb-3 px-[14px] h-9 text-xs leading-normal text-gray-500 line-clamp-2'>
                    {kb.description}
                </div>
            </div>
            {showDeleteKBModal && (
                <Modal isOpen={true} onClose={() => setShowDeleteKBModal(false)}>
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalHeader>确认删除 <span
                            className='text-red-600'>{kb.name}</span> 吗？</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                            <div className='text-center'>删除后数据将无法恢复</div>
                        </ModalBody>
                        <ModalFooter>
                            <Button border='1px' borderColor='gray.200' onClick={confirmDeleteKB}>确认删除</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>
    )
}
