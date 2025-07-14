//import { get_message_from_redis, publish_message, save_to_redis } from "@/utils/redis.chat";
import type { Route } from "./+types/dashboard-chat-test"
import { get_random_uuid } from "@/lib/get_random_uuid";
import ChatTest, { UserChatTest } from "@/components/dashboard-views/user/chat-test";
import type { ChatMessage } from "@/utils/redis";

type SubmitData = {
    senderId:string,
    content:string
}

async function save_to_db(content:string,senderId:string):Promise<ChatMessage>{
    return {
        content,
        createdAt:new Date(),
        recipientId:'admin',
        id:get_random_uuid(),
        senderId
    }
}

export const action = async({request}:Route.ActionArgs)=>{
    const {publish_message} = (await import('@/utils/redis.chat'));
    const data:SubmitData = await request.json();
    const message = await save_to_db(data.content,data.senderId);
    //await save_to_redis(message);
    await publish_message(`chat:admin`,message);
    await publish_message(`chat:${data.senderId}`,message);
    return {logged:true}
}

export const loader = async()=>{
    return [];
    //return await get_message_from_redis()
}

export default function({loaderData}:Route.ComponentProps){
    return <ChatTest chats={[]} />
} 