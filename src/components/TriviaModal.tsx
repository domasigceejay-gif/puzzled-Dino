import { useState } from 'react';
import { motion } from 'motion/react';
import { Trivia } from '../types';
import { CheckCircle2, XCircle } from 'lucide-react';

interface TriviaModalProps {
  trivia: Trivia;
  onComplete: (correct: boolean) => void;
}

export default function TriviaModal({ trivia, onComplete }: TriviaModalProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelectedIdx(idx);
    setShowResult(true);
  };

  const isCorrect = selectedIdx === trivia.correctIndex;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden"
      >
        {!showResult ? (
          <>
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
            <div className="text-amber-500 text-sm font-bold tracking-widest uppercase mb-2">Fossil Discovered!</div>
            <h2 className="text-xl text-white font-medium mb-6 leading-relaxed">{trivia.question}</h2>
            <div className="space-y-3">
              {trivia.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className="w-full text-left px-5 py-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors border border-transparent hover:border-zinc-700 font-medium"
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-4">
              {isCorrect ? (
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              ) : (
                <XCircle className="w-10 h-10 text-red-500" />
              )}
              <h2 className={`text-2xl font-black uppercase tracking-tight ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                {isCorrect ? 'Correct! +500 pts' : 'Incorrect! +100 pts'}
              </h2>
            </div>
            
            <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700/50">
              <div className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">Did you know?</div>
              <p className="text-zinc-300 leading-relaxed text-sm">{trivia.fact}</p>
            </div>

            <button
              onClick={() => onComplete(isCorrect)}
              className="w-full py-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors uppercase tracking-widest"
            >
              Continue Excavation
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
