import mongoose, { Document, Schema } from "mongoose";

interface IMessage extends Document {
    //id: string;
    subject: string;
    userId:mongoose.Types.ObjectId;
    //lastMessage: 'Thank you for joining!',
    //timestamp: Date;
    read: boolean;
    admin_read: boolean;
    messages: mongoose.Types.Array<{
        id:string,
        sender:string,
        content:string,
        timestamp:Date
    }>
     
}

const MessageSchema:Schema = new Schema({
    userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User', index: true },
    subject:{type:String,required:true},
    read:{type:Boolean,required:true,default:false},
    admin_read:{type:Boolean,required:true,default:false},
    messages:[{
        id:String,
        sender:String,
        content:String,
        timestamp:Date
    }]
},{timestamps:true});

if(mongoose.models.Message){
    //delete mongoose.models.Message;
}

const Message = mongoose.models.Message || mongoose.model<IMessage>('Message',MessageSchema);
export default Message;