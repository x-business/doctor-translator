import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Conversation, Message, Role, ConversationSummary } from '@/types';

interface ConversationState {
  conversations: Conversation[];
  currentConversationId: string | null;
  currentRole: Role;
  doctorLanguage: string;
  patientLanguage: string;
  isRecording: boolean;
  isTranslating: boolean;
  
  // Actions
  setCurrentRole: (role: Role) => void;
  setDoctorLanguage: (lang: string) => void;
  setPatientLanguage: (lang: string) => void;
  createConversation: () => string;
  setCurrentConversation: (id: string | null) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessageTranslation: (messageId: string, translatedText: string) => void;
  setIsRecording: (isRecording: boolean) => void;
  setIsTranslating: (isTranslating: boolean) => void;
  setSummary: (conversationId: string, summary: string) => void;
  getCurrentConversation: () => Conversation | undefined;
  searchConversations: (query: string) => { conversation: Conversation; message: Message; matchIndex: number }[];
  deleteConversation: (id: string) => void;
}

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      currentRole: 'doctor',
      doctorLanguage: 'en',
      patientLanguage: 'es',
      isRecording: false,
      isTranslating: false,

      setCurrentRole: (role) => set({ currentRole: role }),
      
      setDoctorLanguage: (lang) => set({ doctorLanguage: lang }),
      
      setPatientLanguage: (lang) => set({ patientLanguage: lang }),
      
      createConversation: () => {
        const id = uuidv4();
        const { doctorLanguage, patientLanguage } = get();
        const newConversation: Conversation = {
          id,
          doctorLanguage,
          patientLanguage,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: id,
        }));
        return id;
      },
      
      setCurrentConversation: (id) => set({ currentConversationId: id }),
      
      addMessage: (messageData) => {
        const id = uuidv4();
        const message: Message = {
          ...messageData,
          id,
          timestamp: new Date(),
        };
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === state.currentConversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, message],
                  updatedAt: new Date(),
                }
              : conv
          ),
        }));
      },
      
      updateMessageTranslation: (messageId, translatedText) => {
        set((state) => ({
          conversations: state.conversations.map((conv) => ({
            ...conv,
            messages: conv.messages.map((msg) =>
              msg.id === messageId ? { ...msg, translatedText } : msg
            ),
          })),
        }));
      },
      
      setIsRecording: (isRecording) => set({ isRecording }),
      
      setIsTranslating: (isTranslating) => set({ isTranslating }),
      
      setSummary: (conversationId, summary) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId ? { ...conv, summary } : conv
          ),
        }));
      },
      
      getCurrentConversation: () => {
        const { conversations, currentConversationId } = get();
        return conversations.find((c) => c.id === currentConversationId);
      },
      
      searchConversations: (query) => {
        const { conversations } = get();
        const results: { conversation: Conversation; message: Message; matchIndex: number }[] = [];
        const lowerQuery = query.toLowerCase();
        
        conversations.forEach((conversation) => {
          conversation.messages.forEach((message) => {
            const originalIndex = message.originalText.toLowerCase().indexOf(lowerQuery);
            const translatedIndex = message.translatedText.toLowerCase().indexOf(lowerQuery);
            
            if (originalIndex !== -1) {
              results.push({ conversation, message, matchIndex: originalIndex });
            } else if (translatedIndex !== -1) {
              results.push({ conversation, message, matchIndex: translatedIndex });
            }
          });
        });
        
        return results.sort((a, b) => 
          new Date(b.message.timestamp).getTime() - new Date(a.message.timestamp).getTime()
        );
      },
      
      deleteConversation: (id) => {
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          currentConversationId: state.currentConversationId === id ? null : state.currentConversationId,
        }));
      },
    }),
    {
      name: 'healthcare-translator-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        doctorLanguage: state.doctorLanguage,
        patientLanguage: state.patientLanguage,
      }),
    }
  )
);
