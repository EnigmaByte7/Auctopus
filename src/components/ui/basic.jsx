'use client'
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
import useFormStore from "../../../formStore"
import { toast } from "sonner"


export default function basic({handleNext}) {
    const {setbasic, name, desc} = useFormStore()
    console.log(name, desc, desc.length);
    
    const validate = () => {
        console.log(desc.length);
        
        if(name == "" || desc == "" || desc.length < 5){
            toast.error('Please fill all fields')
        }
        else handleNext()
    }
  return (
    <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className='text-2xl font-bold text-center'>Register</CardTitle>
            </CardHeader>
            <CardContent>
            <form>
            <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                <Label htmlFor="name">Auction Name</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="Original Painting..."
                    required
                    value={name}
                    onChange={(e) => setbasic(e.target.value,desc)}
                />
                </div>
                <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="desc">Describe your Auction or Asset</Label>
                </div>
                <Input id="desc" type="text" required minLength={10} placeholder='Atleast 20 characters...' value={desc} onChange={(e) => setbasic(name, e.target.value)}/>
                </div>
            </div>
            </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full" onClick={() => validate()}>
                Next
            </Button>
        </CardFooter>
    </Card>
  )
}
