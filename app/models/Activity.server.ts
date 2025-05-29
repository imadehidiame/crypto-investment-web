import mongoose, { Document, Schema } from "mongoose";


interface IActivity extends Document {
    date: Date; 
    userId:mongoose.Types.ObjectId;
    type: string; 
    amount: number; 
    status: string; 
    description: string;
    payment_id?: string
    //createdAt:Date;
}

const ActivitySchema:Schema = new Schema({
    date:{required:true,default:Date.now,type:Date},
    userId:{required:true,type:mongoose.Types.ObjectId,ref:'User'},
    type:{required:true,type:String},
    amount:{required:true,type:Number},
    status:{required:true,type:String},
    payment_id:{required:false,type:String},
    description:{required:false,type:String},
    //createdAt:{required:true,default:Date.now}    
});

if(mongoose.models.Activity){
    //delete mongoose.models.Activity;
    //console.log('Deleted model');
}

const Activity = mongoose.models.Activity || mongoose.model<IActivity>('Activity',ActivitySchema);
export default Activity

