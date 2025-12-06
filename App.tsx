import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Send, Settings, Volume2, Sparkles, BrainCircuit, Minimize2, Languages, Globe } from 'lucide-react';
import CameraFeed from './components/CameraFeed';
import ChatInterface from './components/ChatInterface';
import MotionAvatar from './components/MotionAvatar';
import ControlPanel from './components/ControlPanel';
import StartupModal from './components/StartupModal';
import { Message, SenderType, IntentType } from './types';
import { translateTextToGestureSequence, transformGestureToSentence } from './services/geminiService';
import { SPEECHLESS_DICTIONARY, UI_TRANSLATIONS } from './constants';

const App: React.FC = () => {
  // --- STATE INITIALIZATION WITH AUTO-DETECT ---
  const [language, setLanguage] = useState<'en' | 'zh'>(() => {
    // 1. Check Local Storage
    const saved = localStorage.getItem('speechless_bridge_lang');
    if (saved === 'en' || saved === 'zh') return saved;

    // 2. Check System Language
    if (typeof navigator !== 'undefined') {
      const sysLang = navigator.language.toLowerCase();
      // Default to 'zh' if system is Chinese, otherwise 'en'
      if (sysLang.startsWith('zh')) return 'zh';
    }
    return 'en';
  });

  // State for flashing effect
  const [isFlashing, setIsFlashing] = useState(false);

  // Persist language choice
  useEffect(() => {
    localStorage.setItem('speechless_bridge_lang', language);
  }, [language]);

  const toggleLanguage = () => {
      setLanguage(prev => prev === 'en' ? 'zh' : 'en');
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 3000); // Flash for 3 seconds
  };

  const t = UI_TRANSLATIONS[language];

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Store both languages to allow instant toggling of the visual context
  const [currentSentence, setCurrentSentence] = useState<{en: string, zh: string}>({ en: "", zh: "" });
  
  const [thoughtProcess, setThoughtProcess] = useState<{en: string, zh: string}>({ en: "", zh: "" });
  const [gestureSequence, setGestureSequence] = useState<IntentType[]>([]);

  const [isSimulating, setIsSimulating] = useState(false);
  const [isStartupModalOpen, setIsStartupModalOpen] = useState(true);
  const [isAnalysisVisible, setIsAnalysisVisible] = useState(false);

  const lastGestureTime = useRef<number>(0);
  const lastGestureType = useRef<IntentType | null>(null);

  // --- HANDLERS ---
  const handleGestureDetected = useCallback(async (detectedIntent: IntentType) => {
    if (detectedIntent === IntentType.UNKNOWN) return;

    const now = Date.now();
    if ((detectedIntent === lastGestureType.current && now - lastGestureTime.current < 4000) || (now - lastGestureTime.current < 2000)) {
        return;
    }

    lastGestureTime.current = now;
    lastGestureType.current = detectedIntent;

    const dictionaryItem = SPEECHLESS_DICTIONARY[detectedIntent];
    
    setIsProcessing(true);

    try {
        // Transform Gesture -> Natural Sentence (Returns Dual Language Object now)
        const naturalSentenceObj = await transformGestureToSentence(detectedIntent);

        setCurrentSentence(naturalSentenceObj);
        
        setThoughtProcess({ 
            en: `Detected Gesture: ${dictionaryItem?.label || detectedIntent}. Transformed to natural speech.`,
            zh: `偵測到手勢：${dictionaryItem?.label_zh || detectedIntent}。已轉換為自然語音。`
        });
        setGestureSequence([detectedIntent]);

        const newMessage: Message = {
            id: Date.now().toString(),
            text: language === 'zh' ? naturalSentenceObj.zh : naturalSentenceObj.en,
            sender: SenderType.USER,
            timestamp: new Date(),
            intent: detectedIntent,
            isMotionDerived: true
        };
        setMessages(prev => [...prev, newMessage]);
    } catch (e) {
        // Fallback
        const fallbackEn = dictionaryItem?.label || detectedIntent;
        const fallbackZh = dictionaryItem?.label_zh || detectedIntent;
        
        setCurrentSentence({ en: fallbackEn, zh: fallbackZh });
        
        setGestureSequence([detectedIntent]);
        const newMessage: Message = { 
            id: Date.now().toString(), 
            text: language === 'zh' ? fallbackZh : fallbackEn, 
            sender: SenderType.USER, 
            timestamp: new Date(), 
            intent: detectedIntent, 
            isMotionDerived: true 
        };
        setMessages(prev => [...prev, newMessage]);
    } finally {
        setIsProcessing(false);
    }
  }, [language]);

  const processPartnerText = async (text: string) => {
    if (!text.trim() || isProcessing) return;
    setIsProcessing(true);
    
    const userMsg: Message = { id: Date.now().toString(), text: text, sender: SenderType.PARTNER, timestamp: new Date(), isMotionDerived: false };
    setMessages(prev => [...prev, userMsg]);

    try {
      const result = await translateTextToGestureSequence(text, language);
      setGestureSequence(result.sequence);
      // Store both languages from the result
      setCurrentSentence({ en: result.interpretation, zh: result.interpretation_zh });
      setThoughtProcess({ en: result.thought_process, zh: result.thought_process_zh });
    } catch (err) {
      setCurrentSentence({ en: "Error interpreting meaning", zh: "無法解析語意" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    await processPartnerText(inputText);
    setInputText('');
  };

  // Determine which text to show based on current language
  const displayText = language === 'zh' ? (currentSentence.zh || currentSentence.en) : (currentSentence.en || currentSentence.zh);

  // --- RENDER ---
  return (
    <div className="h-screen w-screen bg-med-light flex flex-col overflow-hidden relative font-sans">
      
      <StartupModal 
        isOpen={isStartupModalOpen} 
        onStart={(text) => { setIsStartupModalOpen(false); processPartnerText(text); }}
        onClose={() => setIsStartupModalOpen(false)}
        language={language}
      />

      {/* Navbar */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
        <h1 className="text-xl font-bold text-med-dark tracking-tight flex items-center gap-2">
          <span className="w-8 h-8 bg-med-primary rounded-lg flex items-center justify-center text-white">SB</span>
          {t.app_name}
        </h1>
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setIsStartupModalOpen(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium text-sm hover:bg-slate-200 transition-colors"
          >
            <Sparkles size={16} />
            {t.new_session}
          </button>
          
          <div className="w-px h-8 bg-slate-200 hidden md:block"></div>
          
          {/* REFINED LANGUAGE TOGGLE BUTTON WITH FLASHING EFFECT */}
          <button 
            onClick={toggleLanguage}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 active:scale-95 group border
                ${isFlashing 
                    ? 'bg-med-primary/10 border-med-primary text-med-primary animate-pulse shadow-[0_0_15px_rgba(79,70,229,0.3)]' 
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'
                }
            `}
            title={language === 'en' ? "Switch to Traditional Chinese" : "Switch to English"}
          >
            <Globe size={16} className={`${isFlashing ? 'text-med-primary' : 'text-med-secondary'} transition-colors`} />
            <span className="w-5 text-center">
                {language === 'en' ? '中' : 'En'}
            </span>
          </button>

          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <Volume2 size={20} />
          </button>
        </div>
      </nav>

      {/* Main Layout */}
      <main className="flex-1 grid grid-rows-[1fr_400px] gap-0 overflow-hidden">
        
        {/* TOP ROW: VISUALS */}
        <section className="grid grid-cols-12 gap-4 p-4 min-h-0 bg-med-light">
           {/* Camera */}
           <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
              <div className="flex-1 relative rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-black">
                 <CameraFeed 
                    onGestureDetected={handleGestureDetected} 
                    isSimulating={isSimulating}
                    language={language}
                 />
                 <div className="absolute top-4 right-4 z-20">
                     <ControlPanel onSelectUseCase={processPartnerText} language={language} />
                 </div>
              </div>
           </div>

           {/* Avatar */}
           <div className="col-span-12 lg:col-span-7 flex flex-col relative">
              <MotionAvatar 
                  gestureSequence={gestureSequence}
                  displayText={displayText}
                  isProcessing={isProcessing}
                  language={language}
              />
              
              {/* Logic Overlay */}
              {thoughtProcess.en && !isProcessing && (
                  <div className={`absolute top-4 left-4 z-10 transition-all duration-500 ease-in-out ${isAnalysisVisible ? 'right-4' : 'right-auto'}`}>
                      <div className={`bg-white/90 backdrop-blur-md shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 origin-top-left
                          ${isAnalysisVisible ? 'rounded-xl p-3 scale-100 opacity-100' : 'rounded-full p-2 scale-90 opacity-80 hover:opacity-100 hover:scale-100 cursor-pointer shadow-md'}`}>
                          <div className="flex gap-3 items-start">
                              <button
                                  onClick={() => setIsAnalysisVisible(!isAnalysisVisible)}
                                  className={`shrink-0 flex items-center justify-center transition-all duration-300 rounded-lg ${isAnalysisVisible ? 'bg-med-primary/10 p-1.5 text-med-primary' : 'bg-med-primary w-10 h-10 text-white shadow-lg'}`}
                              >
                                  <BrainCircuit size={isAnalysisVisible ? 16 : 20} />
                              </button>

                              {isAnalysisVisible && (
                                  <div className="flex-1 min-w-[200px] animate-in fade-in slide-in-from-left-4 duration-300 flex flex-col">
                                      <div className="flex justify-between items-start mb-2">
                                          <div className="mr-4">
                                              <p className="text-[10px] font-bold text-med-primary uppercase tracking-wider mb-0.5">
                                                  ASL Logic & Dictionary Analysis
                                              </p>
                                          </div>
                                          <button onClick={() => setIsAnalysisVisible(false)} className="text-slate-400 p-1 hover:bg-slate-100 rounded-md">
                                              <Minimize2 size={14} />
                                          </button>
                                      </div>
                                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                          {language === 'zh' ? thoughtProcess.zh : thoughtProcess.en}
                                      </p>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              )}
           </div>
        </section>

        {/* BOTTOM ROW: CHAT */}
        <section className="bg-white border-t border-slate-200 flex flex-col shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
           <div className="flex-1 min-h-0">
               <ChatInterface messages={messages} language={language} />
           </div>
           <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex gap-3 items-center">
                 <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={t.input_placeholder}
                      className="w-full bg-slate-100 border-0 rounded-full py-4 pl-6 pr-12 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-med-primary/20 focus:bg-white transition-all font-medium"
                    />
                 </div>
                 <button type="submit" disabled={!inputText.trim() || isProcessing} className="w-12 h-12 bg-med-dark hover:bg-slate-800 text-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 disabled:opacity-50">
                    <Send size={20} className={isProcessing ? 'opacity-50' : ''} />
                 </button>
              </form>
           </div>
        </section>
      </main>
    </div>
  );
};

export default App;