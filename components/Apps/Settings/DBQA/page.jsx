'use client'
import {Flex} from "@chakra-ui/react";
import {SiOpenai} from "react-icons/si";
import {useState, useEffect} from "react";
import {Select, useToast} from "@chakra-ui/react"
import {get_llm_list} from "/api/chat";
import {app_info_modify} from "/api/app";

export default function UniversalAppSettings({appInfo, setAppInfo}) {

    const tabList = [
        {
            'name': '配置'
        }
    ]

    const [selectTab, setSelectTab] = useState(tabList[0].name)

    const toast = useToast()

    const [llmList, setLlmList] = useState([])
    const [selectLLM, setSelectLLM] = useState(appInfo.llm_name)


    useEffect(() => {
        async function getList() {

            const llm_res = await get_llm_list()
            if (llm_res && llm_res.length > 0) {
                setLlmList(llm_res)
            }
        }

        getList()
    }, []);

    async function saveAppInfo() {
        const resp = await app_info_modify(appInfo.id, appInfo.name, appInfo.description, selectLLM)
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
                <div className='w-full flex flex-1 px-6 py-6 flex-col ml-12 mt-12'>
                    <div>
                        <Flex gap={20} alignItems={'center'}>
                            <div className='text-lg'>应用名称</div>
                            <div>{appInfo.name}</div>
                        </Flex>
                    </div>
                    <div className='mt-10'>
                        <Flex gap={20} alignItems={'center'}>
                            <div className='text-lg'>应用描述</div>
                            <div>{appInfo.description}</div>
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
                    <button
                        onClick={saveAppInfo}
                        className='w-[128px] h-[40px] bg-blue-400/90 text-white rounded-lg ml-[160px] mt-12 border hover:bg-blue-400 hover:shadow-[0_0_2px_2px_rgba(147,197,253,0.6)]'
                    >
                        保存
                    </button>
                </div>
            </div>
        </div>
    )
}
