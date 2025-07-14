import { Toasting } from "@/components/loader/loading-anime";
import SectionWrapper from "@/components/shared/section-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ChatMessage } from "@/utils/redis";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react"
import { useActionData, useNavigation, useSubmit } from "react-router";

interface UserChatData {
    userId:string;
    chats:ChatMessage[]
}

export default function ChatTest({chats}:{chats:ChatMessage[]}){

    const [users,set_users] = useState<string[]>([]);
    const [user,set_user] = useState('');
    const create_user = ()=>{
        if(!users.includes(user) && user.trim() !== ''){
            set_users(prev=>[...prev,user]);
        }
    }

    return <SectionWrapper animationType="slideInRight" padding="0" md_padding="0">
    <div className="space-y-6 p-4 max-sm:p-2">
      <CardTitle className="text-xl sm:text-2xl font-medium text-amber-300">Chats</CardTitle>
    <Card className="bg-gray-800 border border-amber-300/50 p-4 space-y-4">

    <CardContent className="max-sm:p-2">
          <div className='space-y-1 p-0 flex flex-wrap gap-4 items-center mb-12'>
            
                <Input type="text" className="w-full bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300 mt-2.5" value={user} onChange={(e)=>{
                    set_user(e.target.value);
                }} />
                
                <Button
                                variant="outline"
                                className="ml-auto border-gold-500 border-amber-300 text-amber-300 hover:border-amber-50 hover:text-amber-50 cursor-pointer text-sm py-2 h-9"
                                disabled={user.trim() === ''}
                                onClick={create_user}
                              >
                                Create User
                </Button>
            
            </div>
         </CardContent>

    </Card>
    </div>
        {
            users.map(user=><UserChatTest key={user} userId={user} chats={chats} />)
        }
    </SectionWrapper>
}

export const UserChatTest:React.FC<UserChatData> = ({userId,chats})=>{
    const [ws,set_ws] = useState<WebSocket|null>();
    const [chat_data,set_chat_data] = useState<ChatMessage[]>([]);
    const [isSubmitting,setIsSubmitting] = useState(false);
    const [content,set_content] = useState('');
    const navigation = useNavigation();
    const submit = useSubmit();
    const action_data = useActionData<{logged:boolean}>();

    useEffect(()=>{
        if(action_data?.logged){
            Toasting.success('Message sent',2000);
        }
        if(!action_data?.logged){
            //Toasting.error('An error occured',2000);
        }
    },[action_data]);
    
    useEffect(()=>{
        set_chat_data(chats.filter(e=>e.recipientId === userId || e.senderId === userId));
        const websocket = new WebSocket(`ws://localhost:4003?userId=${userId}&flag=chat`);
        set_ws(websocket);
        websocket.onmessage = (message)=>{
            //console.log(message.data);
            set_chat_data(prev=>[...prev,JSON.parse(message.data)]);
        }
        websocket.onclose = (event) => {
            console.log(`WebSocket closed for userId: ${userId}, code: ${event.code}, reason: ${event.reason}`);
        };
        websocket.onerror = (error)=>console.error(error)
        return () => {
            websocket.close(1000, "Component unmounted"); // Valid close code
        };
    },[]);
    useEffect(()=>{
        //
    },[chats]);

    useEffect(()=>{
        const {state} = navigation;
        if(state === 'submitting')
            setIsSubmitting(true);
        if(state === 'idle')
            setIsSubmitting(false);
    },[navigation]);
    

    const submit_form = ()=>{
        if(content.trim())
        submit({senderId:userId,content},{action:'/dashboard/chat-test',method:'POST',encType:'application/json',replace:true});
    }

    return  <SectionWrapper animationType="slideInRight" padding="0" md_padding="0">
    <div className="space-y-6 p-4 max-sm:p-2">
      <CardTitle className="text-xl sm:text-2xl font-medium text-amber-300">Chat - {userId}</CardTitle>

      <Card className="bg-gray-800 border border-amber-300/50 p-4 space-y-4">
                {chat_data.map((chat) => (
                  <Card key={chat.id} className="bg-gray-800 border border-gray-700">
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg font-bold text-amber-300 flex items-center gap-2">
                        
                        {chat.senderId === userId ? 'Me' : 'Admin'}
                      </CardTitle>
                      <p className="text-xs text-gray-400">
                        {chat.createdAt.toLocaleString()} 
                      </p>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <p className="text-sm font-medium text-gray-400">{chat.content}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </Card>

      <Card className="bg-gray-800 py-4 px-2 border border-amber-300/50">
        <CardHeader className="max-sm:p-2">
          <CardTitle className="text-lg font-bold text-amber-300">Chat Test</CardTitle>
          <p className="text-sm text-gray-400">Send/Receive Message</p>
        </CardHeader>
        <CardContent className="max-sm:p-2">
          <div className='space-y-1 p-0 flex flex-wrap gap-4 items-center mb-12'>
            
                <Input type="hidden" name={userId} className="w-full bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300 mt-2.5" value={userId} />
                <Textarea value={content} onChange={(e)=>{
                    set_content(e.target.value);
                }} placeholder="Enter message" className="w-full bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300 mt-2.5" />
                <Button
                                variant="outline"
                                className="ml-auto border-gold-500 border-amber-300 text-amber-300 hover:border-amber-50 hover:text-amber-50 cursor-pointer text-sm py-2 h-9"
                                disabled={isSubmitting}
                                onClick={submit_form}
                              >
                                {isSubmitting && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
            
            </div>
         </CardContent>
         </Card>
         </div>
         </SectionWrapper>
}

//export default UserChatTest;