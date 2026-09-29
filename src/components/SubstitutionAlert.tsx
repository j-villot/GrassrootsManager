import React from 'react';
import { FormationPhase, Player } from '../types/football';
import { getFormationById } from '../constants/formations';
import { calculatePhaseDiff } from '../utils/matchUtils';
import { ArrowLeftRight, Bell, Check, X, Shield, ArrowRight } from 'lucide-react';

interface SubstitutionAlertProps {
  phase: FormationPhase;
  currentAssignments: Record<string, string>;
  currentFormationId: string;
  players: Player[];
  onApply: () => void;
  onDismiss: () => void;
}

export const SubstitutionAlert: React.FC<SubstitutionAlertProps> = ({
  phase,
  currentAssignments,
  currentFormationId,
  players,
  onApply,
  onDismiss,
}) => {
  const diff = calculatePhaseDiff(
    currentAssignments,
    phase.assignments,
    currentFormationId,
    phase.formationId,
    players
  );

  const newFormation = getFormationById(phase.formationId);
  const oldFormation = getFormationById(currentFormationId);

  return (
    <div className="fixed inset-x-4 top-20 z-50 max-w-xl mx-auto animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-slate-900 border-2 border-amber-500 rounded-3xl p-5 shadow-2xl shadow-amber-500/20 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                  Minute {phase.targetMinute}' Due
                </span>
                <span className="text-xs font-semibold text-slate-400">Scheduled Rotation</span>
              </div>
              <h3 className="font-extrabold text-white text-base sm:text-lg mt-0.5">
                {phase.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formation change note */}
        {diff.formationChanged && (
          <div className="mt-3 text-xs bg-emerald-500/10 text-emerald-300 px-3 py-2 rounded-xl border border-emerald-500/20 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>
              Formation will switch: <strong>{oldFormation.name.split(' ')[0]}</strong> → <strong>{newFormation.name.split(' ')[0]}</strong>
            </span>
          </div>
        )}

        {/* Substitutions breakdown */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Players Coming In */}
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="font-bold text-emerald-400 mb-1.5 flex items-center gap-1">
              <span>▲ IN to Pitch ({diff.subIns.length})</span>
            </div>
            {diff.subIns.length === 0 ? (
              <span className="text-slate-400 italic text-[11px]">No bench players coming on</span>
            ) : (
              <div className="space-y-1">
                {diff.subIns.map(p => (
                  <div key={p.id} className="flex items-center gap-1.5 font-semibold text-emerald-200">
                    <span className="w-5 h-5 rounded-full bg-emerald-800/80 text-[10px] flex items-center justify-center text-white">
                      #{p.number}
                    </span>
                    <span className="truncate">{p.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Players Coming Out */}
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <div className="font-bold text-rose-400 mb-1.5 flex items-center gap-1">
              <span>▼ OUT to Bench ({diff.subOuts.length})</span>
            </div>
            {diff.subOuts.length === 0 ? (
              <span className="text-slate-400 italic text-[11px]">No players coming off</span>
            ) : (
              <div className="space-y-1">
                {diff.subOuts.map(p => (
                  <div key={p.id} className="flex items-center gap-1.5 font-semibold text-rose-200">
                    <span className="w-5 h-5 rounded-full bg-rose-800/80 text-[10px] flex items-center justify-center text-white">
                      #{p.number}
                    </span>
                    <span className="truncate">{p.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={onApply}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <Check className="w-4 h-4 stroke-[3]" /> Apply Substitutions & Formation Now
          </button>
          <button
            onClick={onDismiss}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm border border-slate-700 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
