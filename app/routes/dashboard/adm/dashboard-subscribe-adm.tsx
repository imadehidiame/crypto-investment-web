import SubscribePage, { type Subscription, type SubscriptionData } from "@/components/dashboard-views/user/subscription";
import type { Route } from "./+types/dashboard-subscribe";
import SubscriptionPlan from "@/models/SubscriptionPlan.server";
import { log } from "@/lib/utils";
import { NumberFormat } from "@/components/number-field";
import { getSess } from "@/layouts/app-layout";
import mongoose from "mongoose";
import Deposit from "@/models/Deposit.server";
import Investment from "@/models/Investment.server";
import Activity from "@/models/Activity.server";

export const action = async ({request,context}:Route.ActionArgs)=>{
  const user = getSess(context);
  let { plan,amount,plan_name,duration } = await request.json();
  const userId = user?.user?._id;
  let amountt = parseFloat((amount as string).replaceAll(',',''));
  const session = await mongoose.startSession();
  try {
    
    session.startTransaction();
    await Deposit.insertOne({userId,amount:amountt},{session});
    await Investment.insertOne({plan:new mongoose.Types.ObjectId(plan as string),userId,invested:amountt,endDate:new Date(Date.now()+(duration*60*60*24*1000))},{session});
    await Activity.insertMany([
      {userId,type:'Deposit',amount:amountt,status:'Completed',description:`$${amount} deposit`},
      {userId,type:'Investment',amount:amountt,status:'Active',description:`${plan_name} investment of $${amount}`}
    ]);
    await session.commitTransaction();
    return {data:{logged:true,message:'Saved'}};
  } catch (error) { 
    await session.abortTransaction();
    log(error,'Transaction error');
  }finally {
    await session.endSession();
    return {data:{logged:false,error:'An error occured on the server. Please try again later'}};
  }


}

export const loader = async ({request}:Route.LoaderArgs)=>{

  /*const inserts = [
    {
      insertOne:{
        document:{name:'Bronze Plan',minInvestment:100,maxInvestment:999,duration:2,dailyReturn:2.2}
      },
    },
    {
      insertOne:{
        document:{name:'Silver Plan',minInvestment:1000,maxInvestment:4999,duration:4,dailyReturn:2.9}
      },
    },
    {
      insertOne:{
        document:{name:'Gold Plan',minInvestment:5000,maxInvestment:9999,duration:6,dailyReturn:3.5}
      },
    }
  ];*/  

  //const subcription = new SubscriptionPlan({});
  let plans = await SubscriptionPlan.find();

  
  

  plans = plans.map((e)=>({name:e.name,minInvestment:NumberFormat.thousands(e.minInvestment,{allow_decimal:true,length_after_decimal:2,add_if_empty:true,allow_zero_start:false}),maxInvestment:NumberFormat.thousands(e.maxInvestment,{allow_decimal:true,length_after_decimal:2,add_if_empty:true,allow_zero_start:false}),duration:e.duration,dailyReturn:e.dailyReturn,id:e._id.toString()})).sort((a,b)=>a.dailyReturn - b.dailyReturn) as SubscriptionData;
  
  
  //const subs = await SubscriptionPlan.bulkWrite(inserts);
  //log(subs,'Subscriptions object plan');
  //log(subs,'Subscriptions object plan1');
  //console.log(subs.insertedIds)

  /*const plans = [ 
    {
      id: '1',
      name: 'Bronze Plan',
      minInvestment: 100,
      maxInvestment: 1000,
      duration: 30,
      dailyReturn: 1.5,
    },
    {
      id: '2',
      name: 'Silver Plan',
      minInvestment: 1001,
      maxInvestment: 5000,
      duration: 60, 
      dailyReturn: 2.0,
    },
    {
        id: '3',
        name: 'Gold Plan',
        minInvestment: 5001,
        maxInvestment: 10000,
        duration: 90,
        dailyReturn: 2.5,
      },
  
];*/
const url = new URL(request.url);
const planId = url.searchParams.get('planId');
const initialSelectedPlan = plans.find(e=>e.id === planId) || null;
return {plans,initialSelectedPlan};
}

export default function DashboardSubscribe({loaderData}:Route.ComponentProps){
  const {plans,initialSelectedPlan} = loaderData;
  return <SubscribePage plans={plans as SubscriptionData} initialSelectedPlan={initialSelectedPlan as (/*typeof plans[0]*/ Subscription | null)} />
}