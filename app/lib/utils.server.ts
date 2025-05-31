export const is_transaction_active = (date:Date)=>Date.now() < date.getTime();
  export async function account_info(id:string|any){
    const Deposit = (await import('@/models/Deposit.server')).default
    const Investment = (await import('@/models/Investment.server')).default    
    try {
    //log(id,'ID VALUE')
        let residuals = (await Investment.find({userId:id}).populate('plan','name duration dailyReturn')).reduce((acc,{startDate,endDate,invested,dailyReturn,plan_name,withdrawal})=>{
            if(!is_transaction_active(endDate as Date)){
              return {...acc,earnings:acc.earnings+=get_earnings(startDate as Date,dailyReturn as number,invested as number,endDate as Date) - withdrawal as number}
            }else{
              return {...acc,investments:acc.investments+=invested}
            }
          },{investments:0,earnings:0} as {investments:number,earnings:number}) as {investments:number,earnings:number};
    
        let deposits  = (await Deposit.find({userId:id}).sort({date:-1})).reduce((acc,{amount})=>{
            return acc+=amount;
          },0);
        
          residuals = Object.assign({},residuals,{investments:parseFloat((residuals.investments as number).toFixed(2)),earnings: parseFloat((residuals.earnings+=deposits as number).toFixed(2))}) as {earnings:number,investments:number};
          return Object.assign({},residuals,{investable:residuals.earnings-residuals.investments as number});

    } catch (error) {
        console.log(error);
    }
  }
  export const get_earnings = (date:Date,percentage:number,investment:number,endDate:Date)=>{
    let days_in_milliseconds = Date.now() - date.getTime();
    let day_in_milliseconds = 86400 * 1000;
    let days = 0;
    if(Date.now() > endDate.getTime()){
        days = (endDate.getTime() - date.getTime())/day_in_milliseconds;
    }else{
        if(days_in_milliseconds > day_in_milliseconds)
            days = Math.floor(days_in_milliseconds/day_in_milliseconds);    
    }
    if(days == 0)
      return 0;
    let daily_percentage = (percentage/100)*investment;
    return parseFloat((daily_percentage*=days).toFixed(2));
  }
  
  


