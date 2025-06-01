import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Smile, Paperclip, Mic, Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload - in real app, upload to Firebase Storage
      console.log('File selected:', file);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Handle voice recording - in real app, use MediaRecorder API
  };

  return (
    <div className="bg-white dark:bg-whatsapp-dark-surface border-t border-gray-200 dark:border-gray-700 p-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="p-2 text-whatsapp-text hover:text-whatsapp-green"
        >
          <Smile className="w-5 h-5" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleFileUpload}
          className="p-2 text-whatsapp-text hover:text-whatsapp-green"
        >
          <Paperclip className="w-5 h-5" />
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full py-3 px-4 pr-12 bg-gray-100 dark:bg-whatsapp-dark-elevated rounded-full border-none focus:ring-2 focus:ring-whatsapp-green text-gray-900 dark:text-white"
          />
          {message.trim() ? (
            <Button
              type="submit"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-whatsapp-green text-white rounded-full p-2 hover:bg-whatsapp-dark-green transition-colors"
            >
              <Send className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleRecording}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors ${
                isRecording 
                  ? 'bg-red-500 text-white' 
                  : 'text-whatsapp-text hover:text-whatsapp-green hover:bg-gray-100 dark:hover:bg-whatsapp-dark-elevated'
              }`}
            >
              <Mic className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
