import { Document, Schema } from "mongoose";
import mongoose from "mongoose"

/*
A
*/

interface IInvestment extends Document {
    plan: mongoose.Types.ObjectId; 
    userId: mongoose.Types.ObjectId;
    invested: number; 
    startDate: Date; 
    isWithdrawal:boolean;
    duration:number;
    dailyReturn:number;
    plan_name:string;
    withdrawal:number;
    endDate:Date;
    status:number;
}

const InvestmentSchema:Schema = new Schema({
    plan:{required:true,type:mongoose.Types.ObjectId,ref:'SubscriptionPlan'},

    userId:{required:true,type:mongoose.Types.ObjectId,ref:'User'},
    status:{type:Number,default:0},
    duration:{type:Number,default:0,required:true},
    dailyReturn:{type:Number,default:2.2,required:true},
    plan_name:{type:String,default:'Silver Plan',required:true},
    invested:{required:true,type:Number},
    startDate:{type:Date,required:true,default:Date.now},
    endDate:{type:Date,required:true,default:Date.now},
    withdrawal:{type:Number,required:true,default:0},
    isWithdrawal:{type:Boolean,default:false}
});

if(mongoose.models.Investment){
    //delete mongoose.models.Investment;
    //console.log('Investment model deleted');
}
if(mongoose.models.Investments){
    //delete mongoose.models.Investments;
}

const Investment = mongoose.models.Investment || mongoose.model<IInvestment>('Investment',InvestmentSchema);
export default Investment;


