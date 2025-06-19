import { NumberFormat } from '@/lib/utils';
import SubscriptionPlan from '@/models/SubscriptionPlan.server';
import type { Route } from './+types/plans';
import PlansPage from '@/components/app/index/plans-page';
//import type { SubscriptionData } from '@/components/dashboard-views/user/subscription';

export interface Subscription {
        id: string;
        name: string;
        minInvestment: number|string;
        maxInvestment: number|string;
        duration: number;
        dailyReturn: number;
}

export const loader = async()=>{
  let plans = await SubscriptionPlan.find();
  plans = plans.map((e)=>({name:e.name,minInvestment:NumberFormat.thousands(e.minInvestment,{allow_decimal:true,length_after_decimal:2,add_if_empty:true,allow_zero_start:false}),maxInvestment:NumberFormat.thousands(e.maxInvestment,{allow_decimal:true,length_after_decimal:2,add_if_empty:true,allow_zero_start:false}),duration:e.duration,dailyReturn:e.dailyReturn,id:e._id.toString()})).sort((a,b)=>a.dailyReturn - b.dailyReturn) as Subscription[];
  return plans;
}

export default function({loaderData}:Route.ComponentProps){
  return <PlansPage plans={loaderData} />
}

//export default SubscriptionPlansPage;