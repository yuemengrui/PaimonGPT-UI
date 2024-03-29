'use client'
import {Tabs, TabList, Tab} from '@chakra-ui/react'
import {useState} from "react";
import LLM from "/components/Arena/LLM"

export default function Arena() {
    const [selectMode, setSelectMode] = useState(0)

    const modeList = [
        {
            id: 0,
            name: '大模型 PK'
        },
        {
            id: 1,
            name: 'Embedding检索 PK'
        }
    ]

    return (
        <div className='flex h-full' style={{maxHeight: 'calc(100vh - 60px)', minHeight: 'calc(100vh - 76px)'}}>
            <div className='flex flex-1 flex-col bg-white border border-gray-200 rounded-3xl mt-1 mr-2 ml-2 mb-1'>
                <div className='w-full h-[48px]'>
                    <Tabs mt={2} mb={2} size={'sm'} align={'center'} variant={'soft-rounded'} colorScheme={'pink'} defaultIndex={0}
                          onChange={(index) => setSelectMode(index)}>
                        <TabList>
                            {modeList.map((item) => (
                                <Tab key={item.id}>{item.name}</Tab>
                            ))}
                        </TabList>
                    </Tabs>
                </div>
                <div className='w-full h-[1px] bg-gray-200'/>
                {selectMode === 0 && <LLM/>}
                {selectMode === 1 && (
                    <div className='text-center mt-24 text-6xl'>coming soon</div>
                )}
            </div>
        </div>
    )
}
