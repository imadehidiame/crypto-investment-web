import sessionEnv from '@/config.server';
import { createClient } from 'redis';

export interface ChatMessage {
    id: number|string;
    senderId: string;
    content: string;
    recipientId: string;
    createdAt: Date;
}

const publisher = createClient({
    url:sessionEnv.Redis.url_server,
    password:sessionEnv.Redis.password_server
});



const subscriber = createClient({
    url:sessionEnv.Redis.url_server,
    password:sessionEnv.Redis.password_server
});

async function connect_redis(){
    publisher.on('error',(err)=>console.error(`Redis publisher error: `,err));
    subscriber.on('error',(err)=>console.error(`Redis subscriber error: `,err));

    try {
        await publisher.connect();
        await subscriber.connect();
        console.log("Connected to redis");
    } catch (error) {
        console.error(`Redis Connection Error `,error);
    }
}

connect_redis();

export async function save_to_redis(message:ChatMessage): Promise<void> {
    try {
        await publisher.lPush("chat:messages",JSON.stringify(message));
        await publisher.expire("chat:messages",60*60*24);
    } catch (error) {
        console.error(`Error saving message to Redis `,error);
    }
}

export async function publish_message(channel:string,message:ChatMessage):Promise<void>{
    try {
        await publisher.publish(channel,JSON.stringify(message));
    } catch (error) {
        console.error(`Error publishing message `,error);
    }
}

export async function subscribe_to_channel(channel:string,callback:(message:ChatMessage)=>void):Promise<void>{
    try {
        subscriber.subscribe(channel,(message:string)=>{
            callback(JSON.parse(message));
        });
    } catch (error) {
        console.error('Error subscribing to channel ',error);
    }
}

export async function get_message_from_redis():Promise<ChatMessage[]>{
    try {
        //console.log(await publisher.lPop('chat:messages'));
        const raw_messages = (await publisher.lRange('chat:messages',0,-1)).reverse();
        return raw_messages.map(e=>JSON.parse(e));
    } catch (error) {
        console.error('Error fetching message from redis ',error);
        return [];
    }
}