import { log } from "@/lib/utils";
import { getSess } from "@/layouts/app-layout";
import Payment from "@/models/Payment.server";
import type { Route } from "./+types/dashboard-deposit-adm";
import DepositPage, { type Deposit, type Users } from "@/components/dashboard-views/adm/deposit";
import User from "@/models/User.server";




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
    let transactions = await Payment.aggregate<Deposit>([
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
              deposit: 1,
              createdAt: 1,
              userId: 1,
              user: {
                name:'$user.name',
                _id:{$toString:'$user._id'}
              },
              status: 1,
              updatedAt: 1,
              coin: 1,
              value_coin: 1,
            },
          },
      ]);

      //log(transactions,'Transation ARRay');

    let transactionss = await Payment.find()
                                   .select('_id deposit createdAt status updatedAt coin value_coin')
                                   .populate('userId','name _id')
                                   //.sort({ timestamp: -1 })
                                   .lean() as unknown as Deposit[];
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
                                  
                                  
  
  return {transactions,userId:user?.user?._id.toString(),users}
}

export default function({loaderData}:Route.HydrateFallbackProps){
  
  //if(loaderData)
  return <DepositPage deposits={loaderData?.transactions || []} users={loaderData?.users || []} userId={loaderData?.userId!} />
} 