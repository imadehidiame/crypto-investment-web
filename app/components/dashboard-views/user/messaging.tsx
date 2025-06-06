import React, { useEffect, useRef, useState } from 'react';
import { useLoaderData, Form, useNavigation, useActionData } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { UserData } from '@/lib/config/session';
import { Label } from '@/components/ui/label';
import SectionWrapper from '@/components/shared/section-wrapper';
import { MessageCircleMore, Send } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { fetch_request } from '@/lib/utils';
import { Toasting } from '@/components/loader/loading-anime';

export interface Message {
  id: number | string;
  sender: string | 'self';
  content: string;
  timestamp: string | Date;
}

interface MessageThread {
  id: number | string;
  subject: string;
  timestamp: Date;
  read: boolean;
  admin_read?: boolean;
  updatedAt: Date;
  messages: Message[];
  isDraft?: boolean;
  draft?: string;
}

export type MessageThreadData = MessageThread[];

const is_same_year = (today: Date, check: Date) => today.getFullYear() == check.getFullYear();

export function extract_date_time(date: Date | string) {
  if (typeof date === 'string') date = new Date(date);
  let dating = '';
  const today = new Date();
  const date_today = today.getDate();
  const date_difference = date_today - date.getDate();
  if (date_difference == 1) {
    dating = 'Yesterday ';
  } else if (date_difference < 0 || date_difference > 1) {
    dating = is_same_year(today, date)
      ? date.toDateString().split(' ').slice(0, 3).join(' ') + ' '
      : date.toDateString() + ' ';
  }
  return dating + date.toTimeString().split(' ').slice(0, 1).join();
}

interface PageProps {
  messageThreads: MessageThreadData;
  user: UserData;
}

