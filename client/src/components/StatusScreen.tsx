import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Plus, Camera, Eye } from 'lucide-react';
import { collection, addDoc, query, where, onSnapshot, Timestamp, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

interface Status {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  timestamp: Date;
  viewers: string[];
}

export default function StatusScreen() {
  const { user } = useAuth();
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [myStatus, setMyStatus] = useState<Status[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Listen to all statuses from last 24 hours
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const statusQuery = query(
      collection(db, 'status'),
      where('timestamp', '>', Timestamp.fromDate(yesterday)),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(statusQuery, (snapshot) => {
      const allStatuses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as Status[];

      // Separate my status from others
      const myStatuses = allStatuses.filter(status => status.userId === user.uid);
      const otherStatuses = allStatuses.filter(status => status.userId !== user.uid);

      setMyStatus(myStatuses);
      setStatuses(otherStatuses);
    });

    return unsubscribe;
  }, [user]);

  const handleStatusUpload = async (file: File) => {
    if (!user || !file) return;

    setLoading(true);
    try {
      // Upload media to Firebase Storage
      const mediaRef = ref(storage, `status/${user.uid}/${Date.now()}`);
      await uploadBytes(mediaRef, file);
      const mediaUrl = await getDownloadURL(mediaRef);

      // Create status document
      await addDoc(collection(db, 'status'), {
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.profilePicture,
        mediaUrl,
        mediaType: file.type.startsWith('video/') ? 'video' : 'image',
        timestamp: Timestamp.now(),
        viewers: [],
      });
    } catch (error) {
      console.error('Error uploading status:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatusCard = ({ status, isOwn = false }: { status: Status; isOwn?: boolean }) => (
    <div className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-whatsapp-dark-elevated cursor-pointer rounded-lg">
      <div className="relative mr-3">
        <img 
          src={status.userPhoto} 
          alt={status.userName} 
          className="w-14 h-14 rounded-full object-cover border-4 border-whatsapp-green"
        />
        {isOwn && (
          <div className="absolute bottom-0 right-0 bg-whatsapp-green text-white rounded-full p-1">
            <Plus className="w-3 h-3" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 dark:text-white">
          {isOwn ? 'My Status' : status.userName}
        </h4>
        <p className="text-sm text-whatsapp-text-secondary">
          {status.timestamp.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          })}
        </p>
      </div>
      {!isOwn && status.viewers.length > 0 && (
        <div className="flex items-center text-whatsapp-text-secondary">
          <Eye className="w-4 h-4 mr-1" />
          <span className="text-sm">{status.viewers.length}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-whatsapp-dark-surface">
      {/* My Status Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">My Status</h3>
        
        {myStatus.length > 0 ? (
          <div className="space-y-2">
            {myStatus.map(status => (
              <StatusCard key={status.id} status={status} isOwn />
            ))}
          </div>
        ) : (
          <div className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-whatsapp-dark-elevated cursor-pointer rounded-lg">
            <div className="relative mr-3">
              <img 
                src={user?.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"} 
                alt="My Status" 
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-whatsapp-green text-white rounded-full p-1">
                <Plus className="w-3 h-3" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">My Status</h4>
              <p className="text-sm text-whatsapp-text-secondary">Tap to add status update</p>
            </div>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => e.target.files?.[0] && handleStatusUpload(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={loading}
            />
          </div>
        )}
      </div>

      {/* Recent Updates */}
      {statuses.length > 0 && (
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Recent Updates</h3>
          <div className="space-y-2">
            {statuses.map(status => (
              <StatusCard key={status.id} status={status} />
            ))}
          </div>
        </div>
      )}

      {statuses.length === 0 && myStatus.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center p-8">
          <Camera className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No Status Updates
          </h3>
          <p className="text-whatsapp-text-secondary">
            Share photos and videos with your contacts
          </p>
        </div>
      )}
    </div>
  );
}