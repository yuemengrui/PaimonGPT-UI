'use client'
import {useEffect, useState} from "react";
import {get_knowledge_base_list, kb_create} from "/api/knowledge_base";
import {useToast} from '@chakra-ui/react'
import KBCard from "/components/KB/KBCard";
import Icon from "/components/Icon/Icon";
import {
    Input,
    Select,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from "@chakra-ui/react";
import {get_embedding_model_list} from "/api/embedding";


export default function KB() {
    const toast = useToast()
    const [KBList, setKBList] = useState([])
    const [embModelList, setEmbModelList] = useState([])
    const [showCreateKBModal, setShowCreateKBModal] = useState(false)
    const [newKBName, setNewKBName] = useState('')
    const [selectEmbModel, setSelectEmbModel] = useState(null)

    async function getKBList() {
        const res = await get_knowledge_base_list()
        console.log('kb list res', res)
        if (res && res.length) {
            setKBList(res)
        }
    }

    useEffect(() => {
        getKBList()
    }, []);

    useEffect(() => {
        async function getEmbModelList() {
            const res = await get_embedding_model_list()
            if (res && res.length) {
                setEmbModelList(res)
            }
        }

        getEmbModelList()
    }, [showCreateKBModal]);

    function closeModal() {
        setShowCreateKBModal(false)
        setNewKBName('')
        setEmbModelList([])
        setSelectEmbModel(null)
    }

    async function createKB() {

        if (newKBName && selectEmbModel) {
            const response = await kb_create(newKBName, selectEmbModel)
            if (response) {
                if (response.errmsg) {
                    toast({
                        title: '失败',
                        description: response.errmsg,
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
            closeModal()
            getKBList()
        } else {
            toast({
                title: '知识库名称和embedding模型不能为空',
                status: 'error',
                position: 'top',
                duration: 2000,
            })
        }
    }

    function createNewKB() {
        setShowCreateKBModal(true)
    }


    return (
        <>
            <div
                className='grid content-start grid-cols-1 gap-4 px-12 pt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grow shrink-0'>
                {/*New KB Card*/}
                <div
                    className='col-span-1 border-2 border-solid border-transparent rounded-lg shadow-xs min-h-[160px] flex flex-col transition-all duration-200 ease-in-out cursor-pointer outline outline-1 outline-gray-200 -outline-offset-1 bg-gray-200 hover:shadow-lg hover:bg-white'
                    onClick={createNewKB}
                >
                    <div className='flex pt-[14px] px-[14px] pb-3 h-[66px] items-center gap-3 grow-0 shrink-0'>
                        <Icon name={'Add'}/>
                        <div
                            className='relative h-8 text-sm font-medium leading-8 grow transition-colors duration-200 ease-in-out'>
                            创建知识库
                        </div>
                    </div>
                </div>
                {/*KB Card*/}
                {KBList.map(kb => (
                    <KBCard key={kb.id} kb={kb} getKBList={getKBList}/>
                ))}
            </div>
            {showCreateKBModal && (
                <Modal isOpen={true} onClose={closeModal}>
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalHeader>创建新应用</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                            <div>应用名称</div>
                            <Input value={newKBName} onChange={(e) => {
                                setNewKBName(e.target.value)
                            }} placeholder={'请输入应用名称...'}/>
                            <div>请选择模型</div>
                            <Select
                                onChange={(e) => {
                                    setSelectEmbModel(e.target.value)
                                }}
                                placeholder='请选择模型'
                            >
                                {embModelList.map((item) => {
                                    return (
                                        <option key={item.model_name}>{item.model_name}</option>
                                    )
                                })}
                            </Select>
                        </ModalBody>
                        <ModalFooter>
                            <Button border='1px' borderColor='gray.200' onClick={createKB}>确认</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>
    )
}
