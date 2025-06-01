import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

const emojiCategories = {
  'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐'],
  'Gestures': ['👍', '👎', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
  'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝'],
  'Objects': ['📱', '💻', '⌚', '📷', '📹', '🎵', '🎶', '📞', '☎️', '📧', '📨', '📩', '📤', '📥', '📮', '🗳️'],
  'Travel': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴'],
  'Food': ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑']
};

export default function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState('Smileys');

  return (
    <div className="absolute bottom-16 left-0 right-0 bg-white dark:bg-whatsapp-dark-surface border border-gray-200 dark:border-gray-700 rounded-t-lg shadow-lg z-50">
      <div className="p-3">
        {/* Category Tabs */}
        <div className="flex space-x-1 mb-3 overflow-x-auto">
          {Object.keys(emojiCategories).map((category) => (
            <Button
              key={category}
              onClick={() => setActiveCategory(category)}
              variant={activeCategory === category ? "default" : "ghost"}
              size="sm"
              className={`whitespace-nowrap text-xs ${
                activeCategory === category 
                  ? 'bg-whatsapp-green text-white' 
                  : 'text-whatsapp-text hover:text-whatsapp-green'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Emoji Grid */}
        <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
          {emojiCategories[activeCategory as keyof typeof emojiCategories].map((emoji, index) => (
            <button
              key={index}
              onClick={() => onEmojiSelect(emoji)}
              className="text-2xl p-2 rounded hover:bg-gray-100 dark:hover:bg-whatsapp-dark-elevated transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-3">
          <Button onClick={onClose} variant="ghost" size="sm">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}