import React from 'react';
import { Player, PlayerMatchStats } from '../types/football';
import { formatMinutesOnly } from '../utils/matchUtils';
import { ArrowDownUp, AlertCircle, Sparkles, UserCheck } from 'lucide-react';

interface BenchProps {
  benchPlayers: Player[];
  playerStats?: Record<string, PlayerMatchStats>;
  selectedPlayerId: string | null;
  onSelectBenchPlayer: (playerId: string) => void;
  targetMinutes?: number;
  isSwapMode?: boolean;
}

export const Bench: React.FC<BenchProps> = ({
  benchPlayers,
  playerStats,
  selectedPlayerId,
  onSelectBenchPlayer,
  targetMinutes = 40,
  isSwapMode = false,
}) => {
  // Sort bench players to highlight those with the least minutes played (U12 fair play!)
  const sortedBench = [...benchPlayers].sort((a, b) => {
    const minsA = playerStats?.[a.id]?.secondsPlayed || 0;
    const minsB = playerStats?.[b.id]?.secondsPlayed || 0;
    return minsA - minsB;
  });

  return (
    <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 backdrop-blur-md shadow-xl">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
            Substitutes Bench
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-amber-500/20">
              {benchPlayers.length} Available
            </span>
          </h3>
        </div>

        {isSwapMode && (
          <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1 animate-bounce">
            <ArrowDownUp className="w-3.5 h-3.5" /> Tap player to swap IN
          </span>
        )}
      </div>

      {benchPlayers.length === 0 ? (
        <div className="text-center py-6 text-slate-400 text-xs sm:text-sm italic">
          No substitutes available. All present players are currently on the pitch!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {sortedBench.map((player, idx) => {
            const stats = playerStats?.[player.id];
            const secondsPlayed = stats?.secondsPlayed || 0;
            const minutesPlayed = Math.round(secondsPlayed / 60);
            const isSelected = selectedPlayerId === player.id;
            const isLeastMinutes = idx === 0 && benchPlayers.length > 1;

            const percentageOfTarget = Math.min(100, Math.round((minutesPlayed / targetMinutes) * 100));

            return (
              <div
                key={player.id}
                onClick={() => onSelectBenchPlayer(player.id)}
                className={`relative p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/10 scale-[1.02]'
                    : isSwapMode
                    ? 'bg-slate-800/80 hover:bg-amber-500/10 border-slate-700 hover:border-amber-400/50'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Fair play recommendation badge */}
                {isLeastMinutes && (
                  <div className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[9px] flex items-center gap-0.5 shadow">
                    <Sparkles className="w-2.5 h-2.5" /> Least Minutes
                  </div>
                )}

                <div className="flex items-center gap-2.5">
                  {/* Player Number Avatar */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs shadow shrink-0"
                    style={{ backgroundColor: player.avatarColor || '#3b82f6' }}
                  >
                    #{player.number}
                  </div>

                  {/* Player Info */}
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-100 text-xs sm:text-sm truncate">
                      {player.name}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-slate-400 font-mono">
                        Roles:
                      </span>
                      <div className="flex gap-1 overflow-hidden">
                        {player.preferredPositions.map(pos => (
                          <span
                            key={pos}
                            className="px-1 py-0.2 rounded text-[9px] font-bold bg-slate-700/80 text-emerald-300"
                          >
                            {pos}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Playing Time Gauge */}
                <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">
                    Played: <strong className="text-emerald-400 font-mono">{minutesPlayed}m</strong>
                    <span className="text-slate-500 text-[10px]"> / {targetMinutes}m</span>
                  </span>

                  <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden ml-2">
                    <div
                      className={`h-full transition-all ${
                        percentageOfTarget >= 75
                          ? 'bg-emerald-400'
                          : percentageOfTarget >= 40
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                      style={{ width: `${percentageOfTarget}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
