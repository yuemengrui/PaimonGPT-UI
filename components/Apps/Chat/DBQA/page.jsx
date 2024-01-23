"use client";

import {Fragment, useEffect, useState} from "react";
import {closeDatabaseSession, createDatabaseSession, getPresetDatabases} from "/api/db";
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
} from "@chakra-ui/react";
import TableStructure from './TableStructure'
import TableData from './TableData'
import DBChatPage from "./dbchat";

const custom = {
    name: "自定义连接",
    value: "custom",
};


export default function Page({appInfo}) {
    const [presetDatabases, setPresetDatabases] = useState([custom]);

    const [db, setDB] = useState("custom");
    const [ip, setIp] = useState("");
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [port, setPort] = useState("3306");
    const [dbName, setDBName] = useState("")

    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState("");
    const [dbTableInfo, setDBTableInfo] = useState(null)

    async function handleDatabaseSessionClose() {
        try {
            await closeDatabaseSession(session)
        } catch (error) {
        }
        setSession("")
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await createDatabaseSession(db, ip, port, user, password, dbName);
            if (res) {
                setSession(res.db_name);
                setDBTableInfo(res.table_info)
            } else {
                // TODO: 异常处理
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    useEffect(() => {
        getPresetDatabases()
            .then((res) => {
                const temp = []
                res.map((item) => (temp.push({'name': item, 'value': item})))
                setPresetDatabases([...temp, custom]);
            })
            .catch(() => "xxx");
    }, []);
    return (
        <div className='flex h-full' style={{maxHeight: 'calc(100vh - 68px)', minHeight: 'calc(100vh - 76px)'}}>
            <div
                className='flex flex-1 border border-gray-200 bg-white rounded-3xl mt-1 mr-2 ml-2 mb-2 overflow-y-auto h-full'>
                <div className="flex w-[600px]">
                    {session ? (
                        <div className="w-full">
                            <div className="flex px-6 mt-4 justify-between">
                                <div>当前连接：<span className="text-blue-500 underline mx-2">{session}</span></div>
                                <button className="border" onClick={handleDatabaseSessionClose}>断开</button>
                            </div>
                            <Tabs mt={4}>
                                <TabList>
                                    <Tab>表结构</Tab>
                                    <Tab>表数据</Tab>
                                </TabList>

                                <TabPanels>
                                    <TabPanel>
                                        <TableStructure tableInfo={dbTableInfo}/>
                                    </TabPanel>
                                    <TabPanel>
                                        <TableData db_name={session} tableInfo={dbTableInfo}/>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </div>
                    ) : (
                        <div className="mx-auto mt-6">
                            <form onSubmit={handleSubmit}>
                                <FormControl>
                                    <FormLabel>选择数据库</FormLabel>
                                    <Select value={db} onChange={(e) => setDB(e.target.value)}>
                                        {presetDatabases.map((db) => (
                                            <option key={db.value} value={db.value}>
                                                {db.name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>
                                {db === "custom" && (
                                    <Fragment>
                                        <FormControl>
                                            <FormLabel>IP</FormLabel>
                                            <Input value={ip} onChange={(e) => setIp(e.target.value)}/>
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>用户</FormLabel>
                                            <Input
                                                value={user}
                                                onChange={(e) => setUser(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>密码</FormLabel>
                                            <Input
                                                type={'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>端口</FormLabel>
                                            <Input
                                                value={port}
                                                onChange={(e) => setPort(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>数据库名</FormLabel>
                                            <Input
                                                value={dbName}
                                                onChange={(e) => setDBName(e.target.value)}
                                            />
                                        </FormControl>
                                    </Fragment>
                                )}
                                <Button mt={4} isLoading={loading} type="submit">
                                    Submit
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
                <div className='w-[1px] h-full bg-gray-200'/>
                {session && (<DBChatPage dbName={db} appInfo={appInfo} chat_id={1} chat_name={'DBQA'}/>)}
            </div>
        </div>
    )
}
