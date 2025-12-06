import { DictionaryItem, IntentType } from './types';

export const UI_TRANSLATIONS = {
  en: {
    app_name: "Speechless Bridge",
    new_session: "New Session",
    input_placeholder: "Type a message to translate...",
  },
  zh: {
    app_name: "無言之橋",
    new_session: "新對話",
    input_placeholder: "輸入訊息以翻譯...",
  }
};

// Simplified SVG paths for "Ghost" overlays representing the gesture
const GHOST_PATHS = {
  CUP: "M50,20 L50,80 Q50,90 60,90 L90,90 Q100,90 100,80 L100,20 Z M100,30 Q110,30 110,40 L110,60 Q110,70 100,70",
  CIRCLE: "M50,50 m-40,0 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0",
  SMILE: "M30,50 Q50,80 70,50",
  FROWN: "M30,50 Q50,20 70,50",
  PILLOW: "M20,40 Q20,20 40,20 L80,20 Q100,20 100,40 L100,70 Q100,90 80,90 L40,90 Q20,90 20,70 Z",
  CHECK: "M20,50 L40,70 L80,20",
  CROSS: "M20,20 L80,80 M80,20 L20,80",
  WAVE: "M30,30 L50,10 L70,30 M50,10 L50,60",
  FLAT: "M20,60 L80,60 L80,80 L20,80 Z",
  POINT_SELF: "M50,20 L50,80", 
  POINT_FWD: "M20,50 L80,50",
  CLAW: "M20,20 Q50,50 80,20",
  FIST: "M30,30 L70,30 L70,70 L30,70 Z",
  INDEX: "M40,80 L40,40 L50,20 L60,40 L60,80 Z"
};

const DEFAULT_GHOST = GHOST_PATHS.CIRCLE;

