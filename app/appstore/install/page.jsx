'use client'
import {Flex, useToast} from "@chakra-ui/react";
import {useState} from "react";
import {appstore_app_install} from "/api/appstore"

export default function AppStoreAppInstall() {

    const toast = useToast()

    const [appName, setAppName] = useState('')
    const [appDescription, setAppDescription] = useState('')
    const [moduleName, setModuleName] = useState('')

    async function InstallApp() {
        if (appName.length > 0 && moduleName.length > 0) {
            const resp = await appstore_app_install(appName, moduleName, appDescription)
            if (resp) {
                if (resp.errmsg) {
                    toast({
                        title: '上架失败',
                        description: resp.errmsg,
                        status: 'error',
                        position: 'top',
                        duration: 2000,
                    })
                } else {
                    setAppName('')
                    setAppDescription('')
                    setModuleName('')
                    toast({
                        title: '上架成功',
                        status: 'success',
                        position: 'top',
                        duration: 2000,
                    })
                }
            } else {
                toast({
                    title: '上架失败',
                    status: 'error',
                    position: 'top',
                    duration: 2000,
                })
            }
        }
        else {
            toast({
                title: '请输入应用名称和应用模块名',
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
                    <div className='text-lg'>应用模块</div>
                    <input
                        className='border border-gray-200 rounded w-[256px] h-[40px] indent-4 text-lg'
                        maxLength={32}
                        value={moduleName}
                        onChange={(e) => {
                            if (!(e.target.value === '\n')) {
                                setModuleName(e.target.value)
                            }
                        }}
                    />
                </Flex>
            </div>
            <button
                onClick={InstallApp}
                className='w-[128px] h-[40px] bg-blue-400/90 text-white rounded-lg ml-[160px] mt-12 border hover:bg-blue-400 hover:shadow-[0_0_2px_2px_rgba(147,197,253,0.6)]'
            >
                上架
            </button>
        </div>
    )
}
