'use client';

import { useConversationStore } from '@/store/useConversationStore';
import { format } from 'date-fns';
import { MessageSquare, Plus, Trash2, X } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@/types';

interface ConversationListProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConversationList({ isOpen, onClose }: ConversationListProps) {
  const {
    conversations,
    currentConversationId,
    setCurrentConversation,
    createConversation,
    deleteConversation,
  } = useConversationStore();

  const handleNewConversation = () => {
    createConversation();
    onClose();
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversation(id);
    onClose();
  };

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this conversation?')) {
      deleteConversation(id);
    }
  };

  const getLanguageName = (code: string) => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === code)?.name || code;
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative inset-y-0 left-0 w-80 glass backdrop-blur-xl border-r border-slate-200/80 z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } flex flex-col shadow-xl`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200/80 bg-gradient-to-r from-white to-slate-50/50 flex items-center justify-between">
          <h2 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Conversations
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleNewConversation}
              className="p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30 active:scale-95"
              title="New conversation"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200 md:hidden active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-slate-500 animate-fade-in">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-4 shadow-lg">
                <MessageSquare className="w-12 h-12 text-blue-600" />
              </div>
              <p className="text-center font-medium text-slate-600 mb-2">No conversations yet</p>
              <p className="text-center text-sm text-slate-500 mb-6">Start a new conversation to begin</p>
              <button
                onClick={handleNewConversation}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-semibold shadow-lg shadow-blue-500/30 active:scale-95"
              >
                Start a conversation
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation.id)}
                  className={`w-full p-4 text-left rounded-xl transition-all duration-200 card-hover cursor-pointer ${
                    currentConversationId === conversation.id 
                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-md' 
                      : 'bg-white/60 hover:bg-white border border-slate-200/60 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg font-semibold shadow-sm">
                          {getLanguageName(conversation.doctorLanguage)}
                        </span>
                        <span className="text-xs text-slate-400 font-bold">↔</span>
                        <span className="text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-lg font-semibold shadow-sm">
                          {getLanguageName(conversation.patientLanguage)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 truncate font-medium mb-1">
                        {conversation.messages.length > 0
                          ? conversation.messages[conversation.messages.length - 1].originalText
                          : 'No messages yet'}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        {format(new Date(conversation.updatedAt), 'MMM d, yyyy HH:mm')}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteConversation(e, conversation.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-95"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
