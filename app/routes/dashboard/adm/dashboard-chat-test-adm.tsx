
//import { get_message_from_redis, publish_message, save_to_redis } from "@/utils/redis.chat";
import { get_random_uuid } from "@/lib/get_random_uuid";
import type { Route } from "./+types/dashboard-chat-test-adm";
import AdminChatTest from "@/components/dashboard-views/adm/chat-test-adm";
import type { ChatMessage } from "@/utils/redis";

type SubmitData = {
    recipientId:string,
    content:string
}

async function save_to_db(content:string,recipientId:string):Promise<ChatMessage>{
    return {
        content,
        createdAt:new Date(),
        recipientId,
        id:get_random_uuid(),
        senderId:'admin'
    }
}

export const action = async({request}:Route.ActionArgs)=>{
    const {publish_message} = (await import('@/utils/redis.chat'));
    const data:SubmitData = await request.json();
    const message = await save_to_db(data.content,data.recipientId);
    //await save_to_redis(message);
    await publish_message(`chat:${data.recipientId}`,message);
    await publish_message(`chat:admin`,message);
    return {logged:true}
}

export const loader = async()=>{
    return [];
    //return await get_message_from_redis();
}

export default function({loaderData}:Route.ComponentProps){
    return <AdminChatTest chats={[]} userId="admin" />
} 