export const SPEECHLESS_DICTIONARY: Record<IntentType, DictionaryItem> = {
  // --- EMERGENCY / MEDICAL ---
  [IntentType.EMERGENCY]: { intent: IntentType.EMERGENCY, label: "Emergency", label_zh: "緊急", icon: "🚨", color: "bg-red-600", description: "Wave E hand.", ghostPath: GHOST_PATHS.WAVE },
  [IntentType.HOSPITAL]: { intent: IntentType.HOSPITAL, label: "Hospital", label_zh: "醫院", icon: "🏥", color: "bg-red-500", description: "H on shoulder.", ghostPath: DEFAULT_GHOST },
  [IntentType.AMBULANCE]: { intent: IntentType.AMBULANCE, label: "Ambulance", label_zh: "救護車", icon: "🚑", color: "bg-red-500", description: "Spin hand light.", ghostPath: GHOST_PATHS.CIRCLE },
  [IntentType.POLICE]: { intent: IntentType.POLICE, label: "Police", label_zh: "警察", icon: "👮", color: "bg-blue-700", description: "Badge on chest.", ghostPath: DEFAULT_GHOST },
  [IntentType.FIRE]: { intent: IntentType.FIRE, label: "Fire", label_zh: "火災", icon: "🔥", color: "bg-orange-600", description: "Wiggle fingers up.", ghostPath: GHOST_PATHS.WAVE },
  [IntentType.DOCTOR]: { intent: IntentType.DOCTOR, label: "Doctor", label_zh: "醫生", icon: "🩺", color: "bg-white", description: "Wrist check.", ghostPath: DEFAULT_GHOST },
  [IntentType.NURSE]: { intent: IntentType.NURSE, label: "Nurse", label_zh: "護士", icon: "👩‍⚕️", color: "bg-white", description: "N on wrist.", ghostPath: DEFAULT_GHOST },
  [IntentType.PAIN]: { intent: IntentType.PAIN, label: "Pain", label_zh: "疼痛", icon: "🤕", color: "bg-red-800", description: "Indices touch.", ghostPath: DEFAULT_GHOST },
  [IntentType.MEDICINE]: { intent: IntentType.MEDICINE, label: "Medicine", label_zh: "藥", icon: "💊", color: "bg-teal-500", description: "Middle finger palm.", ghostPath: DEFAULT_GHOST },
  [IntentType.SICK]: { intent: IntentType.SICK, label: "Sick", label_zh: "生病", icon: "🤢", color: "bg-green-700", description: "Middle finger head/stomach.", ghostPath: DEFAULT_GHOST },

  // --- ALPHABET (Visualizing Fingerspelling) ---
  [IntentType.LETTER_A]: { intent: IntentType.LETTER_A, label: "A", label_zh: "A", icon: "🇦", color: "bg-slate-400", description: "Fist thumb side.", ghostPath: GHOST_PATHS.FIST },
  [IntentType.LETTER_B]: { intent: IntentType.LETTER_B, label: "B", label_zh: "B", icon: "🇧", color: "bg-slate-400", description: "Flat hand.", ghostPath: GHOST_PATHS.FLAT },
  [IntentType.LETTER_C]: { intent: IntentType.LETTER_C, label: "C", label_zh: "C", icon: "🇨", color: "bg-slate-400", description: "Cup hand.", ghostPath: GHOST_PATHS.CUP },
  [IntentType.LETTER_D]: { intent: IntentType.LETTER_D, label: "D", label_zh: "D", icon: "🇩", color: "bg-slate-400", description: "Index up.", ghostPath: GHOST_PATHS.INDEX },
  [IntentType.LETTER_E]: { intent: IntentType.LETTER_E, label: "E", label_zh: "E", icon: "🇪", color: "bg-slate-400", description: "Claw fingers.", ghostPath: GHOST_PATHS.CLAW },
  [IntentType.LETTER_F]: { intent: IntentType.LETTER_F, label: "F", label_zh: "F", icon: "🇫", color: "bg-slate-400", description: "OK sign.", ghostPath: DEFAULT_GHOST },
  [IntentType.LETTER_G]: { intent: IntentType.LETTER_G, label: "G", label_zh: "G", icon: "🇬", color: "bg-slate-400", description: "Index/Thumb point.", ghostPath: DEFAULT_GHOST },
  [IntentType.LETTER_H]: { intent: IntentType.LETTER_H, label: "H", label_zh: "H", icon: "🇭", color: "bg-slate-400", description: "Two fingers side.", ghostPath: DEFAULT_GHOST },
  [IntentType.LETTER_I]: { intent: IntentType.LETTER_I, label: "I", label_zh: "I", icon: "🇮", color: "bg-slate-400", description: "Pinky up.", ghostPath: DEFAULT_GHOST },
  [IntentType.LETTER_J]: { intent: IntentType.LETTER_J, label: "J", label_zh: "J", icon: "🇯", color: "bg-slate-400", description: "Pinky swoop.", ghostPath: DEFAULT_GHOST },
  [IntentType.LETTER_K]: { intent: IntentType.LETTER_K, label: "K", label_zh: "K", icon: "🇰", color: "bg-slate-400", description: "K hand.", ghostPath: DEFAULT_GHOST },
  [IntentType.LETTER_L]: { intent: IntentType.LETTER_L, label: "L", label_zh: "L", icon: "🇱", color: "bg-slate-400", description: "L shape.", ghostPath: DEFAULT_GHOST },
  [IntentType.LETTER_M]: { intent: IntentType.LETTER_M, label: "M", label_zh: "M", icon: "🇲", color: "bg-slate-400", description: "3 fingers over thumb.", ghostPath: GHOST_PATHS.FIST },
  [IntentType.LETTER_N]: { intent: IntentType.LETTER_N, label: "N", label_zh: "N", icon: "🇳", color: "bg-slate-400", description: "2 fingers over thumb.", ghostPath: GHOST_PATHS.FIST },
  [IntentType.LETTER_O]: { intent: IntentType.LETTER_O, label: "O", label_zh: "O", icon: "🇴", color: "bg-slate-400", description: "O shape.", ghostPath: DEFAULT_GHOST },
  [IntentType.LETTER_P]: { intent: IntentType.LETTER_P, label: "P", label_zh: "P", icon: "🇵", color: "bg-slate-400", description: "K down.", ghostPath: DEFAULT_GHOST },
  [IntentType.LETTER_Q]: { intent: IntentType.LETTER_Q, label: "Q", label_zh: "Q", icon: "🇶", color: "bg-slate-400", description: "G down.", ghostPath: DEFAULT_GHOST },
  [IntentType.LETTER_R]: { intent: IntentType.LETTER_R, label: "R", label_zh: "R", icon: "🇷", color: "bg-slate-400", description: "Crossed fingers.", ghostPath: DEFAULT_GHOST },
  [IntentType.LETTER_S]: { intent: IntentType.LETTER_S, label: "S", label_zh: "S", icon: "🇸", color: "bg-slate-400", description: "Fist thumb front.", ghostPath: GHOST_PATHS.FIST },
  [IntentType.LETTER_T]: { intent: IntentType.LETTER_T, label: "T", label_zh: "T", icon: "🇹", color: "bg-slate-400", description: "Thumb under index.", ghostPath: GHOST_PATHS.FIST },
  [IntentType.LETTER_U]: { intent: IntentType.LETTER_U, label: "U", label_zh: "U", icon: "🇺", color: "bg-slate-400", description: "Two fingers up.", ghostPath: DEFAULT_GHOST },
  [IntentType.LETTER_V]: { intent: IntentType.LETTER_V, label: "V", label_zh: "V", icon: "🇻", color: "bg-slate-400", description: "V shape.", ghostPath: DEFAULT_GHOST },
  [IntentType.LETTER_W]: { intent: IntentType.LETTER_W, label: "W", label_zh: "W", icon: "🇼", color: "bg-slate-400", description: "3 fingers up.", ghostPath: DEFAULT_GHOST },
  [IntentType.LETTER_X]: { intent: IntentType.LETTER_X, label: "X", label_zh: "X", icon: "🇽", color: "bg-slate-400", description: "Hook finger.", ghostPath: DEFAULT_GHOST },
  [IntentType.LETTER_Y]: { intent: IntentType.LETTER_Y, label: "Y", label_zh: "Y", icon: "🇾", color: "bg-slate-400", description: "Y shape.", ghostPath: DEFAULT_GHOST },
  [IntentType.LETTER_Z]: { intent: IntentType.LETTER_Z, label: "Z", label_zh: "Z", icon: "🇿", color: "bg-slate-400", description: "Index zig zag.", ghostPath: DEFAULT_GHOST },

  // --- NUMBERS ---
  [IntentType.NUM_1]: { intent: IntentType.NUM_1, label: "1", label_zh: "1", icon: "1️⃣", color: "bg-blue-300", description: "Index up.", ghostPath: GHOST_PATHS.INDEX },
  [IntentType.NUM_2]: { intent: IntentType.NUM_2, label: "2", label_zh: "2", icon: "2️⃣", color: "bg-blue-300", description: "Two fingers.", ghostPath: DEFAULT_GHOST },
  [IntentType.NUM_3]: { intent: IntentType.NUM_3, label: "3", label_zh: "3", icon: "3️⃣", color: "bg-blue-300", description: "Thumb out.", ghostPath: DEFAULT_GHOST },
  [IntentType.NUM_4]: { intent: IntentType.NUM_4, label: "4", label_zh: "4", icon: "4️⃣", color: "bg-blue-300", description: "Four fingers.", ghostPath: DEFAULT_GHOST },
  [IntentType.NUM_5]: { intent: IntentType.NUM_5, label: "5", label_zh: "5", icon: "5️⃣", color: "bg-blue-300", description: "Five fingers.", ghostPath: GHOST_PATHS.WAVE },
  [IntentType.NUM_6]: { intent: IntentType.NUM_6, label: "6", label_zh: "6", icon: "6️⃣", color: "bg-blue-300", description: "Pinky touch.", ghostPath: DEFAULT_GHOST },
  [IntentType.NUM_7]: { intent: IntentType.NUM_7, label: "7", label_zh: "7", icon: "7️⃣", color: "bg-blue-300", description: "Ring touch.", ghostPath: DEFAULT_GHOST },
  [IntentType.NUM_8]: { intent: IntentType.NUM_8, label: "8", label_zh: "8", icon: "8️⃣", color: "bg-blue-300", description: "Middle touch.", ghostPath: DEFAULT_GHOST },
  [IntentType.NUM_9]: { intent: IntentType.NUM_9, label: "9", label_zh: "9", icon: "9️⃣", color: "bg-blue-300", description: "Index touch.", ghostPath: DEFAULT_GHOST },
  [IntentType.NUM_10]: { intent: IntentType.NUM_10, label: "10", label_zh: "10", icon: "🔟", color: "bg-blue-300", description: "Thumb shake.", ghostPath: DEFAULT_GHOST },

  // --- SOCIAL ---
  [IntentType.HELLO]: { intent: IntentType.HELLO, label: "Hello", label_zh: "你好", icon: "👋", color: "bg-med-primary", description: "Raise hand and wave.", ghostPath: GHOST_PATHS.WAVE },
  [IntentType.THANKS]: { intent: IntentType.THANKS, label: "Thanks", label_zh: "謝謝", icon: "🙏", color: "bg-med-secondary", description: "Flat hand forward.", ghostPath: GHOST_PATHS.FLAT },
  [IntentType.PLEASE]: { intent: IntentType.PLEASE, label: "Please", label_zh: "請", icon: "🥺", color: "bg-purple-500", description: "Flat hand circle chest.", ghostPath: DEFAULT_GHOST },
  [IntentType.SORRY]: { intent: IntentType.SORRY, label: "Sorry", label_zh: "抱歉", icon: "😔", color: "bg-gray-500", description: "Fist circle chest.", ghostPath: DEFAULT_GHOST },
  
  // Pronouns
  [IntentType.I]: { intent: IntentType.I, label: "I / Me", label_zh: "我", icon: "👤", color: "bg-slate-500", description: "Point to chest.", ghostPath: GHOST_PATHS.POINT_SELF },
  [IntentType.YOU]: { intent: IntentType.YOU, label: "You", label_zh: "你", icon: "👉", color: "bg-slate-500", description: "Point forward.", ghostPath: GHOST_PATHS.POINT_FWD },
  [IntentType.WE]: { intent: IntentType.WE, label: "We", label_zh: "我們", icon: "👥", color: "bg-slate-500", description: "Point circle.", ghostPath: DEFAULT_GHOST },
  [IntentType.THEY]: { intent: IntentType.THEY, label: "They", label_zh: "他們", icon: "👉👉", color: "bg-slate-500", description: "Point side sweep.", ghostPath: DEFAULT_GHOST },
  [IntentType.MY]: { intent: IntentType.MY, label: "My", label_zh: "我的", icon: "🤚", color: "bg-slate-500", description: "Palm to chest.", ghostPath: DEFAULT_GHOST },
  [IntentType.YOUR]: { intent: IntentType.YOUR, label: "Your", label_zh: "你的", icon: "🫱", color: "bg-slate-500", description: "Palm forward.", ghostPath: DEFAULT_GHOST },

  // Verbs
  [IntentType.WANT]: { intent: IntentType.WANT, label: "Want", label_zh: "想要", icon: "🤲", color: "bg-med-accent", description: "Pull back.", ghostPath: GHOST_PATHS.CLAW },
  [IntentType.NEED]: { intent: IntentType.NEED, label: "Need", label_zh: "需要", icon: "👇", color: "bg-orange-600", description: "Hook finger down.", ghostPath: DEFAULT_GHOST },
  [IntentType.LIKE]: { intent: IntentType.LIKE, label: "Like", label_zh: "喜歡", icon: "👍", color: "bg-pink-500", description: "Pull from chest.", ghostPath: DEFAULT_GHOST },
  [IntentType.LOVE]: { intent: IntentType.LOVE, label: "Love", label_zh: "愛", icon: "❤️", color: "bg-red-500", description: "Cross arms.", ghostPath: DEFAULT_GHOST },
  [IntentType.SEE]: { intent: IntentType.SEE, label: "See", label_zh: "看見", icon: "👀", color: "bg-blue-400", description: "V-hand near eyes.", ghostPath: DEFAULT_GHOST },
  [IntentType.GO]: { intent: IntentType.GO, label: "Go", label_zh: "去", icon: "🚶", color: "bg-green-600", description: "Point forward move.", ghostPath: DEFAULT_GHOST },
  [IntentType.STOP]: { intent: IntentType.STOP, label: "Stop", label_zh: "停止", icon: "🛑", color: "bg-red-700", description: "Flat palm vertical.", ghostPath: DEFAULT_GHOST },
  [IntentType.HELP]: { intent: IntentType.HELP, label: "Help", label_zh: "幫忙", icon: "🤝", color: "bg-teal-500", description: "Fist on palm lift.", ghostPath: DEFAULT_GHOST },
  [IntentType.EAT]: { intent: IntentType.EAT, label: "Eat", label_zh: "吃", icon: "🍽️", color: "bg-orange-500", description: "Hand to mouth.", ghostPath: GHOST_PATHS.CIRCLE },
  [IntentType.DRINK]: { intent: IntentType.DRINK, label: "Drink", label_zh: "喝", icon: "🥤", color: "bg-blue-500", description: "Cup to mouth.", ghostPath: GHOST_PATHS.CUP },
  [IntentType.KNOW]: { intent: IntentType.KNOW, label: "Know", label_zh: "知道", icon: "🧠", color: "bg-indigo-400", description: "Touch temple.", ghostPath: DEFAULT_GHOST },
  [IntentType.THINK]: { intent: IntentType.THINK, label: "Think", label_zh: "想", icon: "💭", color: "bg-indigo-300", description: "Index to temple.", ghostPath: DEFAULT_GHOST },
  [IntentType.FEEL]: { intent: IntentType.FEEL, label: "Feel", label_zh: "感覺", icon: "❤️‍🔥", color: "bg-pink-600", description: "Middle finger chest.", ghostPath: DEFAULT_GHOST },
  [IntentType.UNDERSTAND]: { intent: IntentType.UNDERSTAND, label: "Understand", label_zh: "了解", icon: "💡", color: "bg-yellow-500", description: "Fist flick up.", ghostPath: DEFAULT_GHOST },
  [IntentType.EXPLAIN]: { intent: IntentType.EXPLAIN, label: "Explain", label_zh: "解釋", icon: "🗣️", color: "bg-blue-400", description: "F-hands pull.", ghostPath: DEFAULT_GHOST },
  [IntentType.REMEMBER]: { intent: IntentType.REMEMBER, label: "Remember", label_zh: "記得", icon: "🧠✨", color: "bg-purple-500", description: "Thumb forehead to thumb.", ghostPath: DEFAULT_GHOST },
  [IntentType.FORGET]: { intent: IntentType.FORGET, label: "Forget", label_zh: "忘記", icon: "🧠💨", color: "bg-gray-400", description: "Wipe forehead.", ghostPath: DEFAULT_GHOST },
  [IntentType.MAKE]: { intent: IntentType.MAKE, label: "Make", label_zh: "製作", icon: "🔨", color: "bg-slate-600", description: "Fists twist.", ghostPath: DEFAULT_GHOST },
  [IntentType.USE]: { intent: IntentType.USE, label: "Use", label_zh: "使用", icon: "🔧", color: "bg-slate-600", description: "U-hand circle.", ghostPath: DEFAULT_GHOST },

  // Nouns / Places
  [IntentType.WATER]: { intent: IntentType.WATER, label: "Water", label_zh: "水", icon: "💧", color: "bg-blue-500", description: "W-hand near mouth.", ghostPath: GHOST_PATHS.CUP },
  [IntentType.FOOD]: { intent: IntentType.FOOD, label: "Food", label_zh: "食物", icon: "🍎", color: "bg-red-500", description: "Bunch hand mouth.", ghostPath: GHOST_PATHS.CIRCLE },
  [IntentType.PLAY]: { intent: IntentType.PLAY, label: "Play", label_zh: "玩", icon: "⚡", color: "bg-orange-500", description: "Y-hand shake.", ghostPath: GHOST_PATHS.CIRCLE },
  [IntentType.SLEEP]: { intent: IntentType.SLEEP, label: "Sleep", label_zh: "睡覺", icon: "🌙", color: "bg-indigo-500", description: "Hands to cheek.", ghostPath: GHOST_PATHS.PILLOW },
  [IntentType.TOILET]: { intent: IntentType.TOILET, label: "Toilet", label_zh: "廁所", icon: "🚽", color: "bg-slate-400", description: "T-hand shake.", ghostPath: DEFAULT_GHOST },
  [IntentType.HOME]: { intent: IntentType.HOME, label: "Home", label_zh: "家", icon: "🏠", color: "bg-amber-600", description: "O-hand cheek.", ghostPath: DEFAULT_GHOST },
  [IntentType.SCHOOL]: { intent: IntentType.SCHOOL, label: "School", label_zh: "學校", icon: "🏫", color: "bg-yellow-600", description: "Clap hands.", ghostPath: DEFAULT_GHOST },
  [IntentType.WORK]: { intent: IntentType.WORK, label: "Work", label_zh: "工作", icon: "💼", color: "bg-slate-700", description: "Fist on wrist.", ghostPath: DEFAULT_GHOST },
  [IntentType.STORE]: { intent: IntentType.STORE, label: "Store", label_zh: "商店", icon: "🏪", color: "bg-blue-600", description: "Shake hands.", ghostPath: DEFAULT_GHOST },
  
  // Time
  [IntentType.TIME]: { intent: IntentType.TIME, label: "Time", label_zh: "時間", icon: "⌚", color: "bg-slate-400", description: "Tap wrist.", ghostPath: DEFAULT_GHOST },
  [IntentType.NOW]: { intent: IntentType.NOW, label: "Now", label_zh: "現在", icon: "⬇️", color: "bg-slate-600", description: "Y-hands down.", ghostPath: DEFAULT_GHOST },
  [IntentType.LATER]: { intent: IntentType.LATER, label: "Later", label_zh: "稍後", icon: "🕒", color: "bg-slate-500", description: "L-hand flip.", ghostPath: DEFAULT_GHOST },
  [IntentType.TODAY]: { intent: IntentType.TODAY, label: "Today", label_zh: "今天", icon: "📅", color: "bg-slate-600", description: "Y-hands bounce.", ghostPath: DEFAULT_GHOST },
  [IntentType.TOMORROW]: { intent: IntentType.TOMORROW, label: "Tomorrow", label_zh: "明天", icon: "➡️", color: "bg-slate-500", description: "Thumb forward cheek.", ghostPath: DEFAULT_GHOST },
  [IntentType.YESTERDAY]: { intent: IntentType.YESTERDAY, label: "Yesterday", label_zh: "昨天", icon: "⬅️", color: "bg-slate-500", description: "Thumb back cheek.", ghostPath: DEFAULT_GHOST },
  [IntentType.MORNING]: { intent: IntentType.MORNING, label: "Morning", label_zh: "早上", icon: "🌅", color: "bg-orange-300", description: "Arm raise.", ghostPath: DEFAULT_GHOST },
  [IntentType.NIGHT]: { intent: IntentType.NIGHT, label: "Night", label_zh: "晚上", icon: "🌃", color: "bg-indigo-900", description: "Hand over wrist.", ghostPath: DEFAULT_GHOST },
  [IntentType.FUTURE]: { intent: IntentType.FUTURE, label: "Future", label_zh: "未來", icon: "🔮", color: "bg-purple-600", description: "Hand forward.", ghostPath: DEFAULT_GHOST },
  [IntentType.PAST]: { intent: IntentType.PAST, label: "Past", label_zh: "過去", icon: "📜", color: "bg-slate-600", description: "Hand back.", ghostPath: DEFAULT_GHOST },

  // Family
  [IntentType.FAMILY]: { intent: IntentType.FAMILY, label: "Family", label_zh: "家庭", icon: "👨‍👩‍👧", color: "bg-green-600", description: "F-hands circle.", ghostPath: DEFAULT_GHOST },
  [IntentType.MOTHER]: { intent: IntentType.MOTHER, label: "Mother", label_zh: "媽媽", icon: "👩", color: "bg-pink-400", description: "Thumb on chin.", ghostPath: GHOST_PATHS.CIRCLE },
  [IntentType.FATHER]: { intent: IntentType.FATHER, label: "Father", label_zh: "爸爸", icon: "👨", color: "bg-blue-400", description: "Thumb on forehead.", ghostPath: GHOST_PATHS.CIRCLE },
  [IntentType.FRIEND]: { intent: IntentType.FRIEND, label: "Friend", label_zh: "朋友", icon: "🤝", color: "bg-teal-600", description: "Index link.", ghostPath: DEFAULT_GHOST },
  [IntentType.BABY]: { intent: IntentType.BABY, label: "Baby", label_zh: "嬰兒", icon: "👶", color: "bg-pink-200", description: "Rock arms.", ghostPath: DEFAULT_GHOST },
  [IntentType.MAN]: { intent: IntentType.MAN, label: "Man", label_zh: "男人", icon: "👨", color: "bg-blue-600", description: "Hand to forehead/chest.", ghostPath: DEFAULT_GHOST },
  [IntentType.WOMAN]: { intent: IntentType.WOMAN, label: "Woman", label_zh: "女人", icon: "👩", color: "bg-pink-600", description: "Hand to chin/chest.", ghostPath: DEFAULT_GHOST },

  // Adjectives / Abstract
  [IntentType.HAPPY]: { intent: IntentType.HAPPY, label: "Happy", label_zh: "開心", icon: "😊", color: "bg-green-500", description: "Smile gesture.", ghostPath: GHOST_PATHS.SMILE },
  [IntentType.SAD]: { intent: IntentType.SAD, label: "Sad", label_zh: "難過", icon: "😟", color: "bg-gray-500", description: "Frown gesture.", ghostPath: GHOST_PATHS.FROWN },
  [IntentType.ANGRY]: { intent: IntentType.ANGRY, label: "Angry", label_zh: "生氣", icon: "😠", color: "bg-red-600", description: "Claw face.", ghostPath: DEFAULT_GHOST },
  [IntentType.TIRED]: { intent: IntentType.TIRED, label: "Tired", label_zh: "累", icon: "😫", color: "bg-slate-500", description: "Hands drop.", ghostPath: DEFAULT_GHOST },
  [IntentType.CONFUSED]: { intent: IntentType.CONFUSED, label: "Confused", label_zh: "困惑", icon: "😕", color: "bg-orange-400", description: "Claw head.", ghostPath: DEFAULT_GHOST },
  [IntentType.FRUSTRATED]: { intent: IntentType.FRUSTRATED, label: "Frustrated", label_zh: "挫折", icon: "😤", color: "bg-red-700", description: "Back hand mouth.", ghostPath: DEFAULT_GHOST },
  [IntentType.PROUD]: { intent: IntentType.PROUD, label: "Proud", label_zh: "驕傲", icon: "🦁", color: "bg-yellow-600", description: "Thumb chest up.", ghostPath: DEFAULT_GHOST },
  [IntentType.EXCITED]: { intent: IntentType.EXCITED, label: "Excited", label_zh: "興奮", icon: "🤩", color: "bg-yellow-400", description: "Middle fingers chest.", ghostPath: DEFAULT_GHOST },
  [IntentType.BORED]: { intent: IntentType.BORED, label: "Bored", label_zh: "無聊", icon: "😑", color: "bg-slate-400", description: "Index nose twist.", ghostPath: DEFAULT_GHOST },
  [IntentType.GOOD]: { intent: IntentType.GOOD, label: "Good", label_zh: "好", icon: "✨", color: "bg-green-400", description: "Hand from chin.", ghostPath: DEFAULT_GHOST },
  [IntentType.BAD]: { intent: IntentType.BAD, label: "Bad", label_zh: "壞", icon: "💩", color: "bg-brown-500", description: "Hand flip down.", ghostPath: DEFAULT_GHOST },
  [IntentType.HOT]: { intent: IntentType.HOT, label: "Hot", label_zh: "熱", icon: "🔥", color: "bg-orange-500", description: "Claw turn.", ghostPath: DEFAULT_GHOST },
  [IntentType.COLD]: { intent: IntentType.COLD, label: "Cold", label_zh: "冷", icon: "❄️", color: "bg-blue-300", description: "Fists shake.", ghostPath: DEFAULT_GHOST },
  [IntentType.BIG]: { intent: IntentType.BIG, label: "Big", label_zh: "大", icon: "🐘", color: "bg-slate-600", description: "Hands wide.", ghostPath: DEFAULT_GHOST },
  [IntentType.SMALL]: { intent: IntentType.SMALL, label: "Small", label_zh: "小", icon: "🐜", color: "bg-slate-600", description: "Hands close.", ghostPath: DEFAULT_GHOST },
  [IntentType.SAME]: { intent: IntentType.SAME, label: "Same", label_zh: "相同", icon: "👯", color: "bg-yellow-400", description: "Y-hand back and forth.", ghostPath: DEFAULT_GHOST },
  [IntentType.DIFFERENT]: { intent: IntentType.DIFFERENT, label: "Different", label_zh: "不同", icon: "≠", color: "bg-orange-400", description: "Indices cross.", ghostPath: DEFAULT_GHOST },
  [IntentType.YES]: { intent: IntentType.YES, label: "Yes", label_zh: "是", icon: "👍", color: "bg-green-600", description: "Thumbs up.", ghostPath: GHOST_PATHS.CHECK },
  [IntentType.NO]: { intent: IntentType.NO, label: "No", label_zh: "不", icon: "👎", color: "bg-red-600", description: "Thumbs down.", ghostPath: GHOST_PATHS.CROSS },
  
  // Connectors
  [IntentType.AND]: { intent: IntentType.AND, label: "And", label_zh: "和", icon: "&", color: "bg-slate-400", description: "Hand sweep.", ghostPath: DEFAULT_GHOST },
  [IntentType.BUT]: { intent: IntentType.BUT, label: "But", label_zh: "但是", icon: "🤚", color: "bg-slate-400", description: "Index cross open.", ghostPath: DEFAULT_GHOST },
  [IntentType.OR]: { intent: IntentType.OR, label: "Or", label_zh: "或", icon: "🤷", color: "bg-slate-400", description: "L-hand pivot.", ghostPath: DEFAULT_GHOST },
  [IntentType.BECAUSE]: { intent: IntentType.BECAUSE, label: "Because", label_zh: "因為", icon: "∵", color: "bg-slate-400", description: "Index forehead pull.", ghostPath: DEFAULT_GHOST },

  // Questions
  [IntentType.WHAT]: { intent: IntentType.WHAT, label: "What", label_zh: "什麼", icon: "❓", color: "bg-purple-600", description: "Hands shake.", ghostPath: DEFAULT_GHOST },
  [IntentType.WHERE]: { intent: IntentType.WHERE, label: "Where", label_zh: "哪裡", icon: "🗺️", color: "bg-purple-600", description: "Finger shake.", ghostPath: DEFAULT_GHOST },
  [IntentType.WHO]: { intent: IntentType.WHO, label: "Who", label_zh: "誰", icon: "👤❓", color: "bg-purple-600", description: "Thumb circle.", ghostPath: DEFAULT_GHOST },
  [IntentType.WHY]: { intent: IntentType.WHY, label: "Why", label_zh: "為什麼", icon: "🤔", color: "bg-purple-600", description: "Hand to head.", ghostPath: DEFAULT_GHOST },
  [IntentType.WHEN]: { intent: IntentType.WHEN, label: "When", label_zh: "何時", icon: "🕒❓", color: "bg-purple-600", description: "Finger circle.", ghostPath: DEFAULT_GHOST },
  [IntentType.HOW]: { intent: IntentType.HOW, label: "How", label_zh: "如何", icon: "⚙️", color: "bg-purple-600", description: "Hands roll.", ghostPath: DEFAULT_GHOST },

  [IntentType.UNKNOWN]: { intent: IntentType.UNKNOWN, label: "?", label_zh: "?", icon: "❓", color: "bg-gray-300", description: "Unrecognized", ghostPath: "" }
};

