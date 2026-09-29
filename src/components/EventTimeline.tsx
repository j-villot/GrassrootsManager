import React from 'react';
import { MatchEvent, Player } from '../types/football';
import { Trophy, ArrowLeftRight, Clock, Shield, Trash2, Footprints } from 'lucide-react';

interface EventTimelineProps {
  events: MatchEvent[];
  players: Player[];
  onDeleteEvent: (eventId: string) => void;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  events,
  players,
  onDeleteEvent,
}) => {
  const playerMap = new Map(players.map(p => [p.id, p]));

  // Display newest events first
  const sortedEvents = [...events].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-white text-sm sm:text-base">
            Match Timeline & Events
          </h3>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
          {events.length} Event{events.length !== 1 ? 's' : ''}
        </span>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-6 text-slate-500 text-xs sm:text-sm italic">
          No match events recorded yet. Kick off the match and goals or substitutions will appear here!
        </div>
      ) : (
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {sortedEvents.map(evt => {
            const player = evt.playerId ? playerMap.get(evt.playerId) : undefined;
            const assistPlayer = evt.assistPlayerId ? playerMap.get(evt.assistPlayerId) : undefined;
            const subOutPlayer = evt.subOutPlayerId ? playerMap.get(evt.subOutPlayerId) : undefined;

            return (
              <div
                key={evt.id}
                className="group relative flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 transition-all text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Minute Badge */}
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg shrink-0">
                    {evt.minute}'
                  </span>

                  {/* Icon */}
                  <div className="shrink-0">
                    {evt.type === 'goal_us' && (
                      <span className="text-base" title="Goal scored!">⚽</span>
                    )}
                    {evt.type === 'goal_them' && (
                      <span className="text-base" title="Opponent goal">🥅</span>
                    )}
                    {evt.type === 'sub' && (
                      <ArrowLeftRight className="w-4 h-4 text-amber-400" />
                    )}
                    {evt.type === 'formation_change' && (
                      <Shield className="w-4 h-4 text-blue-400" />
                    )}
                    {evt.type.startsWith('period_') && (
                      <Clock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  {/* Description */}
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white truncate">
                      {evt.description}
                    </div>
                    {evt.detail && (
                      <div className="text-[11px] text-slate-400 truncate">
                        {evt.detail}
                      </div>
                    )}
                  </div>
                </div>

                {/* Delete / Undo action button */}
                <button
                  onClick={() => onDeleteEvent(evt.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all ml-2 shrink-0"
                  title="Remove this event"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
