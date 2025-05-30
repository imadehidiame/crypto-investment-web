import Withdrawals from "@/components/dashboard-views/user/withdrawal";
//import type { Route } from "./+types/dashboard-withdrawal";
//import WithdrawPage from "@/components/dashboard-views/user/withdrawall";
import { getSess } from "@/layouts/app-layout";
import Investment from "@/models/Investment.server";
import { get_earnings, log } from "@/lib/utils";
import type { Route } from "./+types/dashboard-withdrawal-adm";

const remaining_days = (endDate:Date)=>Math.ceil((endDate.getTime()-Date.now())/(86400*1000));


export const loader = async ({context}:Route.LoaderArgs)=>{
    const user = getSess(context);

    let investmentss = (await Investment.find({userId:user?.user?._id}).populate('plan','name duration dailyReturn')).map(({_id,plan,startDate,endDate,isWithdrawal,withdrawal,invested,status})=>
       { 
        //log(plan.dailyReturn,'Daiily returns plans');
        const earnings = get_earnings(startDate as Date,plan.dailyReturn as number,invested as number,endDate as Date);
        return {
        _id:_id.toString(),
         plan:plan.name,
         userId:user?.user?._id.toString() as string,
         duration:plan.duration,
         endDate:(endDate as Date)/*.toLocaleDateString()*/,
         startDate:(startDate as Date),//.toLocaleDateString(),
         isWithdrawal,
         withdrawal,
         invested,
         earnings,
         status,
         dailyReturn:plan.dailyReturn,
         residual_after_withdrawal:invested+earnings-withdrawal,
        total:invested+earnings,
        is_active:(Date.now() < (endDate as Date).getTime()),
        remaining_days:remaining_days(endDate as Date)       
    }
}
);

      return {investmentss}
}

export default function({loaderData}:Route.ComponentProps){
    return <Withdrawals withdrawals={loaderData.investmentss} /> 
    //return <WithdrawPage withdrawals={loaderData.investments} />
}