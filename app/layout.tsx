import './globals.css'
import type {Metadata} from 'next'
import {Providers} from "./providers";
import {Header} from "@/components/Header/Header";


export const metadata: Metadata = {
    title: 'PaimonGPT',
    description: 'PaimonGPT',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body>
        <Providers>
            <Header/>
            {children}
        </Providers>
        </body>
        </html>
    )
}
