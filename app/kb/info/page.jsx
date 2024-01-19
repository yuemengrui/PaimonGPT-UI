'use client'
import {useSearchParams} from 'next/navigation';
import {Flex} from "@chakra-ui/react";
import {SiOpenai} from "react-icons/si";
import {useState} from "react";
import DatasetList from "/components/KB/DatasetList";
import ImportData from "/components/KB/ImportData";

export default function KBInfo() {
    const searchParams = useSearchParams()
    const kb_id = searchParams.get('kb_id')
    const kb_name = searchParams.get('kb_name')

    const tabList = [
        {
            'name': '数据集'
        },
        {
            'name': '导入数据'
        },
        {
            'name': '配置'
        }
    ]

    const [selectTab, setSelectTab] = useState(tabList[0].name)
    // const [contentType, setContentType] = useState('')

    return (
        <div className='flex h-full' style={{maxHeight: 'calc(100vh - 60px)', minHeight: 'calc(100vh - 76px)'}}>
            <div className='flex flex-1 border border-gray-200 bg-white rounded-3xl mt-1 mr-2 ml-2 mb-1'>
                <div className='w-[156px] rounded-l-3xl'>
                    <Flex alignItems={'center'} mt={6} ml={4}>
                        <div
                            className='text-3xl border rounded-lg border-gray-100 shadow-[2px_2px_2px_2px_rgba(0,0,0,0.2)]'>
                            <SiOpenai/></div>
                        <div className='ml-2'>{kb_name}</div>
                    </Flex>
                    <Flex mt={8} direction={'column'} gap={2} alignItems={'center'}>
                        {tabList.map((item) => (
                            <button
                                key={item.name}
                                className={`${selectTab === item.name ? 'shadow-[0_0_1px_1px_rgba(244,114,182,0.2)] text-pink-400 bg-pink-100' : 'hover:text-pink-300 hover:bg-blue-100'} w-[128px] rounded-md py-1`}
                                onClick={() => {
                                    setSelectTab(item.name)
                                }}
                            >
                                {item.name}
                            </button>
                        ))}
                    </Flex>
                </div>
                <div className='w-[1px] h-full bg-gray-200'/>
                {selectTab === '数据集' && (<DatasetList kb_id={kb_id}/>)}
                {selectTab === '导入数据' && (<ImportData kb_id={kb_id}/>)}
            </div>
        </div>
    )
}
