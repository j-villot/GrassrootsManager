import React, { useState } from 'react';
import { Game, Player, MatchSettings } from '../types/football';
import { formatTime } from '../utils/matchUtils';
import {
  Calendar,
  Plus,
  Trophy,
  CheckCircle2,
  Clock,
  Trash2,
  Copy,
  ChevronRight,
  Shield,
  ArrowRight,
  MapPin,
  TrendingUp,
  X,
} from 'lucide-react';

interface GameManagerProps {
  games: Game[];
  activeGameId: string;
  onSelectGame: (gameId: string) => void;
  onCreateGame: (newGame: Partial<Game>, copyFromGameId?: string) => void;
  onDeleteGame: (gameId: string) => void;
  onUpdateGameStatus: (gameId: string, status: 'upcoming' | 'in_progress' | 'completed') => void;
  players: Player[];
  isOpen: boolean;
  onClose: () => void;
}

export const GameManager: React.FC<GameManagerProps> = ({
  games,
  activeGameId,
  onSelectGame,
  onCreateGame,
  onDeleteGame,
  onUpdateGameStatus,
  players,
  isOpen,
  onClose,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [opponentName, setOpponentName] = useState('');
  const [matchDate, setMatchDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [venue, setVenue] = useState<'Home' | 'Away'>('Home');
  const [copyPlanFromId, setCopyPlanFromId] = useState<string>('');
  const [viewTab, setViewTab] = useState<'matches' | 'season'>('matches');

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opponentName.trim()) return;

    onCreateGame(
      {
        opponentName: opponentName.trim(),
        date: matchDate,
        venue,
        title: `vs ${opponentName.trim()} (${venue})`,
      },
      copyPlanFromId || undefined
    );

    setOpponentName('');
    setIsCreating(false);
  };

  // Calculate Season Cumulative Stats
  const seasonStats: Record<string, { minutes: number; goals: number; assists: number; gamesPlayed: number }> = {};
  players.forEach(p => {
    seasonStats[p.id] = { minutes: 0, goals: 0, assists: 0, gamesPlayed: 0 };
  });

  let totalGoalsScored = 0;
  let totalGoalsConceded = 0;
  let wins = 0;
  let draws = 0;
  let losses = 0;

  games.forEach(g => {
    totalGoalsScored += g.scoreUs;
    totalGoalsConceded += g.scoreThem;
    if (g.status === 'completed') {
      if (g.scoreUs > g.scoreThem) wins++;
      else if (g.scoreUs === g.scoreThem) draws++;
      else losses++;
    }

    Object.entries(g.playerStats || {}).forEach(([pid, stats]) => {
      if (seasonStats[pid]) {
        seasonStats[pid].minutes += Math.round(stats.secondsPlayed / 60);
        seasonStats[pid].goals += stats.goals || 0;
        seasonStats[pid].assists += stats.assists || 0;
        if (stats.secondsPlayed > 0) seasonStats[pid].gamesPlayed += 1;
      }
    });
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 max-w-3xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg sm:text-xl">
                Matchday & Season Hub
              </h3>
              <p className="text-xs text-slate-400">
                Manage games individually, switch matchdays, and track season-long minutes.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Switcher: Matches List vs Season Stats */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewTab('matches')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                viewTab === 'matches'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Matches ({games.length})
            </button>
            <button
              onClick={() => setViewTab('season')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                viewTab === 'season'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Season Fair Play & Stats
            </button>
          </div>

          {!isCreating && viewTab === 'matches' && (
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> New Match
            </button>
          )}
        </div>

        {/* Create New Match Form */}
        {isCreating && (
          <form
            onSubmit={handleCreateSubmit}
            className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-4 animate-in fade-in"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" /> Create New Matchday
              </h4>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Opponent Team Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blue Hawks FC"
                  value={opponentName}
                  onChange={e => setOpponentName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Match Date
                </label>
                <input
                  type="date"
                  value={matchDate}
                  onChange={e => setMatchDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Venue
                </label>
                <select
                  value={venue}
                  onChange={e => setVenue(e.target.value as 'Home' | 'Away')}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Home">Home Match 🏠</option>
                  <option value="Away">Away Match 🚌</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Copy Game Plan & Formations From:
              </label>
              <select
                value={copyPlanFromId}
                onChange={e => setCopyPlanFromId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- Use Standard 3-1-3-1 Formation Default Plan --</option>
                {games.map(g => (
                  <option key={g.id} value={g.id}>
                    Copy from: vs {g.opponentName} ({g.date})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30"
              >
                Create & Switch to Match
              </button>
            </div>
          </form>
        )}

        {/* TAB 1: MATCHES LIST */}
        {viewTab === 'matches' && (
          <div className="space-y-3">
            {games.map(g => {
              const isActive = g.id === activeGameId;
              const isCompleted = g.status === 'completed';

              return (
                <div
                  key={g.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isActive
                      ? 'bg-slate-800/90 border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg'
                      : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Left: Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold text-xs shrink-0 shadow ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-slate-900 text-slate-300 border border-slate-700'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-mono">{g.venue}</span>
                      <span className="text-sm font-extrabold">{g.scoreUs}:{g.scoreThem}</span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-white text-sm sm:text-base truncate">
                          vs {g.opponentName}
                        </h4>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            CURRENT
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5 text-xs text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Calendar className="w-3 h-3 text-slate-500" /> {g.date}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-emerald-400 font-semibold">
                          {formatTime(g.elapsedSeconds)}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{g.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Status Pill / Toggle */}
                    <button
                      onClick={() =>
                        onUpdateGameStatus(
                          g.id,
                          isCompleted ? 'in_progress' : 'completed'
                        )
                      }
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
                        isCompleted
                          ? 'bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                      }`}
                      title="Click to toggle match completion status"
                    >
                      {isCompleted ? '✓ Completed' : '⏱️ In Progress'}
                    </button>

                    {!isActive && (
                      <button
                        onClick={() => {
                          onSelectGame(g.id);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all active:scale-95"
                      >
                        Load Game
                      </button>
                    )}

                    {games.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete match vs ${g.opponentName}?`)) {
                            onDeleteGame(g.id);
                          }
                        }}
                        className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete game"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: SEASON CUMULATIVE STATS */}
        {viewTab === 'season' && (
          <div className="space-y-4">
            {/* Season Record Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Matches</span>
                <span className="text-xl font-black text-white">{games.length}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Record (W-D-L)</span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {wins}-{draws}-{losses}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Goals For</span>
                <span className="text-xl font-black text-teal-400 font-mono">⚽ {totalGoalsScored}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Goals Against</span>
                <span className="text-xl font-black text-rose-400 font-mono">🥅 {totalGoalsConceded}</span>
              </div>
            </div>

            {/* Cumulative Playing Time Table */}
            <div className="border border-slate-800 rounded-2xl overflow-hidden shadow">
              <div className="bg-slate-800/80 px-4 py-2.5 font-bold text-xs text-white border-b border-slate-800 flex items-center justify-between">
                <span>Cumulative Squad Playing Time & Goals</span>
                <span className="text-[11px] text-slate-400 font-normal">All matches combined</span>
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Player</th>
                    <th className="py-2.5 px-3">Primary Roles</th>
                    <th className="py-2.5 px-3 text-center">Apps</th>
                    <th className="py-2.5 px-3 text-right">Total Mins</th>
                    <th className="py-2.5 px-3 text-right">Goals</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {players.map(p => {
                    const stats = seasonStats[p.id] || { minutes: 0, goals: 0, assists: 0, gamesPlayed: 0 };
                    return (
                      <tr key={p.id} className="hover:bg-slate-800/30">
                        <td className="py-2 px-3 font-semibold text-white flex items-center gap-2">
                          <span className="font-mono text-slate-400">#{p.number}</span>
                          <span>{p.name}</span>
                        </td>
                        <td className="py-2 px-3 text-slate-400">
                          {p.preferredPositions.slice(0, 2).join(', ')}
                        </td>
                        <td className="py-2 px-3 text-center font-mono text-slate-300">
                          {stats.gamesPlayed}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-emerald-400">
                          {stats.minutes}m
                        </td>
                        <td className="py-2 px-3 text-right font-semibold text-white">
                          {stats.goals > 0 ? `⚽ ${stats.goals}` : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
