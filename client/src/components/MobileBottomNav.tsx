import { useLocation } from 'wouter';
import { MessageCircle, Users, Phone, Settings } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadCount: number;
}

export default function MobileBottomNav({ activeTab, onTabChange, unreadCount }: MobileBottomNavProps) {
  const [, setLocation] = useLocation();

  const handleTabClick = (tab: string) => {
    if (tab === 'settings') {
      setLocation('/settings');
    } else {
      onTabChange(tab);
    }
  };

  const tabs = [
    { id: 'chats', icon: MessageCircle, label: 'Chats', badge: unreadCount },
    { id: 'status', icon: Users, label: 'Status' },
    { id: 'calls', icon: Phone, label: 'Calls' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-whatsapp-dark-surface border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex-1 py-3 px-4 text-center relative transition-colors ${
                isActive 
                  ? 'text-whatsapp-green' 
                  : 'text-whatsapp-text dark:text-whatsapp-text-secondary'
              }`}
            >
              <Icon className="w-6 h-6 mx-auto" />
              <div className="text-xs mt-1 font-medium">{tab.label}</div>
              {tab.badge && tab.badge > 0 && (
                <div className="absolute top-1 right-1/2 transform translate-x-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {tab.badge > 99 ? '99+' : tab.badge}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
