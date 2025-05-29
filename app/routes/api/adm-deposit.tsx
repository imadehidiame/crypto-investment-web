import { log } from "@/lib/utils";
//import type { Route } from "./+types/payment-callback";
//import { verify,createVerify,createSign, type KeyLike,type BinaryLike } from "node:crypto";
//import PaymentCallback from "@/models/Payment.server";
import Payment, { type IPayment } from "@/models/Payment.server";
import { getSess } from "@/layouts/app-layout";
import Activity from "@/models/Activity.server";
//import Deposit from "@/models/Deposit.server";
import type { Route } from "./+types/adm-deposit";
import mongoose from "mongoose";
import Deposit from "@/models/Deposit.server";


export const action = async ({request,params,context}:Route.ActionArgs)=>{

    if(request.headers.get('content-type') && request.headers.get('content-type')?.includes('application/json')){
        const user_id = getSess(context);
        /**
         userId:form_object.user,
                value_coin:form_object.calculated,
                deposit,
                coin:type 
         */
        //log(user_id?.user?.role,'USER ROLE');
        if(user_id?.user?.role !== 'admin'){
          return new Response('Access to resource denied',{status:403,statusText:'Access to resource denied',headers:{
            'Content-Type':'text/plain'
          }})
        }

    if(request.method.toLocaleLowerCase() === 'post'){

        const {coin,deposit,userId,value_coin} = await request.json();
        //Payment
      const payment = await Payment.create({
        coin,
        value_coin,
        userId,
        pending:-1,
        deposit
      });

      await Activity.insertOne({
        userId,
        type:'Deposit',
        amount:deposit,
        status:'Pending',
        payment_id:payment._id.toString(),
        description:`$${deposit} deposit`
      })
      

      //if(payment.acknowledged){
        return Response.json({data:{_id:payment._id.toString(),logged:true}},{status:200,headers:{'Content-Type':'application/json'}});

    }else if(request.method.toLocaleLowerCase() === 'patch' ){
        const {status,id,userId} = await request.json();
        //Payment
      const payment = await Payment.findOneAndUpdate({_id:new mongoose.Types.ObjectId(id as string)},{status},{new:true});
      //Payment.findByIdAndUpdate(new mongoose.Types.ObjectId(id as string),{status});
        if(status === 1){
            await Activity.updateOne({payment_id:id},{status:'Completed'});
            await Deposit.insertOne({
                userId:new mongoose.Types.ObjectId(userId as string),
                amount:payment.deposit
            });
        }
      
      

      //if(payment.acknowledged){
        return Response.json({data:{logged:true}},{status:200,headers:{'Content-Type':'application/json'}});
    }else{
        return new Response('Invalid request sent',{status:403,statusText:'Access to resource denied',headers:{
            'Content-Type':'text/plain'
          }})
    }
    
      
      //}

    }else{

        return new Response('Invalid request sent',{status:403,statusText:'Access to resource denied',headers:{
            'Content-Type':'text/plain'
          }})
    }

}

