import mongoose, { Schema, Document } from 'mongoose';

interface ISettingDocument extends Document {
    userId: mongoose.Types.ObjectId; // Link to the user
    notifications: {
        emailNotifications: boolean;
        smsNotifications: boolean;
        notifyOnLogin?: boolean;
        twofa_auth?: boolean;
    };
    general: {
        language: string;
    };
}

const SettingsSchema:Schema = new Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
    notifications: {
        emailNotifications: { type: Boolean, default: false },
        smsNotifications: { type: Boolean, default: false },
        notifyOnLogin: { type: Boolean },
        twofa_auth: { type: Boolean },
    },
    general: {
        language: { type: String, default: 'en' },
    },
}, { timestamps: true });

const Setting = mongoose.models.Setting || mongoose.model<ISettingDocument>('Setting', SettingsSchema);

export { Setting };