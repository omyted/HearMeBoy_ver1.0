import React, { useEffect, useRef } from 'react';
import { Message, SenderType } from '../types';
import { User, MessageSquareText, Hand } from 'lucide-react';

interface ChatInterfaceProps {
  messages: Message[];
  language?: 'en' | 'zh';
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, language }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-med-primary/10 p-2 rounded-lg">
            <MessageSquareText className="text-med-primary w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-med-dark leading-tight">
                {language === 'zh' ? "即時對話紀錄" : "Live Session Transcript"}
            </h2>
            <p className="text-[10px] text-slate-500 font-medium">
                {language === 'zh' ? "即時溝通日誌" : "Real-time communication log"}
            </p>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-slate-50/30">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
            <p className="font-medium text-sm">
                {language === 'zh' ? "尚無訊息。開始溝通吧。" : "No messages yet. Start communicating."}
            </p>
          </div>
        )}

        {messages.map((msg) => {
          // SenderType.USER maps to the Camera Input (Gesture)
          // SenderType.PARTNER maps to the Text Input (Typed)
          const isGestureInput = msg.sender === SenderType.USER;
          
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-3 ${!isGestureInput ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2 duration-300`}
            >
              {/* Avatar Icon */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${
                isGestureInput ? 'bg-med-secondary text-white border-med-secondary' : 'bg-slate-700 text-white border-slate-700'
              }`}>
                {isGestureInput ? <Hand size={14} /> : <User size={14} />}
              </div>

              {/* Bubble */}
              <div className="flex flex-col gap-1 max-w-[85%]">
                {isGestureInput && (
                   <span className="text-[10px] font-bold text-med-secondary ml-1 uppercase tracking-wider">
                      {language === 'zh' ? "手勢轉換" : "Transformed Gesture"}
                   </span>
                )}
                
                <div
                  className={`px-5 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                    !isGestureInput
                      ? 'bg-slate-800 text-white rounded-br-none'
                      : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
                
                <span className={`text-[10px] text-slate-300 font-medium ${!isGestureInput ? 'text-right mr-1' : 'ml-1'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatInterface;