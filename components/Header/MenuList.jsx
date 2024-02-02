import {PiDatabaseBold} from "react-icons/pi";
import {TbApps} from "react-icons/tb";
import {BsApp} from "react-icons/bs";
import {MdSportsKabaddi} from "react-icons/md";
import {Flex} from "@chakra-ui/react";
import {useRouter, usePathname} from "next/navigation";

export default function MenuList() {
    const router = useRouter()
    const pathname = usePathname()
    const MenuList = [
        {
            'root_path': 'app',
            'pathname': '/app',
            'icon': <BsApp className='text-2xl'/>,
            'name': '应用'
        },
        {
            'root_path': 'kb',
            'pathname': '/kb',
            'icon': <PiDatabaseBold className='text-2xl'/>,
            'name': '知识库'
        },
        {
            'root_path': 'appstore',
            'pathname': '/appstore',
            'icon': <TbApps className='text-2xl'/>,
            'name': '商城'
        },
        {
            'root_path': 'arena',
            'pathname': '/arena',
            'icon': <MdSportsKabaddi className='text-2xl'/>,
            'name': '竞技场'
        }
    ]
    return (
        <Flex className='flex gap-4 text-blue-400 text-sm py-1 px-2'>
            {MenuList.map((item) => {
                return (
                    <button
                        key={item.pathname}
                        className={`${pathname.split('/')[1] === item.root_path ? 'shadow-[0_0_2px_2px_rgba(244,114,182,0.2)] bg-pink-50 text-pink-400' : 'hover:bg-white hover:text-pink-300'} px-2 py-1 rounded-lg`}
                        onClick={() => router.push(item.pathname)}
                    >
                        <Flex gap={1} direction={'row'} align={'center'} textAlign={'center'}>
                            {item.icon}
                            <div className='subpixel-antialiased font-bold'>{item.name}</div>
                        </Flex>
                    </button>
                )
            })}
        </Flex>
    )
}
