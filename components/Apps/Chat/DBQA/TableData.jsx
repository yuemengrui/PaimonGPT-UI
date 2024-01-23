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

export default function TableData({db_name, tableInfo}) {
    const [table, setTable] = useState(null);
    const [tableFields, setTableFields] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
        total: 0,
    });

    function handlePageChange(page) {
        getCurrentDatabaseTableData(
            db_name,
            table,
            page,
            pagination.pageSize
        ).then((res) => {
            setTableData(res.data);
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
                db_name,
                table,
                1,
                pagination.pageSize
            ).then((res) => {
                console.log('xx', res)
                if (res.data.length > 0) {
                    let item = res.data[0];
                    const keys = Object.keys(item);
                    setTableFields(keys);
                }
                setTableData(res.data);
                setPagination({
                    ...pagination,
                    page: 1,
                    total: res.total,
                });
            });
        }
    }, [table]);
    const disablePreviousPage = pagination.page === 1;
    const disableNextPage =
        pagination.page >= pagination.total / pagination.pageSize;
    return (
        <div>
            <Select onChange={(e) => {setTable(e.target.value)}} placeholder={'请选择数据表'}>
                {tableInfo.map((item) => (
                    <option key={item.table_name} value={item.table_name}>{item.table_name}</option>
                ))}
            </Select>
            {table && (
                <TableContainer mt={6}>
                    <Table variant="striped" size={'sm'}>
                        <Thead>
                            <Tr>
                                {tableFields.map((th) => (
                                    <Th key={th} keys={th}>{th}</Th>
                                ))}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {tableData.length > 0 && tableData.map((item) => (
                                <Tr key={item.id}>
                                    {tableFields.map((tf) => {
                                        return (<Td key={tf}>{item[tf]}</Td>)
                                    })}
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            )}

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
