'use client'

import {
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,
    Tooltip
} from "@chakra-ui/react";
import React, {useEffect, useRef, useState} from "react";
import {PiLightningFill} from "react-icons/pi";
import TextareaAutoSize from "react-textarea-autosize";
import MyButton from "../common/MyButton";
import {FiSend} from "react-icons/fi";
import {v4 as uuidv4} from "uuid";
import {fetchEventSource} from "@microsoft/fetch-event-source";
import MyTooltip from "../Tooltip/Tooltip";
import ChatButton from "../Chat/ChatButton";
import {GoCopy} from "react-icons/go";
import Image from "next/image";
import Markdown from "../common/Markdown";
import {SiOpenai} from "react-icons/si";
import {CiStar} from "react-icons/ci";
import Tag from "../Tag/Tag";
import {get_llm_list} from "/api/chat";
import {useToast} from '@chakra-ui/react'


export default function LLM() {
    const toast = useToast()
    const [messageText, setMessageText] = useState("")
    const [messageList, setMessageList] = useState([])
    const [llmList, setLlmList] = useState([])
    const listRef = useRef(null)
    const [showScoreModal, setShowScoreModal] = useState(false)
    const [scoreMsgId, setScoreMsgId] = useState(null)
    const [scoreValue, setScoreValue] = useState(0)
    const [showScoreTooltip, setShowScoreTooltip] = useState(false)
    const [calculateCount, setCalculateCount] = useState(0)
    const [showRankingList, setShowRankingList] = useState(false)

    useEffect(() => {
        async function getllmList() {
            const llm_res = await get_llm_list()
            if (llm_res && llm_res.length > 0) {
                const updatedList = llm_res.map((item) => {
                    return {...item, avgScore: 0, avgGenerationTime: 0, avgTokens: 0, avgSpeed: 0}
                });
                setLlmList(updatedList)
            }
        }

        getllmList()
    }, []);

    useEffect(() => {
        // 每当数据更新时，滚动到最新的数据
        if (listRef.current) {
            // @ts-ignore
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
        if (showRankingList === false) {
            if (messageList.filter((msg) => msg.role === 'user').length > 9) {
                setShowRankingList(true)
            }
        }
    }, [messageList])

    function calculate_ranking_list() {
        const newLlmList = []
        for (const llm of llmList) {
            const messages = messageList.filter((msg) =>
                msg.role === 'assistant' && msg.model_name === llm.model_name
            )
            const total_score = messages.reduce((prev, cur) => {
                return prev + cur.score
            }, 0)
            const total_generation_time = messages.reduce((prev, cur) => {
                return prev + parseFloat(cur.response.time_cost.generation)
            }, 0)
            const total_tokens = messages.reduce((prev, cur) => {
                return prev + cur.response.usage.total_tokens
            }, 0)
            const total_average_speed = messages.reduce((prev, cur) => {
                return prev + parseFloat(cur.response.usage.average_speed)
            }, 0)

            newLlmList.push({
                model_name: llm.model_name,
                avgScore: Math.round(total_score / messages.length * 100) / 100,
                avgGenerationTime: Math.round(total_generation_time / messages.length * 100) / 100,
                avgTokens: Math.round(total_tokens / messages.length * 100) / 100,
                avgSpeed: Math.round(total_average_speed / messages.length * 100) / 100,
            })
        }
        newLlmList.sort((a, b) => b.avgScore - a.avgScore)
        setLlmList(newLlmList)
    }

    useEffect(() => {
        calculate_ranking_list()
    }, [calculateCount])

    async function send() {
        const message = {
            id: uuidv4(),
            role: "user",
            type: 'text',
            content: messageText,
        }
        setMessageText("")
        setMessageList(prevState => [...prevState, message])

        for (const model of llmList) {
            const responseMessage = {
                id: uuidv4(),
                role: "assistant",
                model_name: model.model_name,
                score: 0,
                type: 'text',
                content: "正在思考中...",
                response: {},
            }
            setMessageList(prevState => [...prevState, responseMessage])
            await fetchEventSource(process.env.NEXT_PUBLIC_LLM_CHAT_SIMPLE, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("Authorization")
                },
                body: JSON.stringify({
                    "prompt": messageText,
                    "model_name": model.model_name,
                }),
                onmessage(msg) {
                    // 解码内容
                    try {
                        const res = JSON.parse(msg.data)
                        setMessageList(prevState => [...prevState.slice(0, -1), {
                            id: responseMessage.id,
                            role: responseMessage.role,
                            model_name: model.model_name,
                            score: 0,
                            type: 'text',
                            content: res['answer'],
                            response: res,
                        }])
                    } catch (e) {
                        console.log(e)
                    }

                },
                onerror(error) {
                    setMessageList(prevState => [...prevState.slice(0, -1), {
                        id: responseMessage.id,
                        role: responseMessage.role,
                        model_name: model.model_name,
                        score: 0,
                        type: 'text',
                        content: '抱歉！服务繁忙！请稍后重试！',
                        response: {},
                    }])
                    throw error
                }
            })
        }
        setCalculateCount(calculateCount + 1)
    }

    async function copyTextToClipboard(text) {
        if ('clipboard' in navigator) {
            await navigator.clipboard.writeText(text);
        } else {
            document.execCommand('copy', true, text);
        }
        toast({
            title: '复制成功',
            status: 'success',
            position: 'top',
            duration: 2000,
        })
    }

    function handleEnter(e) {
        if (e.metaKey && e.code === 'Enter') {
            setMessageText(messageText + '\n')
        } else {
            if (e.code === 'Enter') {
                if (messageText) {
                    send()
                }
            }
        }
    }

    function scoring(msg_id, msg_score) {
        setScoreMsgId(msg_id)
        setScoreValue(msg_score)
        setShowScoreModal(true)
    }

    function confirm_scoring() {
        const newMessageList = messageList.map((item) => {
            if (item.id === scoreMsgId) {
                return {...item, score: scoreValue}
            }
            return item
        })
        setMessageList(newMessageList)
        setScoreMsgId(null)
        setCalculateCount(calculateCount + 1)
        setShowScoreModal(false)
    }

    return (
        <div className='flex h-full relative'>
            <div className='w-[500px] items-center text-center'>
                <div className='text-2xl mt-2'>排行榜</div>
                {showRankingList ? (
                    <div>
                        <TableContainer mt={6}>
                            <Table fontSize={'xs'}>
                                <Thead>
                                    <Tr>
                                        <Th>模型名</Th>
                                        <Th maxW={'88px'}>平均token数</Th>
                                        <Th maxW={'88px'}>平均生成时间</Th>
                                        <Th maxW={'88px'}>平均生成速度</Th>
                                        <Th maxW={'20px'}>平均分</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {llmList.map((item) => (
                                        <Tr
                                            key={item.model_name}
                                            cursor={'pointer'}
                                            _hover={{bg: 'blue.50'}}
                                        >
                                            <Td maxW={'130px'}>{item.model_name}</Td>
                                            <Td>{item.avgTokens}</Td>
                                            <Td>{item.avgGenerationTime + ' s'}</Td>
                                            <Td>{item.avgSpeed + ' token/s'}</Td>
                                            <Td>{item.avgScore}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </div>
                ) : (
                    <div className='mt-24'>
                        <div>请在右边提问，并对回答进行打分</div>
                        <div className='mt-6'>问答次数达到10次才会显示排行榜信息</div>
                    </div>
                )}
            </div>
            <div className='w-[1px] h-full bg-gray-200'/>
            <div className='w-full relative'>
                <div className='w-full max-w-4xl mx-auto'>
                    <ul ref={listRef} style={{maxHeight: 'calc(100vh - 200px)'}} className='overflow-auto'>
                        {messageList.map((message) => {
                            const isAssistant = message.role === "assistant"
                            return (
                                <li
                                    key={message.id}
                                    className={`${
                                        isAssistant
                                            ? 'justify-start'
                                            : 'justify-end'
                                    } w-full max-w-4xl mx-auto flex space-x-6 px-4 py-6`}
                                >
                                    {message.role === 'user' && (
                                        <div>
                                            <div>
                                                <Flex gap={3} w={'100%'} alignItems={'center'}
                                                      justifyContent={'flex-end'}>
                                                    {message.type === 'text' && (
                                                        <>
                                                            <MyTooltip label='复制'>
                                                                <ChatButton
                                                                    onClick={() => copyTextToClipboard(message.content)}>
                                                                    <GoCopy/>
                                                                </ChatButton>
                                                            </MyTooltip>
                                                        </>
                                                    )}
                                                    <div
                                                        className='text-3xl shadow-[0_0_1px_1px_rgba(0,0,0,0.2)] bg-white border rounded-lg border-gray-100'>😊
                                                    </div>
                                                </Flex>
                                            </div>
                                            {message.type === 'image' ? (
                                                <Image src={message.url} alt='image' width={message.width || 600}
                                                       height={message.height || 600}/>) : (
                                                <div
                                                    className='bg-blue-100 rounded-lg shadow-[0_2px_2px_2px_rgba(96,165,250,0.3)] text-sm mt-3 text-right px-2 py-2 max-w-fit ml-auto'>
                                                    <Markdown>{message.content}</Markdown>
                                                </div>)}
                                        </div>
                                    )}
                                    {message.role === 'assistant' && (
                                        <div>
                                            <div>
                                                <Flex gap={3} w={'100%'} alignItems={'center'}
                                                      justifyContent={'flex-start'}>
                                                    <div
                                                        className='text-3xl bg-white border rounded-lg border-gray-100 shadow-[0_0_1px_1px_rgba(0,0,0,0.2)]'>
                                                        <SiOpenai/></div>
                                                    <MyTooltip label='复制'>
                                                        <ChatButton
                                                            onClick={() => copyTextToClipboard(message.content)}>
                                                            <GoCopy/>
                                                        </ChatButton>
                                                    </MyTooltip>
                                                    <MyTooltip
                                                        label={message.score === 0 ? '给本次回答打个分' : message.score + ' 分'}>
                                                        <ChatButton
                                                            onClick={() => scoring(message.id, message.score)}
                                                        >
                                                            {message.score === 0 ? (
                                                                <CiStar/>
                                                            ) : (
                                                                <Flex>
                                                                    {Array.from({length: message.score}, (_, index) => (
                                                                        <CiStar key={index} className='text-red-600'/>
                                                                    ))}
                                                                </Flex>
                                                            )}
                                                        </ChatButton>
                                                    </MyTooltip>
                                                </Flex>
                                            </div>
                                            <div
                                                className='bg-pink-100 rounded-lg shadow-[0_2px_2px_2px_rgba(244,114,182,0.3)] text-sm mt-3 px-2 py-2'>
                                                <Markdown>{message.content}</Markdown>
                                                {showRankingList && (
                                                    <Flex alignItems='center' mt='4' flexWrap='wrap' gap='2'>
                                                        <MyTooltip label='本次请求总共使用的token数量'>
                                                            <Tag
                                                                text={`${message.response.usage ? message.response.usage.total_tokens : 0} tokens`}/>
                                                        </MyTooltip>
                                                        <MyTooltip label='本次请求所用时间'>
                                                            <Tag
                                                                text={`${message.response.time_cost ? message.response.time_cost.total : '0s'}`}/>
                                                        </MyTooltip>
                                                        <MyTooltip label='模型名称'>
                                                            <Tag text={message.model_name}/>
                                                        </MyTooltip>
                                                    </Flex>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className='absolute bottom-6 inset-x-0'>
                    <div className='w-full max-w-4xl mx-auto flex flex-col items-center px-4 space-y-4'>
                        <div
                            className='flex items-end w-full border border-back/10 bg-blue-100 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] py-2'>
                            <div className='mx-3 mb-2.5'>
                                <PiLightningFill/>
                            </div>
                            <TextareaAutoSize
                                className='outline-none flex-1 max-h-64 mb-1.5 bg-transparent text-black resize-none border-0'
                                placeholder='输入一条消息...'
                                rows={1}
                                value={messageText}
                                onKeyDown={handleEnter}
                                onChange={(e) => {
                                    if (!(e.target.value === '\n')) {
                                        setMessageText(e.target.value)
                                    }
                                }}
                            />
                            <MyButton
                                className='mx-3 !rounded-lg text-blue-500'
                                icon={FiSend}
                                disabled={messageText.trim() === ""}
                                variant='primary'
                                onClick={send}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {showScoreModal && (
                <Modal isOpen={true} onClose={() => setShowScoreModal(false)}>
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalHeader>请打分</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                            <div className='px-6'>
                                <Slider
                                    id='slider'
                                    defaultValue={scoreValue}
                                    min={0}
                                    max={5}
                                    step={1}
                                    colorScheme='red'
                                    onChange={(v) => setScoreValue(v)}
                                    onMouseEnter={() => setShowScoreTooltip(true)}
                                    onMouseLeave={() => setShowScoreTooltip(false)}
                                >
                                    <SliderMark value={0} mt='1' fontSize='sm' ml='-0.5' color='red.100'>0</SliderMark>
                                    <SliderMark value={1} mt='1' fontSize='sm' ml='-0.5' color='red.200'>1</SliderMark>
                                    <SliderMark value={2} mt='1' fontSize='sm' ml='-0.5' color='red.300'>2</SliderMark>
                                    <SliderMark value={3} mt='1' fontSize='sm' ml='-0.5' color='red.400'>3</SliderMark>
                                    <SliderMark value={4} mt='1' fontSize='sm' ml='-0.5' color='red.500'>4</SliderMark>
                                    <SliderMark value={5} mt='1' fontSize='sm' ml='-0.5' color='red.600'>5</SliderMark>
                                    <SliderTrack><SliderFilledTrack/></SliderTrack>
                                    <Tooltip
                                        hasArrow
                                        bg='blue.300'
                                        color='white'
                                        placement='top'
                                        isOpen={showScoreTooltip}
                                        label={`${scoreValue} 分`}
                                    >
                                        <SliderThumb/>
                                    </Tooltip>
                                </Slider>
                            </div>
                            <div
                                className='px-8 mt-12 text-sm text-gray-600'>分数越高表示回答质量越高，0分表示回答质量很差，5分表示回答质量很好
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button border='1px' borderColor='gray.200'
                                    onClick={confirm_scoring}>确认</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </div>
    )
}
