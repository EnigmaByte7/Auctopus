'use client'
import { AuroraBackground } from "@/components/ui/aurora-background";
import Hero from "../components/ui/hero"
import Nav from "../components/ui/Nav"
import { Toaster } from "sonner";
import useWalletStore from "../../walletStore";
import Image from "next/image";
import logo from '../../public/logo.png'

export default function Home() {
  const {isHydrated} = useWalletStore()
  
  if(!isHydrated)
  { 
    return (
    <div className='w-full h-screen flex flex-col gap-3.5 items-center justify-center'>
      <Image src={logo} alt="llogo" width={100} height={100}></Image>
      <span className="loading loading-spinner loading-lg"></span>
    </div>)
  }
  else {
    return (
      <AuroraBackground>
        <Toaster richColors/>
        <div className="w-full h-full flex items-center flex-col gap-20 p-4 z-50">
          <Nav />
          <Hero />
        </div>
      </AuroraBackground>
    )
  }
}
