'use client'
import {
    Button, Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useToast,
} from '@chakra-ui/react'
import {RiDeleteBinLine} from "react-icons/ri";
import {get_kb_data_detail, get_kb_data_list, kb_data_delete} from "/api/knowledge_base";
import React, {useEffect, useState} from "react";
import Image from "next/image";

export default function DatasetList({kb_id}) {
    const toast = useToast()
    const [dataList, setDataList] = useState([])
    const [showDeleteDataModal, setShowDeleteDataModal] = useState(false)
    const [deleteData, setDeleteData] = useState(null)
    const [showDataDetail, setShowDataDetail] = useState(false)
    const [dataDetail, setDataDetail] = useState({})

    async function getDataList() {
        const res = await get_kb_data_list(kb_id)
        setDataList(res)
    }

    useEffect(() => {
        getDataList()
    }, []);

    async function show_data_detail(data) {
        console.log(data)
        data.detail = await get_kb_data_detail(data.id)
        console.log(data)
        setDataDetail(data)
        setShowDataDetail(true)
    }

    function delete_data(e, data) {
        e.stopPropagation()
        setDeleteData(data)
        setShowDeleteDataModal(true)
    }

    async function confirmDeleteData() {
        const resp = await kb_data_delete(deleteData.id)  // 调后台接口删除

        if (resp && resp.msg) {
            toast({
                title: '删除成功',
                status: 'success',
                position: 'top',
                duration: 2000,
            })
        } else {
            toast({
                title: '删除失败',
                description: resp.errmsg,
                status: 'error',
                position: 'top',
                duration: 2000,
            })
        }
        setShowDeleteDataModal(false)
        setDeleteData(null)
    }

    function back() {
        setDataDetail({})
        setShowDataDetail(false)
    }

    return (
        <div className='w-full'>
            {showDataDetail ? (
                <div>
                    <button className='mt-2 ml-2 text-blue-400' onClick={back}>返回</button>
                    <Flex gap={12} ml={12} mt={12}>
                        <div className='text-xl'>文件名：{dataDetail.file_name}</div>
                        <div className='text-xl'>数据总量：{dataDetail.chunk_total}</div>
                    </Flex>
                    <ul className='mt-12 px-12'>
                        {dataDetail.detail.map((item) => (
                            <div key={item.id} className='list-decimal py-2 mt-12 text-sm whitespace-pre-wrap'>
                                <Flex gap={6} fontSize={'large'}>
                                    <div>第{item.page}页</div>
                                    <div>类型: {item.type}</div>
                                    {item.type === 'table' && (<div>Table_Caption: {item.content || 'None'}</div>)}
                                    {item.type === 'figure' && (<div>Figure_Caption: {item.content || 'None'}</div>)}
                                </Flex>
                                <div className='mt-2 border-2 px-2 py-2 border-dashed border-blue-400'>
                                    {item.type === 'text' && (<div>{item.content}</div>)}
                                    {item.type === 'table' && (
                                        <Flex mt={2}>
                                            <Image src={item.url} alt='image' width={600} height={600}/>
                                            <div dangerouslySetInnerHTML = {{__html:item.html}}></div>
                                        </Flex>
                                    )}
                                    {item.type === 'figure' && (
                                        <Image src={item.url} alt='image' width={600} height={600}/>)}
                                </div>
                            </div>
                        ))}
                    </ul>
                </div>
            ) : (
                <TableContainer mt={2} minH={'70vh'}>
                    {dataList.length > 0 ? (
                        <Table fontSize={'sm'}>
                            <Thead>
                                <Tr>
                                    <Th>文件名</Th>
                                    <Th>数据总量</Th>
                                    <Th>上传时间</Th>
                                    <Th>状态</Th>
                                    <Th/>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {dataList.map((item) => (
                                    <Tr
                                        key={item.id}
                                        cursor={'pointer'}
                                        _hover={{bg: 'blue.50'}}
                                        onClick={() => show_data_detail(item)}
                                    >
                                        <Td maxW={['300px', '400px']} overflow={'overlay'}>{item.file_name}</Td>
                                        <Td>{item.data_total}</Td>
                                        <Td>{item.create_time}</Td>
                                        <Td>{item.status}</Td>
                                        <Td>
                                            <RiDeleteBinLine
                                                className='hover:text-red-600'
                                                onClick={(e) => {
                                                    delete_data(e, item)
                                                }}
                                            />
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    ) : (
                        <div className='text-center mt-32'>知识库中还没有数据，请先导入数据</div>
                    )}
                </TableContainer>
            )}
            {showDeleteDataModal && (
                <Modal isOpen={true} onClose={() => setShowDeleteDataModal(false)}>
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalHeader>确认删除 <span
                            className='text-red-600'>{deleteData.file_name}</span> 吗？</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                            <div className='text-center'>删除后数据将无法恢复</div>
                        </ModalBody>
                        <ModalFooter>
                            <Button border='1px' borderColor='gray.200' onClick={confirmDeleteData}>确认删除</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </div>
    )
}
