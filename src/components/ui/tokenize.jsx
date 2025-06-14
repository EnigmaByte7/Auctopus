"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import useFormStore from "../../../formStore";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { PinataSDK } from "pinata";
const PINATA_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwNjg1YzcwYy1mZDQyLTRjNWUtYjg5Yi1iNTI4NDUzYzhiNTIiLCJlbWFpbCI6InNheGVuYXkxMTdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjkwYTFlMGJmNDBiZjk2NGUzZDgyIiwic2NvcGVkS2V5U2VjcmV0IjoiNDc0ZmU0Y2QxNGMwOWRlOGNlY2M4ZWY0Mjc1ZTg1ODAzZDM0NzU0MDAzZjg1NGUyODRlMjBiYjE4ZmI4MGM5MCIsImV4cCI6MTc4MTM2NzA2MH0.mbTDWC4-xCquHEEQvxp8pJaIZ3Fw8-4VpGWvxGyrOmE'
const NFT_CONTRACT_ADDRESS = '0xc4f21f52867ebC1377794c08EA27B4969F7419C6'
import FlexibleNFT from '../../../artifacts/FlexibleNFT.json'
import { ethers } from "ethers";

const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT,
  pinataGateway: 'amber-tragic-squirrel-52.mypinata.cloud',
});

export default function tokenize({handleNext, handlePrev}) {
    const {image, setimage, imageurl, metauri, uploadimage} = useFormStore()
    const [file, setFile ] = useState();
    console.log(image);
    const [load, setLoad] = useState(false)
    const handleFileUpload = async (files) => {
        setFile(files[0])
        const arr = [{
            name:files[0].name,
            type:files[0].type,
            size:files[0].size,
            lastModified:files[0].lastModified
        }]
        setimage(arr)
        
    }

    const handleFile = async () => {
        if(imageurl === ''){
        let url = '';

//             try {
//     const text = "hello world!";
//     const blob = new Blob([text], { type: "text/plain" });
//     const file = new File([blob], "hello.txt");
//     const data = new FormData();
//     data.append("file", file);
//     data.append("network", "public")

//     const request = await fetch(
//       "https://uploads.pinata.cloud/v3/files",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${PINATA_JWT}`,
//         },
//         body: data,
//       }
//     );
//     const response = await request.json();
//     console.log(response);
//   } catch (error) {
//     console.log(error);
//   }
            

        try {
            if (!file) {
                toast.error('No file selected')
                return;
            }

            setLoad(true);
            const data = new FormData();
            data.append("file", file);
            data.append("network", "public")

            const uploadRequest = await fetch("https://uploads.pinata.cloud/v3/files", {
                method: "POST",        
                headers: {
                Authorization: `Bearer ${PINATA_JWT}`,
                },
                body: data,
            });
            const response = await uploadRequest.json();
            console.log(response);
            
            url = 'https://amber-tragic-squirrel-52.mypinata.cloud/ipfs/' + response.data.cid
            console.log(url);
            
        } 
        catch (e) {
            console.log(e);
            setLoad(false);
            toast.error('Failed to upload image')
            return
        }

        const metadata = {
            "name": "Auction Asset",
            "description": "This is a tokenized asset",
            "image": url
        }
        let metauri = ''
        const metadataBlob = new Blob([JSON.stringify(metadata)], {
            type: "application/json"
        });
        const metadataFile = new File([metadataBlob], "metadata.json");

        const metaDataForm = new FormData();
        metaDataForm.append("file", metadataFile);
        metaDataForm.append("network", "public");

        try {
            const uploadRequest = await fetch("https://uploads.pinata.cloud/v3/files", {
                method: "POST",       
                headers: {
                Authorization: `Bearer ${PINATA_JWT}`,
                },
                body: metaDataForm,
            });
            const response = await uploadRequest.json();
            console.log(response.data.cid);
            metauri = 'ipfs://' + response.data.cid
            setLoad(false);
        } 
        catch (e) {
            console.log(e);
            setLoad(false);
            toast.error('Something went wrong')
            return
        }
        let tokenId = 0;
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, FlexibleNFT.abi, signer);

            const tx = await contract.mint(metauri);
            const receipt = await tx.wait();
             tokenId = (receipt.logs[0].args.tokenId);
             tokenId = tokenId.toString() 
            toast.success(`NFT minted! Token id: ${tokenId}`);


            } 
            catch (err) {
                console.error(err);
                toast.error("Failed to mint NFT");
            }
            console.log(tokenId);
            
        uploadimage(url, metauri, tokenId)

    }
    else{
        handleNext()
    }
}

  return (
    <Card className="w-full max-w-sm relative">
        <Toaster/>
        <CardHeader className="pt-5">
                <CardTitle className='text-2xl font-bold text-center'>Tokenize Your Asset</CardTitle>
        </CardHeader>
        <CardContent>
        <FileUpload  onChange={handleFileUpload} />
        </CardContent>
        <CardFooter className="flex-col gap-2">
            <Button disabled={load} type="submit" className="w-full" onClick={ () => handleFile()}>
                {imageurl === '' ? 'Upload' : 'Next'}
            </Button>
            <Button disabled={load} type="submit" variant={"outline"} className="w-full" onClick={() => handlePrev()}>
                Prev
            </Button>
        </CardFooter>
        { load && <progress className="progress absolute top-0 rounded-tl-full rounded-tr-full"></progress>}
    </Card>
  )
}
