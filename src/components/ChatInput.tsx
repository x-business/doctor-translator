'use client';

import { useState, useRef, useEffect } from 'react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { Mic, MicOff, Send, Loader2, X } from 'lucide-react';

interface ChatInputProps {
  onSendText: (text: string) => Promise<void>;
  onSendAudio: (audioBlob: Blob, duration: number) => Promise<void>;
  isTranslating: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSendText,
  onSendAudio,
  isTranslating,
  disabled = false,
  placeholder = 'Type your message...',
}: ChatInputProps) {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const {
    isRecording,
    audioBlob,
    audioUrl,
    duration,
    startRecording,
    stopRecording,
    clearRecording,
    error: recordingError,
  } = useAudioRecorder();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSendText = async () => {
    if (!text.trim() || isSending || disabled) return;
    
    setIsSending(true);
    try {
      await onSendText(text.trim());
      setText('');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const handleToggleRecording = async () => {
    if (isRecording) {
      const blob = await stopRecording();
      // Audio will be available in audioBlob state
    } else {
      await startRecording();
    }
  };

  const handleSendAudio = async () => {
    if (!audioBlob) return;
    
    setIsSending(true);
    try {
      await onSendAudio(audioBlob, duration);
      clearRecording();
    } finally {
      setIsSending(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="border-t border-slate-200/80 glass backdrop-blur-xl p-4 md:p-6 shadow-lg shadow-slate-900/5">
      {recordingError && (
        <div className="mb-3 p-3 bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200 text-red-700 text-sm rounded-xl shadow-sm animate-slide-in">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            {recordingError}
          </div>
        </div>
      )}

      {/* Audio Preview */}
      {audioUrl && !isRecording && (
        <div className="mb-4 p-4 bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200/60 shadow-md flex items-center gap-3 animate-slide-in">
          <audio src={audioUrl} controls className="flex-1 h-10" />
          <div className="px-3 py-1.5 bg-slate-100 rounded-lg">
            <span className="text-sm font-medium text-slate-600">{formatDuration(duration)}</span>
          </div>
          <button
            onClick={clearRecording}
            className="p-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 active:scale-95"
            title="Discard recording"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={handleSendAudio}
            disabled={isSending || disabled}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg shadow-blue-500/30 transition-all duration-200 active:scale-95"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send
          </button>
        </div>
      )}

      {/* Recording Indicator */}
      {isRecording && (
        <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200 rounded-2xl flex items-center gap-3 animate-slide-in shadow-md">
          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
          <span className="text-red-700 font-semibold">Recording...</span>
          <div className="px-3 py-1 bg-red-100 rounded-lg">
            <span className="text-red-700 font-medium">{formatDuration(duration)}</span>
          </div>
          <button
            onClick={handleToggleRecording}
            className="ml-auto px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 flex items-center gap-2 font-medium shadow-lg shadow-red-500/30 transition-all duration-200 active:scale-95"
          >
            <MicOff className="w-4 h-4" />
            Stop
          </button>
        </div>
      )}

      {/* Text Input */}
      {!audioUrl && !isRecording && (
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled || isSending}
              rows={1}
              className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:bg-slate-50 disabled:cursor-not-allowed bg-white shadow-sm transition-all duration-200 placeholder:text-slate-400 text-slate-800"
            />
          </div>
          
          <button
            onClick={handleToggleRecording}
            disabled={disabled || isSending}
            className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 rounded-2xl hover:from-slate-200 hover:to-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg"
            title="Record voice message"
          >
            <Mic className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleSendText}
            disabled={!text.trim() || disabled || isSending || isTranslating}
            className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95"
            title="Send message"
          >
            {isSending || isTranslating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
