import { GoogleGenAI, Type, Schema } from "@google/genai";
import { IntentType } from "../types";

// Note: In a real environment, you must handle the case where API_KEY is missing.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

// Using Gemini 2.5 Flash as the "Latest Nano/Efficient" model
const modelId = "gemini-2.5-flash";

const intentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    intent: {
      type: Type.STRING,
      enum: Object.values(IntentType).filter(i => i !== IntentType.UNKNOWN),
      description: "The core intent of the user's message."
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence score between 0 and 1."
    }
  },
  required: ["intent", "confidence"]
};

const sequenceSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    thought_process: {
      type: Type.STRING,
      description: "Explain the Semantic Search & Mapping process. For words not in the vocabulary, explain which synonyms or compound signs (Logical Thinking) were selected from the available list."
    },
    thought_process_zh: {
      type: Type.STRING,
      description: "Translation of the thought_process into Traditional Chinese (Taiwan usage)."
    },
    interpretation: {
      type: Type.STRING,
      description: "A sophisticated, university-level translation of the meaning in English."
    },
    interpretation_zh: {
      type: Type.STRING,
      description: "Translation of interpretation into Traditional Chinese (Taiwan usage)."
    },
    sequence: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        enum: Object.values(IntentType).filter(i => i !== IntentType.UNKNOWN),
      },
      description: "The ordered sequence of gesture IDs adhering to ASL syntax."
    }
  },
  required: ["thought_process", "thought_process_zh", "interpretation", "interpretation_zh", "sequence"]
};

// Schema for simple gesture-to-sentence translation
const gestureSentenceSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    sentence_en: {
      type: Type.STRING,
      description: "Natural English sentence."
    },
    sentence_zh: {
      type: Type.STRING,
      description: "Natural Traditional Chinese sentence."
    }
  },
  required: ["sentence_en", "sentence_zh"]
};

// --- OFFLINE / FALLBACK DICTIONARIES ---

const OFFLINE_SENTENCE_MAP: Record<string, string> = {
  [IntentType.HELLO]: "Hello, it is nice to see you.",
  [IntentType.THANKS]: "Thank you very much.",
  [IntentType.WATER]: "I would like some water, please.",
  [IntentType.FOOD]: "I am hungry.",
  [IntentType.TOILET]: "I need to use the restroom.",
  [IntentType.EMERGENCY]: "This is an emergency.",
  [IntentType.HAPPY]: "I am feeling happy.",
  [IntentType.SAD]: "I am feeling sad."
};

const OFFLINE_SENTENCE_MAP_ZH: Record<string, string> = {
  [IntentType.HELLO]: "你好，很高興見到你。",
  [IntentType.THANKS]: "非常感謝你。",
  [IntentType.WATER]: "請給我一點水。",
  [IntentType.FOOD]: "我餓了。",
  [IntentType.TOILET]: "我想去洗手間。",
  [IntentType.EMERGENCY]: "這是緊急狀況。",
  [IntentType.HAPPY]: "我現在感覺很開心。",
  [IntentType.SAD]: "我感覺很難過。"
};

