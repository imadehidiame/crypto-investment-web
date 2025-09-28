import mongoose, { Document, Schema } from "mongoose";

interface IAdmWithdrawal extends Document {
    userId:mongoose.Types.ObjectId;
    amount:number;
    createdAt:Date;
}

const AdmWithdrawalSchema:Schema = new Schema({
    userId:{type:mongoose.Types.ObjectId,required:true,ref:'User'},
    amount:{required:true,type:Number},
    createdAt:{type:Date,required:true,default:Date.now},
    //status:{type:String,required:true,default:'Pending'}
});

const AdmWithdrawal = mongoose.models.AdmWithdrawal || mongoose.model<IAdmWithdrawal>('AdmWithdrawal',AdmWithdrawalSchema);
export default AdmWithdrawal;