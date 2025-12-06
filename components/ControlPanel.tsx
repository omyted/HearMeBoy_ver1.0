import React, { useState } from 'react';
import { DAILY_USE_CASES } from '../constants';
import { MessageSquare, Keyboard } from 'lucide-react';

interface ControlPanelProps {
  onSelectUseCase: (text: string) => void;
  language?: 'en' | 'zh';
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onSelectUseCase, language }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-2 rounded-lg hover:bg-white/20 transition-colors"
        title={language === 'zh' ? "快速短語" : "Quick Phrases"}
      >
        <Keyboard size={20} />
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 origin-top-right">
           <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-slate-400 uppercase">
                  {language === 'zh' ? "快速短語" : "Quick Phrases"}
              </span>
              <MessageSquare size={14} className="text-slate-300" />
           </div>
           <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
              {DAILY_USE_CASES.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                        // Use text_zh if available and language is zh, else text
                        const text = (language === 'zh' && (item as any).text_zh) ? (item as any).text_zh : item.text;
                        onSelectUseCase(text);
                        setIsOpen(false);
                    }}
                    className="text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-sm text-slate-700 font-medium border border-transparent hover:border-slate-100 flex items-center gap-2"
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">
                        {(language === 'zh' && (item as any).label_zh) ? (item as any).label_zh : item.label}
                    </span>
                  </button>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;