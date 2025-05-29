import { log } from "@/lib/utils";
//import type { Route } from "./+types/dashboard-transaction-history";
//import TransactionHistoryPage from "@/components/dashboard-views/user/transactions";
//import Activity from "@/models/Activity.server";
import { getSess } from "@/layouts/app-layout";
//import { NumberFormat } from "@/components/number-field";
import DepositPage, { type Deposit } from "@/components/dashboard-views/user/deposit";
import type { Route } from "./+types/dashboard-deposit";
import Payment from "@/models/Payment.server";



/**
 id: string;
  deposit: number;
  createdAt: Date;
  status: number;
  updatedAt: Date;
  coin:string;
  value_coin:number;
 */

export const loader = async ({context}:Route.LoaderArgs) =>{
    const user = getSess(context);
    //let transactions  = await Activity.find({userId:user?.user?._id});
    let transactions = await Payment.find({ userId: user?.user?._id })
                                   .select('_id deposit createdAt status updatedAt coin value_coin')
                                   //.sort({ timestamp: -1 })
                                   .lean() as unknown as Deposit[];
    /*transactions = transactions.filter(e=>e.type.toLocaleLowerCase() === 'deposit').map(({amount,_id,status,date})=>{
        return {id:_id.toString(),date:date.toLocaleDateString(),amount,status};
    })*/

/*const transactionss = [ 
        { id: '1', date: '2023-10-26', type: 'Deposit', amount: 1000.00, status: 'Completed' },
        { id: '2', date: '2023-10-26', type: 'Investment', amount: -500.00, status: 'Completed', description: 'Bronze Plan' },
        { id: '3', date: '2023-10-27', type: 'Earning', amount: 7.50, status: 'Completed', description: 'Bronze Plan Daily Return' },
        { id: '4', date: '2023-10-27', type: 'Withdrawal', amount: -100.00, status: 'Pending' },
  
];*/
   
  
  return {transactions,userId:user?.user?._id.toString()}
}

export default function({loaderData}:Route.HydrateFallbackProps){
  
  //if(loaderData)
  return <DepositPage deposits={loaderData?.transactions || []} userId={loaderData?.userId!} />
} 