export interface User {
  uid: string;
  email: string;
  displayName: string;
  profilePicture?: string;
  bio?: string;
  phoneNumber?: string;
  isPhoneVerified: boolean;
  status: string;
  lastSeen: Date;
  onlineStatus: boolean;
  platformUsed: string;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTime: Date;
  unreadCount?: number;
  contactName?: string;
  contactPhoto?: string;
  contactOnlineStatus?: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  messageType: 'text' | 'image' | 'video' | 'audio' | 'document';
  mediaUrl?: string;
  deliveryStatus: 'sent' | 'delivered' | 'seen';
  timestamp: Date;
  senderName?: string;
  senderPhoto?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}
