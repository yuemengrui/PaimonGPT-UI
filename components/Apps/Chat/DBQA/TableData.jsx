'use client'
import {
    Button,
    Select,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import {useEffect} from "react";
import {useState} from "react";
import {getCurrentDatabaseTableData} from "/api/db";

export default function TableData(props) {
    const tables = props.tables || [];
    const [table, setTable] = useState("");
    const [ths, setThs] = useState([]);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
        total: 0,
    });

    function handlePageChange(page) {
        getCurrentDatabaseTableData(
            props.session,
            table,
            page,
            pagination.pageSize
        ).then((res) => {
            setData(res.list);
            setPagination({
                ...pagination,
                page,
                total: res.total,
            });
        });
    }

    useEffect(() => {
        if (table) {
            getCurrentDatabaseTableData(
                props.session,
                table,
                1,
                pagination.pageSize
            ).then((res) => {
                if (res.length > 0) {
                    let item = res[0];
                    const keys = Object.keys(item);
                    setThs(keys);
                }
                setData(res.list);
                setPagination({
                    ...pagination,
                    page: 1,
                    total: res.total,
                });
            });
        }
    }, [table]);
    const disablePreviousPage = pagination.page == 1;
    const disableNextPage =
        pagination.page >= pagination.total / pagination.pageSize;
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
                            {ths.map((th) => (
                                <Th key={th.id} keys={th}>{th}</Th>
                            ))}
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
            <div className="text-right mt-4">
                <Button
                    disabled={disablePreviousPage}
                    onClick={() => handlePageChange(pagination.page - 1)}
                >
                    上一页
                </Button>
                <Button
                    disabled={disableNextPage}
                    onClick={() => handlePageChange(pagination.page + 1)}
                >
                    下一页
                </Button>
            </div>
        </div>
    );
}