const MessagingPage: React.FC<PageProps> = ({ messageThreads, user }) => {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSending = navigation.state === 'submitting';
  const [check_chat, set_check_chat] = useState<NodeJS.Timeout | null>(null);

  const [selectedThreadId, setSelectedThreadId] = useState<number | string | null>(null);
  const [selectedThread, setMessageThread] = useState(
    messageThreads.find((thread) => thread.id === selectedThreadId)
  );

  const [newMessageSubject, setNewMessageSubject] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');
  const [chatMessages, setChatMessages] = useState(messageThreads);
  const [updateAt_timestamp, set_updateAt_timestamp] = useState<Date>(new Date('2025-05-20'));

  const message_ref = useRef<HTMLDivElement>(null);

  

  useEffect(() => {
    if (selectedThreadId) {
      setChatMessages((prev) =>
        prev.map((e) => (e.id == selectedThreadId ? { ...e, read: true } : e))
      );
      setNewMessageContent(chatMessages.find((e) => e.id == selectedThreadId)?.draft ?? '');
    }
  }, [selectedThreadId]);

  useEffect(() => {
    setMessageThread(chatMessages.find((thread) => thread.id === selectedThreadId));
  }, [chatMessages]);

  useEffect(() => {
    const interval = setInterval(async () => {
      await pull_messages(updateAt_timestamp);
    }, 10000);
    set_check_chat(interval);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [updateAt_timestamp]);

  useEffect(()=>{
    if(message_ref.current && selectedThreadId){
        message_ref.current.scrollTo({
            top:message_ref.current.scrollHeight,
            behavior:'smooth'
        });
    }
  },[chatMessages,selectedThreadId]);

  type Chat = Omit<MessageThread, 'subject'> & {
    subject?: undefined;
  };

  function stop_check() {
    if (check_chat) clearInterval(check_chat);
  }

  async function pull_messages(date: Date) {
    
    const fetched = await fetch_request(
      'POST',
      '/api/chat-messaging',
      JSON.stringify({ date: date.getTime(), flag: 'get' }),
      'data'
    );
    if(chatMessages.length < 1){
    //log('Initialize data','Init');
    setChatMessages(fetched.data as MessageThread[])
    }
    else{
    //log('Pushig data','Push')
    push_message(false, 'update_chat', undefined, undefined, undefined, undefined, undefined, fetched.data as MessageThread[]);
    }

    //log(fetched.data, 'Fetched Data');
    set_updateAt_timestamp(new Date());
    //log(new Date(), 'Updated updateAt_timestamp');
  }

  const push_message = (
    isDraft: boolean,
    flag: 'new' | 'update_id' | 'update_chat' | undefined,
    outerID?: string,
    draft?: string,
    updateID?: string,
    message?: string,
    subject?: string,
    payload?: MessageThread[],
    innerID?: string
  ) => {
    
    if (!isDraft) {
      const date = new Date();
      if (flag == 'new')
        setChatMessages((prev) => [
          ...prev,
          {
            id: outerID as string,
            read: true,
            subject: subject as string,
            timestamp: date,
            updatedAt: date,
            isDraft: false,
            draft: '',
            messages: [
              {
                content: message as string,
                sender: '',
                id: innerID as string,
                timestamp: date,
              },
            ],
          },
        ]);
      else if (flag == 'update_id')
        setChatMessages((prev) =>
          prev.map((e) => (e.id == outerID ? { ...e, id: updateID as string } : e))
        );
      else {
        if (payload && payload.length > 0){
            
          payload.forEach((element) => {
            setChatMessages((prev) =>
              prev.map((e) =>
                e.id == element.id
                  ? {
                      ...e,
                      updatedAt: element.updatedAt,
                      timestamp: element.updatedAt,
                      read: selectedThreadId === element.id ? true : element.read,
                      messages: [...e.messages, ...element.messages.filter(f=>!e.messages.reduce((acc:(string|number)[],{id},index)=>(acc.concat([id])),[]).includes(f.id))],
                    }
                  : e
              )
            );
          });
        }
      }
    } else {
      setChatMessages((prev) => {
        const next = prev.map((e) => {
          const should_draft = !!draft?.trim();
          if (e.id === outerID) {
            if (should_draft) {
              if (e.isDraft) {
                return { ...e, updatedAt: e.draft?.trim() !== draft?.trim() ? new Date() : e.updatedAt, draft };
              } else {
                return { ...e, updatedAt: new Date(), draft, isDraft };
              }
            } else {
              return { ...e, updatedAt: e.timestamp, draft: '', isDraft: false };
            }
          }
          return e;
        });
        return next;
      });
    }
  };

  const string_to_date = (date: string | Date) => {
    return typeof date === 'string' ? new Date(date).getTime() : date.getTime();
  };

  const get_last_message = (message: Message[]) => {
    const sorted = message.sort((a, b) => string_to_date(a.timestamp) - string_to_date(b.timestamp));
    return sorted[sorted.length - 1].content;
  };

  const send_message = async (message: string, subject?: string) => {
    const check = !!message && (selectedThreadId ? true : !!newMessageSubject.trim());
    if (!check) return;
    const date = new Date();
    if (selectedThreadId) {
      const outerID = (Math.random() * Math.random()).toString();
      push_message(false, 'update_chat', undefined, undefined, undefined, undefined, undefined, [
        {
          id: selectedThreadId,
          read: true,
          subject: newMessageSubject,
          updatedAt: date,
          timestamp: date,
          messages: [
            {
              content: newMessageContent,
              id: outerID,
              sender: '',
              timestamp: date,
            },
          ],
        },
      ]);
      const fetched = await fetch_request(
        'POST',
        '/api/chat-messaging',
        JSON.stringify({
          newMessageContent,
          newMessageSubject,
          inner_id: outerID,
          date: date.getTime(),
          flag: 'update',
          id: selectedThreadId,
        }),
        'data'
      );
      
      if (fetched.is_error) {
        Toasting.error('An error occurred while sending message');
      }
      setNewMessageContent('');
    } else {
      const outerID = (Math.random() * Math.random()).toString();
      const innerID = (Math.random() * Math.random()).toString();
      push_message(false, 'new', outerID, undefined, undefined, newMessageContent, newMessageSubject, undefined, innerID);
      const fetched = await fetch_request<{ id: string }>(
        'POST',
        '/api/chat-messaging',
        JSON.stringify({
          newMessageContent,
          newMessageSubject,
          date: date.getTime(),
          flag: 'new',
          inner_id: outerID,
        })
      );
      
      if (fetched.is_error) {
        return;
      }
      push_message(false, 'update_id', outerID, undefined, fetched.data?.id);
      setSelectedThreadId(fetched.data?.id as string);
      setNewMessageContent('');
      setNewMessageSubject('');
    }
  };

  return (
    <SectionWrapper animationType="slideInLeft" padding="4" md_padding="6" className="overflow-hidden">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl sm:text-2xl font-medium text-amber-300">Messaging</CardTitle>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="text-amber-300 xl:hidden">
                <MessageCircleMore className="w-8 h-8" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-dark">
              <SheetHeader>
                <SheetTitle asChild>
                  <span className="text-xl font-bold text-amber-300">Inbox</span>
                </SheetTitle>
                <SheetDescription></SheetDescription>
              </SheetHeader>
              <SectionWrapper animationType="fadeInRight" padding="0" md_padding="0">
                <ScrollArea className="h-full">
                  {chatMessages.length > 0 ? (
                    chatMessages
                      .slice()
                      .sort((a, b) => string_to_date(b.updatedAt) - string_to_date(a.updatedAt))
                      .map((thread) => (
                        <div
                          key={thread.id}
                          className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors duration-200 ${
                            selectedThreadId === thread.id ? 'bg-gray-700' : ''
                          } ${thread.read ? 'text-gray-400' : 'text-white font-semibold'}`}
                          onClick={() => {
                            if (selectedThreadId) {
                              if (newMessageContent.trim()) {
                                push_message(true, undefined, selectedThreadId as string, newMessageContent);
                              } else {
                                push_message(true, undefined, selectedThreadId as string, '');
                              }
                            }
                            setSelectedThreadId(thread.id);
                            setNewMessageContent('');
                          }}
                        >
                          <div className="text-sm text-amber-300">{extract_date_time(thread.updatedAt)}</div>
                          <div className="text-lg">{thread.subject}</div>
                          {thread.isDraft ? (
                            <div className="">
                              <span className="text-green-400 text-sm">Draft: </span>
                              <span className="text-sm truncate">{thread.draft}</span>
                            </div>
                          ) : (
                            <div className="text-sm truncate">{get_last_message(thread.messages)}</div>
                          )}
                        </div>
                      ))
                  ) : (
                    <p className="text-center text-gray-400 p-4">No messages.</p>
                  )}
                </ScrollArea>
              </SectionWrapper>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="hidden xl:flex md:col-span-1 bg-gray-800 border border-amber-300/50 max-h-[85vh] min-h-[85vh] flex-col">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-amber-300">Inbox</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-0">
              <ScrollArea className="h-full">
                {chatMessages.length > 0 ? (
                  chatMessages
                    .slice()
                    .sort((a, b) => string_to_date(b.updatedAt) - string_to_date(a.updatedAt))
                    .map((thread) => (
                      <div
                        key={thread.id}
                        className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors duration-200 ${
                          selectedThreadId === thread.id ? 'bg-gray-700' : ''
                        } ${thread.read ? 'text-gray-400' : 'text-white font-semibold'}`}
                        onClick={() => {
                          if (selectedThreadId) {
                            if (newMessageContent.trim()) {
                              push_message(true, undefined, selectedThreadId as string, newMessageContent);
                            } else {
                              push_message(true, undefined, selectedThreadId as string, '');
                            }
                          }
                          setSelectedThreadId(thread.id);
                        }}
                      >
                        <div className="text-sm text-amber-300">{extract_date_time(thread.updatedAt)}</div>
                        <div className="text-lg">{thread.subject}</div>
                        {thread.isDraft ? (
                          <div className="">
                            <span className="text-green-400 text-sm">Draft: </span>
                            <span className="text-sm truncate">{thread.draft}</span>
                          </div>
                        ) : (
                          <div className="text-sm truncate">{get_last_message(thread.messages)}</div>
                        )}
                      </div>
                    ))
                ) : (
                  <p className="text-center text-gray-400 p-4">No messages.</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card
            className="col-span-1 xl:col-span-2 bg-gray-800 border border-amber-300/50 flex flex-col max-h-[calc(100vh-120px)] h-full"
          >
            <CardHeader>
              <CardTitle className="text-xl font-bold text-amber-300">
                {selectedThread ? selectedThread.subject : 'New Message'}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              {selectedThread ? (
                <div className="flex flex-col h-full border-gray-700">
                  <div className="flex-grow overflow-y-auto p-4 space-y-4 border-b mb-4 max-sm:p-2" ref={message_ref}>
                    {selectedThread.messages
                      .slice()
                      .sort((a, b) => string_to_date(a.timestamp) - string_to_date(b.timestamp))
                      .map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender === 'System' ? 'justify-start' : 'justify-end'
                          }`}
                        >
                          <div
                            className={`p-3 rounded-lg max-w-[70%] ${
                              message.sender === 'System'
                                ? 'bg-gray-700 text-gray-400'
                                : 'bg-amber-400 text-gray-900'
                            }`}
                          >
                            <div className="text-xs text-gray-800 mb-1">
                              {message.sender === 'System' ? 'System' : ''}
                              {extract_date_time(message.timestamp)}
                            </div>
                            <div>{message.content}</div>
                          </div>
                        </div>
                      ))}
                  </div>

                  <Form
                    method="post"
                    className="p-4 space-y-4 bg-gray-800 max-sm:p-2 sticky bottom-0 z-10"
                    onSubmit={(e) => {
                      e.preventDefault();
                      send_message(newMessageContent);
                    }}
                  >
                    <input type="hidden" name="threadId" value={selectedThreadId || ''} />
                    <div className="space-y-2">
                      <Label htmlFor="content" className="text-gray-300">
                        Message
                      </Label>
                      <Textarea
                        id="content"
                        name="content"
                        rows={5}
                        className="bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300 w-full"
                        value={newMessageContent}
                        onChange={(e) => setNewMessageContent(e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      className="bg-amber-300 text-gray-900 hover:bg-amber-400 self-end"
                      disabled={(!selectedThread && !newMessageSubject) || !newMessageContent}
                      onClick={() => {
                        
                        send_message(newMessageContent);
                      }}
                    >
                      {isSending ? 'Sending...' : 'Send Message'}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                    {actionData?.message && (
                      <p className="text-green-500 mt-4 text-center">{actionData.message}</p>
                    )}
                    {actionData?.error && (
                      <p className="text-red-500 mt-4 text-center">{actionData.error}</p>
                    )}
                  </Form>
                </div>
              ) : (
                <Form
                  method="post"
                  className="flex-grow flex flex-col space-y-4 p-4"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input type="hidden" name="threadId" value={selectedThreadId || ''} />
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-gray-300">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      className="bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300"
                      value={newMessageSubject}
                      onChange={(e) => setNewMessageSubject(e.target.value)}
                      disabled={!!selectedThread}
                    />
                  </div>
                  <div className="space-y-2 flex-grow">
                    <Label htmlFor="content" className="text-gray-300">
                      Message
                    </Label>
                    <Textarea
                      id="content"
                      name="content"
                      rows={5}
                      className="bg-gray-700 border-gray-600 text-white focus-visible:ring-amber-300 flex-grow"
                      value={newMessageContent}
                      onChange={(e) => setNewMessageContent(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-amber-300 text-gray-900 hover:bg-amber-400 self-end"
                    disabled={(!selectedThread && !newMessageSubject) || !newMessageContent}
                    onClick={() => {
                      send_message(newMessageContent, newMessageSubject);
                    }}
                  >
                    {'Send'}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                  {actionData?.message && (
                    <p className="text-green-500 mt-4 text-center">{actionData.message}</p>
                  )}
                  {actionData?.error && (
                    <p className="text-red-500 mt-4 text-center">{actionData.error}</p>
                  )}
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default MessagingPage;