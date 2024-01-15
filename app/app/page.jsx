'use client'
import {useEffect, useState} from "react";
import {
    get_app_list,
    app_create,
    app_delete,
} from "/api/app";
import {get_llm_list} from "/api/chat";
import {get_knowledge_base_list} from "/api/knowledge_base";
import {useToast} from '@chakra-ui/react'
import {useRouter} from "next/navigation";
import AppCard from "/components/App/AppCard";
import Icon from "../../components/Icon/Icon";


export default function AppStore() {
    const router = useRouter();
    const toast = useToast()
    const [appList, setAppList] = useState([])
    const [llmList, setLlmList] = useState([])
    const [KBList, setKBList] = useState([])
    const [systemAppList, setSystemAppList] = useState([])
    const [showCreateAppModal, setShowCreateAppModal] = useState(false)
    const [appType, setAppType] = useState(0)
    const [selectSystemApp, setSelectSystemApp] = useState(1)
    const [newAppName, setNewAppName] = useState('')
    const [selectLLM, setSelectLLM] = useState(null)
    const [selectKB, setSelectKB] = useState(null)
    const [showDeleteAppModal, setShowDeleteAppModal] = useState(false)
    const [deleteAppInfo, setDeleteAppInfo] = useState(null)

    async function getAppList() {
        // const res = await get_app_list()
        const res = [
            {
                name: 'app-1'
            },
            {
                name: 'app-2'
            },
            {
                name: 'app-3'
            },
            {
                name: 'app-4'
            }
        ]
        setAppList(res)
    }

    useEffect(() => {
        getAppList()
    }, []);

    // useEffect(() => {
    //     async function getList() {
    //         const system_app_res = await get_app_create_system_app_list()
    //         if (system_app_res && system_app_res.length > 0) {
    //             setSystemAppList(system_app_res)
    //         }
    //
    //         const llm_res = await get_llm_list()
    //         if (llm_res && llm_res.length > 0) {
    //             setLlmList(llm_res)
    //         }
    //
    //         const kb_res = await get_knowledge_base_list()
    //         if (kb_res && kb_res.length > 0) {
    //             setKBList(kb_res)
    //         }
    //     }
    //
    //     getList()
    // }, [showCreateAppModal]);

    function closeModal() {
        setShowCreateAppModal(false)
        setAppType(0)
        setSelectSystemApp(null)
        setNewAppName('')
        setSelectLLM(null)
        setSelectLLM(null)
    }

    async function createApp() {
        if (appType === 0) {
            const resp = await app_create_system_app(selectSystemApp)
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
            closeModal()
            getAppList()
        } else {
            if (newAppName && selectLLM) {
                const resp = await app_create(newAppName, selectLLM, selectKB)
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
                closeModal()
                getAppList()
            } else {
                toast({
                    title: "请填写应用名称和选择模型",
                    status: 'error',
                    position: 'top',
                    duration: 2000,
                })
            }
        }
    }

    function createNewApp() {
        if (appList.length >= 10) {
            toast({
                title: "只允许创建10个应用",
                status: 'error',
                position: 'top',
                duration: 2000,
            })
        } else {
            setShowCreateAppModal(true)
        }
    }

    function delete_app(e, appInfo) {
        e.stopPropagation()
        setDeleteAppInfo(appInfo)
        setShowDeleteAppModal(true)
    }

    async function confirmDeleteApp() {
        const resp = await app_delete(deleteAppInfo.id)  // 调后台接口删除
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
        getAppList() // 调后台接口获取新的 AppStore list
        setShowDeleteAppModal(false)
        setDeleteAppInfo(null)
    }


    return (
        <>
            <div
                className='grid content-start grid-cols-1 gap-4 px-12 pt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grow shrink-0'>
                {/*New App Card*/}
                <div
                    className='col-span-1 border-2 border-solid border-transparent rounded-lg shadow-xs min-h-[160px] flex flex-col transition-all duration-200 ease-in-out cursor-pointer outline outline-1 outline-gray-200 -outline-offset-1 bg-gray-200 hover:shadow-lg hover:bg-white'>
                    <div className='flex pt-[14px] px-[14px] pb-3 h-[66px] items-center gap-3 grow-0 shrink-0'>
                        <Icon name={'Add'}/>
                        <div
                            className='relative h-8 text-sm font-medium leading-8 grow transition-colors duration-200 ease-in-out'>
                            创建应用
                        </div>
                    </div>
                    <div className='mb-3 px-[14px] h-9 text-xs leading-normal text-gray-500 line-clamp-2'>
                        tips: 创建应用前可以先去探索页面逛逛，说不定能发现你需要的应用！
                    </div>
                </div>
                {/*App Card*/}
                {appList.map(app => (
                    <AppCard key={app.id} app={app}/>
                ))}
            </div>
        </>
    )
}
