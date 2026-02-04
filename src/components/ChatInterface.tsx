'use client';

import { useEffect, useRef, useState } from 'react';
import { useConversationStore } from '@/store/useConversationStore';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { RoleSelector } from './RoleSelector';
import { LanguageSelector } from './LanguageSelector';
import { ConversationSummaryPanel } from './ConversationSummary';
import { SearchPanel } from './SearchPanel';
import { ConversationList } from './ConversationList';
import { ConversationSummary, SUPPORTED_LANGUAGES } from '@/types';
import { 
  Menu, 
  Search, 
  FileText, 
  Settings,
  MessageSquare,
  ArrowLeftRight,
  AlertCircle,
  X
} from 'lucide-react';

export function ChatInterface() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [summary, setSummary] = useState<ConversationSummary | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    currentRole,
    doctorLanguage,
    patientLanguage,
    isTranslating,
    setCurrentRole,
    setDoctorLanguage,
    setPatientLanguage,
    createConversation,
    setCurrentConversation,
    addMessage,
    getCurrentConversation,
    setIsTranslating,
  } = useConversationStore();

  const currentConversation = getCurrentConversation();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  // Create a new conversation if none exists
  useEffect(() => {
    if (!currentConversation) {
      createConversation();
    }
  }, [currentConversation, createConversation]);

  const translateText = async (text: string, sourceLanguage: string, targetLanguage: string) => {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          sourceLanguage: SUPPORTED_LANGUAGES.find(l => l.code === sourceLanguage)?.name || sourceLanguage,
          targetLanguage: SUPPORTED_LANGUAGES.find(l => l.code === targetLanguage)?.name || targetLanguage,
          context: currentRole,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
        throw new Error(errorData.error || `Translation failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.translatedText) {
        throw new Error('Translation response is empty');
      }
      
      return data.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Translation failed';
      setError(`Translation error: ${errorMessage}. Please check your OpenAI API key configuration.`);
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
      return '';
    }
  };

  const transcribeAudio = async (audioBlob: Blob, language: string) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('language', language);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
        throw new Error(errorData.error || `Transcription failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.text) {
        throw new Error('Transcription response is empty');
      }
      
      return data.text;
    } catch (error) {
      console.error('Transcription error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Transcription failed';
      setError(`Transcription error: ${errorMessage}. Please try again.`);
      setTimeout(() => setError(null), 5000);
      return '';
    }
  };

  const handleSendText = async (text: string) => {
    if (!currentConversation) return;

    setIsTranslating(true);

    const sourceLanguage = currentRole === 'doctor' ? doctorLanguage : patientLanguage;
    const targetLanguage = currentRole === 'doctor' ? patientLanguage : doctorLanguage;

    // Add message immediately with empty translation
    addMessage({
      conversationId: currentConversation.id,
      role: currentRole,
      originalText: text,
      translatedText: '',
      originalLanguage: sourceLanguage,
      targetLanguage: targetLanguage,
      isAudio: false,
    });

    // Translate in background
    const translatedText = await translateText(text, sourceLanguage, targetLanguage);
    
    // Update the message with translation
    const messages = getCurrentConversation()?.messages;
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      useConversationStore.getState().updateMessageTranslation(lastMessage.id, translatedText);
    }

    setIsTranslating(false);
  };

  const handleSendAudio = async (audioBlob: Blob, duration: number) => {
    if (!currentConversation) return;

    setIsTranslating(true);

    const sourceLanguage = currentRole === 'doctor' ? doctorLanguage : patientLanguage;
    const targetLanguage = currentRole === 'doctor' ? patientLanguage : doctorLanguage;

    // Transcribe the audio
    const transcribedText = await transcribeAudio(audioBlob, sourceLanguage);
    
    if (!transcribedText) {
      setIsTranslating(false);
      return;
    }

    // Create audio URL for playback
    const audioUrl = URL.createObjectURL(audioBlob);

    // Add message with transcription
    addMessage({
      conversationId: currentConversation.id,
      role: currentRole,
      originalText: transcribedText,
      translatedText: '',
      originalLanguage: sourceLanguage,
      targetLanguage: targetLanguage,
      audioUrl,
      audioDuration: duration,
      isAudio: true,
    });

    // Translate the transcribed text
    const translatedText = await translateText(transcribedText, sourceLanguage, targetLanguage);
    
    // Update the message with translation
    const messages = getCurrentConversation()?.messages;
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      useConversationStore.getState().updateMessageTranslation(lastMessage.id, translatedText);
    }

    setIsTranslating(false);
  };

  const handleGenerateSummary = async () => {
    if (!currentConversation || currentConversation.messages.length === 0) return;

    setIsSummaryLoading(true);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: currentConversation.messages.map((m) => ({
            role: m.role,
            originalText: m.originalText,
            translatedText: m.translatedText,
          })),
        }),
      });

      if (!response.ok) throw new Error('Summarization failed');
      
      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Summarization error:', error);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const currentLanguage = currentRole === 'doctor' ? doctorLanguage : patientLanguage;
  const currentLanguageName = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)?.name || currentLanguage;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Sidebar */}
      <ConversationList 
        isOpen={showSidebar} 
        onClose={() => setShowSidebar(false)} 
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Error Banner */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100/50 border-b border-red-200 px-4 py-3 flex items-center justify-between gap-4 animate-slide-in">
            <div className="flex items-center gap-3 flex-1">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="p-1.5 text-red-600 hover:bg-red-200 rounded-lg transition-colors flex-shrink-0"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <header className="glass border-b border-slate-200/80 backdrop-blur-xl shadow-sm px-4 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(true)}
                className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-all duration-200 md:hidden active:scale-95"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden md:flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  MedTranslate
                </h1>
              </div>
            </div>

            <RoleSelector currentRole={currentRole} onRoleChange={setCurrentRole} />

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSearch(true)}
                className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                title="Search conversations"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setShowSummary(true);
                  if (!summary) handleGenerateSummary();
                }}
                disabled={!currentConversation || currentConversation.messages.length === 0}
                className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-sm hover:shadow-md"
                title="Generate summary"
              >
                <FileText className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2.5 rounded-xl transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md ${
                  showSettings 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mt-4 p-5 bg-gradient-to-br from-white to-slate-50/80 rounded-2xl border border-slate-200/60 shadow-lg animate-slide-in">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2 text-lg">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                </div>
                Language Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LanguageSelector
                  value={doctorLanguage}
                  onChange={setDoctorLanguage}
                  label="Doctor's Language"
                />
                <LanguageSelector
                  value={patientLanguage}
                  onChange={setPatientLanguage}
                  label="Patient's Language"
                />
              </div>
            </div>
          )}
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {!currentConversation || currentConversation.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 animate-fade-in">
              <div className="p-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl mb-6 shadow-xl shadow-blue-500/10">
                <MessageSquare className="w-20 h-20 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Start a Conversation</h2>
              <p className="text-center max-w-md text-slate-600 leading-relaxed mb-8">
                Select your role above and start typing or recording to begin the translation.
                Messages will be automatically translated between the doctor and patient languages.
              </p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2.5 px-4 py-2.5 bg-blue-50 rounded-xl border border-blue-100 shadow-sm">
                  <div className="w-3 h-3 bg-blue-600 rounded-full shadow-sm shadow-blue-600/50" />
                  <span className="font-medium text-slate-700">Doctor: {SUPPORTED_LANGUAGES.find(l => l.code === doctorLanguage)?.name}</span>
                </div>
                <div className="flex items-center gap-2.5 px-4 py-2.5 bg-green-50 rounded-xl border border-green-100 shadow-sm">
                  <div className="w-3 h-3 bg-green-600 rounded-full shadow-sm shadow-green-600/50" />
                  <span className="font-medium text-slate-700">Patient: {SUPPORTED_LANGUAGES.find(l => l.code === patientLanguage)?.name}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {currentConversation.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <ChatInput
          onSendText={handleSendText}
          onSendAudio={handleSendAudio}
          isTranslating={isTranslating}
          placeholder={`Type as ${currentRole} (${currentLanguageName})...`}
        />
      </div>

      {/* Search Panel */}
      {showSearch && (
        <SearchPanel
          onClose={() => setShowSearch(false)}
          onSelectConversation={(id) => {
            setCurrentConversation(id);
            setShowSearch(false);
          }}
        />
      )}

      {/* Summary Panel */}
      {showSummary && (
        <ConversationSummaryPanel
          summary={summary}
          isLoading={isSummaryLoading}
          onClose={() => setShowSummary(false)}
          onGenerate={handleGenerateSummary}
        />
      )}
    </div>
  );
}
