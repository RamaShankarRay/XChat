import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MessageCircle, UserPlus } from 'lucide-react';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from '@/types';

interface UserSearchProps {
  onUserSelect: (userId: string) => void;
  onClose: () => void;
}

export default function UserSearch({ onUserSelect, onClose }: UserSearchProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (term: string) => {
    if (!term.trim() || !user) return;

    setLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('email', '>=', term.toLowerCase()),
        where('email', '<=', term.toLowerCase() + '\uf8ff')
      );
      
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs
        .map(doc => ({ ...doc.data(), uid: doc.id }) as User)
        .filter(u => u.uid !== user.uid); // Exclude current user
      
      setSearchResults(users);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const createChat = async (selectedUser: User) => {
    if (!user) return;

    try {
      // Create new chat
      await addDoc(collection(db, 'chats'), {
        participants: [user.uid, selectedUser.uid],
        lastMessage: '',
        lastMessageTime: Timestamp.now(),
      });

      onUserSelect(selectedUser.uid);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        searchUsers(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-whatsapp-dark-surface rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">New Chat</h2>
            <Button onClick={onClose} variant="ghost" size="sm">×</Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-100 dark:bg-whatsapp-dark-elevated border-none focus:ring-2 focus:ring-whatsapp-green"
            />
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-green"></div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="p-2">
              {searchResults.map((searchUser) => (
                <div
                  key={searchUser.uid}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-whatsapp-dark-elevated cursor-pointer"
                  onClick={() => createChat(searchUser)}
                >
                  <img 
                    src={searchUser.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"} 
                    alt={searchUser.displayName} 
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {searchUser.displayName}
                    </h4>
                    <p className="text-sm text-whatsapp-text-secondary">
                      {searchUser.email}
                    </p>
                    {searchUser.bio && (
                      <p className="text-xs text-whatsapp-text-secondary truncate">
                        {searchUser.bio}
                      </p>
                    )}
                  </div>
                  <MessageCircle className="w-5 h-5 text-whatsapp-green" />
                </div>
              ))}
            </div>
          ) : searchTerm && !loading ? (
            <div className="text-center p-8">
              <UserPlus className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-whatsapp-text-secondary">No users found</p>
            </div>
          ) : (
            <div className="text-center p-8">
              <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-whatsapp-text-secondary">Search for users to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}