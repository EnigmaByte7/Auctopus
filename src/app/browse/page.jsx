'use client'
import React, { useEffect, useState } from 'react'
import Nav1 from '@/components/ui/Nav1'
import Link from 'next/link'
import { ethers } from 'ethers'
import Auctopus from '../../../artifacts/Auctopus.json'
import FlexibleNFT from '../../../artifacts/FlexibleNFT.json'
import Auctions from '@/components/ui/Auctions'

export default function Page() {
    const NFT_CONTRACT_ADDRESS= '0xc4f21f52867ebC1377794c08EA27B4969F7419C6'
    const AUCTOPUS_CONTRACT_ADDRESS = '0xC0Dca172cF93Ce6bc089dD14EEc1f761E0cCC303'
  const [load, setLoad] = useState(false)
  const [auctions, setAuctions] = useState([])
  console.log(auctions);
  

  useEffect(() => {
    const fetchAuctions = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const auctopus = new ethers.Contract(AUCTOPUS_CONTRACT_ADDRESS, Auctopus.abi, signer)
      const auction = await auctopus.getAuction(9);
      console.log(auction.name);
      setLoad(true)
      try {
        const tokenIds = await auctopus.getAllTokenIds()
        const alltokens = tokenIds.map(id => Number(id));
        
        const res = await Promise.all(alltokens.map(async (tokenid) => {
          const auction = await auctopus.getAuction(tokenid)
          console.log(auction);
          
          return {
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
        }))
         console.log('result', res)

         setAuctions(res)
        // setAuctions(results)
      } catch (err) {
        console.error('Error fetching auctions:', err.revert.args[0])
      }
      finally{
        setLoad(false)
      }
    }

    fetchAuctions()
  }, [])

  
  return (
    <div className='flex flex-col gap-8 w-full h-[100vh]  items-center p-2 relative'>
        <Nav1 />
        <div className='flex flex-col gap-2.5 w-[95%] '>
          <div className='flex flex-row  justify-between items-baseline'>
              <div className='text-4xl text-left font-extrabold'>All Auctions</div>
              <Link href={'/create'} >
              <button className="btn rounded-3xl btn-primary text-white">
                Create Auction
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="#fff"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-plus-icon lucide-circle-plus"
                    viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8M12 8v8"></path>
                </svg>
                </button> 
              </Link>
          </div>
        </div>

      {  load && <span className="absolute top-1/2 left-1/2 loading loading-spinner loading-lg"></span>}
      {
        !load && (<Auctions auctions={auctions}></Auctions>)
      }
    </div>
  )
}