export const detectIntentFromText = async (text: string): Promise<IntentType> => {
  if (!apiKey) return IntentType.UNKNOWN;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Analyze text for intent: "${text}" Intents: ${Object.values(IntentType).join(', ')}`,
      config: { 
        systemInstruction: "You are a semantic classifier. Map the input text to the most relevant IntentType enum.",
        responseMimeType: "application/json", 
        responseSchema: intentSchema, 
        temperature: 0.1 
      },
    });
    const parsed = JSON.parse(response.text || '{}');
    return parsed.intent as IntentType || IntentType.UNKNOWN;
  } catch (error) { return IntentType.UNKNOWN; }
};

interface TranslationResult {
  thought_process: string;
  thought_process_zh: string;
  interpretation: string;
  interpretation_zh: string;
  sequence: IntentType[];
}

export const translateTextToGestureSequence = async (text: string, language: 'en' | 'zh'): Promise<TranslationResult> => {
  if (!apiKey) {
      return {
          thought_process: "Offline mode.",
          thought_process_zh: "離線模式。",
          interpretation: text,
          interpretation_zh: text,
          sequence: fallbackTranslation(text)
      };
  }

  try {
    const validGestures = Object.values(IntentType).filter(i => i !== IntentType.UNKNOWN).join(", ");
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Input Text: "${text}"\n\nTarget Vocabulary (Available 3D Assets): [${validGestures}]`,
      config: { 
        systemInstruction: `
        Role: ASL hand dictionary expert.
        
        Task: Translate English Input into a 3D Avatar Gesture Sequence (Gloss) and provide a sophisticated text interpretation.
        
        --- INTELLIGENT SEARCH & MAPPING PROCESS ---
        
        STEP 1: SEMANTIC MAPPING (Logical Thinking)
        - If a word is NOT in the [Target Vocabulary], use your internal knowledge to map it.
        - Synonym: "Beverage" -> DRINK
        - Compound: "Microscope" -> [SEE, SMALL], "Teacher" -> [TEACHER] or [KNOW, GIVE, PERSON]
        - Fingerspelling: Use LETTER_* only for Proper Nouns (Names) or technical terms with no equivalent.

        STEP 2: ASL GRAMMAR
        - Time First (e.g., YESTERDAY).
        - Topic-Comment Structure.
        - Negation at the end.

        Output Requirements:
        - interpretation: A polished, university-level summary of the meaning.
        - sequence: The final list of ENUMS from the vocabulary.
        `,
        responseMimeType: "application/json", 
        responseSchema: sequenceSchema, 
        temperature: 0.1 
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
        thought_process: parsed.thought_process,
        thought_process_zh: parsed.thought_process_zh || "無",
        interpretation: parsed.interpretation,
        interpretation_zh: parsed.interpretation_zh || parsed.interpretation,
        sequence: parsed.sequence
    };
  } catch (error) {
    return {
        thought_process: "Error connecting to AI.", thought_process_zh: "連線錯誤。",
        interpretation: text, interpretation_zh: text,
        sequence: fallbackTranslation(text)
    };
  }
};

interface GestureTranslation {
    en: string;
    zh: string;
}

export const transformGestureToSentence = async (intent: IntentType): Promise<GestureTranslation> => {
   const fallbackEn = OFFLINE_SENTENCE_MAP[intent] || intent.toString();
   const fallbackZh = OFFLINE_SENTENCE_MAP_ZH[intent] || intent.toString();

   if (!apiKey) return { en: fallbackEn, zh: fallbackZh };

   try {
      const response = await ai.models.generateContent({
         model: modelId,
         contents: `Input Gesture: "${intent}"`,
         config: { 
             systemInstruction: `
             Role: Voice Interpreter for an AAC Device.
             Task: Translate the input gesture into a natural, dignified sentence in BOTH English and Traditional Chinese (Taiwan).
             Tone: Polite, Adult, Professional.
             
             Guidelines:
             - "FRUSTRATED" -> "I am feeling quite frustrated with this situation."
             - "WATER" -> "I would appreciate some water, please."
             - "UNDERSTAND" -> "I understand what you mean."
             `,
             responseMimeType: "application/json", 
             responseSchema: gestureSentenceSchema,
             temperature: 0.7 
         }
      });
      
      const parsed = JSON.parse(response.text || '{}');
      return {
          en: parsed.sentence_en || fallbackEn,
          zh: parsed.sentence_zh || fallbackZh
      };
   } catch (e) {
       return { en: fallbackEn, zh: fallbackZh };
   }
}

const fallbackTranslation = (text: string): IntentType[] => {
   const cleanText = text.toLowerCase();
   const sequence: IntentType[] = [];
   const intents = Object.values(IntentType);
   
   // Direct word match
   const words = cleanText.replace(/[^\w\s]/g, '').split(/\s+/);
   for (const w of words) {
     const upperW = w.toUpperCase();
     if (intents.includes(upperW as IntentType) && upperW !== IntentType.UNKNOWN) {
       sequence.push(upperW as IntentType);
     }
   }

   // Semantic Heuristics
   if (sequence.length === 0) {
       if (cleanText.includes('drink') || cleanText.includes('water')) sequence.push(IntentType.WATER);
       if (cleanText.includes('eat') || cleanText.includes('food')) sequence.push(IntentType.FOOD);
       if (cleanText.includes('hello') || cleanText.includes('hi')) sequence.push(IntentType.HELLO);
       if (cleanText.includes('thanks')) sequence.push(IntentType.THANKS);
   }

   return sequence;
}