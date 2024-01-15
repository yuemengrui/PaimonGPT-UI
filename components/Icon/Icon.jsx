import {
    Add,
    Bat,
    Bear,
    Bee,
    Bird,
    Butterfly,
    Cat,
    Cattle,
    Deer,
    Dog,
    Dolphin,
    Duck,
    Eagle,
    Elephant,
    FishOne,
    Frog,
    Hippo,
    KoalaBear,
    Monkey,
    Owl,
    Panda,
    Pig,
    Pigeon,
    Rabbit,
    Whale,
    MoreApp
} from '@icon-park/react'
import '@icon-park/react/styles/index.css';

export default function Icon({name = null}) {
    const special_icons = {
        'Add': <Add theme="outline" size="24" fill="#adabab" />,
    }

    const iconList = [
        {'icon': <Bat theme="outline" size="24" fill="#333"/>},
        {'icon': <Bear theme="outline" size="24" fill="#333"/>},
        {'icon': <Bee theme="outline" size="24" fill="#333"/>},
        {'icon': <Bird theme="outline" size="24" fill="#333"/>},
        {'icon': <Butterfly theme="outline" size="24" fill="#333"/>},
        {'icon': <Cat theme="outline" size="24" fill="#333"/>},
        {'icon': <Cattle theme="outline" size="24" fill="#333"/>},
        {'icon': <Deer theme="outline" size="24" fill="#333"/>},
        {'icon': <Dog theme="outline" size="24" fill="#333"/>},
        {'icon': <Dolphin theme="outline" size="24" fill="#333"/>},
        {'icon': <Duck theme="outline" size="24" fill="#333"/>},
        {'icon': <Eagle theme="outline" size="24" fill="#333"/>},
        {'icon': <Elephant theme="outline" size="24" fill="#333"/>},
        {'icon': <FishOne theme="outline" size="24" fill="#333"/>},
        {'icon': <Frog theme="outline" size="24" fill="#333"/>},
        {'icon': <Hippo theme="outline" size="24" fill="#333"/>},
        {'icon': <KoalaBear theme="outline" size="24" fill="#333"/>},
        {'icon': <Monkey theme="outline" size="24" fill="#333"/>},
        {'icon': <Owl theme="outline" size="24" fill="#333"/>},
        {'icon': <Panda theme="outline" size="24" fill="#333"/>},
        {'icon': <Pig theme="outline" size="24" fill="#333"/>},
        {'icon': <Pigeon theme="outline" size="24" fill="#333"/>},
        {'icon': <Rabbit theme="outline" size="24" fill="#333"/>},
        {'icon': <Whale theme="outline" size="24" fill="#333"/>}
    ]
    return (
        name ? (special_icons[name]) : (iconList[Math.floor(Math.random() * (iconList.length))].icon)
    )
}

