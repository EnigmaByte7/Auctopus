
import {Button} from "../ui/button"
import Image from "next/image"
import illus from '../../../public/illus.png'
import { ethers } from 'ethers'
import useWalletStore from '../../../walletStore'
import { toast } from "sonner"
import { useState, useEffect } from "react"
import  { useRouter } from "next/navigation"

export default function Hero() {
    const router = useRouter()
    const [isloading, setLoading] = useState(false)
    const {isHydrated, isConnected, balance, setWallet } = useWalletStore()

    const handleWallet = async () => {
        if(isConnected){
            router.push('/browse')
            return;
        }
        setLoading(true);
        if (typeof window === 'undefined' || !window.ethereum) {
            console.log("MetaMask is not installed")
            toast.info("Metamask not installed!")
            setLoading(false)
            return
        }
        const provider = new ethers.BrowserProvider(window.ethereum)
        const network = await provider.getNetwork()
        let balance = 0;
        if (network.chainId !== 11155111) {
            try{
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0xaa36a7' }],
                })
            }
            
            catch(e){
                if(e.code === 4902){
                    try{
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [ {
                                chainId: '0xaa36a7',
                                chainName: 'Sepolia Test Network',
                                rpcUrls: ['https://rpc2.sepolia.org'],
                                nativeCurrency: {
                                    name: 'SepoliaETH',
                                    symbol: 'ETH',
                                    decimals: 18,
                                },
                                blockExplorerUrls: ['https://sepolia.etherscan.io'],
                                },
                            ],
                        })
                    }
                    catch(e){
                        console.log('cannot add sepolia chain');
                        toast.error('Sepolia Test Network can\'t be added as chain')
                        setLoading(false)
                        return;
                    }
                }
            }
        }

        try {
            const account = await window.ethereum.request({
                "method": "eth_requestAccounts",
                "params": [],
            });
            
            const balanceBigInt = await provider.getBalance(address);
            balance = ethers.formatEther(balanceBigInt);
        }
        catch(e) {
            if(e.code === 4001){
                console.log('User rejected the request')
                toast.warning("Please connect your wallet to continue")
                return
            }
        }
        finally{
            setLoading(false)
        }

        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        console.log(address);
        toast.success("Wallet Successfully connected!")
        setWallet(address, true, balance)
        router.push('/browse')
    }
    
  return (
          <div className="flex flex-row items-center  justify-center w-full">
          <div className="flex flex-row gap-3 w-[65%] items-center">
            <div className="flex flex-col gap-7 ">
              <div className="flex flex-col gap-4">
                <div className="text-5xl break-words font-bold">Seize Opportunities,<br></br> Seal Deals</div>
                <div className="text-lg break-words font-medium">With Auctopus a decentralized auction platform deployed on Ethereum blockchain</div>
              </div>
              <button  onClick={handleWallet} disabled={isloading} className="btn btn-neutral w-fit rounded-lg">
                {isloading && <span className="loading loading-spinner"></span> }{isConnected ? 'Continue' : 'Connect Wallet'}</button>
            </div>
            <div >
              <Image src={illus} alt="illustration" height={450} width={450}></Image>
            </div>
          </div>
        </div>
  )

}