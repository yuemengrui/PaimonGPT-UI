'use client'
import {Select, Table, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import {useState} from "react";

export default function TableStructure({tableInfo}) {

    const [table, setTable] = useState(tableInfo[0].table_name || undefined)

    return (
        <div>
            <Select onChange={(e) => setTable(e.target.value)}>
                {tableInfo.map((item) => (
                    <option key={item.table_name} value={item.table_name}>{item.table_name}</option>
                ))}
            </Select>
            {table && (
                <TableContainer mt={6}>
                    <Table variant="striped" size={'sm'}>
                        <Thead>
                            <Tr>
                                <Th>名称</Th>
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
            )}
        </div>
    );
}
