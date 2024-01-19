'use client'
import {useEffect, useState} from "react";
import {get_appstore_app_list} from '/api/appstore'
import AppStoreAppCard from "/components/AppStore/AppStoreAppCard";
import {get_app_list} from "/api/app";


export default function AppStore() {
    const [appList, setAppList] = useState([])
    const [installedAppList, setInstalledAppList] = useState([])

    async function getStoreAppList() {
        const res = await get_appstore_app_list()
        if (res) {
            setAppList(res)
        }
    }

    async function getUserAppList() {
        const res = await get_app_list()
        if (res) {
            const temp = []
            res.map((item) => {
                if (item.is_store) {
                    temp.push(item.store_app_uid)
                }
                setInstalledAppList(temp)
            })
        }
    }

    useEffect(() => {
        getStoreAppList()
        getUserAppList()
    }, []);


    return (
        <>
            {appList.length > 0 ? (
                <div
                    className='grid content-start grid-cols-1 gap-4 px-12 pt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grow shrink-0'>
                    {appList.map(app => (
                        <AppStoreAppCard key={app.id} app={app} installed={installedAppList.includes(app.id)}/>
                    ))}
                </div>
            ) : (
                <div className='w-full h-full text-center'>
                    <div className='text-2xl mt-36'>暂时还未有应用上架</div>
                    <div className='text-4xl mt-6'>敬请期待</div>
                </div>

            )}
        </>
    )
}
