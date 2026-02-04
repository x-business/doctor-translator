// Types for the Healthcare Doctor-Patient Translation Application

export type Role = 'doctor' | 'patient';

export type Language = {
  code: string;
  name: string;
  nativeName: string;
};

export type Message = {
  id: string;
  conversationId: string;
  role: Role;
  originalText: string;
  translatedText: string;
  originalLanguage: string;
  targetLanguage: string;
  audioUrl?: string;
  audioDuration?: number;
  timestamp: Date;
  isAudio: boolean;
};

export type Conversation = {
  id: string;
  doctorLanguage: string;
  patientLanguage: string;
  messages: Message[];
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SearchResult = {
  conversationId: string;
  messageId: string;
  matchedText: string;
  context: string;
  timestamp: Date;
  role: Role;
};

export type ConversationSummary = {
  overview: string;
  symptoms: string[];
  diagnoses: string[];
  medications: string[];
  followUpActions: string[];
  keyPoints: string[];
};

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
];
