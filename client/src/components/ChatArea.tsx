import { useEffect, useRef, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { Chat, Message } from '@/types';
import { ArrowLeft, Video, Phone, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatAreaProps {
  chat: Chat;
  onBack: () => void;
  isMobile: boolean;
}

export default function ChatArea({ chat, onBack, isMobile }: ChatAreaProps) {
  const { user } = useAuth();
  const { messages, sendMessage, loading } = useChat(chat.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    try {
      await sendMessage(content, chat.id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getContactInfo = () => {
    // Mock contact data - in real app, fetch from participants
    const mockContacts = [
      {
        name: 'Sarah Wilson',
        photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80',
        online: true
      },
      {
        name: 'Mike Johnson',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80',
        online: false
      },
      {
        name: '🇳🇵 Ravi Sharma',
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80',
        online: true
      }
    ];
    
    return mockContacts[0]; // Return first contact for demo
  };

  const contact = getContactInfo();

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white dark:bg-whatsapp-dark-surface border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2 text-whatsapp-text hover:text-whatsapp-green"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div className="relative">
              <img 
                src={contact.photo} 
                alt={contact.name} 
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                contact.online ? 'bg-whatsapp-online' : 'bg-gray-400'
              }`}></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {contact.name}
              </h3>
              <p className="text-sm text-whatsapp-text-secondary">
                {contact.online ? 'Online' : 'Last seen recently'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-whatsapp-text hover:text-whatsapp-green"
            >
              <Video className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-whatsapp-text hover:text-whatsapp-green"
            >
              <Phone className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-whatsapp-text hover:text-whatsapp-green"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="chat-bg" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="0.5" fill="%23f0f2f5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23chat-bg)"/></svg>')`
        }}
      >
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-green"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <i className="fas fa-comments text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
            <p className="text-whatsapp-text-secondary text-lg">No messages yet</p>
            <p className="text-whatsapp-text-secondary">Send a message to start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isOwnMessage = message.senderId === user?.uid;
              
              return (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 animate-fade-in ${
                    isOwnMessage ? 'justify-end' : ''
                  }`}
                >
                  {!isOwnMessage && (
                    <img 
                      src={contact.photo} 
                      alt="Contact" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <div className="max-w-xs lg:max-w-md">
                    <div className={`rounded-2xl p-3 shadow-sm ${
                      isOwnMessage 
                        ? 'bg-whatsapp-light-green dark:bg-whatsapp-green rounded-tr-md' 
                        : 'bg-white dark:bg-whatsapp-dark-surface rounded-tl-md'
                    }`}>
                      {message.messageType === 'image' && message.mediaUrl && (
                        <img 
                          src={message.mediaUrl} 
                          alt="Shared image" 
                          className="rounded-xl w-full h-auto max-w-sm mb-2"
                        />
                      )}
                      <p className="text-gray-900 dark:text-white break-words">
                        {message.content}
                      </p>
                      <div className="flex items-center justify-end mt-1 space-x-1">
                        <span className={`text-xs ${
                          isOwnMessage 
                            ? 'text-gray-600 dark:text-gray-300' 
                            : 'text-whatsapp-text-secondary'
                        }`}>
                          {formatTime(message.timestamp)}
                        </span>
                        {isOwnMessage && (
                          <i className={`fas text-xs ${
                            message.deliveryStatus === 'seen' 
                              ? 'fa-check-double text-blue-500' 
                              : message.deliveryStatus === 'delivered'
                              ? 'fa-check-double text-gray-500'
                              : 'fa-check text-gray-500'
                          }`}></i>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Typing Indicator */}
            {isTyping && <TypingIndicator contact={contact} />}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
