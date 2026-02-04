'use client';

import { useState } from 'react';
import { useConversationStore } from '@/store/useConversationStore';
import { format } from 'date-fns';
import { Search, X, MessageSquare, Stethoscope, User } from 'lucide-react';

interface SearchPanelProps {
  onClose: () => void;
  onSelectConversation: (conversationId: string) => void;
}

export function SearchPanel({ onClose, onSelectConversation }: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const { searchConversations } = useConversationStore();

  const results = query.trim() ? searchConversations(query) : [];

  const highlightMatch = (text: string, searchQuery: string) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-300 px-1.5 py-0.5 rounded font-semibold text-slate-900">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getContext = (text: string, matchIndex: number, contextLength: number = 50) => {
    const start = Math.max(0, matchIndex - contextLength);
    const end = Math.min(text.length, matchIndex + query.length + contextLength);
    let context = text.slice(start, end);
    if (start > 0) context = '...' + context;
    if (end < text.length) context = context + '...';
    return context;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-20 animate-fade-in">
      <div className="glass backdrop-blur-xl bg-white/95 rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200/60 animate-slide-in">
        {/* Search Header */}
        <div className="p-5 border-b border-slate-200/80 bg-gradient-to-r from-white to-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search conversations..."
                autoFocus
                className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={onClose}
              className="p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500 animate-fade-in">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-4 shadow-lg">
                <Search className="w-12 h-12 text-blue-600" />
              </div>
              <p className="font-medium text-slate-600">Enter a search term to find messages</p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500 animate-fade-in">
              <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-4 shadow-lg">
                <MessageSquare className="w-12 h-12 text-slate-400" />
              </div>
              <p className="font-medium text-slate-600">No results found for &quot;{query}&quot;</p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map(({ conversation, message, matchIndex }, index) => (
                <button
                  key={`${message.id}-${index}`}
                  onClick={() => {
                    onSelectConversation(conversation.id);
                    onClose();
                  }}
                  className="w-full p-4 text-left rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 card-hover border border-slate-200/60 bg-white/60"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                        message.role === 'doctor'
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                          : 'bg-gradient-to-br from-green-500 to-green-600 text-white'
                      }`}
                    >
                      {message.role === 'doctor' ? (
                        <Stethoscope className="w-4 h-4" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 capitalize">
                      {message.role}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {format(new Date(message.timestamp), 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                  <p className="text-slate-800 text-sm leading-relaxed">
                    {highlightMatch(
                      getContext(
                        message.originalText.toLowerCase().includes(query.toLowerCase())
                          ? message.originalText
                          : message.translatedText,
                        matchIndex
                      ),
                      query
                    )}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="p-4 border-t border-slate-200/80 bg-gradient-to-r from-slate-50 to-blue-50/30">
            <p className="text-sm font-semibold text-slate-600 text-center">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
