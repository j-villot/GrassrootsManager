# ⚽ Grassroots FC Manager (U12)

A grassroots football management web app tailored for **Grassroots Youth Football Coaches (specifically U12)**. Designed for matchday sidelines: drag-and-drop tactical formations, multi-phase rotations, 3-1-3-1 system support, game-by-game management with season stats, fair playing time tracking, and instant goal recording.

---

## 🌟 Key Features

### 1. 📐 3-1-3-1 Formation & Interactive Pitch Drag-and-Drop
- **Premier 3-1-3-1 Support**: Pre-configured as the default 9v9 formation with:
  - 1 Goalkeeper (`GK`)
  - 3 Defenders (`LCB`, `CB`, `RCB`)
  - 1 Dedicated Defensive Midfielder / Holding Pivot (`CDM`)
  - 3 Attacking Midfielders / Wingers (`LM`, `CAM`, `RM`)
  - 1 Striker (`ST`)
- **Direct Drag-and-Drop on Pitch**:
  - Touch or click & drag any player pin anywhere on the tactical pitch to tweak width, depth, or custom shapes.
  - Smart discrimination between dragging (moving position) and tapping (swapping players).
  - "Reset Shape" button to snap back to standard preset coordinates whenever needed.

### 2. 📅 Game-by-Game Matchday & Season Hub
- **Individual Game Tracking**: Create, switch, and manage matches game by game (e.g. "vs Red Star Rovers (Home)", "vs Blue Hawks (Away)").
- **Create New Matches**: Pick opponent, match date, venue (Home/Away), and clone the lineup/plan from any previous match.
- **Season Fair Play & Cumulative Analytics**:
  - Total minutes played across ALL matches this season for each player.
  - Overall record (Wins, Draws, Losses, Goals Scored, Goals Conceded).
  - Season top scorers and assists.

### 3. 📋 Multi-Formation Game Plan (Up to 5 Formations per Game)
- Pre-plan up to **5 tactical phases** across the match (e.g. Quarter 1 `0'`, Quarter 2 `15'`, Quarter 3 `30'`, Quarter 4 `45'`, or defensive closer).
- Pick different formations for each phase (e.g. **3-1-3-1**, **3-3-2**, **3-2-3**, **3-4-1**, **2-4-2**, **4-3-1**).
- **Substitutions Diff & Tracking**:
  - Automatically compares Phase N with Phase N-1.
  - Highlights who is coming **IN (▲)**, who is going **OUT (▼)**, and which positions shifted.

### 4. ⏱️ Matchday Live & Substitution Alert
- **Live Match Clock**: Accurate second-by-second match timer with Play / Pause / Period advance / Sync (+/- 1 min for referee stoppage).
- **Scheduled Substitution Popups**: High-visibility alert prompts the coach at the planned minute with 1-tap "Apply Substitutions & Formation Now".
- **On-the-Fly Quick Swaps**:
  - Tap any player on the live pitch -> tap a bench player or another slot to make immediate tactical or injury subs.

### 5. ⚖️ Playing Time & Fair Play Analytics
- Live tracking of seconds/minutes played on pitch vs seconds on bench.
- **Fair Play Indicator**: Disparity warning if playing time spread between players grows too high.
- **Bench Fair Play Priority**: Highlights players with the fewest minutes.

### 6. ⚽ Goal & Match Event Tracking
- Tactile **"+ GOAL!"** button with goalscorer selection, optional assist, and confetti celebration.
- Full chronological match event log with undo capability.

---

## 🚀 Running the App

```bash
# Start development server
npm run dev

# Run production build
npm run build
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.
