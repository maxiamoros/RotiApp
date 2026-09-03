import { useEffect, useRef } from 'react';

/** Renderiza markdown básico: **negrita**, *cursiva*, \n, listas */
const renderMarkdown = (text) => {
  return text
    .split('\n')
    .map((line, i) => {
      // Lista con guión
      if (line.startsWith('- ')) {
        const content = formatInline(line.slice(2));
        return <li key={i} className="ml-3 list-disc" dangerouslySetInnerHTML={{ __html: content }} />;
      }
      // Lista numerada
      if (/^\d+\.\s/.test(line)) {
        const content = formatInline(line.replace(/^\d+\.\s/, ''));
        return <li key={i} className="ml-3 list-decimal" dangerouslySetInnerHTML={{ __html: content }} />;
      }
      // Línea vacía
      if (!line.trim()) return <br key={i} />;
      // Párrafo normal
      return (
        <p key={i} className="leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
      );
    });
};

const formatInline = (text) =>
  text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-white/10 px-1 rounded text-xs font-mono">$1</code>');

const ChatMessages = ({ messages, isLoading }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, index) => (
        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          {msg.role === 'assistant' && (
            <div className="w-7 h-7 rounded-full bg-orange-600/20 border border-orange-500/30
                            flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-0.5">
              🤖
            </div>
          )}
          <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
            msg.role === 'user'
              ? 'bg-orange-600 text-white rounded-tr-none'
              : 'bg-slate-700/80 border border-slate-600/50 text-slate-200 rounded-tl-none'
          }`}>
            <div className="space-y-1">
              {renderMarkdown(msg.content)}
            </div>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-orange-600/20 border border-orange-500/30
                          flex items-center justify-center text-sm flex-shrink-0">
            🤖
          </div>
          <div className="bg-slate-700/80 border border-slate-600/50 rounded-2xl rounded-tl-none
                          px-4 py-3 flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
