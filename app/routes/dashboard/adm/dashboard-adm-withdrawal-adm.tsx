import { get_earnings, log } from "@/lib/utils";
import { getSess } from "@/layouts/app-layout";
//import Payment from "@/models/Payment.server";
//import type { Route } from "./+types/dashboard-deposit-adm";
//import DepositPage, { type Deposit, type Users } from "@/components/dashboard-views/adm/deposit";
import User from "@/models/User.server";
import type { Users, Withdrawals } from "@/components/dashboard-views/adm/adm-withdrawal";
import AdmWithdrawal from "@/models/AdmWithdrawal.server";
import Investment from "@/models/Investment.server";
import mongoose from "mongoose";
import Deposit from "@/models/Deposit.server";
//import Activity from "@/models/Activity.server";
import WithdrawalPage from "@/components/dashboard-views/adm/adm-withdrawal";
import type { Route } from "./+types/dashboard-adm-withdrawal-adm";


async function get_user_balance(userId:mongoose.Types.ObjectId){
    const investments:{
        plan:{
          duration:number, 
          dailyReturn:number,
          name:string
        },
        invested:number,
        endDate:Date,
        startDate:Date,
        isWithdrawal:boolean,
        withdrawal:number,
        //balance:0,
        //earnings:0
        //active_investments:0,
        //active_investments_amount:0,
        //deposit:0
        
      }[] = (await Investment.find({userId}).populate('plan','duration dailyReturn name')).map(e=>({...e._doc,...{/*earnings:0,balance:0,deposit:0,active_investments:0,active_investments_amount:0*/}}));
      //log(investments,'Investments');
      
      let deposits  = (await Deposit.find({userId}).sort({date:-1})).reduce((acc,{amount})=>{
        return acc+=amount;
      },0)
      
      type AdmWithdraw = {amount:number};
      
      //log(deposits,'Depositss');
      let adm_withdrawals:number = (await AdmWithdrawal.find({userId})).reduce((prev:number,{amount}:AdmWithdraw)=>{
        return prev+=amount
      },0)
      
      
          
        
        let account_balance = investments.reduce((acc,{invested,startDate,plan,withdrawal,endDate},index,array)=>
          (
            {
              balance:(get_earnings(startDate,plan.dailyReturn,invested,endDate)/*+invested*/-withdrawal)+acc.balance,
              
            }
          ),
            {
              balance:0,
              
            });
            
            account_balance = Object.assign({},account_balance,{balance:((deposits as number)+account_balance.balance)});
            account_balance = Object.assign({},account_balance,{balance:(account_balance.balance - adm_withdrawals)>=0 ? account_balance.balance - adm_withdrawals : 0 });
            return account_balance.balance;
}

export const loader = async ({context}:Route.LoaderArgs) =>{
    const user = getSess(context);
    //let transactions  = await Activity.find({userId:user?.user?._id});
    /**
    _id: string;
  deposit: number;
  createdAt: Date;
  status: number;
  updatedAt: Date;
  coin:string;
  userId:{
    name:string;
    _id:string;
  }
  value_coin:number;
     */
    let transactions = await AdmWithdrawal.aggregate<Withdrawals>([
        {
            $addFields:{
                _id:{
                    $toString:"$_id"
                }
            }
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
            $project: {
              _id: 1,
              amount: 1,
              createdAt: 1,
              userId: 1,
              user: {
                name:'$user.name',
                _id:{$toString:'$user._id'}
              },
              //status: 1,
              //updatedAt: 1,
              //coin: 1,
              //value_coin: 1,
            },
          },
      ]);

      //log(transactions,'Transation ARRay');

    /*let transactionss = await Payment.find()
                                   .select('_id deposit createdAt status updatedAt coin value_coin')
                                   .populate('userId','name _id')
                                   //.sort({ timestamp: -1 })
                                   .lean() as unknown as Deposit[];*/
                                   let users = await User.aggregate<Users>([
                                    {
                                        $match:{
                                            role:'user'
                                        }
                                    },
                                    { 
                                        $project: { 
                                            _id: { 
                                                $toString: "$_id" 
                                            }, 
                                            name: 1, 
                                            email: 1 
                                        } 
                                    }
                                  ]);

                                  
                                  users = await Promise.all(users.map(async e => ({...e,balance:await get_user_balance(new mongoose.Types.ObjectId(e._id))})));
                                  
                                  console.log({users});
  
  return {transactions,userId:user?.user?._id.toString(),users}
}

export default function({loaderData}:Route.HydrateFallbackProps){
  
  //if(loaderData)
  return <WithdrawalPage withdrawals={loaderData?.transactions || []} users={loaderData?.users || []} userId={loaderData?.userId!} />
} 