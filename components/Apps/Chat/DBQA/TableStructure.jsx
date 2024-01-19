'use client'
import {Select, Table, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import {useEffect} from "react";
import {useState} from "react";
import {getCurrentDatabaseTableStructure} from "/api/db";

export default function TableStructure(props) {
    const tables = props.tables || [];
    const [table, setTable] = useState("");
    const [data, setData] = useState([]);
    useEffect(() => {
        if (table) {
            getCurrentDatabaseTableStructure(props.session, table).then((res) => {
                setData(res);
            });
        }
    }, [table]);
    return (
        <div>
            <Select onChange={(e) => setTable(e.target.value)}>
                {tables.map((item) => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                ))}
            </Select>
            <TableContainer>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>名称</Th>
                            <Th>数据类型</Th>
                            <Th>默认值</Th>
                            <Th>注释</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.map((item) => (
                            <Tr key={item.id}>
                                <Td>{item.name}</Td>
                                <Td>{item.type}</Td>
                                <Td>{item.default}</Td>
                                <Td>{item.comment}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </div>
    );
}
