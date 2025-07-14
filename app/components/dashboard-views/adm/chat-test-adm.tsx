import { Toasting } from "@/components/loader/loading-anime";
import SectionWrapper from "@/components/shared/section-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ChatMessage } from "@/utils/redis";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react"
import { useActionData, useNavigation, useSubmit } from "react-router";

interface UserChatData {
    userId:string;
    chats:ChatMessage[]
}

const AdminChatTest:React.FC<UserChatData> = ({userId,chats})=>{
    const [ws,set_ws] = useState<WebSocket|null>();
    const [chat_data,set_chat_data] = useState<ChatMessage[]>(chats);
    const [isSubmitting,setIsSubmitting] = useState(false);
    const [content,set_content] = useState('');
    const [user,set_user] = useState('null');
    const [recipient,set_recipient] = useState('');
    const [selects,set_selects] = useState<{name:string,value:string}[]>([{name:'Select user',value:'null'}]);
    const navigation = useNavigation();
    const submit = useSubmit();
    const action_data = useActionData<{logged:boolean}>();

    useEffect(()=>{
        if(action_data?.logged){
            Toasting.success('Message sent',2000);
            set_content('');
        }
        if(!action_data?.logged){
          //  Toasting.error('An error occured',2000);
            
        }
    },[action_data]);
    
    useEffect(()=>{
        console.log('Effect use called');
        set_selects(prev => [...prev,...chats.reduce((prev,{recipientId,senderId})=>{
            if(recipientId === 'admin'){
                return prev.includes(senderId) ? prev : [...prev,senderId];
            }else{
                return prev.includes(recipientId) ? prev : [...prev,recipientId];
            }
        },[] as string[]).map(e=>({name:e,value:e}))]);

        const websocket = new WebSocket(`ws://localhost:4003?userId=admin&flag=chat`);
        set_ws(websocket);
        websocket.onmessage = (message)=>{
            const {recipientId,senderId}:ChatMessage = JSON.parse(message.data);
            //console.log({recipientId,senderId});
            if(recipientId === 'admin'){
                set_recipient(senderId);
            }else{
                set_recipient(recipientId);
            }
            //update_select(recipientId,senderId);
            set_chat_data(prev=>[...prev,JSON.parse(message.data)]);
        }
        websocket.onclose = (event) => {
            console.log(`WebSocket closed for userId: admin, code: ${event.code}, reason: ${event.reason}`);
        };
        websocket.onerror = (error)=>console.error(error)
        return () => {
            websocket.close(1000, "Component unmounted"); // Valid close code
        };
    },[]);
    useEffect(()=>{
        //set_chat_data(chats.filter(e=>e.recipientId === userId || e.senderId === userId));
        //console.log(chats);
        
    },[chats]);

    useEffect(()=>{
        const {state} = navigation;
        if(state === 'submitting')
            setIsSubmitting(true);
        if(state === 'idle')
            setIsSubmitting(false);
    },[navigation]);

    useEffect(()=>{
        console.log(selects);
        if(recipient){
        if(!selects.some(e=>e.name === recipient)){
            set_selects(prev=>[...prev,{name:recipient,value:recipient}]);
        }}
    },[recipient]);
    
    function update_select(recipientId:string,senderId:string){
        if(recipientId === 'admin'){
            set_recipient(senderId);
        }else{
            set_recipient(recipientId);
        }
    }

    const submit_form = ()=>{
        if(content.trim()){
        console.log(user);
        submit({content,recipientId:user},{action:'/dashboard/adm/chat-test-adm',method:'POST',encType:'application/json',replace:true});
        }
    }

    return  <SectionWrapper animationType="slideInRight" padding="0" md_padding="0">
    <div className="space-y-6 p-4 max-sm:p-2">
      <CardTitle className="text-xl sm:text-2xl font-medium text-amber-300">Chat - {userId}</CardTitle>

      <Card className="bg-gray-800 border border-amber-300/50 p-4 space-y-4">
                {chat_data.map((chat) => (
                  <Card key={chat.id} className="bg-gray-800 border border-gray-700">
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg font-bold text-amber-300 flex items-center gap-2">
                        
                        {chat.senderId === userId ? 'Me' : chat.senderId}
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
            
                <Input type="hidden" name="userId" className="w-full bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300 mt-2.5" value={userId} />
        <Select onValueChange={(e)=>{
            set_user(e);
        }} value={user}>
          <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300 mt-2.5">
            <SelectValue placeholder={'Select user'} />
          </SelectTrigger>
          <SelectContent className={'bg-gray-800 text-gray-100 border-amber-300/50'}>
            {selects.map((select) => (
              <SelectItem key={select.value} value={select.value}>
                {select.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
                <Textarea name="content" value={content} onChange={(e)=>{
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

export default AdminChatTest;