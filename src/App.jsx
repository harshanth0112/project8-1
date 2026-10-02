import React, { useState, useEffect, useCallback } from 'react';
import { TubesBackground } from './TubesBackground';
import { Plus, Minus, RotateCcw, Undo2, Redo2, Moon, Sun, History as HistoryIcon, Target, Activity } from 'lucide-react';
import { cn } from './utils';

/* ── Shared style helpers (all driven by CSS vars in index.css) ─────────────── */
const T = {
  // Surfaces
  card:    'bg-[var(--color-card)] border-[var(--color-border)]',
  cardSec: 'bg-[var(--color-card-sec)] border-[var(--color-border)]',
  header:  'bg-[var(--color-header)] border-[var(--color-border)]',
  footer:  'bg-[var(--color-footer)] border-[var(--color-border)]',

  // Typography
  textPrim: 'text-[var(--color-text-prim)]',
  textBody: 'text-[var(--color-text-body)]',
  textSec:  'text-[var(--color-text-sec)]',
  textDis:  'text-[var(--color-text-dis)]',

  // Accent
  accent:    'bg-[var(--color-accent)] hover:bg-[var(--color-accent-h)] text-white',
  accentSub: 'bg-[var(--color-accent-sub)] text-[var(--color-accent)]',

  // Ghost button (neutral)
  ghost: 'bg-[var(--color-card-sec)] hover:brightness-95 text-[var(--color-text-body)] border-[var(--color-border)]',

  // Input
  input: 'bg-[var(--color-input-bg)] border-[var(--color-input-brd)] text-[var(--color-text-prim)] placeholder:text-[var(--color-text-dis)]',
};

