import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, User, Lock, Moon, Bell, Globe, HelpCircle, LogOut, Edit, Camera } from 'lucide-react';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    try {
      await signOut();
      setLocation('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleBack = () => {
    setLocation('/home');
  };

  return (
    <div className="min-h-screen bg-whatsapp-bg dark:bg-whatsapp-dark-bg">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-whatsapp-green p-4">
          <div className="flex items-center space-x-4">
            <button onClick={handleBack} className="text-white/80 hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-white text-xl font-semibold">Settings</h1>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white dark:bg-whatsapp-dark-surface p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={user?.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80"} 
                alt="User Avatar" 
                className="w-16 h-16 rounded-full object-cover"
              />
              <button className="absolute bottom-0 right-0 bg-whatsapp-green text-white rounded-full p-1">
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user?.displayName}
              </h2>
              <p className="text-whatsapp-text-secondary">
                {user?.bio || 'Available'}
              </p>
              {user?.phoneNumber && (
                <p className="text-sm text-whatsapp-text-secondary">
                  {user.phoneNumber}
                </p>
              )}
            </div>
            <button className="text-whatsapp-green">
              <Edit className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Options */}
        <div className="bg-white dark:bg-whatsapp-dark-surface">
          {/* Account */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-whatsapp-dark-elevated">
              <div className="flex items-center space-x-4">
                <User className="text-whatsapp-green w-6 h-6" />
                <span className="text-gray-900 dark:text-white">Account</span>
              </div>
              <i className="fas fa-chevron-right text-whatsapp-text-secondary"></i>
            </button>
          </div>

          {/* Privacy */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-whatsapp-dark-elevated">
              <div className="flex items-center space-x-4">
                <Lock className="text-whatsapp-green w-6 h-6" />
                <span className="text-gray-900 dark:text-white">Privacy</span>
              </div>
              <i className="fas fa-chevron-right text-whatsapp-text-secondary"></i>
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Moon className="text-whatsapp-green w-6 h-6" />
                <span className="text-gray-900 dark:text-white">Dark Mode</span>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
                className="data-[state=checked]:bg-whatsapp-green"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-whatsapp-dark-elevated">
              <div className="flex items-center space-x-4">
                <Bell className="text-whatsapp-green w-6 h-6" />
                <span className="text-gray-900 dark:text-white">Notifications</span>
              </div>
              <i className="fas fa-chevron-right text-whatsapp-text-secondary"></i>
            </button>
          </div>

          {/* Language (Nepali Special) */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-whatsapp-dark-elevated">
              <div className="flex items-center space-x-4">
                <Globe className="text-whatsapp-green w-6 h-6" />
                <span className="text-gray-900 dark:text-white">🇳🇵 भाषा / Language</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-whatsapp-text-secondary text-sm">English</span>
                <i className="fas fa-chevron-right text-whatsapp-text-secondary"></i>
              </div>
            </button>
          </div>

          {/* Help */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-whatsapp-dark-elevated">
              <div className="flex items-center space-x-4">
                <HelpCircle className="text-whatsapp-green w-6 h-6" />
                <span className="text-gray-900 dark:text-white">Help</span>
              </div>
              <i className="fas fa-chevron-right text-whatsapp-text-secondary"></i>
            </button>
          </div>

          {/* Logout */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full p-4 flex items-center justify-start space-x-4 hover:bg-gray-50 dark:hover:bg-whatsapp-dark-elevated text-red-600 dark:text-red-400 h-auto"
            >
              <LogOut className="w-6 h-6" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center">
          <p className="text-whatsapp-text-secondary text-sm">XChat v1.0.0</p>
          <p className="text-whatsapp-text-secondary text-xs mt-1">🇳🇵 Made with ❤️ for Nepal</p>
        </div>
      </div>
    </div>
  );
}
