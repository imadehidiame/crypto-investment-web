//import { update_single_document } from "@/lib/app-write-server-query";
//import useInitAppwrite from "@/lib/config/appwrite-server";
//import type { Route } from "./+types/product-update";

import { getSess } from "@/layouts/app-layout";
//import { Setting } from "@/models/Setting.server";
//import type { Route } from "./+types/settings-update";
import Message from "@/models/Message.server";
import mongoose from "mongoose";
import { log } from "@/lib/utils";
import type { Route } from "./+types/chat-messaging";
import { publish_message, type MessageThread } from "@/utils/redis.chat";
//import type { Route } from "./+types/settings-update";
//import type { Route } from "./+types/settings-update";


export const action = async ({request,context}:Route.ActionArgs)=>{
    //console.log(request)
    //console.log(await request.json());
    const user = getSess(context);
    //console.log({user});
    //console.log(user);
    if(!user?.isAuthenticated){
        return new Response(null,{status:403,statusText:'Access to request denied as a result of an invalid request first'})
    }

    if(request.method === 'POST'){
        try {
        //const { AppwriteServerConfig } = await useInitAppwrite();
        //const document = await get_single_document(AppwriteServerConfig.categories_collection_id,params.product);
        /**
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
         */
        //let form_data;
        if(request.headers.has('Content-Type') && request.headers.get('Content-Type') == 'application/json'){
            let form_data = await request.json();
            //log(form_data,'Form Data');
            if(form_data.hasOwnProperty('flag')){
                const date = new Date(typeof form_data.date === 'string' ? parseInt(form_data.date) : form_data.date)
                const flag = form_data.flag;
                const is_user:boolean = form_data.is_user;
                if(flag === 'new'){

                    const message = await Message.create({
                        userId:new mongoose.Types.ObjectId(user.user?._id),
                        read: is_user ? true : false,
                        admin_read: is_user ? false : true, 
                        createdAt:date,
                        updatedAt:date,
                        subject:form_data.newMessageSubject,
                        messages:[
                        {
                            id:form_data.inner_id,
                            sender:user.user?.name,
                            timestamp: date,
                            content: form_data.newMessageContent
                        }
                        ]
                    });
                    const channel = is_user ? `livechat:system` : `livechat:${form_data.user_id}`;
                    const message_data:MessageThread = {
                      user:is_user ? {
                        id:user.user?._id.toString() as string,
                        name:user.user?.name as string
                      }: {
                        id:form_data.user_id,
                        name:form_data.name
                      },
                      id:`${message._id.toString()}`,
                      read:is_user ? true : false,
                      subject:form_data.newMessageSubject,
                      timestamp:date,
                      updatedAt:date,
                      admin_read:is_user ? false : true,
                      is_new:true,
                      userId: is_user ? user.user?._id.toString() : form_data.user_id,
                      messages:[
                        {
                            id:form_data.inner_id,
                            sender: is_user ? user.user?.name as string : 'System',
                            timestamp: date,
                            content: form_data.newMessageContent
                        }
                        ]
                    }
                    await publish_message(channel,message_data);
                    //log(message,'Sent Message');
                    //return {data:{id:`${message._id.toString()}`}};
                    return Response.json({data:{data:{id:`${message._id.toString()}`},logged:true}});
                }else if(flag === 'update'){
                    //log(form_data.id,'Form data ID for unpdate');
                    await Message.findByIdAndUpdate(new mongoose.Types.ObjectId(form_data.id as string),{
                        read:is_user ? true : false,
                        admin_read:is_user ? false : true,
                        updatedAt:date,
                        '$push':{
                            messages:{
                                id:form_data.inner_id,
                                sender: is_user ? user.user?.name as string : 'System',
                                timestamp:date,
                                content:form_data.newMessageContent
                            }
                        }
                    },
                    {new:true}
                );
                //livechat:system
                const channel = is_user ? `livechat:system` : `livechat:${form_data.user_id}`;
                    const message_data:MessageThread = {
                      id:form_data.id,
                      read:is_user ? true : false,
                      subject:form_data.newMessageSubject || '',
                      timestamp:date,
                      updatedAt:date,
                      admin_read:is_user ? false : true,
                      is_new:false,
                      userId: is_user ? user.user?._id.toString() : form_data.user_id,
                      messages:[
                        {
                            id:form_data.inner_id,
                            sender: is_user ? user.user?.name as string : 'System',
                            timestamp: date,
                            content: form_data.newMessageContent
                        }
                        ]
                    }
                    //console.log({message_data});
                    await publish_message(channel,message_data);

                //log(message,'Sent edited Message');
                return Response.json({data:{data:{},logged:true}},{headers:{'Content-Type':'application/json'}});

                
              }else if(flag === 'update_read'){
                //log(form_data.id,'Form data ID for unpdate');
                is_user ? 
                await Message.findByIdAndUpdate(new mongoose.Types.ObjectId(form_data.id as string),{
                    read:true,
                    //updatedAt:date,
                },
                {new:true}
                ) : 
                await Message.findByIdAndUpdate(new mongoose.Types.ObjectId(form_data.id as string),{
                  admin_read:true,
                  //updatedAt:date,
                },
                {new:true}
              );
              return Response.json({data:{data:{},logged:true}});
            }
                else if(flag == 'get'){
                    const date = new Date(typeof form_data.date === 'string' ? parseInt(form_data.date) : form_data.date)
                    
                    const messagesFiltered = await Message.aggregate([
                        {
                          $match: {
                            'messages': {
                              $elemMatch: {
                                timestamp: { $gt: date },
                              },
                            },
                            'userId':new mongoose.Types.ObjectId(user.user?._id)
                          },
                        },
                        
                        {
                          $project: {
                            _id: 1,
                            //userId: 1,
                            subject: 1,
                            read: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            messages: {
                              $filter: {
                                input: '$messages',
                                as: 'message',
                                cond: { $gt: ['$$message.timestamp', date] },
                              },
                            },
                          },
                        },
                      ]);

                      return Response.json({data:{data:messagesFiltered.map(({_id,subject,read,updatedAt,messages})=>({id:_id.toString(),timestamp:updatedAt,read,subject,messages,updatedAt})),logged:true}},{status:200})
                      /**
                         id: number | string;
                           subject: string;
                           //lastMessage: string;
                           timestamp: Date;
                           read: boolean;
                           admin_read?: boolean;
                           updatedAt:Date;
                           messages: Message[];
                           isDraft?:boolean;
                           draft?:string;
                         */

                }


                //settings = await Setting.findOneAndUpdate({userId:user.user?._id},{$set:{'notifications.emailNotifications':form_data.emailNotifications}},{new:true});
                //await update_single_document(AppwriteServerConfig.products_collection_id,params.product,{is_archived:form_data.is_archived});
            }
            else{
                return new Response(null,{status:403,statusText:'Access to request denied as a result of an invalid request'})
            }
        }
        //return Response.json({data:{logged:true,settings}});
        
        } catch (error) {  
          console.log(error);
          return new Response(null,{status:500,statusText:'An error occured on the server'});
        }
      }
      return new Response(null,{status:403,statusText:'Access to request denied as a result of an invalid request'})
    
}

