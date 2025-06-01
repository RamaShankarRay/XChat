import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  doc, 
  updateDoc,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Message, Chat } from '@/types';
import { useAuth } from './useAuth';

export function useChat(chatId?: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Listen to messages in a specific chat
  useEffect(() => {
    if (!chatId || !user) return;

    setLoading(true);
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as Message[];
      
      setMessages(messagesData);
      setLoading(false);
    });

    return unsubscribe;
  }, [chatId, user]);

  // Listen to user's chats
  useEffect(() => {
    if (!user) return;

    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef, 
      where('participants', 'array-contains', user.uid),
      orderBy('lastMessageTime', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastMessageTime: doc.data().lastMessageTime?.toDate() || new Date(),
      })) as Chat[];
      
      setChats(chatsData);
    });

    return unsubscribe;
  }, [user]);

  const sendMessage = async (content: string, chatId: string, messageType: string = 'text') => {
    if (!user || !content.trim()) return;

    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const messageData = {
        senderId: user.uid,
        content: content.trim(),
        messageType,
        deliveryStatus: 'sent',
        timestamp: Timestamp.now(),
        senderName: user.displayName,
        senderPhoto: user.profilePicture,
      };

      await addDoc(messagesRef, messageData);

      // Update chat's last message
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        lastMessage: content.trim(),
        lastMessageTime: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const createChat = async (participantId: string): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const chatsRef = collection(db, 'chats');
      const chatData = {
        participants: [user.uid, participantId],
        lastMessage: '',
        lastMessageTime: Timestamp.now(),
      };

      const docRef = await addDoc(chatsRef, chatData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  };

  const updateTypingStatus = async (chatId: string, isTyping: boolean) => {
    if (!user) return;

    try {
      const typingRef = doc(db, 'chats', chatId, 'typing', user.uid);
      if (isTyping) {
        await updateDoc(typingRef, {
          isTyping: true,
          timestamp: Timestamp.now(),
        });
      } else {
        await updateDoc(typingRef, {
          isTyping: false,
        });
      }
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  };

  return {
    messages,
    chats,
    loading,
    typingUsers,
    sendMessage,
    createChat,
    updateTypingStatus,
  };
}
