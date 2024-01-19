'use client'
import {Flex, Grid} from '@chakra-ui/react'
import React, {useState} from "react";
import FileUpload from "../FileUpload/FileUpload";
import {kb_data_import} from "/api/knowledge_base";
import {useToast} from '@chakra-ui/react'

export default function ImportData({kb_id}) {

    const toast = useToast()
    const [uploadFiles, setUploadFiles] = useState([])

    const methodList = [
        {
            id: 1,
            title: 'AI智能分段',
            desc: 'AI智能分析数据，自动分段、分句',
            accept: '.txt,.pdf,.docx,.doc,.md'
        },
        {
            id: 2,
            title: 'AI智能QA拆分',
            desc: 'AI智能分析数据，自动生成问答对',
            accept: '.txt,.pdf,.docx,.doc,.md'
        },
        {
            id: 3,
            title: 'JSON 导入',
            desc: '批量导入json问答对，格式{"instruction":"问题", "input":"问题的补充数据", "output":"答案"}',
            accept: '.json'
        }
    ]

    const [selectMethod, setSelectMethod] = useState(methodList[0].id)

    async function importConfirm() {
        kb_data_import(kb_id, selectMethod, uploadFiles)
        setUploadFiles([])
        toast({
            title: '数据导入任务已添加，请耐心等待后台导入完成，稍后可在数据集页面中查看导入的数据',
            status: 'success',
            position: 'top',
            duration: 5000,
        })
    }

    function xx(method_id) {
        if (method_id === 1) {
            setSelectMethod(method_id)
        } else {
            toast({
                title: '暂不支持，请选择其他导入方式',
                status: 'warning',
                position: 'top',
                duration: 2000,
            })
        }
    }

    return (
        <div className='flex flex-col flex-1 px-3 mt-6'>
            <div className='text-xl ml-6 font-semibold italic'>数据导入方式</div>
            <Grid
                p={6}
                gridTemplateColumns={['repeat(3,1fr)']}
                gridGap={6}
                textAlign={'center'}
            >
                {methodList.map((item) => (
                    <div
                        key={item.id}
                        className={`${selectMethod === item.id ? 'shadow-[0_0_2px_2px_rgba(244,114,182,0.6)] text-pink-400 bg-pink-100 border-pink-100' : 'hover:border-blue-300 hover:text-pink-300 hover:bg-blue-100'} border-2 rounded-md py-1`}
                        onClick={() => xx(item.id)}
                    >
                        <div>{item.title}</div>
                        <div className='mt-3 flex-wrap text-xs text-gray-500'>{item.desc}</div>
                    </div>
                ))}
            </Grid>
            <div className='w-full h-[1px] bg-gray-200'/>
            <div className='flex flex-1'>
                <Flex direction={'column'}>
                    <FileUpload uploadFiles={uploadFiles} setUploadFiles={setUploadFiles}
                                accept={methodList.filter((item) => item.id === selectMethod)[0].accept}/>
                    {uploadFiles.length > 0 && (
                        <button
                            onClick={importConfirm}
                            className='bg-blue-400/90 text-white rounded-lg py-2 ml-6 mt-6 border hover:bg-blue-400 hover:shadow-[0_0_2px_2px_rgba(147,197,253,0.6)]'
                        >
                            确认导入
                        </button>
                    )}
                </Flex>
                <div className='ml-6 mt-3 mb-3 w-[1px] bg-gray-200'/>
                {uploadFiles.length > 0 && (
                    <div className='ml-6 mt-6'>
                        <div className='text-lg font-semibold'>已添加的文件: {uploadFiles.length}</div>
                        <ul className='mt-6 ml-12'>
                            {uploadFiles.map((item) => (
                                <li key={item.file_hash} className='list-disc py-2'>{item.file_name}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}
