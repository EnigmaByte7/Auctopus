import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ethers } from "ethers"
import useFormStore from "../../../formStore"
import Auctopus from '../../../artifacts/Auctopus.json'
import FlexibleNFT from '../../../artifacts/FlexibleNFT.json'
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function publish({handleNext, handlePrev}) {
    const router = useRouter()
    const [load, setLoad] = useState(false)
    const NFT_CONTRACT_ADDRESS= '0xc4f21f52867ebC1377794c08EA27B4969F7419C6'
    const AUCTOPUS_CONTRACT_ADDRESS = '0xC0Dca172cF93Ce6bc089dD14EEc1f761E0cCC303'

    const {incr, init, time, tokenid , setfinal, t,sett} = useFormStore()
    console.log(incr, init, time)
    const handleTime = (e) => {
        const t = e.target.value
        sett(t)
        const sel = new Date(t)
        const unixTime = Math.floor(sel.getTime() / 1000);
        setfinal(incr, init, unixTime)
        console.log(unixTime)
    }
    const handleComplete = async () => {
        router.prefetch('/browse')
        setLoad(true)
        const { name, desc, init, incr, time, tokenid, imageurl, metauri,reset } = useFormStore.getState();

        if(time == null || incr == null || init == null){ 
            toast.error('Please fill all fields')
            setLoad(false)
            return
        }
        if (time <= Math.floor(Date.now() / 1000)) {
            setLoad(false)
            toast.error("End time must be in the future");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner()
            const auctopus = new ethers.Contract(AUCTOPUS_CONTRACT_ADDRESS, Auctopus.abi, signer);
            const nft = new ethers.Contract(NFT_CONTRACT_ADDRESS, FlexibleNFT.abi, signer)

            const approvetx = await nft.approve(AUCTOPUS_CONTRACT_ADDRESS, tokenid)
            await approvetx.wait()
            const currowner = await nft.ownerOf(tokenid)
            console.log(currowner);

            if(currowner !== AUCTOPUS_CONTRACT_ADDRESS){
                const transfertx = await nft["safeTransferFrom(address,address,uint256)"](
                    await signer.getAddress(),
                    AUCTOPUS_CONTRACT_ADDRESS,
                    tokenid
                )

                await transfertx.wait()
            }

            const bigtime = BigInt(time)
            const biginit = BigInt(init)
            const bigincr = BigInt(incr)
            const bigtokenid = BigInt(tokenid)
            console.log("Auction Params", {
              name,                  
                desc,                 
                biginit,                 
                bigtime,               
                bigtokenid,            
                metauri, 
                imageurl,              
                bigincr                  
            });

            const tx = await auctopus.createAuction(
                name,                  
                desc,                 
                biginit,                 
                bigtime,               
                bigtokenid,            
                metauri, 
                imageurl,              
                bigincr                  
            );

            
            await tx.wait();
            // const auction = await auctopus.getAuction(6);
            // console.log(auction);
            toast.success("Auction created successfully");
            setTimeout(() => {
                router.push('/browse')
                reset()
            }, 2000)
        }
        catch(e){
            console.log(e);
            toast.error('Something went Wrong')
        }
        finally{
            setLoad(false)
        }
    }
  return (
    <Card className="w-full max-w-sm relative">
            <CardHeader>
                <CardTitle className='text-2xl font-bold text-center'>Publish</CardTitle>
            </CardHeader>
            <CardContent>
            <form>
            <div className="flex flex-col gap-6">  
              <Label htmlFor="token">Token Id</Label>
                <Input
                    id="token"
                    value={tokenid}
                    type="number"
                    className="cursor-not-allowed pointer-events-all"
                    disabled
                />
                <div className="grid gap-2">
                <Label htmlFor="init">Initial Value</Label>
                <Input
                    id="init"
                    value={init && init !== "" ? ethers.formatUnits(init, "ether") : 0.0}
                    placeholder="0.05 ETH"
                    type="number" min={0.0001}
                step={0.0001}
                    onChange={(e) => setfinal(incr, (ethers.parseUnits(e.target.value, "ether")).toString(), time)}
                    required
                />
                </div>
                <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="incr">Minimum increment</Label>
                </div>
                <Input id="incr" type="number" required min={0.0001} placeholder="0.1 ETH"
                step={0.0001} value={incr && incr !== "" ? ethers.formatUnits(incr, "ether") : 0.0} onChange={(e) => setfinal((ethers.parseUnits(e.target.value, "ether")).toString(), init, time)} />
                </div>
                <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="time">End Time</Label>
                </div>
                <input type="datetime-local" id="time" className="input"   value={t} onChange={(e) => handleTime(e)}/>
                </div>
            </div>
            </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
            <Button disabled={load} type="submit" className="w-full" onClick={handleComplete}>
                Next
            </Button>            
            <Button disabled={load} type="submit" variant={"outline"} className="w-full" onClick={() => handlePrev()}>
                Prev
            </Button>
        </CardFooter>
        { load && <progress className="progress absolute top-0 rounded-tl-full rounded-tr-full"></progress>}
    </Card>
  )
}
