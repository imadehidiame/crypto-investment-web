import mongoose, { Schema, Document } from 'mongoose';

interface IWalletDocument extends Document {
    userId: mongoose.Types.ObjectId; // Link to the user
    address: string;
    currency: string;
    label: string;
    createdAt: Date;
}

const WalletSchema = new Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true, index: true }, // Index for efficient lookups by user
    address: { type: String, required: true },
    currency: { type: String, required: true },
    label: { type: String },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Wallet = mongoose.models.Wallet ||  mongoose.model<IWalletDocument>('Wallet', WalletSchema);

export { Wallet };