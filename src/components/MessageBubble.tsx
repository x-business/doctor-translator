'use client';

import { Message, SUPPORTED_LANGUAGES } from '@/types';
import { format } from 'date-fns';
import { Mic, Stethoscope, User, Volume2 } from 'lucide-react';
import { useRef, useState } from 'react';

interface MessageBubbleProps {
  message: Message;
  highlightText?: string;
}

export function MessageBubble({ message, highlightText }: MessageBubbleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isDoctor = message.role === 'doctor';
  const sourceLang = SUPPORTED_LANGUAGES.find((l) => l.code === message.originalLanguage);
  const targetLang = SUPPORTED_LANGUAGES.find((l) => l.code === message.targetLanguage);

  const highlightMatch = (text: string) => {
    if (!highlightText) return text;
    const regex = new RegExp(`(${highlightText})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-300 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const playAudio = () => {
    if (message.audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div
      className={`flex ${isDoctor ? 'justify-start' : 'justify-end'} mb-6 animate-slide-in`}
    >
      <div
        className={`max-w-[85%] md:max-w-[75%] ${
          isDoctor ? 'order-2' : 'order-1'
        }`}
      >
        <div
          className={`flex items-center gap-2.5 mb-2 ${
            isDoctor ? 'flex-row' : 'flex-row-reverse'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 ${
              isDoctor 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/30' 
                : 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-500/30'
            }`}
          >
            {isDoctor ? <Stethoscope className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </div>
          <span className="text-xs font-medium text-slate-600">
            {isDoctor ? 'Doctor' : 'Patient'} • {format(new Date(message.timestamp), 'HH:mm')}
          </span>
        </div>

        <div
          className={`rounded-3xl px-5 py-4 shadow-lg card-hover ${
            isDoctor
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tl-md'
              : 'bg-gradient-to-br from-green-500 to-green-600 text-white rounded-tr-md'
          }`}
        >
          {message.isAudio && (
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/20">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Mic className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium opacity-90">Voice message</span>
              {message.audioDuration && (
                <span className="text-xs opacity-75">
                  ({Math.floor(message.audioDuration / 60)}:{String(message.audioDuration % 60).padStart(2, '0')})
                </span>
              )}
            </div>
          )}
          
          <p className="text-sm md:text-base leading-relaxed font-medium">{highlightMatch(message.originalText)}</p>
          
          {message.audioUrl && (
            <div className="mt-3 pt-3 border-t border-white/20">
              <button
                onClick={playAudio}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 active:scale-95 ${
                  isDoctor 
                    ? 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm' 
                    : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                }`}
              >
                <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                {isPlaying ? 'Playing...' : 'Play Audio'}
              </button>
              <audio
                ref={audioRef}
                src={message.audioUrl}
                onEnded={handleAudioEnded}
                className="hidden"
              />
            </div>
          )}
        </div>

        {message.translatedText && (
          <div
            className={`mt-3 rounded-3xl px-5 py-4 bg-gradient-to-br from-white to-slate-50 border border-slate-200/60 shadow-md card-hover ${
              isDoctor ? 'rounded-tl-md' : 'rounded-tr-md'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="px-2.5 py-1 bg-slate-100 rounded-lg">
                <span className="text-xs font-semibold text-slate-600">
                  {sourceLang?.name} → {targetLang?.name}
                </span>
              </div>
            </div>
            <p className="text-sm md:text-base text-slate-800 leading-relaxed">
              {highlightMatch(message.translatedText)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
