const ChatHeader = () => {
  return (
    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
          <span className="text-xl">🤖</span>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Gemini 1.5 Flash</h3>
          <p className="text-xs text-slate-500">Conectado a la base de datos de Prisma</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <span className="text-sm font-medium text-emerald-600">En línea</span>
      </div>
    </div>
  );
};

export default ChatHeader;
