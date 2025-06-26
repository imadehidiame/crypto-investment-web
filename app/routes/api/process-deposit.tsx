import { fetch_request_mod, generateSecureRandomString, log } from "@/lib/utils";
import type { Route } from "./+types/process-deposit";
import { getSess } from "@/layouts/app-layout";
import { CURRENCIES } from "@/lib/config/crypt_api";
import  { randomUUID } from 'node:crypto';
    


export const action = async ({request,context}:Route.ActionArgs)=>{
    const {flag,type,deposit,address_in,value_coin} = await request.json() as {
        flag:'address'|'prices'|'qr_code'|'blockchain_fees',
        type?:'btc'|'eth',
        deposit?:number|string,
        address_in?:string,
        value_coin?:string
    }
    
    
    const user_id = getSess(context)?.user?._id.toString()
    
    if(flag === 'address'){
    
        const { btc,btc_,eth,eth_,callback_url:generate_callback_url,email,callback_url_path } = CURRENCIES;
        
            const payment_id = randomUUID();
            const callback_uri = generate_callback_url(user_id as string,payment_id);
            let url_search = new URLSearchParams({
              callback:encodeURI(callback_uri),
              address: type && type == 'btc' ? `0.9@${btc}|0.1@${btc_}` : `0.9@${eth}|0.1@${eth_}`,
              pending:'1',
              confirmations:'3',
              email,
              post:'1',
              //json:'1',
              priority:'default',
              multi_token:'0',
              convert:'1'
            }).toString();

            log(url_search,'API URL');
            
        
       
        type T = {
            error?:string,
            status:string,
            address_in?:string,
            address_out?:string,
            payment_id?:string
        }
        
        const {data,is_error,status,served} = await fetch_request_mod<T>('GET',`https://api.cryptapi.io/${type}/create/?${url_search}`);
        log({data,is_error,status,served},'Server response');
        
        if(status === 200 && is_error === false){
            return Response.json({...served,payment_id},{status:200}); 
        }else{
            return Response.json({error:served?.error},{status:400,statusText:served?.error}); 
        }
    }else if(flag === 'prices'){
        let url_search = new URLSearchParams({
            value:deposit!.toString(),
            from:'USD'
          }).toString()
        const {data,is_error,status,served} = await fetch_request_mod<{
            value_coin?:string;
            error?:string;
            status?:string
        }>('GET',`https://api.cryptapi.io/${type}/convert/?${url_search}`);
        
        
        
        if(status == 200 && !is_error){
            return Response.json({...served},{status:200});
        }else{
            return Response.json({error:served?.error},{status:400,statusText:served?.error ?? 'An error occured along the way while pulling prices data'});
        }
          
    }else if(flag === 'qr_code'){
        let url_search = new URLSearchParams({
            address:address_in as string,
            size:'320',
            value: value_coin!
          }).toString()

          

          const {data,is_error,status,served} = await fetch_request_mod<{
            qr_code?:string;
            error?:string;
            //status?:string
        }>('GET',`https://api.cryptapi.io/${type}/qrcode/?${url_search}`);

        
        
        
        if(status == 200 && !is_error){
            return Response.json({...served},{status:200});
        }else{
            return Response.json({error:'An error occured'},{status:400,statusText:served?.error ?? 'An error occured along the way while pulling QR code data'});
        }

    }else{
        let url_search = new URLSearchParams({
            addresses:'2',
            priority:'default'
          }).toString();

        const {data,is_error,status,served} = await fetch_request_mod<{
            //qr_code?:string;
            error?:string;
            estimated_cost?:string;
            estimated_cost_currency?:{
                USD?:string
            }
            //status?:string
        }>('GET',`https://api.cryptapi.io/${type}/estimate/?${url_search}`);
        
        
        if(status == 200 && !is_error){
            return Response.json({...served},{status:200});
        }else{
            return Response.json({error:'An error occured'},{status:400,statusText:served?.error ?? 'An error occured along the way while pulling blockchain fees'});
        }
        

    }
}