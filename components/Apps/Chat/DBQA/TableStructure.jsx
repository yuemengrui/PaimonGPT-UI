'use client'
import {Select, Table, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import {useState} from "react";
import {useToast} from '@chakra-ui/react'
import {save_table_desc} from "/api/db";

export default function TableStructure({db_name, tableInfo, tableDesc, setTableDesc}) {
    const toast = useToast()
    const [table, setTable] = useState(null)

    function updateTableComment(e) {
        const table_comment = e.target.value
        const temp = []
        tableDesc.map((item) => {
            if (item.table_name === table) {
                temp.push({...item, table_comment})
            } else {
                temp.push({...item})
            }
        })
        setTableDesc(temp)
    }

    function updateTableColumnDeprecated(col_name) {
        const temp = []
        tableDesc.map((item) => {
            if (item.table_name === table) {
                const columns = []
                item.columns.map((col) => {
                    if (col.name === col_name) {
                        const is_deprecated = !col.is_deprecated
                        columns.push({...col, is_deprecated})
                    }
                    else {
                        columns.push(col)
                    }
                })
                temp.push({...item, columns})
            } else {
                temp.push({...item})
            }
        })
        setTableDesc(temp)
    }

    function updateTableColumnComment(e, col_name) {
        const comment = e.target.value
        const temp = []
        tableDesc.map((item) => {
            if (item.table_name === table) {
                const columns = []
                item.columns.map((col) => {
                    if (col.name === col_name) {
                        columns.push({...col, comment})
                    }
                    else {
                        columns.push(col)
                    }
                })
                temp.push({...item, columns})
            } else {
                temp.push({...item})
            }
        })
        setTableDesc(temp)
    }

    async function saveTableDesc() {
        const response = await save_table_desc(db_name, tableDesc)
        if (response) {
            toast({
                title: '成功',
                status: 'success',
                position: 'top',
                duration: 2000,
            })
        }
        else {
            toast({
                title: '失败',
                status: 'error',
                position: 'top',
                duration: 2000,
            })
        }
    }

    return (
        <div>
            <Select onChange={(e) => setTable(e.target.value)} placeholder={'请选择数据表'}>
                {tableInfo.map((item) => (
                    <option key={item.table_name} value={item.table_name}>{item.table_name}</option>
                ))}
            </Select>
            {table && (
                <>
                    <TableContainer mt={6}>
                        <div
                            className='text-sm'>表注释: {tableInfo.filter((t) => t.table_name === table)[0].table_comment}</div>
                        <Table variant="striped" size={'sm'} mt={4}>
                            <Thead>
                                <Tr>
                                    <Th>字段名</Th>
                                    <Th>注释</Th>
                                    <Th>数据类型</Th>
                                    <Th>默认值</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {tableInfo.filter((t) => t.table_name === table)[0].columns.map((item) => (
                                    <Tr key={item.name}>
                                        <Td>{item.name}</Td>
                                        <Td>{item.comment}</Td>
                                        <Td>{item.type}</Td>
                                        <Td>{item.default}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                    <div className='flex mt-6'>
                        <div>自定义表描述</div>
                        <button
                            onClick={saveTableDesc}
                            className='ml-4 border bg-blue-200'
                        >
                            保存
                        </button>
                    </div>
                    <div className='text-sm flex mt-2'>
                        <div>表注释:</div>
                        <input
                            onChange={(e) => updateTableComment(e)}
                            className='ml-4'
                            value={tableDesc.filter((t) => t.table_name === table)[0].table_comment}
                        />
                    </div>
                    <div className='mt-4 w-full flex text-center items-center'>
                        <div className='w-[128px] max-w-[128px]'>字段名</div>
                        <div className='w-[36px] max-w-[36px]'>启用</div>
                        <div className='w-[496px] max-w-[496px]'>注释</div>
                    </div>
                    {tableDesc.filter((t) => t.table_name === table)[0].columns.map((item) => (
                        <>
                            <div className='mt-2 w-full flex text-center items-center'>
                                <div className='w-[128px] max-w-[128px]'>{item.name}</div>
                                <input type="checkbox" onChange={() => {
                                    updateTableColumnDeprecated(item.name)
                                }} checked={!item.is_deprecated}/>
                                <input
                                    onChange={(e) => {
                                        updateTableColumnComment(e, item.name)
                                    }}
                                    className='ml-6 w-[496px] max-w-[496px] text-center'
                                    value={item.comment}
                                />
                            </div>
                        </>
                    ))}
                </>
            )}

        </div>
    );
}
