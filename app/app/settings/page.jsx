'use client'
import {useSearchParams} from 'next/navigation';
import {useEffect, useState} from "react";
import {get_app_info} from "/api/app";
import React, {lazy} from 'react';

export default function APPSettings() {
    const searchParams = useSearchParams()
    const appid = searchParams.get('appid')
    const [appInfo, setAppInfo] = useState({})
    const [DynamicComponent, setDynamicComponent] = useState("div")


    async function getAppInfo() {
        const resp = await get_app_info(appid)
        if (resp) {
            setAppInfo(resp)
            const appComponent = resp.module_name || 'Universal'
            setDynamicComponent(lazy(() => import(`/components/Apps/Settings/${appComponent}/page`)));
        }
    }

    useEffect(() => {
        getAppInfo()
    }, []);

    return (<><DynamicComponent appInfo={appInfo} setAppInfo={setAppInfo}/></>)
}
