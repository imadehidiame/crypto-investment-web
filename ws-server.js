import { createServer } from "http";
import express from "express";
import { WebSocketServer,WebSocket } from "ws";
import { config } from "dotenv";
import { createClient } from 'redis';

config();

const publisher = createClient({
    url:process.env.REDIS_URL,
    password:process.env.REDIS_PASSWORD
});

const subscriber = createClient({
  url:process.env.REDIS_URL,
  password:process.env.REDIS_PASSWORD
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

export async function save_to_redis(message) {
    try {
        await publisher.lPush("chat:messages-mod",JSON.stringify(message));
        await publisher.expire("chat:messages-mod",60*60*24);
    } catch (error) {
        console.error(`Error saving message to Redis `,error);
    }
}

export async function publish_message(channel,message){
    try { 
        await publisher.publish(channel,JSON.stringify(message));
    } catch (error) {
        console.error(`Error publishing message `,error);
    }
}

export async function subscribe_to_channel(channel,callback){
    try {
        subscriber.subscribe(channel,(message)=>{
            callback(JSON.parse(message));
        });
    } catch (error) {
        console.error('Error subscribing to channel ',error);
    }
}

export async function get_message_from_redis(){
    try {
        const raw_messages = (await publisher.lRange('chat:messages-mod',0,-1)).reverse();
        return raw_messages.map(e=>JSON.parse(e));
    } catch (error) {
        console.error('Error fetching message from redis ',error);
        return [];
    }
}



const is_development = process.env.NODE_ENV === 'development';
const port = Number.parseInt(process.env.WS_PORT);

const app = express();
const server = createServer(app)
let ws_server = new WebSocketServer({server/*,path:'/ws'*/});
const clients = new Map();
            ws_server.on("connection", async (ws, req) => {
              console.log('Connection initiated');
            
            if (!req.url) {
              console.error("Request URL is undefined");
              ws.close(1008, "Missing URL"); 
              return;
            }
            console.log('Url is '+req.url);
            console.log(`Request host header = ${req.headers.host}`)
            const url = new URL(req.url, `http://${req.headers.host || /*!is_development ? process.env.APP_HOST :*/ "http://localhost:4005"}`);
            console.log(url);
            const userId = url.searchParams.get("userId");
            const flag = url.searchParams.get('flag');
            const is_chat = flag && flag === 'chat';
            if (!userId) {
              console.error("Client with invalid userId not connected", { url: req.url });
              ws.close(1008, "Invalid userId"); 
              return;
            }
            clients.set(userId, ws);
            const channel =  is_chat ? `chat:${userId}` : `livechat:${userId}`;
            console.log('Time to subscribe to channel');
            subscribe_to_channel(channel, (message) => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(message));
              }
            }).catch((error) => console.error(`Error subscribing to channel ${channel}:`, error));

            ws.isAlive = true;

            ws.on('pong',()=>{
              console.log('Pong activated');
              ws.isAlive = true;
            });

            ws.on('message',(data)=>{
                console.log(`Data from client`);
                //data.
                //console.log(data.toJSON());
                //console.log(data.toLocaleString());
                //console.log(data.toString());
                console.log(JSON.parse(data));
            });

            ws.on("close", (code, reason) => {
              clients.delete(userId);
              console.log(`Client ${userId} disconnected with code ${code}, reason: ${reason.toString()}`);
            });
            ws.on("error", (error) => console.error(`WebSocket error for ${userId}:`, error));
          });
        ws_server.on("error", (error) => console.error("WebSocketServer error:", error));

        setInterval(()=>{
          console.log('Keeping alive');
          ws_server.clients.forEach((ws)=>{
            console.log('Connection isAlive: '+ws.isAlive);
            if(!ws.isAlive)
              return ws.terminate();
            ws.isAlive = false;
            ws.ping();
          })
        },10000);

        server?.on('upgrade',(req,socket,head)=>{
                        if(req.url?.startsWith('/ws')){
                            console.log('Found a connection');
                            console.log(ws_server.listenerCount('connection',undefined));
                            if(ws_server.listenerCount('connection',undefined) < 1){
                              ws_server.handleUpgrade(req,socket,head,(ws,req)=>{
                                ws_server.emit('connection',ws,req);
                            })
                          }
                                
                        }
                    });

        if(is_development)
        server.listen(port,()=>{
          console.log(`Server is running on http://localhost:${port}`);
        })
        else
        server.listen(port,'0.0.0.0',()=>{
          console.log(`Server is running on http://localhost:${port}`);
        })

