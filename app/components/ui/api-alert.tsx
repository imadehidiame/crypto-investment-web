'use client';
import { Copy, Server } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Badge, type BadgeProps } from "./badge";
import { Button } from "./button";
import toast from "react-hot-toast";

interface ApiAlertProps{
    title:string;
    description:string,
    variant:'admin'|'public'
}

const text_map: Record<ApiAlertProps['variant'],string> = {
    public: 'Public',
    admin:  'Admin'
}


const variant_map: Record<ApiAlertProps['variant'],BadgeProps['variant']> = {
    public: 'secondary',
    admin:  'destructive'
}

export default function ApiAlert({title,description,variant='public'}:ApiAlertProps){

    const on_copy = ()=>{
        navigator.clipboard.writeText(description);
        toast.success('Api route copied to clipboard',{duration:3000});
    }

    return (
        <Alert>
            <Server className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-x-2">
                {title}
                <Badge variant={variant_map[variant]}>{text_map[variant]}</Badge>
            </AlertTitle>
            <AlertDescription className="mt-4 flex items-center justify-between">
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                {description}
                </code>
                <Button variant={'outline'} size="icon" onClick={on_copy}>
                    <Copy className="h-4 w-4" />
                </Button>
            </AlertDescription>
        </Alert>
    )
}