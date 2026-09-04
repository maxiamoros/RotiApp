const ChatInput = ({ input, setInput, sendMessage, isLoading }) => {
  return (
    <div className="p-4 bg-roti-cream border-t border-roti-cream/20">
      <form onSubmit={sendMessage} className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pregúntame sobre el stock o los pedidos..."
          className="w-full pl-5 pr-14 py-4 rounded-xl border border-roti-cream/20 bg-roti-cream focus:bg-roti-cream focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-700"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="absolute right-3 p-2 bg-roti-primary hover:bg-roti-secondary text-roti-cream rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
