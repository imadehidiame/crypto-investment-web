import {  type Plugin } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer, Server as HttpServer, type IncomingMessage } from 'http';
import { Socket } from 'net';
import { subscribe_to_channel, type MessageThread } from './app/utils/redis.chat';
export function wb_chat(): Plugin {
    
    return {

        name: "wb-chat",
        configureServer(viteServer) {
            const isProduction = process.env.NODE_ENV === "production";
            const httpServer: HttpServer = isProduction
              ? createServer()
              : (viteServer.httpServer as HttpServer) || createServer();
            let ws_server = new WebSocketServer({noServer:true});
            const clients = new Map<string, WebSocket>();
            ws_server.on("connection", (ws: WebSocket, req: IncomingMessage) => {

            /*console.log("WebSocket connection request:", {
                url: req.url,
                headers: req.headers,
              });*/
              
              if (!isProduction && req.headers["sec-websocket-protocol"] === "vite-hmr") {
                console.log("Ignoring Vite HMR connection");
                ws.close(1000, "Vite HMR connection ignored");
                return;
              }
            
              console.log('Connection initiated');
            
            if (!req.url) {
              console.error("Request URL is undefined");
              ws.close(1008, "Missing URL"); 
              return;
            }
            console.log('Url is '+req.url);
            console.log(`Request host header = ${req.headers.host}`)
            const url = new URL(req.url, `http://${req.headers.host || isProduction ? process.env.APP_HOST : "http://localhost:4003"}`);
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
            ws.on("close", (code, reason) => {
              clients.delete(userId);
              console.log(`Client ${userId} disconnected with code ${code}, reason: ${reason.toString()}`);
            });
            ws.on("error", (error) => console.error(`WebSocket error for ${userId}:`, error));
          });
        ws_server.on("error", (error) => console.error("WebSocketServer error:", error));
        httpServer?.on('upgrade',(req:IncomingMessage,socket:Socket,head:Buffer)=>{
                if(req.url?.startsWith('/ws')){
                    console.log('Found a connection');
                    ws_server.handleUpgrade(req,socket,head,(ws,req)=>{
                        ws_server.emit('connection',ws,req);
                    })    
                }
            });
            
        if (isProduction) {
            console.log('Now creating server')
            return () => {
              httpServer?.listen(3000, "0.0.0.0", () => {
                console.log(`WebSocket server running on ws://0.0.0.0:4003`);
              });
            };
          }
        },
      };
}

