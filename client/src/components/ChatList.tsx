import { Chat } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface ChatListProps {
  chats: Chat[];
  onChatSelect: (chat: Chat) => void;
  activeChat: Chat | null;
}

export default function ChatList({ chats, onChatSelect, activeChat }: ChatListProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getContactInfo = (chat: Chat) => {
    // Mock contact data - in real app, fetch from user collection
    const mockContacts = [
      {
        id: 'user1',
        name: 'Sarah Wilson',
        photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80',
        online: true
      },
      {
        id: 'user2',
        name: 'Mike Johnson',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80',
        online: false
      },
      {
        id: 'user3',
        name: '🇳🇵 Ravi Sharma',
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80',
        online: true
      }
    ];
    
    return mockContacts[Math.floor(Math.random() * mockContacts.length)];
  };

  if (chats.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <i className="fas fa-comments text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
          <p className="text-whatsapp-text-secondary">No chats yet</p>
          <p className="text-sm text-whatsapp-text-secondary mt-1">Start a conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-1 p-2">
        {chats.map((chat) => {
          const contact = getContactInfo(chat);
          const isActive = activeChat?.id === chat.id;
          
          return (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat)}
              className={`flex items-center p-3 rounded-lg cursor-pointer group transition-colors ${
                isActive 
                  ? 'bg-whatsapp-green/10 dark:bg-whatsapp-green/20' 
                  : 'hover:bg-gray-50 dark:hover:bg-whatsapp-dark-elevated'
              }`}
            >
              <div className="relative mr-3">
                <img 
                  src={contact.photo} 
                  alt={contact.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                  contact.online ? 'bg-whatsapp-online' : 'bg-gray-400'
                }`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                    {contact.name}
                  </h4>
                  <div className="flex flex-col items-end space-y-1">
                    <span className="text-xs text-whatsapp-text-secondary">
                      {formatTime(chat.lastMessageTime)}
                    </span>
                    {chat.unreadCount && chat.unreadCount > 0 && (
                      <span className="bg-whatsapp-green text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center mt-1">
                  <i className="fas fa-check text-blue-500 text-xs mr-1"></i>
                  <p className="text-sm text-whatsapp-text dark:text-whatsapp-text-secondary truncate">
                    {chat.lastMessage || 'No messages yet'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
