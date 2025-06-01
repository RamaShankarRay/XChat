import { useState, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import ChatList from '@/components/ChatList';
import ChatArea from '@/components/ChatArea';
import StatusScreen from '@/components/StatusScreen';
import CallsScreen from '@/components/CallsScreen';
import UserSearch from '@/components/UserSearch';
import MobileBottomNav from '@/components/MobileBottomNav';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquarePlus } from 'lucide-react';
import { Chat } from '@/types';

export default function MainApp() {
  const { user } = useAuth();
  const { chats } = useChat();
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [activeTab, setActiveTab] = useState('chats');
  const [isMobile, setIsMobile] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleChatSelect = (chat: Chat) => {
    setActiveChat(chat);
  };

  const handleUserSelect = (userId: string) => {
    // Find or create chat with this user
    const existingChat = chats.find(chat => 
      chat.participants.includes(userId) && chat.participants.includes(user?.uid || '')
    );
    
    if (existingChat) {
      setActiveChat(existingChat);
    }
    setShowUserSearch(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'status':
        return <StatusScreen />;
      case 'calls':
        return <CallsScreen />;
      case 'chats':
      default:
        return (
          <ChatList 
            chats={chats} 
            onChatSelect={handleChatSelect}
            activeChat={activeChat}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-whatsapp-bg dark:bg-whatsapp-dark-bg">
      {/* Desktop Sidebar / Mobile Full Screen Chat List */}
      <div className={`${isMobile ? (activeChat ? 'hidden' : 'flex') : 'hidden lg:flex'} lg:w-80 bg-white dark:bg-whatsapp-dark-surface border-r border-gray-200 dark:border-gray-700 flex-col w-full`}>
        {/* Header */}
        <div className="p-4 bg-whatsapp-green">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src={user?.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80"} 
                  alt="User Avatar" 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-whatsapp-online border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h3 className="text-white font-semibold">{user?.displayName}</h3>
                <p className="text-white/80 text-sm">Online</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {activeTab === 'chats' && (
                <Button
                  onClick={() => setShowUserSearch(true)}
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10"
                >
                  <MessageSquarePlus className="w-5 h-5" />
                </Button>
              )}
              <button className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10">
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-white dark:bg-whatsapp-dark-surface border-b border-gray-200 dark:border-gray-700">
          {['chats', 'status', 'calls'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-center font-medium capitalize ${
                activeTab === tab
                  ? 'text-whatsapp-green border-b-2 border-whatsapp-green'
                  : 'text-whatsapp-text dark:text-whatsapp-text-secondary hover:text-whatsapp-green'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="Search or start new chat"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-whatsapp-dark-elevated rounded-lg border-none focus:ring-2 focus:ring-whatsapp-green text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${isMobile && !activeChat ? 'hidden' : 'flex'}`}>
        {activeChat ? (
          <ChatArea 
            chat={activeChat} 
            onBack={() => setActiveChat(null)}
            isMobile={isMobile}
          />
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center bg-whatsapp-bg dark:bg-whatsapp-dark-bg">
            <div className="text-center">
              <div className="w-64 h-64 mx-auto mb-8 opacity-20">
                <i className="fas fa-comments text-8xl text-whatsapp-green"></i>
              </div>
              <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Welcome to XChat
              </h2>
              <p className="text-whatsapp-text-secondary">
                Select a chat to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <MobileBottomNav 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          unreadCount={chats.reduce((total, chat) => total + (chat.unreadCount || 0), 0)}
        />
      )}

      {/* User Search Modal */}
      {showUserSearch && (
        <UserSearch 
          onUserSelect={handleUserSelect}
          onClose={() => setShowUserSearch(false)}
        />
      )}
    </div>
  );
}
