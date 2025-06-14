'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Nav1 from '@/components/ui/Nav1'
import { use } from 'react'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ethers } from 'ethers'
import Auctopus from '../../../../artifacts/Auctopus.json'
import { Toaster } from 'sonner'
import { toast } from 'sonner'

export default  function page({params}) {
  const AUCTOPUS_CONTRACT_ADDRESS = '0xC0Dca172cF93Ce6bc089dD14EEc1f761E0cCC303'
  console.log(params);
  
  const {id} =  use(params)
  const router = useRouter()
  const [bid, setBid] = useState();
  const [load, setLoad] = useState(false);
  const [res, setRes] = useState();
  const handlePlacebid = async () => {
    setLoad(true)
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const auctopus = new ethers.Contract(AUCTOPUS_CONTRACT_ADDRESS, Auctopus.abi, signer);
      const currtime = Math.floor(Date.now() / 1000);
      if (currtime > Number(res.endtime)) {
        const tx = await auctopus.finalizeAuction(res.tokenid);
        await tx.wait();

        return;
      }
      try {

        const tx = await auctopus.bid(res.tokenid, {
          value: bid, 
        });

        await tx.wait(); 

        const updatedAuction = await auctopus.getAuction(res.tokenid);
        const updated = {
          name: updatedAuction.name,
          desc: updatedAuction.desc,
          owner: updatedAuction.owner,
          initial: updatedAuction.initial_value,
          endtime: updatedAuction.endtime,
          tokenid: updatedAuction.tokenid,
          imageuri: updatedAuction.imageuri,
          tokenuri: updatedAuction.tokenuri,
          currentbid: updatedAuction.currentbid,
          currentbidder: updatedAuction.currentbidder,
          minincrement: updatedAuction.minincrement,
          totalbidders: updatedAuction.totalbidders,
          finalized: updatedAuction.finalized
        };

        setRes(updated);
        setBid();
      } catch (err) {
        console.error('Bid error:', err);
        toast.error('Something went wrong...')
      }
      finally{
        setLoad(false)
      }

  }

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoad(true)
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const auctopus = new ethers.Contract(AUCTOPUS_CONTRACT_ADDRESS, Auctopus.abi, signer)
      const auction = await auctopus.getAuction(id);
      console.log(auction.name);
      const res = {
            name: auction.name,
            desc: auction.desc,
            owner: auction.owner,
            initial: auction.initial_value,
            endtime: auction.endtime,
            tokenid: auction.tokenid,
            imageuri: auction.imageuri,
            tokenuri: auction.tokenuri,
            currentbid: auction.currentbid,
            currentbidder: auction.currentbidder,
            minincrement: auction.minincrement,
            totalbidders: auction.totalbidders,
            finalized: auction.finalized
        }
          
      setLoad(false)
      console.log('result', res)
      setRes(res)
      }

    fetchAuctions()
  }, [])

  
  return (
    <div className='flex flex-col gap-8 w-full h-[100vh]  items-center p-2 relative'>
        <Nav1 />
      <Toaster />
       {res && !load && (
         <div className='flex flex-row w-[75%]'>

          <div className='flex flex-row justify-center items-center w-[50%] p-4'>
            <img className='border-[12px] rounded-4xl border-gray-200 shadow-xl object-cover outline-2 outline-zinc-400' width={400} height={500} src={res.imageuri}></img>
          </div>
          <div className='w-[50%] p-5 flex flex-col gap-10 '>
            <div className='flex flex-col gap-3'>
              <div className='font-bold text-3xl'>{res.name}</div>
              <div className='bg-amber-300 text-sm w-fit font-bold p-1 rounded-full'>{ethers.formatUnits(res.currentbid,"ether")} <span className='bg-amber-400 rounded-full p-1 px-3>'>ETH</span></div>
              <div className='text-lg font-medium'>{res.desc}</div>
            </div>

            <div className='flex flex-row justify-between'>
              <div className='flex flex-col gap-2'>
                <div className='text-xl font-bold'>Highest bid By: {res.currentbidder.slice(0,3) + "..." + res.currentbidder.slice(res.currentbidder.length - 3, res.currentbidder.length)}</div>
                <div className='text-sm w-fit bg-blue-300 rounded-full p-1 px-2 font-bold'>{ethers.formatUnits(res.currentbid, "ether")} <span className='bg-blue-400 rounded-full px-3 p-1>'>ETH</span></div>
              </div>
              <div className='text-lg font-bold'>Total Bidders : {res.totalbidders}</div>
            </div>

            <div className='flex flex-row justify-between'>
              <div className='flex flex-col gap-3'>
                <div className='text-lg font-bold'>Auction End Time: </div>
                <div className='text-xl font-bold'>{new Date(Number(res.endtime) * 1000).toLocaleString()}</div>
              </div> 
              <div className='flex flex-col gap-3'>
                <div className='flex flex-row items-center gap-2'>
                  <div className='text-sm font-bold'>Minimum Increment : </div>
                  <div className='bg-lime-300 text-sm w-fit font-bold p-1 rounded-full'>{ethers.formatUnits(res.minincrement,"ether")} <span className='bg-lime-400 rounded-full p-1 px-3>'>ETH</span></div>
                </div>
                 <Label htmlFor="bid">Place bid</Label>
                <Input
                    id="bid"
                    min={ethers.formatUnits(Number(res.currentbid), "ether")}
                    step={ethers.formatUnits(Number(res.minincrement), "ether")}
                    type="number"
                    placeholder='(ETH)'
                    onChange={(e) => setBid(ethers.parseUnits(e.target.value, "ether"))}
                />
                <button onClick={handlePlacebid} disabled={load} className="btn btn-wide btn-neutral">Place Bid</button>
              </div>
            </div>
          </div>
        </div>)}
        <Link href={'/browse'}>
        <button className="btn btn-circle absolute top-20 left-10 border-1">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="30"
                viewBox="0 0 1024 1024"
            ><g id="SVGRepo_iconCarrier"><path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64"></path><path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312z"></path></g>
            </svg>        
        </button>
    </Link>
      {  load && <span className="absolute top-1/2 left-1/2 loading loading-spinner loading-lg"></span>}
    </div>
  )
}
