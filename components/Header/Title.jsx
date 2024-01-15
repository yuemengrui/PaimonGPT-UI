import {useRouter} from 'next/navigation';

export function Title() {
    const router = useRouter()
    return (
        <img
            className='cursor-pointer'
            onClick={() => (router.push('/welcome'))}
            src='/paimongpt_logo.png'
            alt='logo'
            width={224}
        />
    );
}

