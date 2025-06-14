import Image from "next/image"
import logo from "../../public/logo.png";

export default function loading() {
  return (
    <div className='w-full h-screen flex flex-col gap-3.5 items-center justify-center'>
      <Image src={logo} alt="llogo" width={100} height={100}></Image>
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  )
}
