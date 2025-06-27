import { getSess } from "@/layouts/app-layout";
import DepositPage, { type CryptoData, type Deposit } from "@/components/dashboard-views/user/deposit";
import type { Route } from "./+types/dashboard-deposit";
import { fetch_request_mod } from "@/lib/utils";


export const loader = async ({context}:Route.LoaderArgs) =>{
          let currencies:CryptoData[] = []; 
          let prices:{btc:number,eth:number} = {btc:0,eth:0};
          const search = new URLSearchParams({ price: '1' }).toString();
          const {data,served,status,is_error} = await fetch_request_mod<{btc:any,eth:any,trc20:any}>('GET',`https://api.cryptapi.io/info/?${search}`);
          //const data = await fetch_data.json();
          //console.log(served);
          if(!is_error && status == 200){
            const { btc, eth, trc20 } = served!;
          const needed_data = Object.entries({ btc, eth, trc20 });
          //set_prices({btc:parseFloat(btc.prices.USD),eth:parseFloat(eth.prices.USD)});
          prices = {btc:parseFloat(btc.prices.USD),eth:parseFloat(eth.prices.USD)};
          currencies = needed_data.reduce((acc, current) => {
            const [currency, currency_data] = current;
            if (currency === 'trc20') {
              const data: CryptoData = currency_data.usdt;
              return acc.concat([data]);
            } else {
              return acc.concat([currency_data as CryptoData]);
            }
          }, [] as CryptoData[]);
          }
          

    const Payment = (await import('@/models/Payment.server')).default;
    const user = getSess(context);
    //let transactions  = await Activity.find({userId:user?.user?._id});
    let transactionss = await Payment.find({ userId: user?.user?._id })
                                   .select('_id deposit createdAt status updatedAt coin value_coin')
                                   //.sort({ timestamp: -1 })
                                   .lean() as unknown as Deposit[];
    let transactions = await Payment.aggregate<Deposit>([
      {
        $match:{
          userId:user?.user?._id
        }
      },
      {
        $project:{
          _id:{
            $toString:'$_id'
          },
            deposit:1,
            createdAt:1,
            status:1,
            updatedAt:1,
            coin:1,
            value_coin:1
          }
      }
      
    ]);

    
  return {transactions,userId:user?.user?._id.toString(),currencies,prices}
}

export default function({loaderData}:Route.HydrateFallbackProps){
  
  //if(loaderData)
  return <DepositPage deposits={loaderData?.transactions || []} userId={loaderData?.userId!} currencies={loaderData?.currencies!} prices={loaderData?.prices!} />
} 