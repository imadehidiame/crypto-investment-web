import { getSess } from "@/layouts/app-layout";
import { log } from "@/lib/utils";
import type { Route } from "./+types/dashboard-settings";
import SettingsPage, {type SettingsData}  from "@/components/dashboard-views/user/settingsg";
import User from "@/models/User.server";
import mongoose from "mongoose";
import { Setting } from "@/models/Setting.server";
import { Wallet } from "@/models/Wallet.server";
import { get_flash_session } from "@/session.server";
import { useEffect, useState } from "react";




export const action = async ({request,context}:Route.ActionArgs)=>{
    try {
    
        if(request.method === 'POST'){
            const {label,currency,address} = await request.json();
            const user = getSess(context);
            log({label,currency,address},'Submit data');
            const wallet = await Wallet.insertOne({
                label,
                currency,
                address,
                userId:user?.user?._id
            });
            log(wallet,'Wallet Data');
            log(wallet._id,'Wallet Data ID');
            return {data:{logged:true,data:{label,currency,address,createdAt:new Date(Date.now()),_id: typeof wallet._id == 'string' ? wallet._id : wallet._id.toString()}}}
        }
        if(request.method === 'PATCH'){
            const {label,currency,address,_id} = await request.json();
            const wallet = await Wallet.findByIdAndUpdate(new mongoose.Types.ObjectId(_id as string),{
                label,currency,address
            },{new:true});
            log(wallet,'Wallet Data update');
            return {data:{logged:true,data:{label,currency,address}}}
        }
        if(request.method === 'DELETE'){
            
        }
        
    } catch (error) {
     log(error,'Error report');   
     return {data:{logged:false,error:'An error occured on the server'}};
    }
    
}

export const loader = async ({context,request}:Route.LoaderArgs) =>{
    const context_data = getSess(context);
    const session = await get_flash_session(request);
    log(session,'Session Data');

    let user_settings = await User.aggregate([
        {
            $match:{
                _id:context_data?.user?._id
            },    
        },
        {
            $lookup:{
                from:'settings',
                localField:'_id',
                foreignField:'userId',
                as:'notifications'
            }
        },
        {
            $unwind:{
                path:'$notifications',
                preserveNullAndEmptyArrays:true
            }
        },
        {
            $lookup:{
                from:'wallets',
                as:'wallets',
                localField:'_id',
                foreignField:'userId'
            }
        },
        {
            $project:{
                _id:1,
                wallets:'$wallets',
                notifications:'$notifications'//  {$arrayElemAt:['$userSettings',0]}
            }
        }
    ]
);

/**
 notifications: {
        emailNotifications: boolean;
        smsNotifications: boolean;
        notifyOnLogin?: boolean;
        twofa_auth?: boolean;
    };
    general: {
        language: string; // Use string for language
    };
    wallets: WalletAddress[];
 */

    //log(user_settings[0],'User settings');
    log(user_settings[0].notifications,'User settings notifications');

if(!user_settings[0].notifications){
    const setting = await Setting.insertOne({
        userId: context_data?.user?._id, // Link to the user
            notifications: {
                emailNotifications: true,
                smsNotifications: false,
                notifyOnLogin: false,
                twofa_auth: false, 
            },
            general: {
                language: 'en', 
            }
    });
    user_settings[0].notifications = {
        _id:setting._id.toString(),
        userId: context_data?.user?._id, // Link to the user
            notifications: {
                emailNotifications: true,
                smsNotifications: false,
                notifyOnLogin: false,
                twofa_auth: false,
            },
            general: {
                language: 'en', 
            },
            createdAt:new Date(Date.now()),
            updatedAt:new Date(Date.now())
    }
    //log(setting,'Basic Settings');
}else{
    //user_settings[0].notifications = user_settings[0].notifications.notifications;
    //user_settings[0].general = user_settings[0].general;
    //log(user_settings[0],'Final note');
}
log(Object.assign({},user_settings[0].notifications,{wallets:user_settings[0].wallets.map((e:any)=>({...e,_id:e._id.toString()}))}),'Final take note');
  
  return {session,user_settings: Object.assign({},user_settings[0].notifications,{wallets:user_settings[0].wallets.map((e:any)=>({...e,_id:e._id.toString()}))})}
}

export default function({loaderData}:Route.ComponentProps){
    
  return <SettingsPage settings={loaderData?.user_settings as SettingsData} session={loaderData?.session?.m} />
  
} 