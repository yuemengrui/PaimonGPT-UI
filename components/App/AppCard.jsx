'use client'
import Icon from "../Icon/Icon";
import {useRouter} from 'next/navigation';

export default function AppCard({app}) {

    const router = useRouter()
    return (
        <>
            <div
                onClick={(e) => {
                    e.preventDefault()
                    router.push(`/app/chat?appid=${app.id}`)
                }}
                className='col-span-1 bg-white border-2 border-solid border-transparent rounded-lg shadow-xs min-h-[160px] flex flex-col transition-all duration-300 ease-in-out cursor-pointer hover:shadow-2xl'
            >
                <div className='flex pt-[14px] px-[14px] pb-3 h-[66px] items-center gap-3 grow-0 shrink-0'>
                    <Icon/>
                    <div className='relative h-8 text-sm font-medium leading-8 grow'>
                        <div
                            className='absolute top-0 left-2 w-full h-full overflow-hidden text-ellipsis whitespace-nowrap'>{app.name}</div>
                    </div>
                </div>
                <div className='mb-3 px-[14px] h-9 text-xs leading-normal text-gray-500 line-clamp-2'>
                    this is app Description
                </div>
                <div className='flex items-center flex-wrap min-h-[24px] px-2 mt-4 text-xs'>
                    自建应用
                </div>
            </div>
        </>
    )
}
