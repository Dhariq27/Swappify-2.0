import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import ChatInput from "@/components/ChatInput";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockChats } from "@/data/mockData";
import { 
  Send, 
  Search, 
  MoreVertical,
  Phone,
  Video,
  Info,
  Paperclip,
  Smile
} from "lucide-react";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      sender: 'Sarah Johnson',
      content: 'Hi! I saw your React development skills. I\'d love to exchange guitar lessons for some coding help!',
      timestamp: '2024-01-15T09:00:00Z',
      isOwn: false
    },
    {
      id: '2',
      sender: 'You',
      content: 'That sounds amazing! I\'ve always wanted to learn guitar. What level of React help do you need?',
      timestamp: '2024-01-15T09:05:00Z',
      isOwn: true
    },
    {
      id: '3',
      sender: 'Sarah Johnson',
      content: 'I\'m building a small portfolio website and need help with components and state management. Nothing too complex!',
      timestamp: '2024-01-15T09:07:00Z',
      isOwn: false
    },
    {
      id: '4',
      sender: 'You',
      content: 'Perfect! I can definitely help with that. How about we start with 1-hour sessions each week?',
      timestamp: '2024-01-15T09:10:00Z',
      isOwn: true
    },
    {
      id: '5',
      sender: 'Sarah Johnson',
      content: 'Sounds great! When would you like to start the guitar lessons?',
      timestamp: '2024-01-15T10:30:00Z',
      isOwn: false
    }
  ]);

  // Real-time messaging with Supabase
  useEffect(() => {
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMsg = payload.new as any;
          setChatMessages(prev => [...prev, {
            id: newMsg.id,
            sender: newMsg.sender_id === 'current-user' ? 'You' : selectedChat.participant.name,
            content: newMsg.content,
            timestamp: newMsg.created_at,
            isOwn: newMsg.sender_id === 'current-user'
          }]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        sender: 'You',
        content: message,
        timestamp: new Date().toISOString(),
        isOwn: true
      };
      setChatMessages([...chatMessages, newMessage]);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Chat List Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Messages</h2>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search conversations..." 
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-340px)]">
                  <div className="space-y-1 p-4">
                    {mockChats.map(chat => (
                      <div
                        key={chat.id}
                        onClick={() => setSelectedChat(chat)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                          selectedChat.id === chat.id ? 'bg-muted' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={chat.participant.avatar} alt={chat.participant.name} />
                              <AvatarFallback>{chat.participant.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {chat.unreadCount > 0 && (
                              <div className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {chat.unreadCount}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium truncate">{chat.participant.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(chat.timestamp).toLocaleTimeString('en-US', { 
                                  hour: 'numeric', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {chat.lastMessage}
                            </p>
                            <div className="flex gap-1 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {chat.skillExchange.offered} ↔ {chat.skillExchange.wanted}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedChat.participant.avatar} alt={selectedChat.participant.name} />
                      <AvatarFallback>{selectedChat.participant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedChat.participant.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedChat.skillExchange.offered} ↔ {selectedChat.skillExchange.wanted}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <div className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {chatMessages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${msg.isOwn ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`p-3 rounded-2xl ${
                              msg.isOwn
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 px-3">
                            {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <ChatInput 
                  message={message}
                  setMessage={setMessage}
                  onSendMessage={handleSendMessage}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;