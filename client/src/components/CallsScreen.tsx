import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Video, Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock } from 'lucide-react';
import { collection, addDoc, query, where, onSnapshot, Timestamp, orderBy, or } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Call {
  id: string;
  callerId: string;
  callerName: string;
  callerPhoto: string;
  receiverId: string;
  receiverName: string;
  receiverPhoto: string;
  callType: 'audio' | 'video';
  status: 'missed' | 'answered' | 'declined';
  duration?: number;
  timestamp: Date;
}

export default function CallsScreen() {
  const { user } = useAuth();
  const [calls, setCalls] = useState<Call[]>([]);
  const [activeCall, setActiveCall] = useState<Call | null>(null);

  useEffect(() => {
    if (!user) return;

    // Listen to calls where user is either caller or receiver
    const callsQuery = query(
      collection(db, 'calls'),
      or(
        where('callerId', '==', user.uid),
        where('receiverId', '==', user.uid)
      ),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(callsQuery, (snapshot) => {
      const callsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as Call[];
      
      setCalls(callsData);
    });

    return unsubscribe;
  }, [user]);

  const initiateCall = async (receiverId: string, receiverName: string, receiverPhoto: string, callType: 'audio' | 'video') => {
    if (!user) return;

    try {
      const callData = {
        callerId: user.uid,
        callerName: user.displayName,
        callerPhoto: user.profilePicture || '',
        receiverId,
        receiverName,
        receiverPhoto,
        callType,
        status: 'answered', // Simulated for demo
        duration: Math.floor(Math.random() * 300) + 30, // Random duration 30s-5min
        timestamp: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'calls'), callData);
      console.log('Call initiated:', docRef.id);
    } catch (error) {
      console.error('Error initiating call:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

  const getCallIcon = (call: Call) => {
    const isIncoming = call.receiverId === user?.uid;
    
    if (call.status === 'missed') {
      return <PhoneMissed className="w-4 h-4 text-red-500" />;
    } else if (isIncoming) {
      return <PhoneIncoming className="w-4 h-4 text-green-500" />;
    } else {
      return <PhoneOutgoing className="w-4 h-4 text-blue-500" />;
    }
  };

  const getContactInfo = (call: Call) => {
    const isIncoming = call.receiverId === user?.uid;
    return {
      name: isIncoming ? call.callerName : call.receiverName,
      photo: isIncoming ? call.callerPhoto : call.receiverPhoto,
    };
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-whatsapp-dark-surface">
      {/* Header with quick call buttons */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Calls</h2>
          <div className="flex space-x-2">
            <Button
              onClick={() => initiateCall('demo-user-1', 'Sarah Wilson', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80', 'audio')}
              variant="outline"
              size="sm"
              className="border-whatsapp-green text-whatsapp-green hover:bg-whatsapp-green hover:text-white"
            >
              <Phone className="w-4 h-4 mr-2" />
              Audio Call
            </Button>
            <Button
              onClick={() => initiateCall('demo-user-2', 'Mike Johnson', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80', 'video')}
              variant="outline"
              size="sm"
              className="border-whatsapp-green text-whatsapp-green hover:bg-whatsapp-green hover:text-white"
            >
              <Video className="w-4 h-4 mr-2" />
              Video Call
            </Button>
          </div>
        </div>
      </div>

      {/* Calls List */}
      <div className="p-2">
        {calls.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Phone className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No Call History
            </h3>
            <p className="text-whatsapp-text-secondary">
              Start making calls to see your history here
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {calls.map((call) => {
              const contact = getContactInfo(call);
              
              return (
                <div
                  key={call.id}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-whatsapp-dark-elevated cursor-pointer"
                >
                  <div className="relative mr-3">
                    <img 
                      src={contact.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"} 
                      alt={contact.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                        {contact.name}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-whatsapp-text-secondary">
                          {formatTime(call.timestamp)}
                        </span>
                        <Button
                          onClick={() => initiateCall(
                            call.receiverId === user?.uid ? call.callerId : call.receiverId,
                            contact.name,
                            contact.photo,
                            call.callType
                          )}
                          variant="ghost"
                          size="sm"
                          className="p-1 text-whatsapp-green hover:bg-whatsapp-green/10"
                        >
                          {call.callType === 'video' ? 
                            <Video className="w-4 h-4" /> : 
                            <Phone className="w-4 h-4" />
                          }
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-1 space-x-2">
                      {getCallIcon(call)}
                      <span className={`text-sm ${
                        call.status === 'missed' ? 'text-red-500' : 'text-whatsapp-text-secondary'
                      }`}>
                        {call.status === 'missed' ? 'Missed' : ''}
                        {call.callType === 'video' ? 'Video call' : 'Voice call'}
                      </span>
                      {call.duration && (
                        <>
                          <span className="text-whatsapp-text-secondary">•</span>
                          <div className="flex items-center text-whatsapp-text-secondary">
                            <Clock className="w-3 h-3 mr-1" />
                            <span className="text-sm">{formatDuration(call.duration)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}