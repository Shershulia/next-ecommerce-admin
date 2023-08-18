import Image from 'next/image'
import {useSession, signIn, signOut} from "next-auth/react"
import {Logo, Navbar} from "@/components";
import {useState} from "react";


export default function Layout({children}) {
    const { data: session } = useSession();
    const [showNav, setShowNav] = useState(false);
    if(!session){
      return (
          <div className={'bg-amber-900 w-screen h-screen flex items-center'}>
            <div className={'text-center w-full flex items-center flex-col'}>
              <button className={'bg-white p-2 rounded-lg px-4 my-4'} onClick={() => signIn('google')}>Login with Google</button>
                <button className={'bg-white btn-red p-2 rounded-lg px-4'} onClick={signOut}>Clear</button>

            </div>
          </div>
      )
    }

    return (
        <div className={'bg-amber-900 min-h-screen'}>
            <div className={'block md:hidden flex items-center'}>
                <button className={'flex items-center justify-center w-12 h-12 '} onClick={()=>setShowNav(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="white" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                    </svg>
                </button>
                <div className={'flex w-full justify-center mr-12'}>
                    <Logo/>
                </div>
            </div>
                <div className={'flex mb-2'}>
                    <Navbar show={showNav}/>

                    <div className={'bg-white flex-grow h-full my-2 md:mr-2 mx-2 rounded-lg p-4'}>{children}</div> <br/>
                </div>
        </div>

    )

}
