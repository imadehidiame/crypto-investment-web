import { getSess } from "@/layouts/app-layout";
import type { Route } from "./+types/dashboard-home";
//import DashboardHome from "@/components/dashboard-views/user/home";
//import DashboardHomee from "@/components/dashboard-views/user/dashboard";
import DashboardHomeMod from "@/components/dashboard-views/user/dashboard-mod";
import Investment from "@/models/Investment.server";
import { get_earnings, log } from "@/lib/utils";
import Activity from "@/models/Activity.server";
import { NumberFormat } from "@/components/number-field";
import Deposit from "@/models/Deposit.server";
import AdmWithdrawal from "@/models/AdmWithdrawal.server";
//import User, { type IUser } from "@/models/User.server";
//import DashboardHome, { type RecentTransactionsData } from "@/components/dashboard-views/user/home";



const is_transaction_active = (date:Date)=>Date.now() < date.getTime();

const investment_pie_chart = (total:number,active_investments:{invested:number,name:string}[])=>{
  const backgroundColors = ['#FCD34D', '#D97706', '#CA8A04'];
  let labels:string[] = [];
  let backgroundColor:string[] = [];
  const data = active_investments.map((e,i)=>{
    labels.push(e.name);
    backgroundColor.push(backgroundColors[i%backgroundColors.length])
    return parseFloat(((e.invested/total)*100).toFixed(2));
  })

  return {
    labels,
    datasets:{
      data,
      backgroundColor
    }
  }

}

export const loader = async ({context}:Route.LoaderArgs) =>{
  //const use_new = await User.create({name:'Admin Man',email:'freetone4life@gmail.com',role:'admin',password:'goodhitage'});
  //log(use_new,'New user data');
  const context_data = getSess(context);
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
  
}[] = (await Investment.find({userId:context_data?.user?._id}).populate('plan','duration dailyReturn name')).map(e=>({...e._doc,...{/*earnings:0,balance:0,deposit:0,active_investments:0,active_investments_amount:0*/}}));
//log(investments,'Investments');

let deposits  = (await Deposit.find({userId:context_data?.user?._id}).sort({date:-1})).reduce((acc,{amount})=>{
  return acc+=amount;
},0)

type AdmWithdraw = {amount:number};

//log(deposits,'Depositss');
let adm_withdrawals:number = (await AdmWithdrawal.find({userId:context_data?.user?._id})).reduce((prev:number,{amount}:AdmWithdraw)=>{
  return prev+=amount
},0)
let recentTransactions  = await Activity.find({userId:context_data?.user?._id}).sort({date:-1})
    recentTransactions = recentTransactions.map(({_id,type,amount,status,description,date},i)=>({
        //log(e,'transaction');
        id:_id.toString(),date:date.toLocaleDateString(),datee:date,type,amount:type.includes('Investment') || type.includes('Withdrawal') ? `-$${NumberFormat.thousands(amount,{allow_decimal:true,length_after_decimal:2,add_if_empty:true,allow_zero_start:false})}`:`$${NumberFormat.thousands(amount,{allow_decimal:true,length_after_decimal:2,add_if_empty:true,allow_zero_start:false})}`,status,plan:description
    }))///.sort((a,b)=>b.datee.getTime()-a.datee.getTime());

    const months = {
      '0':'Jan',
      '1':'Feb',
      '2':'Mar',
      '3':'Apr',
      '4':'May',
      '5':'Jun',
      '6':'Jul',
      '7':'Aug',
      '8':'Sep',
      '9':'Oct',
      '10':'Nov',
      '11':'Dec',
  }
  
  let account_balance = investments.reduce((acc,{invested,startDate,plan,withdrawal,endDate},index,array)=>
    (
      {
        earnings:acc.earnings+get_earnings(startDate,plan.dailyReturn,invested,endDate),
        earning_month:acc.earning_month ? acc.earning_month+='{}'+startDate.getMonth() : startDate.getMonth().toString(),
        //earning_data:{...acc.earning_data,[startDate.getMonth().toString()]:acc.earning_data[startDate.getMonth().toString() as keyof typeof acc.earning_data] ? acc.earning_data[startDate.getMonth().toString() as keyof typeof acc.earning_data]+=','+ get_earnings(startDate,plan.dailyReturn,invested) : (get_earnings(startDate,plan.dailyReturn,invested)).toString()},
        earning_dates:{...acc.earning_dates,[endDate.toLocaleDateString()]: acc.earning_dates[endDate.toLocaleDateString()] ? acc.earning_dates[endDate.toLocaleDateString() as keyof typeof acc.earning_dates].concat([get_earnings(startDate,plan.dailyReturn,invested,endDate)]): [get_earnings(startDate,plan.dailyReturn,invested,endDate)]},
        earning_dataa:{...acc.earning_dataa,[months[startDate.getMonth().toString() as keyof typeof months]]:acc.earning_dataa[months[startDate.getMonth().toString() as keyof typeof months] as keyof typeof acc.earning_dataa].concat([get_earnings(startDate,plan.dailyReturn,invested,endDate)])},
        balance:(get_earnings(startDate,plan.dailyReturn,invested,endDate)/*+invested*/-withdrawal)+acc.balance,
        active_investments:is_transaction_active(endDate) ? acc.active_investments+1 : acc.active_investments+0,
        active_investments_amount: is_transaction_active(endDate) ? acc.active_investments_amount + invested : acc.active_investments_amount + 0,
      //plans: is_transaction_active(endDate) ? acc.plans ? acc.plans+='{}'+plan.name : acc.plans+=plan.name : acc.plans+='',
      //investments:[...[invested]] 
      }
    ),
      {
        balance:0,
        earnings:0,
        active_investments:0,
        active_investments_amount:0,
        earning_month:'',
        earning_dates:{} as {[date:string]:number[]},
        earning_dataa:({
          'Jan':[],
          'Feb':[],
          'Mar':[],
          'Apr':[],
          'May':[],
          'Jun':[],
          'Jul':[],
          'Aug':[],
          'Sep':[],
          'Oct':[],
          'Nov':[],
          'Dec':[],
        } as {[x:string]:number[]} )
        //plans:'',
        //investments:[]
      });
      
      account_balance = Object.assign({},account_balance,{balance:((deposits as number)+account_balance.balance)});
      account_balance = Object.assign({},account_balance,{balance:(account_balance.balance - adm_withdrawals)>=0 ? account_balance.balance - adm_withdrawals : 0 });
      
  //    log(account_balance,'Earning dates');

      let earnings_title = 'Earnings Title';
      let earnings_data_months:string[] = [];
      let earnings_data_values:number[];
      let earnings_mod:{[x:string]:number};
      let earnings_data_valuess  = Object.entries(account_balance.earning_dataa).filter(([months,earnings])=>earnings.length > 0);
      if(earnings_data_valuess.length > 1){
        earnings_mod = earnings_data_valuess.reduce((acc,[month,earnings])=>{
          return {...acc,[month]:earnings.reduce((a,cur)=>a+cur,0)};
        },{} as {[x:string]:number})
      }else{
        earnings_title = earnings_data_valuess.length > 0 ?  'Earnings in '+earnings_data_valuess[0][0] : earnings_title
        earnings_data_valuess = Object.entries(account_balance.earning_dates);
        earnings_mod = earnings_data_valuess.reduce((acc,[month,earnings])=>{
          return {...acc,[month]:earnings.reduce((a,cur)=>a+cur,0)};
        },{} as {[x:string]:number})
      }
      
      /*.reduce((acc,[month,earnings])=>{
        return {...acc,[month]:earnings.reduce((a,cur)=>a+cur,0)};
      },{} as {[x:string]:number})*/

    //  log(earnings_data_valuess,'Earnings data value');

      earnings_data_values = /*Object.values(account_balance.earning_dataa).filter(e=>e.length > 0).map(e=>{
        return e.reduce((acc,current)=>current+acc,0);
      })*/ Object.values(earnings_mod);

      earnings_data_months = /*Object.keys(account_balance.earning_dataa).filter(e=>account_balance.earning_dataa[e as keyof typeof account_balance.earning_dataa].length > 0).map(e=>months[e as keyof typeof months]);*/ Object.keys(earnings_mod);

  //log(earnings_data_months,'Account balance')

  //log(transactions,'transactions');

  const active_investments = investments.filter(e=>is_transaction_active(e.endDate)).map(e=>({invested:e.invested,name:e.plan.name}));

  const portfolioChartData = investment_pie_chart(account_balance.active_investments_amount,active_investments);
