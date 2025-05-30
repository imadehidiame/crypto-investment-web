import { log } from "@/lib/utils";
import type { Route } from "./+types/payment-callback";
//import { verify,createVerify,createSign, type KeyLike,type BinaryLike } from "node:crypto";
//import PaymentCallback from "@/models/Payment.server";
import Payment, { type IPayment } from "@/models/Payment.server";
import { getSess } from "@/layouts/app-layout";
import Activity from "@/models/Activity.server";
import Deposit from "@/models/Deposit.server";
//import { cr } from 'node';

export async function validate_cryptapi_signature (data:string,key:string,buffer_signature:Buffer){
    const {createVerify} = await import('node:crypto');
    try {
        //const m = createSign('RSA-SHA256')
        //m.sign()
        const verifier = createVerify('RSA-SHA256');
        verifier.update(data);
        //verifier.update(Buffer.from(data,'utf-8'));
        return verifier.verify(key,buffer_signature);    

    } catch (error) {
        log('Error vefifying signature');
        return false;
    }
    
    
}

export async function extract_body(request:Request){
    const req_body = request.body;
    const read_data = req_body?.getReader();
    let done = false;
    let read_body = ''
    while(!done){
        const {done:read_done,value} = await read_data?.read()!
        if(read_done){
            done = false;
        }else{
            read_body+=(new TextDecoder('utf-8')).decode(value)
        }
    }
    return read_body;
}


async function validate_request(request:Request){
    /*const verify_data = (data:string,key:KeyLike,signature_buff:Buffer<ArrayBuffer>)=>{

        return verify(null,Buffer.from(data,'utf-8'),key,signature_buff);
    }*/
    const pub_key = "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC3FT0Ym8b3myVxhQW7ESuuu6lo\ndGAsUJs4fq+Ey//jm27jQ7HHHDmP1YJO7XE7Jf/0DTEJgcw4EZhJFVwsk6d3+4fy\nBsn0tKeyGMiaE6cVkX0cy6Y85o8zgc/CwZKc0uw6d5siAo++xl2zl+RGMXCELQVE\nox7pp208zTvown577wIDAQAB\n-----END PUBLIC KEY-----";
    const signature_base_64 = request.headers.get('x-ca-signature');
    const signature_buffer = Buffer.from(signature_base_64 as string,'base64');
    const raw_body = await request.text();
    //const valid = validate_cryptapi_signature(raw_body,signature_base_64!,signature_buffer);
    //return verify_data(raw_body,pub_key,signature_buffer);
    return await validate_cryptapi_signature(raw_body,pub_key,signature_buffer);
    
    //request.body?.getReader({mode:'byob'}).

    //new Buffer(signature_base_64 as string,'base64');
}

export const action = async ({request,params,context}:Route.ActionArgs)=>{

    

    //const request_data = await request.formData();

    if(request.headers.get('content-type') && request.headers.get('content-type')?.includes('application/json')){
        const user_id = getSess(context);

      const {address_in,address_out,callback_url,estimated_fee,encoded_callback_url,estimated_fee_fiat,coin,deposit} = await request.json();
        //Payment
      const payment = await Payment.create({
        address_in,
        address_out,
        callback_url,//:decodeURIComponent(callback_url),
        estimated_fee,
        estimated_fee_fiat,
        coin,
        encoded_callback_url,
        userId:user_id?.user?._id,
        pending:-1,
        deposit
      });

      await Activity.insertOne({
        userId:user_id?.user?._id,
        type:'Deposit',
        amount:deposit,
        status:'Pending',
        payment_id:payment._id.toString(),
        description:`$${deposit} deposit`
      })

      //if(payment.acknowledged){
        return Response.json({data:payment.insertedId.toString()},{status:200,headers:{'Content-Type':'application/json'}});
      //}

    }else{

    if(!(await validate_request(request))){
        log('Invalid request sent');
        throw new Response('Access denied',{status:403,statusText:'Access to request denied'});
    }
    const data = await request.formData();
    const {  uuid,callback_url,txid_in,confirmations,value_coin,value_coin_convert,price,pending,txid_out,value_forwarded_coin,value_forwarded_coin_convert,fee_coin  } = Object.fromEntries(data);
    const {USD} = JSON.parse(value_coin_convert as string);
    
    const pend = typeof pending == 'string' ? parseFloat(pending) : pending;
    let send = {
        uuid,
        txid_in,
        //txid_out,
        price: typeof price == 'string' ? parseFloat(price) : price,
        pending: typeof pending == 'string' ? parseFloat(pending) : pending,
        confirmations:typeof confirmations == 'string' ? parseInt(confirmations) : confirmations,
        value_coin: typeof value_coin == 'string' ? parseFloat(value_coin) : value_coin,
        value_coin_convert: typeof USD == 'string' ? parseFloat(USD) : USD,
        deposit: typeof USD == 'string' ? parseFloat(USD) : USD,
        status: typeof pending == 'string' ? parseFloat(pending) : pending,
    }

    if(pend == 0){
        const value_forwarded_coin_convert_usd = JSON.parse(value_forwarded_coin_convert as string).USD;
        send = Object.assign({},send,{
            txid_out,
            value_forwarded_coin: typeof value_forwarded_coin == 'string' ? parseFloat(value_forwarded_coin) : value_forwarded_coin,
            value_forwarded_coin_convert:parseFloat(value_forwarded_coin_convert_usd),
            fee_coin: typeof fee_coin == 'string' ? parseFloat(fee_coin) : fee_coin,
        }) 
    }

    //const data_v = Object.entries(data);
    /**
     
     */
    
    const url = decodeURIComponent(callback_url as string);
    const payment_update = await Payment.findOneAndUpdate({callback_url:url},send,{new:true});
    if(pend == 0){
        const deposit = typeof USD == 'string' ? parseFloat(USD) : USD;
        /*await Activity.insertOne({
            userId:payment_update.userId,
            type:'Deposit',
            amount:deposit, 
            status:'Completed',
            description:`$${deposit} deposit`
          });*/
        await Activity.updateOne({payment_id:payment_update._id.toString()},{status:'Completed'});
        await Deposit.insertOne({
            userId:payment_update.userId,
            amount:deposit
        }); 
    }
    return new Response('ok',{status:200});
}

}

