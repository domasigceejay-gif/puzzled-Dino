import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, ArrowLeft, Info } from 'lucide-react';
import { ScoreEntry } from '../types';

interface LeaderboardProps {
  onBack: () => void;
  currentScore?: number;
  currentLevel?: number;
}

export default function Leaderboard({ onBack, currentScore, currentLevel }: LeaderboardProps) {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('dino-puzzle-scores');
    if (stored) {
      setScores(JSON.parse(stored));
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || saved || currentScore === undefined) return;

    const newEntry: ScoreEntry = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      score: currentScore,
      levelReached: currentLevel || 1,
      date: new Date().toISOString(),
    };

    const newScores = [...scores, newEntry].sort((a, b) => b.score - a.score).slice(0, 10);
    setScores(newScores);
    localStorage.setItem('dino-puzzle-scores', JSON.stringify(newScores));
    setSaved(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-zinc-950 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl mt-8 md:mt-12">
        <button onClick={onBack} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 font-medium">
          <ArrowLeft className="w-5 h-5" /> Back to Base
        </button>
        
        <div className="flex items-center gap-4 mb-8">
          <Trophy className="w-10 h-10 text-amber-500" />
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">Leaderboard</h1>
        </div>

        {currentScore !== undefined && !saved && (
          <motion.form initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onSubmit={handleSave} className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-6 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              Expedition Complete! <span className="text-amber-500 font-mono">({currentScore} pts)</span>
            </h2>
            <div className="flex items-start gap-2 text-zinc-400 text-sm mb-5 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>Since cloud synchronization was skipped, your score will be stored locally on this device.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                maxLength={15}
                placeholder="Enter Paleontologist Name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-amber-500 transition-colors font-medium"
              />
              <button type="submit" disabled={!name.trim()} className="px-8 py-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:hover:bg-amber-600 rounded-xl font-bold transition-colors uppercase tracking-widest text-sm">
                Log Score
              </button>
            </div>
          </motion.form>
        )}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-12 gap-4 p-5 border-b border-zinc-800 text-xs font-bold text-zinc-500 uppercase tracking-widest bg-zinc-900/80">
            <div className="col-span-2">Rank</div>
            <div className="col-span-5">Name</div>
            <div className="col-span-2 text-center">Lvl</div>
            <div className="col-span-3 text-right">Score</div>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {scores.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 flex flex-col items-center">
                <Trophy className="w-12 h-12 mb-4 opacity-20" />
                No expeditions logged yet. Be the first!
              </div>
            ) : (
              scores.map((s, i) => (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} key={s.id} className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-zinc-800/30 transition-colors">
                  <div className={`col-span-2 font-black text-xl ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-zinc-300' : i === 2 ? 'text-amber-700' : 'text-zinc-600'}`}>
                    #{i + 1}
                  </div>
                  <div className="col-span-5 font-bold truncate text-lg">{s.name}</div>
                  <div className="col-span-2 text-center font-medium text-zinc-400">{s.levelReached}</div>
                  <div className="col-span-3 text-right font-mono font-bold text-amber-500 text-lg">{s.score.toLocaleString()}</div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
