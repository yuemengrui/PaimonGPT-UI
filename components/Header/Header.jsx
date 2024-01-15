'use client'
import {Title} from "./Title";
import MyAvatar from "@/components/Header/Avatar";
import MenuList from "@/components/Header/MenuList";

export function Header() {

    return (
        <div className='min-h-[56px] max-h-[64px]'>
            <div className='flex flex-1 items-center justify-between px-6'>
                <Title />
                <MenuList />
                <MyAvatar />
            </div>
            <hr className='mt-1'/>
        </div>
    );
}

