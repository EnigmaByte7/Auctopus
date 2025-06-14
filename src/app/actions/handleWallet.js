import { ethers } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";
import { Elsie_Swash_Caps } from "next/font/google";

const handleWallet = async () => {
    if(window.ethereum !== null){
        try{            
            const provider = new ethers.BrowserProvider(window.ethereum)
            
            const accounts = await provider.send("eth_requestAccounts", []);
            console.log(accounts);
            
            const signer = await provider.getSigner()
            console.log('provider,' ,provider)
            console.log('signer,', signer)
            console.log(await provider.getBlockNumber());
        }
        catch(e){
            console.log(e);
        }
    }
    else {
        
    }
}

export default handleWallet;