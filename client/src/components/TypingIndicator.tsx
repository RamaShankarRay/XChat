interface TypingIndicatorProps {
  contact: {
    name: string;
    photo: string;
  };
}

export default function TypingIndicator({ contact }: TypingIndicatorProps) {
  return (
    <div className="flex items-start space-x-2 animate-fade-in">
      <img 
        src={contact.photo} 
        alt="Contact" 
        className="w-8 h-8 rounded-full object-cover"
      />
      <div className="max-w-xs lg:max-w-md">
        <div className="bg-white dark:bg-whatsapp-dark-surface rounded-2xl rounded-tl-md p-3 shadow-sm">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