//log(pie_chart,'Pie Chart')

  return {name:context_data?.user?.name,account_balance,recentTransactions,portfolioChartData,earnings_data_months,earnings_data_values,earnings_title};
}


export default function({loaderData}:Route.HydrateFallbackProps){

  const {recentTransactions,portfolioChartData,account_balance,earnings_data_months,earnings_data_values,earnings_title} = loaderData!;
   

  const dashboard = {
    earnings_title,
    balance: account_balance.balance, // Placeholder
    totalEarnings: account_balance.earnings, // Placeholder
    activeInvestments: account_balance.active_investments, // Placeholder
    recentTransactions/*: [ 
        { id: 1, type: 'Deposit', amount: 1000, date: '2023-10-25' },
        { id: 2, type: 'Earning', amount: 15.50, date: '2023-10-26' },
        { id: 3, type: 'Investment', amount: 500, date: '2023-10-26', plan: 'Bronze' },
        //{ id: '2', date: '2023-10-26', type: 'Investment', amount: -500.00, status: 'Completed', description: 'Bronze Plan' },
    ]*/,
    earningsChartData: { // Placeholder data for Line chart
        labels: earnings_data_months,//['Jan','Feb','March']
        datasets: [
          {
            label: 'Earnings',
            data: /*[100, 150, 200, 180, 250, 300]*/earnings_data_values,
            borderColor: '#FCD34D', // amber-300
            backgroundColor: 'rgba(252, 211, 77, 0.2)', // amber-300 with opacity
            tension: 0.4,
          },
        ],
     },
     marketTrends:[
      {asset: "BTC", price: 190000, change: 3},
      {asset: "ETH", price: 19000, change: 1.5},
      {asset: "XRP", price: 190, change: 5}
     ],
     portfolioChartData: { 
         //labels: ['Bitcoin Plan', 'Ethereum Plan', 'Altcoin Plan'],
         labels: portfolioChartData.labels,
         datasets: [
             {
                 //data: [40, 29.90, 30.10], // Percentages
                 data: portfolioChartData.datasets.data,
                 backgroundColor: portfolioChartData.datasets.backgroundColor
                 //backgroundColor: ['#FCD34D', '#D97706', '#CA8A04'], // Shades of amber/gold
             }
         ]
     }
};
  //return <DashboardHome name={loaderData?.name as string} dashboard={dashboard} />
  return <DashboardHomeMod name={loaderData?.name as string} dashboard={dashboard} />
  //return <DashboardHomee />
} 