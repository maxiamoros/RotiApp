import { useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { useChat } from '../../hooks/useChat';

const FloatingChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, setInput, isLoading, error, sendMessage } = useChat();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 ${
          isOpen ? 'bg-slate-700 text-white' : 'bg-orange-600 text-white'
        }`}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[400px] h-[550px] bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-200">
          <ChatHeader />
          {/* We override styles in ChatMessages dynamically using CSS but for now they are styled for light mode. We should make them responsive to dark mode if possible, but the widget can stay slightly light-themed inside to contrast, or we just pass a prop. Let's rely on Tailwind classes. */}
          <div className="flex-1 bg-slate-900/50 overflow-hidden flex flex-col">
            <ChatMessages messages={messages} isLoading={isLoading} error={error} />
          </div>
          <ChatInput 
            input={input} 
            setInput={setInput} 
            sendMessage={sendMessage} 
            isLoading={isLoading} 
          />
        </div>
      )}
    </div>
  );
};

export default FloatingChatWidget;
