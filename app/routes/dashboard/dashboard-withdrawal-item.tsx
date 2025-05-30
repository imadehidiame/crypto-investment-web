//import WithdrawalRequest from "@/components/dashboard-views/user/withdrawal-item"
import type { Route } from "./+types/dashboard-withdrawal-item"
import Investment from "@/models/Investment.server"
//import { redirect } from "react-router";
import { get_earnings, log } from "@/lib/utils";
import WithdrawFormPage from "@/components/dashboard-views/user/withdrawal-item";
//import WithdrawalRequest from "@/components/dashboard-views/user/withdr";
import { getSess } from "@/layouts/app-layout";
import { Wallet } from "@/models/Wallet.server";
import mongoose from "mongoose";
import Activity from "@/models/Activity.server";
import WithdrawalRequest from "@/models/WithdrawalRequest.server";
//import Activity from "@/models/Activity.server";

export const action = async ({request,params,context}:Route.ActionArgs)=>{
    const client_data = await request.json();
    //log(client_data,'Request jsons');
    const user = getSess(context);
    let investment = (await Investment.findOne({_id:params.investment_id,userId:user?.user?._id,isWithdrawal:false,withdrawal:0,invested:{$gt:0}}, { invested: 1, isWithdrawal: 1, withdrawal:1, plan: 1, endDate: 1, startDate: 1,  }).populate('plan', 'name dailyReturn duration minInvestment').lean()) as unknown as {invested:number,isWithdrawal:boolean,plan:{_id:mongoose.Types.ObjectId,name:string,dailyReturn:number,duration:number},endDate:Date,startDate:Date,_id:mongoose.Types.ObjectId};
    if(!investment){
        throw new Response('Access denied',{status:403,statusText:'Access to request denied'});
    }
    const earnings = get_earnings(investment.startDate,investment.plan.dailyReturn,investment.invested,investment.endDate);
    const amount = parseFloat(client_data.amount.replaceAll(',',''));
    const available_withdrawal = earnings + investment.invested;
    if(available_withdrawal < amount){
        throw new Response('Access denied',{status:403,statusText:'Access to request denied by server'});
    }
    //const residual_after_withdrawal = available_withdrawal - amount;
    
    const session = await mongoose.startSession();
      try {
        
        session.startTransaction();
        //await Deposit.insertOne({userId,amount:amountt},{session});
        await Investment.updateOne({_id: new mongoose.Types.ObjectId(params.investment_id)},{isWithdrawal:true,withdrawal:amount,status:1},{timestamps:true});   
        //await Investment.insertOne({plan:new mongoose.Types.ObjectId(plan as string),userId,invested:amountt,endDate:new Date(Date.now()+(duration*60*60*24*1000))},{session});
        await Activity.insertMany([
          {userId:user?.user?._id,type:'Withdrawal Request',amount,status:'Pending',description:`Withdrawal request of $${amount}`},
          //{userId,type:'Investment',amount:amountt,status:'Active',description:`${plan_name} investment  of $${amount}`}
        ]);
        await WithdrawalRequest.insertOne({amount,investment:new mongoose.Types.ObjectId(params.investment_id),userId:user?.user?._id,currency:client_data.currency});
        await session.commitTransaction();
        //log('Before time out','I got here');
        return {data:{logged:true,message:'Saved'}}; 
      } catch (error) { 
        //log(error,'Transaction error');
        await session.abortTransaction();
        //log(error,'Transaction error');
        return {data:{logged:false,error:'An error occured on the server. Please try again later'}};
        //return {data:{logged:false,error:'An error occured on the server. Please try again later'}};
      }finally {
        await session.endSession();
        
      }
}


export const loader = async ({context,params}:Route.LoaderArgs) =>{
    const user = getSess(context);
    let {invested,isWithdrawal,plan,endDate,startDate,_id,status} = (await Investment.findById(params.investment_id, { invested: 1, isWithdrawal: 1, plan: 1, endDate: 1, startDate: 1, status: 1 }).populate('plan', 'name dailyReturn duration minInvestment').lean()) as unknown as {invested:number,isWithdrawal:boolean,plan:any,endDate:Date,startDate:Date,_id:mongoose.Types.ObjectId,status:number};
    const wallets = (await Wallet.find({userId:user?.user?._id},{label:1,address:1,currency:1}).lean()).map(e=>({value:e._id?.toString() as string,name:`${e.currency} - (${e.label} - ${e.address})`}))

    if(isWithdrawal){}
    const isActive = Date.now() < (endDate as Date).getTime();
    let withdrawal = Object.assign({},{invested,isWithdrawal,plan,endDate},{max_withdrawal:(invested as number)+get_earnings(startDate as Date,plan.dailyReturn as number,invested as number,endDate),_id:_id.toString(),isActive});
    //log(wallets,'Withdrawal Data Wallets');
    //log(withdrawal,'Withdrawal Data');
    return {withdrawal,wallets};

}

export default function({loaderData}:Route.ComponentProps){
    //return <WithdrawalRequest />
    //return <WithdrawalRequest wallets={loaderData.mockWallets}  />
    return <WithdrawFormPage investmentDetails={loaderData.withdrawal} userWallets={loaderData.wallets} />
}