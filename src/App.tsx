import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Pickaxe, Skull, Trophy, Play, Info } from 'lucide-react';
import { LEVELS, TRIVIA } from './data';
import { TileData, Level, Trivia } from './types';
import GridTile from './components/GridTile';
import TriviaModal from './components/TriviaModal';
import Leaderboard from './components/Leaderboard';

function generateGrid(level: Level): TileData[] {
  const { gridSize, fossilCount } = level;
  const totalTiles = gridSize * gridSize;
  const tiles: TileData[] = Array.from({ length: totalTiles }, (_, i) => ({
    id: `tile-${i}`,
    x: i % gridSize,
    y: Math.floor(i / gridSize),
    hasFossil: false,
    isDug: false,
    adjacentFossils: 0
  }));

  let placed = 0;
  while (placed < fossilCount) {
    const idx = Math.floor(Math.random() * totalTiles);
    if (!tiles[idx].hasFossil) {
      tiles[idx].hasFossil = true;
      placed++;
    }
  }

  for (const tile of tiles) {
    if (tile.hasFossil) continue;
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nx = tile.x + dx;
        const ny = tile.y + dy;
        if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
          const neighbor = tiles.find(t => t.x === nx && t.y === ny);
          if (neighbor && neighbor.hasFossil) count++;
        }
      }
    }
    tile.adjacentFossils = count;
  }
  return tiles;
}

const floodFill = (startX: number, startY: number, currentTiles: TileData[]): TileData[] => {
  const newTiles = [...currentTiles];
  const stack = [[startX, startY]];
  const visited = new Set<string>();

  while (stack.length > 0) {
    const [x, y] = stack.pop()!;
    const key = `${x},${y}`;
    if (visited.has(key)) continue;
    visited.add(key);

    const tileIndex = newTiles.findIndex(t => t.x === x && t.y === y);
    if (tileIndex === -1) continue;

    const tile = newTiles[tileIndex];
    if (tile.isDug || tile.hasFossil) continue;

    newTiles[tileIndex] = { ...tile, isDug: true };

    if (tile.adjacentFossils === 0) {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          stack.push([x + dx, y + dy]);
        }
      }
    }
  }
  return newTiles;
};

