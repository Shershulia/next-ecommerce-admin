import React from 'react';
import Image from "next/image";
import {useSession} from "next-auth/react";

const HomeHeader = () => {
    const {data:session} = useSession();
    return (
        <div className="text-amber-900 flex sm:justify-between sm:gap-0 items-center justify-start gap-4">
            Hello, {session?.user?.name}
            <Image src={session?.user?.image} width={30} height={30} alt='user image' className='object-contain rounded-[50%] sm:hidden'></Image>
            <div className={'hidden sm:block'}>
                <div className='flex flex-col p-4 rounded-lg items-center bg-gray-200'>
                    <Image src={session?.user?.image} width={50} height={50} alt='user image' className='object-contain rounded-[50%]'></Image>
                    <h2 className="font-semibold leading-6">{session?.user?.name}</h2>
                </div>
            </div>
        </div>
    );
};

export default HomeHeader;