/* ── App ────────────────────────────────────────────────────────────────────── */
function App() {
  const [count,  setCount]  = useState(() => JSON.parse(localStorage.getItem('count'))  || 0);
  const [step,   setStep]   = useState(1);
  const [customStep, setCustomStep] = useState('');
  const [goal,   setGoal]   = useState(() => JSON.parse(localStorage.getItem('goal'))   || 100);
  const [history,   setHistory]   = useState(() => JSON.parse(localStorage.getItem('history'))  || []);
  const [undoStack, setUndoStack] = useState([]);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });
  const [stats, setStats] = useState(
    () => JSON.parse(localStorage.getItem('stats')) || { highest: 0, increments: 0, decrements: 0 }
  );

  /* Apply/remove .dark on <html> */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  /* Persist state */
  useEffect(() => {
    localStorage.setItem('count',   JSON.stringify(count));
    localStorage.setItem('goal',    JSON.stringify(goal));
    localStorage.setItem('history', JSON.stringify(history));
    localStorage.setItem('stats',   JSON.stringify(stats));
  }, [count, goal, history, stats]);

  /* ── Counter logic ──────────────────────────────────────────────────────── */
  const updateCount = useCallback((newCount, actionType) => {
    if (newCount < 0) return;
    setCount(prev => {
      setHistory(h =>
        [{ type: actionType, prev, next: newCount, timestamp: new Date(), step: Math.abs(newCount - prev) }, ...h].slice(0, 50)
      );
      setUndoStack([]);
      setStats(s => ({
        ...s,
        highest:    Math.max(s.highest, newCount),
        increments: actionType === 'increment' ? s.increments + 1 : s.increments,
        decrements: actionType === 'decrement' ? s.decrements + 1 : s.decrements,
      }));
      return newCount;
    });
  }, []);

  const increment = useCallback(() => updateCount(count + step, 'increment'), [count, step, updateCount]);
  const decrement = useCallback(() => { if (count > 0) updateCount(Math.max(0, count - step), 'decrement'); }, [count, step, updateCount]);
  const reset     = useCallback(() => { if (count > 0) updateCount(0, 'reset'); }, [count, updateCount]);

  const undo = useCallback(() => {
    if (!history.length) return;
    const last = history[0];
    setHistory(h => h.slice(1));
    setUndoStack(u => [last, ...u]);
    setCount(last.prev);
  }, [history]);

  const redo = useCallback(() => {
    if (!undoStack.length) return;
    const next = undoStack[0];
    setUndoStack(u => u.slice(1));
    setHistory(h => [next, ...h]);
    setCount(next.next);
  }, [undoStack]);

  /* Keyboard shortcuts */
  useEffect(() => {
    const handler = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === '+' || e.key === 'ArrowUp')   { e.preventDefault(); increment(); }
      if (e.key === '-' || e.key === 'ArrowDown') { e.preventDefault(); decrement(); }
      if (e.key.toLowerCase() === 'r') reset();
      if (e.key.toLowerCase() === 'z') undo();
      if (e.key.toLowerCase() === 'y') redo();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [increment, decrement, reset, undo, redo]);

  const progress = Math.min(100, Math.round((count / goal) * 100)) || 0;

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen relative">
      {/* 3-D tubes background – sits at z-index:-10 behind everything */}
      <TubesBackground isDark={isDark} />

      <div className="relative z-10 p-4 md:p-6 flex flex-col max-w-5xl mx-auto gap-6 pb-16">

        {/* ── Navbar ────────────────────────────────────────────────────────── */}
        <header className={cn('flex justify-between items-center backdrop-blur-xl p-4 rounded-3xl border shadow-sm transition-colors duration-300', T.header)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#6366F1] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">C</div>
            <div>
              <h1 className={cn('font-bold text-xl tracking-tight', T.textPrim)}>CounterVerse</h1>
              <p className={cn('text-xs', T.textSec)}>Count smarter. Track progress.</p>
            </div>
          </div>
          <button
            onClick={() => setIsDark(d => !d)}
            className={cn('p-2.5 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-ring)]', T.ghost)}
            aria-label="Toggle theme"
          >
            {isDark
              ? <Sun  size={20} className="text-yellow-400" />
              : <Moon size={20} className="text-[#6366F1]"  />}
          </button>
        </header>

        <div className="grid md:grid-cols-12 gap-6">

          {/* ── Left column ───────────────────────────────────────────────── */}
          <div className="md:col-span-8 flex flex-col gap-6">

            {/* Main counter card */}
            <div className={cn('backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 border shadow-xl relative overflow-hidden group transition-colors duration-300', T.card)}>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-60 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 flex flex-col items-center">
                {/* Counter value */}
                <div className={cn('text-[7rem] md:text-[10rem] font-bold tracking-tighter leading-none transition-all duration-150', T.textPrim)}>
                  {count}
                </div>
                {count === 0 && (
                  <p className={cn('text-sm mt-1', T.textDis)}>Minimum limit reached</p>
                )}

                {/* Primary controls */}
                <div className="flex gap-4 mt-10 w-full max-w-md">
                  {/* Decrement */}
                  <button
                    onClick={decrement}
                    disabled={count === 0}
                    className={cn(
                      'flex-1 flex items-center justify-center py-5 rounded-3xl border transition-all duration-150 hover:scale-105 active:scale-95',
                      'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-ring)]',
                      count === 0
                        ? cn('cursor-not-allowed', T.cardSec, T.textDis)
                        : T.ghost
                    )}
                    aria-label="Decrement"
                  >
                    <Minus size={28} />
                  </button>

                  {/* Reset */}
                  <button
                    onClick={reset}
                    disabled={count === 0}
                    className={cn(
                      'w-20 flex items-center justify-center rounded-3xl border transition-all duration-150 hover:scale-105 active:scale-95',
                      'focus:outline-none focus:ring-2 focus:ring-rose-300',
                      count === 0
                        ? 'cursor-not-allowed bg-rose-50 border-rose-100 text-rose-200 dark:bg-rose-900/10 dark:border-rose-800/20 dark:text-rose-700'
                        : 'bg-[#FFF1F2] hover:bg-rose-100 text-[#E11D48] border-rose-200 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/25'
                    )}
                    aria-label="Reset counter"
                  >
                    <RotateCcw size={22} />
                  </button>

                  {/* Increment */}
                  <button
                    onClick={increment}
                    className={cn(
                      'flex-1 flex items-center justify-center py-5 rounded-3xl border transition-all duration-150 hover:scale-105 active:scale-95',
                      'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-ring)]',
                      'bg-[#6366F1] hover:bg-[#4F46E5] text-white border-indigo-400 shadow-lg shadow-indigo-500/25'
                    )}
                    aria-label="Increment"
                  >
                    <Plus size={28} />
                  </button>
                </div>

                {/* Undo / Redo */}
                <div className="flex gap-3 mt-5">
                  {[
                    { label: 'Undo', icon: <Undo2 size={15} />, action: undo, disabled: !history.length },
                    { label: 'Redo', icon: <Redo2 size={15} />, action: redo, disabled: !undoStack.length },
                  ].map(({ label, icon, action, disabled }) => (
                    <button
                      key={label}
                      onClick={action}
                      disabled={disabled}
                      className={cn(
                        'px-5 py-2.5 rounded-full border flex items-center gap-2 text-sm transition-all duration-150',
                        'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-ring)]',
                        disabled
                          ? cn('cursor-not-allowed', T.cardSec, T.textDis)
                          : T.ghost
                      )}
                    >
                      {icon} {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step selector */}
            <div className={cn('backdrop-blur-xl rounded-3xl p-5 border flex flex-wrap items-center gap-3 transition-colors duration-300', T.card)}>
              <span className={cn('font-medium text-sm mr-1', T.textSec)}>Step Size:</span>
              {[1, 5, 10].map(s => (
                <button
                  key={s}
                  onClick={() => { setStep(s); setCustomStep(''); }}
                  className={cn(
                    'px-5 py-2 rounded-xl font-bold text-sm transition-all duration-150',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-ring)]',
                    step === s && customStep === ''
                      ? 'bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-md shadow-indigo-500/25 border border-indigo-400'
                      : cn('border', T.ghost)
                  )}
                >
                  {s}
                </button>
              ))}
              <input
                type="number"
                value={customStep}
                min={1}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setCustomStep(e.target.value);
                  if (val > 0) setStep(val);
                }}
                placeholder="Custom"
                className={cn(
                  'w-24 px-3 py-2 border rounded-xl text-sm outline-none transition-colors duration-150',
                  'focus:ring-2 focus:ring-[var(--color-accent-ring)] focus:border-[var(--color-accent)]',
                  T.input
                )}
              />
            </div>
          </div>

          {/* ── Right sidebar ─────────────────────────────────────────────── */}
          <div className="md:col-span-4 flex flex-col gap-5">

            {/* Goal tracker */}
            <div className={cn('backdrop-blur-xl rounded-3xl p-5 border flex flex-col items-center gap-4 transition-colors duration-300', T.card)}>
              <h3 className={cn('font-semibold self-start flex items-center gap-2 text-sm', T.textPrim)}>
                <Target size={16} className="text-[#6366F1]" /> Goal Progress
              </h3>

              {/* Circular progress */}
              <div className="w-28 h-28 flex items-center justify-center relative">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Track */}
                  <circle cx="50" cy="50" r="44" fill="none"
                    stroke="var(--color-accent-sub)"
                    strokeWidth="8"
                  />
                  {/* Indicator */}
                  <circle cx="50" cy="50" r="44" fill="none"
                    stroke="#6366F1"
                    strokeWidth="8"
                    strokeDasharray="276"
                    strokeDashoffset={276 - (276 * progress) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <span className={cn('text-2xl font-bold relative z-10', T.textPrim)}>{progress}%</span>
              </div>

              <p className={cn('text-sm font-medium', count >= goal ? 'text-green-500' : T.textSec)}>
                {count >= goal ? '🎉 Goal Achieved!' : 'Keep going!'}
              </p>

              <div className="flex items-center gap-2 w-full">
                <span className={cn('text-xs whitespace-nowrap', T.textSec)}>Target:</span>
                <input
                  type="number"
                  value={goal}
                  min={1}
                  onChange={(e) => setGoal(Math.max(1, parseInt(e.target.value) || 1))}
                  className={cn(
                    'flex-1 border rounded-lg px-3 py-1.5 text-sm outline-none transition-colors duration-150',
                    'focus:ring-2 focus:ring-[var(--color-accent-ring)] focus:border-[var(--color-accent)]',
                    T.input
                  )}
                />
              </div>
            </div>

            {/* Statistics */}
            <div className={cn('backdrop-blur-xl rounded-3xl p-5 border text-sm space-y-3 transition-colors duration-300', T.card)}>
              <h3 className={cn('font-semibold flex items-center gap-2 mb-1', T.textPrim)}>
                <Activity size={16} className="text-[#6366F1]" /> Statistics
              </h3>
              {[
                ['Highest Count',    stats.highest],
                ['Total Increments', stats.increments],
                ['Total Decrements', stats.decrements],
              ].map(([label, val]) => (
                <div key={label} className={cn('flex justify-between items-center py-1 border-b last:border-0', 'border-[var(--color-border)]')}>
                  <span className={T.textSec}>{label}</span>
                  <span className={cn('font-bold tabular-nums', T.textPrim)}>{val}</span>
                </div>
              ))}
            </div>

            {/* Activity history */}
            <div className={cn('backdrop-blur-xl rounded-3xl p-5 border flex flex-col overflow-hidden transition-colors duration-300', T.card)} style={{ maxHeight: '17rem' }}>
              <div className="flex justify-between items-center mb-3">
                <h3 className={cn('font-semibold flex items-center gap-2 text-sm', T.textPrim)}>
                  <HistoryIcon size={16} className="text-[#6366F1]" /> Activity
                </h3>
                {history.length > 0 && (
                  <button
                    onClick={() => setHistory([])}
                    className="text-xs text-rose-400 hover:text-rose-500 transition-colors focus:outline-none"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="overflow-y-auto flex-1 space-y-1.5 pr-1">
                {history.length === 0 ? (
                  <p className={cn('text-xs text-center py-6', T.textDis)}>No activity yet</p>
                ) : (
                  history.map((item, i) => (
                    <div
                      key={i}
                      className={cn('flex justify-between items-center text-xs py-1.5 border-b', 'border-[var(--color-border)]')}
                    >
                      <span className={
                        item.type === 'increment' ? 'text-emerald-500 font-semibold' :
                        item.type === 'decrement' ? 'text-orange-400 font-semibold'  :
                        'text-[#6366F1] font-semibold'
                      }>
                        {item.type === 'increment' ? `+${item.step}` :
                         item.type === 'decrement' ? `-${item.step}` : 'Reset'}
                      </span>
                      <span className={T.textSec}>{item.prev} → {item.next}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Fixed footer ──────────────────────────────────────────────────────── */}
      <footer
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center flex-wrap gap-x-4 gap-y-1 py-2 px-4 text-xs backdrop-blur-xl border-t transition-colors duration-300',
          T.footer
        )}
      >
        <span className={T.textSec}>Shortcuts:</span>
        {[['+','increment'],['-','decrement'],['R','reset'],['Z','undo'],['Y','redo']].map(([key, label]) => (
          <span key={key} className={cn('flex items-center gap-1', T.textSec)}>
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-accent-sub)] text-[var(--color-accent)] font-mono text-[10px] border border-[var(--color-border)]">
              {key}
            </kbd>
            {label}
          </span>
        ))}
      </footer>
    </div>
  );
}

export default App;
