import mongoose, { Document, Schema } from "mongoose";

interface IWithdrawal extends Document {
    userId:mongoose.Types.ObjectId;
    amount:number;
    createdAt:Date;
    status:string;
}

const WithdrawalSchema:Schema = new Schema({
    userId:{type:mongoose.Types.ObjectId,required:true,ref:'User'},
    amount:{required:true,type:Number},
    createdAt:{type:Date,required:true,default:Date.now},
    status:{type:String,required:true,default:'Pending'}
});

const Withdrawal = mongoose.models.Withdrawal || mongoose.model<IWithdrawal>('Withdrawal',WithdrawalSchema);
export default Withdrawal;