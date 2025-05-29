'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "app/components/ui/dialog";

interface ModalProps {
    title:string;
    description:string;
    is_open:boolean;
    onCloseAction:()=>void;
    children?:React.ReactNode;
}

export const Modal: React.FC<ModalProps> =({
    title,description,is_open,onCloseAction,children
})=>{
    const on_change = (open:boolean)=>{
        if(!open)  
        onCloseAction();
    }
    return (
        <Dialog open={is_open} onOpenChange={on_change}> 
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div>
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
}
