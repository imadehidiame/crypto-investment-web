import { Wallet } from "@/models/Wallet.server";
import type { Route } from "./+types/delete-wallet";
import { getSess } from "@/layouts/app-layout";
import { redirect } from "react-router";
//import { create_flash_session } from "@/session.server";

export const action = async ({request,context,params}:Route.ActionArgs) =>{
    try {
    
        if(request.method === 'DELETE' || request.method.toLocaleLowerCase() === 'delete'){
            const user = getSess(context);
            if(!user?.isAuthenticated){
                return redirect('/auth',{status:302});  
            }
            const search = await Wallet.findOneAndDelete({userId:user.user?._id,_id:params.wallet});
            if(search){
                //const session = await create_flash_session({m:'Wallet has been deleted'},true) as string;
                return redirect('/dashboard/settings');
            }
            throw new Response('Access denied',{status:403,statusText:'Access to request denied'});    
        }
        throw new Response('Access denied',{status:403,statusText:'Access to request denied'});
        
    } catch (error) {
        throw new Response('An error occured on the server. Please try again later.',{status:500,statusText:'An error occured on the server. Please try again later'});
    }
    
}