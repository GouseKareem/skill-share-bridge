
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { format } from 'date-fns';

const Messages = () => {
  const { id: contactId } = useParams<{ id?: string }>();
  const { user, isAuthenticated } = useAuth();
  const { conversations, messages, sendMessage, markAsRead, tutors } = useData();
  
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [contactUsers, setContactUsers] = useState<any[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Find all users the current user has conversations with
  useEffect(() => {
    if (isAuthenticated && user) {
      // Get all conversation participants that aren't the current user
      const contacts = conversations
        .filter(conv => conv.participants.includes(user.id))
        .map(conv => {
          const otherParticipantId = conv.participants.find(p => p !== user.id);
          const contact = tutors.find(t => t.id === otherParticipantId);
          
          return {
            id: otherParticipantId,
            name: contact ? contact.name : 'Unknown User',
            image: contact ? contact.profileImage : undefined,
            conversationId: conv.id,
            lastMessage: conv.lastMessage,
            lastMessageTimestamp: conv.lastMessageTimestamp,
            unreadCount: conv.unreadCount
          };
        });
      
      setContactUsers(contacts);
      
      // If contactId is provided, select that conversation
      if (contactId) {
        const conversation = conversations.find(conv => 
          conv.participants.includes(user.id) && conv.participants.includes(contactId)
        );
        
        if (conversation) {
          setSelectedConversation(conversation.id);
        }
      }
    }
  }, [isAuthenticated, user, conversations, tutors, contactId]);
  
  // Update messages when selectedConversation changes
  useEffect(() => {
    if (selectedConversation) {
      const conversation = conversations.find(conv => conv.id === selectedConversation);
      
      if (conversation) {
        const conversationMessages = messages.filter(msg => 
          conversation.participants.includes(msg.senderId) && 
          conversation.participants.includes(msg.receiverId)
        ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        
        setConversationMessages(conversationMessages);
        
        // Mark unread messages as read
        conversationMessages.forEach(msg => {
          if (msg.receiverId === user?.id && !msg.read) {
            markAsRead(msg.id);
          }
        });
      }
    } else {
      setConversationMessages([]);
    }
  }, [selectedConversation, conversations, messages, user, markAsRead]);
  
  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);
  
  // Format timestamp
  const formatMessageTime = (timestamp: string) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    
    const isToday = 
      messageDate.getDate() === now.getDate() &&
      messageDate.getMonth() === now.getMonth() &&
      messageDate.getFullYear() === now.getFullYear();
    
    if (isToday) {
      return format(messageDate, 'h:mm a');
    } else {
      return format(messageDate, 'MMM d, h:mm a');
    }
  };
  
  const handleSend = () => {
    if (newMessage.trim() === '') return;
    
    const conversation = conversations.find(conv => conv.id === selectedConversation);
    if (conversation) {
      const receiverId = conversation.participants.find(p => p !== user?.id);
      
      if (receiverId) {
        sendMessage(receiverId, newMessage);
        setNewMessage('');
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold font-heading mb-6">Messages</h1>
        
        <div className="bg-card border rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-3 h-[600px]">
          {/* Conversations List */}
          <div className="border-r md:col-span-1">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Conversations</h2>
            </div>
            <ScrollArea className="h-[calc(600px-65px)]">
              {contactUsers.length > 0 ? (
                contactUsers.map(contact => (
                  <div 
                    key={contact.id}
                    className={`p-4 border-b cursor-pointer hover:bg-accent/50 transition-colors ${
                      selectedConversation === contact.conversationId ? 'bg-accent' : ''
                    }`}
                    onClick={() => setSelectedConversation(contact.conversationId)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={contact.image} alt={contact.name} />
                        <AvatarFallback>{contact.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-medium">{contact.name}</h3>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(contact.lastMessageTimestamp), 'MMM d')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {contact.lastMessage}
                        </p>
                      </div>
                      {contact.unreadCount > 0 && (
                        <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                          {contact.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  No conversations yet
                </div>
              )}
            </ScrollArea>
          </div>
          
          {/* Messages Area */}
          <div className="md:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b flex items-center gap-3">
                  {(() => {
                    const contact = contactUsers.find(c => c.conversationId === selectedConversation);
                    return contact ? (
                      <>
                        <Avatar>
                          <AvatarImage src={contact.image} alt={contact.name} />
                          <AvatarFallback>{contact.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{contact.name}</h3>
                        </div>
                      </>
                    ) : null;
                  })()}
                </div>
                
                {/* Messages */}
                <ScrollArea className="flex-grow p-4">
                  <div className="space-y-4">
                    {conversationMessages.map(msg => {
                      const isCurrentUser = msg.senderId === user?.id;
                      
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className="flex items-end gap-2 max-w-[80%]">
                            {!isCurrentUser && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage 
                                  src={contactUsers.find(c => c.id === msg.senderId)?.image} 
                                  alt={msg.senderName} 
                                />
                                <AvatarFallback>{msg.senderName[0]}</AvatarFallback>
                              </Avatar>
                            )}
                            <div>
                              <div 
                                className={`rounded-lg p-3 ${
                                  isCurrentUser 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'bg-accent'
                                }`}
                              >
                                <p>{msg.content}</p>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 px-1">
                                {formatMessageTime(msg.timestamp)}
                              </p>
                            </div>
                            {isCurrentUser && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.profileImage} alt={user?.name} />
                                <AvatarFallback>{user?.name[0]}</AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                {/* Message Input */}
                <div className="p-4 border-t flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow"
                  />
                  <Button onClick={handleSend}>Send</Button>
                </div>
              </>
            ) : (
              <div className="flex-grow flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
