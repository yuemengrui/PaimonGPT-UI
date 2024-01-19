'use client'
import {useEffect, useState} from "react";
import {get_app_info} from "/api/app";
import {useSearchParams} from 'next/navigation';
import React, {lazy} from 'react';

export default function Chat() {
    const searchParams = useSearchParams()
    const appid = searchParams.get('appid')
    const [appInfo, setAppInfo] = useState({})
    const [DynamicComponent, setDynamicComponent] = useState("div")

    async function getAppInfo(appid) {
        if (appid) {
            const res = await get_app_info(appid)
            if (res) {
                setAppInfo(res)
                const appComponent = res.module_name || 'Universal'
                setDynamicComponent(lazy(() => import(`/components/Apps/Chat/${appComponent}/page`)));
            }
        }
    }

    useEffect(() => {
        getAppInfo(appid)
    }, []);


    return (<><DynamicComponent appInfo={appInfo}/></>)
}
