import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import logo from "../../../public/logo.png"

export default function Nav() {
  return (
    <div className=" p-2 px-7 w-[95%] h-fit items-center flex flex-row justify-between  backdrop-blur-2xl rounded-4xl border-1 border-white">
        <div className="flex flex-row gap-3 items-center">
            <Image src={logo} alt="auctopus" height={40} width={40}></Image>
            <div className="text-3xl font-bold">Auctopus</div>
        </div>
        <div className="flex flex-row gap-3 items-center">
            <Link href={'https://github.com/EnigmaByte7'}> 
            <Avatar>
                <AvatarImage src="https://avatars.githubusercontent.com/u/134928189?v=4" />
                <AvatarFallback>EN7</AvatarFallback>
            </Avatar>
            </Link>
        </div>
    </div>
  )
}