export default function App() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'trivia' | 'level_complete' | 'game_over' | 'leaderboard'>('menu');
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [digsLeft, setDigsLeft] = useState(0);
  const [fossilsFound, setFossilsFound] = useState(0);
  const [tiles, setTiles] = useState<TileData[]>([]);
  const [activeTrivia, setActiveTrivia] = useState<Trivia | null>(null);

  const initLevel = useCallback((levelIdx: number, keepScore = false) => {
    const level = LEVELS[levelIdx];
    if (!level) return;
    
    setTiles(generateGrid(level));
    setDigsLeft(level.maxDigs);
    setFossilsFound(0);
    setCurrentLevelIdx(levelIdx);
    if (!keepScore) setScore(0);
    setGameState('playing');
  }, []);

  const handleStart = () => initLevel(0, false);

  const handleTileClick = (x: number, y: number) => {
    if (gameState !== 'playing') return;
    
    const tileIndex = tiles.findIndex(t => t.x === x && t.y === y);
    const tile = tiles[tileIndex];
    
    if (tile.isDug || digsLeft <= 0) return;

    setDigsLeft(prev => prev - 1);

    if (tile.hasFossil) {
      const newTiles = [...tiles];
      newTiles[tileIndex] = { ...tile, isDug: true };
      setTiles(newTiles);
      
      const randomTrivia = TRIVIA[Math.floor(Math.random() * TRIVIA.length)];
      setActiveTrivia(randomTrivia);
      setGameState('trivia');
    } else {
      const newTiles = floodFill(x, y, tiles);
      setTiles(newTiles);
    }
  };

  const handleTriviaComplete = (correct: boolean) => {
    if (correct) {
      setScore(prev => prev + 500);
    } else {
      setScore(prev => prev + 100);
    }
    setFossilsFound(prev => prev + 1);
    setActiveTrivia(null);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    const currentLevel = LEVELS[currentLevelIdx];
    
    if (fossilsFound >= currentLevel.fossilCount) {
      setScore(prev => prev + (digsLeft * 50)); // Bonus for remaining digs
      setGameState('level_complete');
    } else if (digsLeft <= 0) {
      setGameState('game_over');
    }
  }, [fossilsFound, digsLeft, gameState, currentLevelIdx]);

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/40 via-zinc-950 to-zinc-950"></div>
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 flex flex-col items-center">
          <div className="relative mb-8">
            <Skull className="w-28 h-28 text-amber-500 drop-shadow-[0_0_25px_rgba(245,158,11,0.4)]" />
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-8 border border-dashed border-amber-500/20 rounded-full"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 text-center uppercase">
            Dino <span className="text-amber-500">Dig</span>
          </h1>
          <p className="text-zinc-400 text-lg mb-12 text-center max-w-sm leading-relaxed">
            Excavate hidden fossils, master paleontology trivia, and survive the expedition.
          </p>
          
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <button onClick={handleStart} className="flex items-center justify-center gap-3 w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(217,119,6,0.3)] uppercase tracking-widest text-sm">
              <Play className="fill-current w-5 h-5" /> Start Expedition
            </button>
            <button onClick={() => setGameState('leaderboard')} className="flex items-center justify-center gap-3 w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold rounded-xl transition-all border border-zinc-800 uppercase tracking-widest text-sm">
              <Trophy className="w-5 h-5" /> Leaderboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'leaderboard') {
    const currentLevel = LEVELS[currentLevelIdx];
    return <Leaderboard onBack={() => setGameState('menu')} currentScore={score > 0 ? score : undefined} currentLevel={currentLevel?.levelNumber} />;
  }

  const currentLevel = LEVELS[currentLevelIdx];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <header className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 p-4 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Site {currentLevel.levelNumber}</div>
            <div className="text-lg font-black text-amber-500">Sector {currentLevel.gridSize}x{currentLevel.gridSize}</div>
          </div>
          
          <div className="flex gap-6 md:gap-16">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-zinc-400 mb-1">
                <Pickaxe className="w-4 h-4" /> <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Digs</span>
              </div>
              <div className={`text-2xl font-black ${digsLeft <= 5 ? 'text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-white'}`}>
                {digsLeft}
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-zinc-400 mb-1">
                <Skull className="w-4 h-4" /> <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Fossils</span>
              </div>
              <div className="text-2xl font-black text-amber-500">
                {fossilsFound} <span className="text-zinc-600 text-lg">/ {currentLevel.fossilCount}</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-zinc-400 mb-1">
                <Trophy className="w-4 h-4" /> <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Score</span>
              </div>
              <div className="text-2xl font-black font-mono text-green-400">{score.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative">
        <div className="w-full max-w-3xl relative">
          <div 
            className="grid gap-1 sm:gap-2 mx-auto bg-zinc-900/50 p-2 sm:p-4 rounded-2xl border border-zinc-800" 
            style={{ gridTemplateColumns: `repeat(${currentLevel.gridSize}, minmax(0, 1fr))` }}
          >
            {tiles.map(tile => (
              <GridTile key={tile.id} tile={tile} onClick={() => handleTileClick(tile.x, tile.y)} />
            ))}
          </div>
        </div>
        
        <div className="mt-8 text-zinc-500 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
          <Info className="w-4 h-4" /> Dig carefully. Numbers indicate adjacent fossils.
        </div>
      </main>

      <AnimatePresence>
        {gameState === 'trivia' && activeTrivia && (
          <TriviaModal trivia={activeTrivia} onComplete={handleTriviaComplete} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState === 'level_complete' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-zinc-900 border border-amber-500/30 p-8 rounded-3xl max-w-md w-full text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
              <div className="w-24 h-24 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                <Trophy className="w-12 h-12" />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-2 text-white">Area Cleared!</h2>
              <div className="bg-zinc-950 rounded-xl p-4 mb-8 border border-zinc-800">
                <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest mb-1">Efficiency Bonus</p>
                <p className="text-amber-500 font-mono text-2xl font-black">+{digsLeft * 50} pts</p>
              </div>
              <button 
                onClick={() => {
                  if (currentLevelIdx + 1 < LEVELS.length) {
                    initLevel(currentLevelIdx + 1, true);
                  } else {
                    setGameState('leaderboard');
                  }
                }}
                className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all uppercase tracking-widest text-sm"
              >
                {currentLevelIdx + 1 < LEVELS.length ? 'Proceed to Next Site' : 'Finish Expedition'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState === 'game_over' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="max-w-md w-full text-center">
              <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                <Pickaxe className="w-12 h-12" />
              </div>
              <h2 className="text-5xl font-black uppercase text-red-500 mb-4 tracking-tighter">Tools Broken</h2>
              <p className="text-zinc-400 text-lg mb-8 leading-relaxed">You ran out of digs before excavating all the fossils. The expedition is over.</p>
              
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-zinc-700"></div>
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Final Score</div>
                <div className="text-5xl font-black font-mono text-white mb-2">{score.toLocaleString()}</div>
                <div className="text-amber-500 font-bold uppercase tracking-widest text-sm">Site Reached: {currentLevel.levelNumber}</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleStart} className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all border border-zinc-700 uppercase tracking-widest text-sm">
                  Try Again
                </button>
                <button onClick={() => setGameState('leaderboard')} className="flex-1 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all uppercase tracking-widest text-sm">
                  Log Score
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
