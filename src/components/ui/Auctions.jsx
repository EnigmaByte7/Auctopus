import Link from 'next/link';
import React from 'react'

export default function Auctions({auctions}) {
    console.log(auctions);
    
  return (
    auctions.map(auction => {
        return (
    <div key={auction.tokenid} className="card card-side bg-base-100 w-[90%] shadow-sm">
        <figure className="w-auto h-auto [&>*]:w-[200px] [&>*]:h-[200px] [&>*]:object-cover">
            <img
            width={300}
            height={400}
            src={auction.imageuri}
            alt="NFT" />
        </figure>
        <div className="card-body">
            <h2 className="card-title text-3xl font-bold">{auction.name}</h2>
            <p className='text-xl'>{auction.desc}</p>
            <div className="card-actions justify-end">
            <Link href={`/auction/${auction.tokenid}`}><button className="btn btn-primary">Bid</button></Link>
            </div>
        </div>
        </div>)
    })
  )
}
