import mongoose, { Document, Schema } from "mongoose";


interface IDeposit extends Document {
    userId:mongoose.Types.ObjectId;
    amount:number;
    createdAt:Date;
}

const DepositSchema:Schema = new Schema({
    userId:{type:mongoose.Types.ObjectId,ref:'User',required:true},
    amount:{type:Number,required:true},
    createdAt:{type:Date,required:true,default:Date.now}
});

const Deposit = mongoose.models.Deposit || mongoose.model<IDeposit>('Deposit',DepositSchema);
export default Deposit;