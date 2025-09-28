//import {  log } from "@/lib/utils";
//import type { Route } from "./+types/process-deposit";
import { getSess } from "@/layouts/app-layout";
import { CURRENCIES } from "@/lib/config/crypt_api";
import  { randomUUID } from 'node:crypto';
import { URLSearchParams } from "node:url";
import type { Route } from "./+types/process-adm-withdrawal";
import Activity from "@/models/Activity.server";
import mongoose from "mongoose";
import AdmWithdrawal from "@/models/AdmWithdrawal.server";
    

 async function fetch_request_mod<T>(method:'POST'|'GET'|'PATCH'|'DELETE',action:string,body?:string|FormData|any|null,is_json?:boolean): Promise<{
    data?:any,
    served?:T,
    is_error?:boolean,
    status?:number
  }> {
    //console.log({body,is_json,method});
    try {
        //URLSearchParams
        if(method === 'POST' || method === 'PATCH'){
                body = body instanceof FormData || typeof body == 'string' || body instanceof URLSearchParams ? body :  JSON.stringify(body);
        }
        const response = is_json ? await fetch(action,{method,body,headers:{'Content-Type':'application/json'}}) : method === 'GET' || method === 'DELETE' ? await fetch(action,{method}) : await fetch(action,{method,body});
        const {status,statusText,ok} = response.clone(); 
        console.log({status,statusText,ok});
        if(!ok || status !== 200){
            //console.log(await response.text()); 
            if(statusText)
            return { is_error:true,data:statusText,status };  
            return {is_error:true,status,data:'Unspecified error'}; 
        }
        

          const contentType = response.headers.get("Content-Type");
          if (!contentType?.includes("application/json")) {
            return {served:await response.text() as T,status,is_error:false};
          }
            return {served:await response.json(),status,is_error:false};
        
        
    } catch (error) {
      console.log('Error during fetch\n',error);
        return {is_error:true,data:null}
    }
}

export const action = async ({request,context}:Route.ActionArgs)=>{
    const {amount,user,description} = await request.json() as {
        amount:number,
        user:string,
        description:string
    }
    const userId = new mongoose.Types.ObjectId(user);
    await Activity.insertOne({
            userId,
            type:'Withdrawal',
            amount,
            status:'Completed',
            payment_id:randomUUID(),
            description
    });

    await AdmWithdrawal.insertOne({
        userId,
        amount,
    })

    return Response.json({data:{logged:true}},{status:200});
}