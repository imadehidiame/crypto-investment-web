import mongoose, { Document, Schema } from "mongoose";


interface ISubscriptionPlan extends Document {
      //id: '1',
      name: string;
      minInvestment: number;
      maxInvestment: number;
      duration: number;
      dailyReturn: number;
      isActive: boolean;
      createdAt: Date;
}

const SubscriptionPlanSchema:Schema = new Schema({
    name:{type:String,required:true,unique:true},
    isActive:{type:Boolean,required:true,default:true},
    minInvestment:{type:Number,required:true},
    maxInvestment:{type:Number,required:true},
    duration:{type:Number,required:true,default:30},
    dailyReturn:{type:Number,required:true},
    createdAt:{type:Date,required:true,default:Date.now}
});

//SubscriptionPlanSchema.index({name:1},{unique:true});
if(mongoose.models.SubscriptionPlan){
    //delete mongoose.models.SubscriptionPlan;
    //console.log('Model sub deleted');
}

const SubscriptionPlan = mongoose.models.SubscriptionPlan || mongoose.model<ISubscriptionPlan>('SubscriptionPlan',SubscriptionPlanSchema);
export default SubscriptionPlan;
