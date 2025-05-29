'use client';
import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";

interface AlertModalProps{
    is_open:boolean;
    on_close:()=>void;
    on_confirm:()=>void,
    loading:boolean;
}

export default function AlertModal({is_open,on_close,on_confirm,loading}:AlertModalProps) {
    const [isMounted,setIsMounted] = useState(false);
    useEffect(()=>{
        setIsMounted(true);
    },[]);
    if(!isMounted)
    return null;
    return (
        <Modal title="Are you sure?" description="This action cannot be undone" is_open={is_open} onCloseAction={on_close}>
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button disabled={loading} variant={'outline'} onClick={on_close}>Cancel</Button>
                <Button disabled={loading} variant={'destructive'} onClick={on_confirm}>Continue</Button>
            </div>
        </Modal> 
    )
}