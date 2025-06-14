'use client'
import React from 'react'
import Nav1 from '@/components/ui/Nav1'
import Link from 'next/link'
import Basic from '@/components/ui/Basic'
import BackButton from '@/components/ui/backbutton'
import Progress from '@/components/ui/progress'
import Tokenize from '@/components/ui/tokenize'
import Publish from '@/components/ui/publish'
import useFormStore from '../../../formStore'
import Image from 'next/image'
import logo from '../../../public/logo.png'
import { Toaster } from 'sonner'

export default function page() {
    const {current, setcurrent, setbasic, isHydrated} = useFormStore()
    const handleNext = () => {
        if(current === 2) setcurrent(0);
        else setcurrent(current + 1);
    }
    const handlePrev = () => {
        if(current === 0) return;
        else setcurrent(current - 1);
    }
    
    return (
        <div className='flex flex-col items-center p-2'>
            {isHydrated === true ?
            (
            <>
            <Toaster />
            <Nav1 />
            <div className='flex flex-col w-full items-center justify-center p-7 relative'>
                <BackButton />
                <div className='flex flex-col gap-10 w-full h-full items-center'>
                    <div className='text-[40px] font-bold'>Create Auction</div>
                    <Progress current={current}/>
                    {
                        current === 0 ? <Basic handleNext={handleNext}/> :
                        current === 1 ? <Tokenize handleNext={handleNext} handlePrev={handlePrev}/> :
                        <Publish hhandleNext={handleNext} handlePrev={handlePrev}/>
                    }
                </div>
            </div>
            </>
                ) : 
                (
                <div className='w-full h-screen flex flex-col gap-3.5 items-center justify-center'>
                    <Image src={logo} alt="llogo" width={100} height={100}></Image>
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
                )
            }
    </div>
  )
}
