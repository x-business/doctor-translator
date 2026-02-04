'use client';

import { ConversationSummary as SummaryType } from '@/types';
import { 
  FileText, 
  Stethoscope, 
  Pill, 
  Calendar, 
  AlertCircle,
  Activity,
  X,
  Loader2
} from 'lucide-react';

interface ConversationSummaryProps {
  summary: SummaryType | null;
  isLoading: boolean;
  onClose: () => void;
  onGenerate: () => void;
}

export function ConversationSummaryPanel({
  summary,
  isLoading,
  onClose,
  onGenerate,
}: ConversationSummaryProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass backdrop-blur-xl bg-white/95 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200/60 animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200/80 bg-gradient-to-r from-white to-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Conversation Summary
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-6 shadow-lg">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
              <p className="text-slate-700 font-semibold text-lg mb-1">Generating summary...</p>
              <p className="text-sm text-slate-500">Analyzing conversation for medical insights</p>
            </div>
          ) : summary ? (
            <div className="space-y-4 animate-fade-in">
              {/* Overview */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-5 border border-blue-200/60 shadow-md">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5" />
                  Overview
                </h3>
                <p className="text-blue-800 leading-relaxed">{summary.overview}</p>
              </div>

              {/* Symptoms */}
              {summary.symptoms.length > 0 && (
                <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-5 border border-orange-200/60 shadow-md">
                  <h3 className="font-bold text-orange-900 mb-3 flex items-center gap-2 text-lg">
                    <Activity className="w-5 h-5" />
                    Symptoms Reported
                  </h3>
                  <ul className="space-y-2">
                    {summary.symptoms.map((symptom, i) => (
                      <li key={i} className="text-orange-800 flex items-start gap-3 leading-relaxed">
                        <span className="text-orange-500 mt-1.5 font-bold">•</span>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Diagnoses */}
              {summary.diagnoses.length > 0 && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-5 border border-purple-200/60 shadow-md">
                  <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2 text-lg">
                    <Stethoscope className="w-5 h-5" />
                    Diagnoses / Conditions
                  </h3>
                  <ul className="space-y-2">
                    {summary.diagnoses.map((diagnosis, i) => (
                      <li key={i} className="text-purple-800 flex items-start gap-3 leading-relaxed">
                        <span className="text-purple-500 mt-1.5 font-bold">•</span>
                        <span>{diagnosis}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Medications */}
              {summary.medications.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-5 border border-green-200/60 shadow-md">
                  <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2 text-lg">
                    <Pill className="w-5 h-5" />
                    Medications
                  </h3>
                  <ul className="space-y-2">
                    {summary.medications.map((medication, i) => (
                      <li key={i} className="text-green-800 flex items-start gap-3 leading-relaxed">
                        <span className="text-green-500 mt-1.5 font-bold">•</span>
                        <span>{medication}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Follow-up Actions */}
              {summary.followUpActions.length > 0 && (
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-2xl p-5 border border-yellow-200/60 shadow-md">
                  <h3 className="font-bold text-yellow-900 mb-3 flex items-center gap-2 text-lg">
                    <Calendar className="w-5 h-5" />
                    Follow-up Actions
                  </h3>
                  <ul className="space-y-2">
                    {summary.followUpActions.map((action, i) => (
                      <li key={i} className="text-yellow-800 flex items-start gap-3 leading-relaxed">
                        <span className="text-yellow-600 mt-1.5 font-bold">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Points */}
              {summary.keyPoints.length > 0 && (
                <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-5 border border-slate-200/60 shadow-md">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-lg">
                    <AlertCircle className="w-5 h-5" />
                    Key Points
                  </h3>
                  <ul className="space-y-2">
                    {summary.keyPoints.map((point, i) => (
                      <li key={i} className="text-slate-700 flex items-start gap-3 leading-relaxed">
                        <span className="text-slate-400 mt-1.5 font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-6 shadow-lg">
                <FileText className="w-12 h-12 text-blue-600" />
              </div>
              <p className="text-slate-600 mb-2 font-semibold">No summary generated yet</p>
              <p className="text-sm text-slate-500 mb-6">Generate a summary to see medical insights</p>
              <button
                onClick={onGenerate}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg shadow-blue-500/30 active:scale-95"
              >
                Generate Summary
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {summary && (
          <div className="p-5 border-t border-slate-200/80 bg-gradient-to-r from-slate-50 to-blue-50/30">
            <button
              onClick={onGenerate}
              disabled={isLoading}
              className="w-full px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg shadow-blue-500/30 active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Regenerating...
                </>
              ) : (
                'Regenerate Summary'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
