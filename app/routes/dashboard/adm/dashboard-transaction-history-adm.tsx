//import { getSess } from "@/layouts/app-layout";
//import type { Route } from "./+types/dashboard-home";
//import DashboardHome, { type RecentTransactionsData } from "@/components/dashboard-views/user/home";
//import type { Route } from "./+types/dashboard-profile";
//import DashboardProfile from "@/components/dashboard-views/user/profile";
//import type { UserData } from "@/lib/config/session";
//import { log } from "@/lib/utils";
//import type { Route } from "./+types/dashboard-transaction-history";
import TransactionHistoryPage from "@/components/dashboard-views/user/transactions";
import Activity from "@/models/Activity.server";
import { getSess } from "@/layouts/app-layout";
import { NumberFormat } from "@/components/number-field";
import type { Route } from "./+types/dashboard-transaction-history-adm";


export const loader = async ({context}:Route.LoaderArgs) =>{
    const user = getSess(context);
    let transactions  = await Activity.find({userId:user?.user?._id});
    transactions = transactions.map(e=>{
        return {id:e._id.toString(),date:e.date.toLocaleDateString(),type:e.type,amount:e.type == 'Investment' || e.type == 'Withdrawal' ? `-$${NumberFormat.thousands(e.amount,{allow_decimal:true,length_after_decimal:2,add_if_empty:true,allow_zero_start:false})}`:`$${NumberFormat.thousands(e.amount,{allow_decimal:true,length_after_decimal:2,add_if_empty:true,allow_zero_start:false})}`,status:e.status,description:e.description};
    })

const transactionss = [ // Placeholder
        { id: '1', date: '2023-10-26', type: 'Deposit', amount: 1000.00, status: 'Completed' },
        { id: '2', date: '2023-10-26', type: 'Investment', amount: -500.00, status: 'Completed', description: 'Bronze Plan' },
        { id: '3', date: '2023-10-27', type: 'Earning', amount: 7.50, status: 'Completed', description: 'Bronze Plan Daily Return' },
        { id: '4', date: '2023-10-27', type: 'Withdrawal', amount: -100.00, status: 'Pending' },
        // Add more transactions
    ];
  
  
  return {transactions}
}

export default function({loaderData}:Route.HydrateFallbackProps){
  
  //if(loaderData)
  return <TransactionHistoryPage transactions={loaderData?.transactions || []} />
} 