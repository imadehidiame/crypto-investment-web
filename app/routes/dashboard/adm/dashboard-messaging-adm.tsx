import { getSess } from "@/layouts/app-layout";
//import type { Route } from "./+types/dashboard-home";
//import DashboardHome, { type RecentTransactionsData } from "@/components/dashboard-views/user/home";
//import type { Route } from "./+types/dashboard-profile";
//import DashboardProfile from "@/components/dashboard-views/user/profile";
import type { UserData } from "@/lib/config/session";
import { log } from "@/lib/utils";
import MessagingPage, { type Message as ChatMessage, type MessageThreadData } from "@/components/dashboard-views/user/messaging";
//import type { Route } from "./+types/dashboard-messaging";
import Message from "@/models/Message.server";
import type { Route } from "./+types/dashboard-messaging-adm";
import User from "@/models/User.server";
import MessagingPageAdm from "@/components/dashboard-views/adm/message";

interface Message {
  id: number | string;
  sender: string | 'self';
  content: string;
  timestamp: string | Date;
}

interface MessageThread {
  id: number | string;
  subject: string;
  is_new?:boolean;
  user?:{
    id:string,
    name:string,
  },
  timestamp: Date;
  read?: boolean;
  admin_read?: boolean;
  updatedAt: Date;
  messages: Message[];
  isDraft?: boolean;
  draft?: string;
}

const string_to_date = (date:string|Date)=>{
    return typeof date === 'string' ? (new Date(date)).getTime() : date.getTime();
  }
/**
 * 
  id: number | string;
  subject: string;
  read: boolean;
  updatedAt:Date;
  messages: Message[];
  isDraft?:boolean;
  draft?:string; 

 */

export const loader = async ({context}:Route.LoaderArgs) =>{
  const context_data = getSess(context);
  //log(context_data?.user?._id.toString(),'User data');
  const {name,email,role,_id} = context_data?.user!;

  const messages = await Message.find(
    {}, // Empty filter to get all messages
    { subject: 1, read: 1, messages: 1, admin_read:1 , updatedAt: 1, _id: 1, userId: 1 } // Select fields
  )
    .populate('userId', 'name _id') // Populate userId with name and _id
    //.lean() // Convert to plain JavaScript objects for easier manipulation
    .exec();

    const users_data = (await User.find({role:'user'},{_id:1,name:1})).map(({_id,name})=>({id:_id.toString(),name}));
  
  const formattedMessages = messages.map((message) => ({

    /**
     id: number | string;
  subject: string;
  is_new?:boolean;
  user?:{
    id:string,
    name:string,
  },
  timestamp: Date;
  read?: boolean;
  admin_read?: boolean;
  updatedAt: Date;
  messages: Message[];
  isDraft?: boolean;
  draft?: string;
     */

    id: message._id.toString(), // Convert message _id to string
    subject: message.subject,
    read: message.read,
    admin_read:message.admin_read,
    updatedAt: message.updatedAt,
    messages: message.messages.map((e:any) => ({
      id: e.id.toString(),
      sender: e.sender,
      content: e.content,
      timestamp: e.timestamp,
    })), 
    timestamp: message.updatedAt,
    user: {
      id: message.userId._id.toString(), // Convert userId._id to string
      name: message.userId.name, // Include user name
    },
  })) as unknown as MessageThread[];

  //const messages = (await Message.find({userId:context_data?.user?._id},{subject:1,read:1,messages:1,updatedAt:1,_id:1})).map(({_id,subject,read,updatedAt,messages})=>({id:_id.toString(),subject,read,updatedAt,messages:messages.map((e:any)=>e._doc),timestamp:updatedAt})) as unknown as MessageThreadData;

  //log(messages.toObject(),'Message Data')

  const messageThreads = [ // Placeholder

/**
{
    userId:{type:mongoose.Types.ObjectId,required:true,ref:'User'},
    subject:{type:String,required:true},
    read:{type:Boolean,required:true,default:false},

    messages:mongoose.Types.Array<{
        id:string,
        sender:string, 
        content:string,
        timestamp:Date
    }>
}
 */

    // Add more threads
];
  
  return {user:{name,email,role,_id},messages:formattedMessages,users_data}
}

export default function({loaderData}:Route.HydrateFallbackProps){
  
  
  {/*return <MessagingPage user={loaderData?.user as unknown as UserData} messageThreads={loaderData?.messages!} />*/}
  return <MessagingPageAdm messageThreads={loaderData?.messages!} users_data={loaderData?.users_data} />
} 