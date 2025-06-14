"use client"
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import logo from "../../../public/logo.png"
import useWalletStore from "../../../walletStore"
import pfp from '../../../public/pfp.jpg'

export default function Nav1() {
    const {balance, address} = useWalletStore()
    let len = address.length
    let displayadd = address.slice(0, 3) + "..." + address.slice(len - 3, len)
  return (
    <div className=" p-2 px-7 w-[95%] h-fit items-center flex flex-row justify-between  backdrop-blur-2xl rounded-4xl border-1 border-white">
        <div className="flex flex-row gap-3 items-center">
            <Image src={logo} alt="auctopus" height={40} width={40}></Image>
            <div className="text-3xl font-bold">Auctopus</div>
        </div>
        <div className="flex flex-row gap-3 items-center">
            <div className="dropdown dropdown-hover dropdown-bottom dropdown-center">
            <div tabIndex={0} role="button" className="btn w-12 h-12 border-0 rounded-full bg-gradient-to-r from-rose-500 to-cyan-400"></div>
                <div tabIndex={0} className="dropdown-content  bg-base-100 rounded-box z-1 w-38 flex items-start justify-center flex-col p-3 shadow-sm">
                    <div className="text-sm font-bold">Account: {displayadd}</div>
                    <div className="text-sm font-bold">Balance: {balance}</div>
                </div>
            </div>
        </div>
    </div>
  )
}
