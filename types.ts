export enum SenderType {
  USER = 'USER',       // The non-verbal individual (Gesture/Camera input)
  PARTNER = 'PARTNER', // The conversation partner (Text input)
  SYSTEM = 'SYSTEM'
}

export interface Message {
  id: string;
  text: string;
  sender: SenderType;
  timestamp: Date;
  intent?: string; // The recognized semantic intent
  isMotionDerived?: boolean; // If true, came from gesture recognition
}

export enum IntentType {
  // --- ALPHABET (Fingerspelling) ---
  LETTER_A = 'LETTER_A', LETTER_B = 'LETTER_B', LETTER_C = 'LETTER_C', LETTER_D = 'LETTER_D',
  LETTER_E = 'LETTER_E', LETTER_F = 'LETTER_F', LETTER_G = 'LETTER_G', LETTER_H = 'LETTER_H',
  LETTER_I = 'LETTER_I', LETTER_J = 'LETTER_J', LETTER_K = 'LETTER_K', LETTER_L = 'LETTER_L',
  LETTER_M = 'LETTER_M', LETTER_N = 'LETTER_N', LETTER_O = 'LETTER_O', LETTER_P = 'LETTER_P',
  LETTER_Q = 'LETTER_Q', LETTER_R = 'LETTER_R', LETTER_S = 'LETTER_S', LETTER_T = 'LETTER_T',
  LETTER_U = 'LETTER_U', LETTER_V = 'LETTER_V', LETTER_W = 'LETTER_W', LETTER_X = 'LETTER_X',
  LETTER_Y = 'LETTER_Y', LETTER_Z = 'LETTER_Z',

  // --- NUMBERS ---
  NUM_1 = 'NUM_1', NUM_2 = 'NUM_2', NUM_3 = 'NUM_3', NUM_4 = 'NUM_4', NUM_5 = 'NUM_5',
  NUM_6 = 'NUM_6', NUM_7 = 'NUM_7', NUM_8 = 'NUM_8', NUM_9 = 'NUM_9', NUM_10 = 'NUM_10',

  // --- EMERGENCY / MEDICAL ---
  EMERGENCY = 'EMERGENCY',
  HOSPITAL = 'HOSPITAL',
  AMBULANCE = 'AMBULANCE',
  POLICE = 'POLICE',
  FIRE = 'FIRE',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  PAIN = 'PAIN',
  MEDICINE = 'MEDICINE',
  SICK = 'SICK',

  // --- FUNCTIONAL / DAILY ---
  WATER = 'WATER',
  FOOD = 'FOOD',
  PLAY = 'PLAY',
  SLEEP = 'SLEEP',
  TOILET = 'TOILET',
  HOME = 'HOME',
  SCHOOL = 'SCHOOL',
  WORK = 'WORK',
  STORE = 'STORE',
  
  // --- TIME ---
  TIME = 'TIME',
  NOW = 'NOW',
  LATER = 'LATER',
  TODAY = 'TODAY',
  TOMORROW = 'TOMORROW',
  YESTERDAY = 'YESTERDAY',
  MORNING = 'MORNING',
  NIGHT = 'NIGHT',
  FUTURE = 'FUTURE', // New
  PAST = 'PAST',     // New

  // --- PEOPLE / FAMILY ---
  FAMILY = 'FAMILY',
  MOTHER = 'MOTHER',
  FATHER = 'FATHER',
  FRIEND = 'FRIEND',
  BABY = 'BABY',     // New
  MAN = 'MAN',       // New
  WOMAN = 'WOMAN',   // New
  
  // --- EMOTIONAL / ABSTRACT ---
  HAPPY = 'HAPPY',
  SAD = 'SAD',
  ANGRY = 'ANGRY',
  TIRED = 'TIRED',
  CONFUSED = 'CONFUSED',
  FRUSTRATED = 'FRUSTRATED',
  PROUD = 'PROUD',
  EXCITED = 'EXCITED',
  BORED = 'BORED',
  YES = 'YES',
  NO = 'NO',
  GOOD = 'GOOD',
  BAD = 'BAD',
  HOT = 'HOT',
  COLD = 'COLD',
  BIG = 'BIG',
  SMALL = 'SMALL',
  SAME = 'SAME',
  DIFFERENT = 'DIFFERENT',
  
  // --- CONVERSATIONAL / GRAMMAR ---
  HELLO = 'HELLO',
  THANKS = 'THANKS',
  PLEASE = 'PLEASE',
  SORRY = 'SORRY',
  I = 'I',
  YOU = 'YOU',
  WE = 'WE',
  THEY = 'THEY',
  MY = 'MY',
  YOUR = 'YOUR',
  AND = 'AND',       // New
  BUT = 'BUT',       // New
  BECAUSE = 'BECAUSE', // New
  OR = 'OR',         // New
  
  // --- VERBS ---
  WANT = 'WANT',
  NEED = 'NEED',
  LIKE = 'LIKE',
  LOVE = 'LOVE',
  SEE = 'SEE',
  GO = 'GO',
  STOP = 'STOP',
  HELP = 'HELP',
  EAT = 'EAT',
  DRINK = 'DRINK',
  KNOW = 'KNOW',
  THINK = 'THINK',
  FEEL = 'FEEL',
  UNDERSTAND = 'UNDERSTAND',
  EXPLAIN = 'EXPLAIN',
  REMEMBER = 'REMEMBER',
  FORGET = 'FORGET',
  MAKE = 'MAKE',     // New
  USE = 'USE',       // New

  // --- QUESTIONS ---
  WHAT = 'WHAT',
  WHERE = 'WHERE',
  WHO = 'WHO',
  WHY = 'WHY',
  WHEN = 'WHEN',
  HOW = 'HOW',

  UNKNOWN = 'UNKNOWN'
}

export interface DictionaryItem {
  intent: IntentType;
  label: string;
  label_zh?: string; // Translation support
  icon: string; // Icon name or unicode
  color: string;
  description: string;
  ghostPath: string; // SVG path data for the ghost overlay
}

export interface ChatState {
  messages: Message[];
  isThinking: boolean;
  currentHint: IntentType | null;
}