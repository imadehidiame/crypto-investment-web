import mongoose, { Schema, Document } from 'mongoose';

/**
    estimated_fee_fiat,
    estimated_fee,
    callback_url:callback_uri,
    encoded_callback_url:encodeURI(callback_uri),
    address_in,
    address_out,
    value_coin,
    deposit,
    coin:type
 */

interface IPayment extends Document {
  userId:mongoose.Types.ObjectId;//
  address_in?: string;
  callback_url?: string;
  encoded_callback_url ?:string;///
  deposit:number;//
  estimated_fee?: number;
  estimated_fee_fiat?: number;
  //exchange_rate?: number;
  //coin_to_transfer?: string;
  uuid?: string;
  address_out?: string;
  txid_in?: string;
  txid_out?: string;
  confirmations?: number;
  value_coin?: number;
  value_coin_convert?: number;
  coin?: string;
  current_price?: number;
  value_forwarded_coin?: number;
  value_forwarded_coin_convert?: number;
  fee_coin?: number;
  price?: number;
  status:number;
  pending?:number;
  createdAt?: Date;
  updatedAt?: Date;
}

const paymentSchema: Schema = new Schema(
  {
    userId: {type: mongoose.Types.ObjectId,index:true,ref:'User',required:true},
    encoded_callback_url:{type:String,required:false},
    deposit:{type:Number,required:false},
    address_in: { type: String, required: false },
    callback_url: { type: String, required: false, index: true },
    estimated_fee: { type: Number, required: false },
    estimated_fee_fiat: { type: Number, required: false },
    //exchange_rate: { type: Number, required: false },
    //coin_to_transfer: { type: String, required: false },
    uuid: { type: String, required: false },
    address_out: { type: String, required: false },
    txid_in: { type: String, required: false },
    txid_out: { type: String, required: false },
    confirmations: { type: Number, required: false },
    value_coin: { type: Number, required: false },
    value_coin_convert: { type: Number, required: false },
    coin: { type: String, required: false },
    current_price: { type: Number, required: false },
    value_forwarded_coin: { type: Number, required: false },
    value_forwarded_coin_convert: { type: Number, required: false },
    fee_coin: { type: Number, required: false },
    price: { type: Number, required: false },
    pending: { type: Number, required: false },
    status: {type: Number, required: true, default:-1}
  },
  { timestamps: true }
); 

if(mongoose.models.Payment){
    //delete mongoose.models.Payment;
    //console.log('Deleted paymetn');
}

const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', paymentSchema);

export default Payment;
export type { IPayment };