'use client'

import {Flex, Select} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {get_llm_list} from "/api/chat";
import {get_knowledge_base_list} from "/api/knowledge_base";
import {app_info_modify} from "/api/app";
import {useToast} from '@chakra-ui/react'

export default function Settings({appInfo, setAppInfo}) {
    const toast = useToast()

    const [llmList, setLlmList] = useState([])
    const [KBList, setKBList] = useState([])
    const [appName, setAppName] = useState(appInfo.name)
    const [appDescription, setAppDescription] = useState(appInfo.description)
    const [selectLLM, setSelectLLM] = useState(appInfo.llm_name)

    useEffect(() => {
        async function getList() {

            const llm_res = await get_llm_list()
            if (llm_res && llm_res.length > 0) {
                setLlmList(llm_res)
            }

            const kb_res = await get_knowledge_base_list()
            if (kb_res && kb_res.length > 0) {
                setKBList(kb_res)
            }
        }

        getList()
    }, []);

    async function saveAppInfo() {
        const resp = await app_info_modify(appInfo.id, appName, appDescription, selectLLM, appInfo.kb_id)
        if (resp) {
            if (resp.errmsg) {
                toast({
                    title: '保存失败',
                    description: resp.errmsg,
                    status: 'error',
                    position: 'top',
                    duration: 2000,
                })
            } else {
                toast({
                    title: '保存成功',
                    status: 'success',
                    position: 'top',
                    duration: 2000,
                })
                setAppInfo({
                    ...appInfo,
                    name: appName,
                    llm_name: selectLLM
                })
            }
        } else {
            toast({
                title: '保存失败',
                status: 'error',
                position: 'top',
                duration: 2000,
            })
        }
    }

    return (
        <div className='w-full flex flex-1 px-6 py-6 flex-col ml-12 mt-12'>
            <div>
                <Flex gap={20} alignItems={'center'}>
                    <div className='text-lg'>应用名称</div>
                    {appInfo.is_system ? (
                        <div>{appInfo.name}</div>
                    ) : (
                        <input
                            className='border border-gray-200 rounded w-[256px] h-[40px] indent-4 text-lg'
                            maxLength={32}
                            value={appName}
                            onChange={(e) => {
                                if (!(e.target.value === '\n')) {
                                    setAppName(e.target.value)
                                }
                            }}
                        />
                    )}
                </Flex>
            </div>
            <div className='mt-10'>
                <Flex gap={20} alignItems={'center'}>
                    <div className='text-lg'>应用描述</div>
                    <input
                        className='border border-gray-200 rounded w-[256px] h-[40px] indent-4 text-lg'
                        maxLength={32}
                        value={appDescription}
                        onChange={(e) => {
                            if (!(e.target.value === '\n')) {
                                setAppDescription(e.target.value)
                            }
                        }}
                    />
                </Flex>
            </div>
            <div className='mt-10'>
                <Flex gap={20} alignItems={'center'}>
                    <div className='text-lg'>应用类型</div>
                    {appInfo.is_system ? (
                        <div>系统应用</div>
                    ) : (
                        <div>自建应用</div>
                    )}
                </Flex>
            </div>
            <div className='mt-10'>
                <Flex gap={20} alignItems={'center'}>
                    <div className='text-lg'>大模型</div>
                    <div className='ml-[20px]'>
                        <Select
                            w={'256px'}
                            onChange={(e) => {
                                setSelectLLM(e.target.value)
                            }}
                            value={selectLLM}
                        >
                            {llmList.map((item) => {
                                return (
                                    <option key={item.model_name}>{item.model_name}</option>
                                )
                            })}
                        </Select>
                    </div>
                </Flex>
            </div>
            <div className='mt-10'>
                <Flex gap={20} alignItems={'center'}>
                    <div className='text-lg'>关联知识库</div>
                    {appInfo.kb_name ? (
                        <div>{appInfo.kb_name}</div>
                    ) : (
                        <div className='ml-[-16px]'>没有关联任何知识库</div>
                    )}
                </Flex>
            </div>
            <button
                onClick={saveAppInfo}
                className='w-[128px] h-[40px] bg-blue-400/90 text-white rounded-lg ml-[160px] mt-12 border hover:bg-blue-400 hover:shadow-[0_0_2px_2px_rgba(147,197,253,0.6)]'
            >
                保存
            </button>
        </div>
    )
}
