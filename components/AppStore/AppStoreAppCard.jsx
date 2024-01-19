'use client'
import Icon from "../Icon/Icon";
import {useToast} from '@chakra-ui/react'
import {app_create_from_appstore} from "/api/app";


export default function AppStoreAppCard({app, installed}) {
    const toast = useToast()

    async function AddApp() {
        const response = await app_create_from_appstore(app.id)
        if (response.msg) {
            toast({
                title: '成功',
                status: 'success',
                position: 'top',
                duration: 2000,
            })
        }
    }

    return (
        <>
            <div
                className='relative col-span-1 bg-white border-2 border-solid border-transparent rounded-lg shadow-xs min-h-[160px] flex flex-col transition-all duration-300 ease-in-out cursor-pointer hover:shadow-2xl group'
            >
                <div className='flex pt-[14px] px-[14px] pb-3 h-[66px] items-center gap-3 grow-0 shrink-0'>
                    <Icon/>
                    <div className='relative h-8 text-sm font-medium leading-8 grow'>
                        <div
                            className='absolute top-0 left-2 w-full h-full overflow-hidden text-ellipsis whitespace-nowrap'>{app.name}</div>
                    </div>
                </div>
                <div className='mb-3 px-[14px] h-9 text-xs leading-normal text-gray-500 line-clamp-2'>
                    {app.description}
                </div>
                <button
                    disabled={installed}
                    onClick={AddApp}
                    className='absolute py-1.5 border-transparent rounded-lg w-full bottom-0 hidden group-hover:block group-hover:text-white group-hover:bg-blue-400'
                >
                    {installed ? '已添加' : '添加到我的应用'}
                </button>
            </div>
        </>
    )
}
