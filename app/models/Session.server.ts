import mongoose, { Document,Schema } from "mongoose"
//import mongoose {Document}

export interface ISession extends Document {
    userId:mongoose.Types.ObjectId;
    token:string;
    expiresAt:Date;
}

const SessionSchema:Schema = new Schema({
    userId:{required:true,type:mongoose.Types.ObjectId,ref:'User'},
    token:{required:true,type:String,unique:true},
    expiresAt:{required:true,type:Date,default:Date.now},
});

//SessionSchema.index({token:1});

const Session = mongoose.models.Session || mongoose.model<ISession>('Session',SessionSchema);
export default Session;