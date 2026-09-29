import React, { useState } from 'react';
import { Player } from '../types/football';
import confetti from 'canvas-confetti';
import { Trophy, X, Plus, Sparkles, Check } from 'lucide-react';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGoal: (scorerId: string, assistId?: string, minute?: number) => void;
  onPitchPlayers: Player[];
  allPlayers: Player[];
  currentMinute: number;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onSaveGoal,
  onPitchPlayers,
  allPlayers,
  currentMinute,
}) => {
  const [selectedScorerId, setSelectedScorerId] = useState<string>(
    onPitchPlayers[0]?.id || ''
  );
  const [selectedAssistId, setSelectedAssistId] = useState<string>('');
  const [minute, setMinute] = useState<number>(currentMinute);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!selectedScorerId) return;

    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    onSaveGoal(
      selectedScorerId,
      selectedAssistId ? selectedAssistId : undefined,
      minute
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Trophy className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg">
                Record Goal! ⚽
              </h3>
              <p className="text-xs text-slate-400">Select goal scorer and assist</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Minute Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Goal Minute
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="120"
              value={minute}
              onChange={e => setMinute(parseInt(e.target.value) || 0)}
              className="w-24 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
            />
            <span className="text-xs text-slate-400">minute of match</span>
          </div>
        </div>

        {/* Goal Scorer Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Goal Scorer <span className="text-rose-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {onPitchPlayers.map(p => {
              const isSelected = selectedScorerId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedScorerId(p.id)}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-400 ring-1 ring-emerald-400'
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700'
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0"
                    style={{ backgroundColor: p.avatarColor || '#3b82f6' }}
                  >
                    #{p.number}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate">{p.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {p.preferredPositions[0]}
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Assist Selection (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Assist (Optional)
          </label>
          <select
            value={selectedAssistId}
            onChange={e => setSelectedAssistId(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="">-- No direct assist / Solo effort --</option>
            {allPlayers
              .filter(p => p.id !== selectedScorerId)
              .map(p => (
                <option key={p.id} value={p.id}>
                  #{p.number} {p.name}
                </option>
              ))}
          </select>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSave}
          disabled={!selectedScorerId}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <Sparkles className="w-4 h-4" /> Save Goal & Celebrate
        </button>
      </div>
    </div>
  );
};