export const DAILY_USE_CASES = [
  { label: "Emergency", label_zh: "緊急", text: "I need help, call the doctor.", text_zh: "我需要幫忙，請叫醫生。", icon: "🚨" },
  { label: "Greeting", label_zh: "問候", text: "Hello, nice to meet you.", text_zh: "你好，很高興見到你。", icon: "👋" },
  { label: "Needs", label_zh: "需求", text: "I need to go to the toilet.", text_zh: "我需要去廁所。", icon: "🚽" },
  { label: "Hunger", label_zh: "飢餓", text: "I am hungry, I want food.", text_zh: "我餓了，想要食物。", icon: "🍎" },
  { label: "Thirst", label_zh: "口渴", text: "Can I have some water please?", text_zh: "請給我一點水。", icon: "💧" },
  { label: "Emotion", label_zh: "情緒", text: "I am feeling very happy today.", text_zh: "我今天感覺很開心。", icon: "😊" },
  { label: "Question", label_zh: "問題", text: "Where are you going?", text_zh: "你要去哪裡？", icon: "🗺️" },
  { label: "Time", label_zh: "時間", text: "What time is it now?", text_zh: "現在幾點？", icon: "⌚" },
  { label: "Family", label_zh: "家庭", text: "My mother is at home.", text_zh: "我媽媽在家。", icon: "👩" },
  { label: "Future", label_zh: "未來", text: "I want to go tomorrow.", text_zh: "我想要明天去。", icon: "➡️" }
];