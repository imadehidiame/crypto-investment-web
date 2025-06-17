import { getSess } from "@/layouts/app-layout";
//import type { Route } from "./+types/dashboard-home";
//import DashboardHome, { type RecentTransactionsData } from "@/components/dashboard-views/user/home";
import type { Route } from "./+types/dashboard-profile";
import DashboardProfile from "@/components/dashboard-views/user/profile";
import type { UserData } from "@/lib/config/session";
import { log } from "@/lib/utils";
import mongoose, { Types } from "mongoose";
import User, { type IUser } from "@/models/User.server";


async function verifyUserPassword(userId: string | mongoose.Types.ObjectId, password: string): Promise<{user?:any,valid:boolean}> {
  try {
    /*if (!Types.ObjectId.isValid(userId)) {
      log('Invalid user ID:', userId);
      throw new Error('Invalid user ID');
    }*/

    const user = await User.findById(userId).select('password');
    if (!user) {
      return {valid:false};
    }
    return  {valid:await user.verifyPassword(password),user};
  
  } catch (error: any) {
    log('Error verifying password:', error.message);
    throw error;
  }
}

async function isEmailAvailable(userId: string | mongoose.Types.ObjectId, newEmail: string): Promise<boolean> {
  try {
    const existingUser = await User.findOne({
      email: newEmail,
      _id: { $ne: typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId }, // Exclude the current user
    }).select('_id');

    if (existingUser) {
      //log('Email already in use:', newEmail);
      return false;
    }
    return true;
  } catch (error: any) {
    log('Error checking email availability:', error.message);
    throw error;
  }
}


export const loader = async ({context}:Route.LoaderArgs) =>{
  const context_data = getSess(context);
  //log(context_data?.user?._id.toString(),'User data');
  const {name,email,role,_id} = context_data?.user!;
  return {user:{name,email,role,_id}}
}

export const action = async ({request,context}:Route.ActionArgs) =>{
    const context_data = getSess(context);
    const form_data = Object.fromEntries(await request.formData());
    if(form_data.formType === 'changePassword'){
      //update password
      const {valid,user } = await verifyUserPassword(context_data?.user?._id!,form_data.currentPassword as string);
      if(!valid){
        return Response.json({error:'Invalid password entered',data:JSON.stringify(form_data),...form_data},{status:200});
      }
      
       const user_data = user as IUser;
       user_data.password = form_data.newPassword as string;
       await user_data.save() 
      return Response.json({message:'Password has been updated successfully',formType:form_data.formType},{status:200});
    }else{
      //update personal data
      const { valid } = await verifyUserPassword(context_data?.user?._id!,form_data.user_password as string)
      if(!valid){
        return Response.json({error:'Invalid password entered',data:JSON.stringify(form_data),...form_data},{status:200});
      }
      if(!(await isEmailAvailable(context_data?.user?._id!,form_data.email as string)))
        return Response.json({error:'Unfortunately, the email address has already been taken',data:JSON.stringify(form_data),...form_data},{status:200}); 
      const user = await User.updateOne(
        { 
          _id: context_data?.user?._id 
        },
        { 
          $set: 
          {
            email:form_data.email,
            name:form_data.name
          }  
        },
        { runValidators: true }
      );
      if(user.matchedCount === 0){
        return Response.json({error:'User data not found',data:JSON.stringify(form_data),...form_data},{status:200});
      }
      return Response.json({message:'Profile has been updated successfully',formType:form_data.formType},{status:200});
    }
    
}

export default function({loaderData}:Route.HydrateFallbackProps){
  
  
  return <DashboardProfile user={loaderData?.user as unknown as UserData} />
} 