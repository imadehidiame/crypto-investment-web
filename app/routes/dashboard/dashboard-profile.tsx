import { getSess } from "@/layouts/app-layout";
//import type { Route } from "./+types/dashboard-home";
//import DashboardHome, { type RecentTransactionsData } from "@/components/dashboard-views/user/home";
import type { Route } from "./+types/dashboard-profile";
import DashboardProfile from "@/components/dashboard-views/user/profile";
import type { UserData } from "@/lib/config/session";
import { log } from "@/lib/utils";


export const loader = async ({context}:Route.LoaderArgs) =>{
  const context_data = getSess(context);
  //log(context_data?.user?._id.toString(),'User data');
  const {name,email,role,_id} = context_data?.user!;
  return {user:{name,email,role,_id}}
}

export default function({loaderData}:Route.HydrateFallbackProps){
  
  
  return <DashboardProfile user={loaderData?.user as unknown as UserData} />
} 