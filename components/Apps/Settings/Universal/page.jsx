'use client'
import {Flex} from "@chakra-ui/react";
import {SiOpenai} from "react-icons/si";
import {useState} from "react";
import Settings from "/components/App/settings";

export default function UniversalAppSettings({appInfo, setAppInfo}) {

    const tabList = [
        {
            'name': '配置'
        }
    ]

    const [selectTab, setSelectTab] = useState(tabList[0].name)


    return (
        <div className='flex w-full bg-blue-50/30'>
            <div className='flex flex-1 border border-gray-200 bg-white rounded-3xl mt-4 mr-4 ml-4 mb-4'>
                <div className='w-[156px] rounded-l-3xl'>
                    <Flex alignItems={'center'} mt={6} ml={4}>
                        <div
                            className='text-3xl border rounded-lg border-gray-100 shadow-[2px_2px_2px_2px_rgba(0,0,0,0.2)]'>
                            <SiOpenai/></div>
                        <div className='ml-2'>{appInfo.name}</div>
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
                {appInfo.id && <Settings appInfo={appInfo} setAppInfo={setAppInfo}/>}
            </div>
        </div>
    )
}
