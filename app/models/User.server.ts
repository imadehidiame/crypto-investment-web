import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { log } from '@/lib/utils';


export interface IUser extends Document {
    name:string;
    email:string;
    role:'user'|'admin';
    password:string;
    createdAt:Date;
    updatedAt:Date;
    verifyPassword:(password:string)=>Promise<boolean>;
}

const UserSchema:Schema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    role:{type:String,enum:['admin','user'],default:'user'},
    password: { type: String, required: true },
    //createdAt:{type:Date,default:Date.now},
    //updatedAt:{type:Date,default:Date.now}
},{timestamps:true});

UserSchema.pre<IUser>('save', async function (next) {
    //console.log('pre save middleware triggered');
    //console.log('this.password before hashing:', this.password, 'type:', typeof this.password);
    if (!this.isModified('password') && !this.isNew) {
        //console.log('Password not modified or new, skipping hash');
        return next();
    }
    if (!this.password) {
        const error = new Error('Password is missing or undefined');
        console.error('Password validation failed:', error);
        return next(error);
    }
    try {
        //console.log('Generating salt...');
        const salt = await bcrypt.genSalt(10);
        //console.log('Salt value:', salt);
        this.password = await bcrypt.hash(this.password, salt);
        //console.log('Password hashed successfully');
        next();
    } catch (error: any) {
        console.error('Error hashing password:', error);
        next(error);
    }
});

UserSchema.methods.verifyPassword = async function (pass:string) : Promise<boolean> {
    return bcrypt.compare(pass,this.password);
}

if (mongoose.models.User) {
    //delete mongoose.models.User; 
    //console.log('Deleted existing User model to prevent conflict');
}

const User = mongoose.models.User || mongoose.model<IUser>('User',UserSchema);
//console.log('User schema fields:', Object.keys(User.schema.paths));
export default User;