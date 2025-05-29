import { getSess } from "@/layouts/app-layout";
//import type { Route } from "./+types/dashboard-home";
//import DashboardHome, { type RecentTransactionsData } from "@/components/dashboard-views/user/home";
//import type { Route } from "./+types/dashboard-profile";
import DashboardProfile from "@/components/dashboard-views/user/profile";
import type { UserData } from "@/lib/config/session";
import { log } from "@/lib/utils";
import MessagingPage, { type Message as ChatMessage, type MessageThreadData } from "@/components/dashboard-views/user/messaging";
import type { Route } from "./+types/dashboard-messaging";
import Message from "@/models/Message.server";


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
  const messages = (await Message.find({userId:context_data?.user?._id},{subject:1,read:1,messages:1,updatedAt:1,_id:1})).map(({_id,subject,read,updatedAt,messages})=>({id:_id.toString(),subject,read,updatedAt,messages:messages.map((e:any)=>e._doc),timestamp:updatedAt})) as unknown as MessageThreadData;

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

    {
        id: 1,
        subject: 'Welcome to CoinInvest',
        lastMessage: 'Thank you for joining!',
        updatedAt: new Date('2025-05-20'),
        timestamp: new Date('2025-05-20'),
        read: true,
         messages: [ 
             { id: 101, sender: 'System', content: 'Welcome to CoinInvest!', timestamp: '2023-10-26' },
             { id: 102, sender: 'Me', content: 'Thanks for the welcome! Are you sure you are happy to see me? I have my doubts about that though', timestamp: '2023-10-26' },
             { id: 103, sender: 'Me', content: 'Yes i am sure about that', timestamp: '2023-10-25' },
             { id: 104, sender: 'System', content: 'Yes i am sure about that', timestamp: '2023-10-24' },
             { id: 105, sender: 'Me', content: 'Yes i am sure about that', timestamp: '2023-10-23' },
             { id: 106, sender: 'System', content: 'Yes i am sure about that', timestamp: '2023-10-23' },
             { id: 107, sender: 'Me', content: 'Yes i am sure about that', timestamp: '2023-10-22' },
             { id: 108, sender: 'Me', content: 'Yes i am sure about that', timestamp: '2025-05-20' },
         ]
    }, 
     {
         id: 2,
         subject: 'Investment Plan Update',
         lastMessage: 'Your Bronze plan has been activated.',
         updatedAt: new Date('2023-10-27'),
         timestamp: new Date('2023-10-27'),
         read: false,
         messages: [
             { id: 201, sender: 'System', content: 'Your Bronze plan has been activated.', timestamp: '2023-10-27' },
         ]
     },
    // Add more threads
];
  
  return {user:{name,email,role,_id},messageThreads,messages}
}

export default function({loaderData}:Route.HydrateFallbackProps){
  
  
  {/*return <MessagingPage user={loaderData?.user as unknown as UserData} messageThreads={loaderData?.messages!} />*/}
  return <MessagingPage user={loaderData?.user as unknown as UserData} messageThreads={loaderData?.messages!} />
} 