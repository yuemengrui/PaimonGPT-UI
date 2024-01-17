"use client"

import {useEffect} from "react";
import {useRouter} from 'next/navigation';
import {auth_token_verify} from "/api/auth";

export default function Home() {
    const router = useRouter()
    useEffect(() => {
        async function auth_token() {
            const res = await auth_token_verify()

            if (res) {
                router.push('/welcome')
            }
            else {
                router.push('/auth')
            }
        }
        auth_token()
    }, []);

}
