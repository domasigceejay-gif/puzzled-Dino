import { motion } from 'motion/react';
import { Skull } from 'lucide-react';
import { TileData } from '../types';

interface GridTileProps {
  tile: TileData;
  onClick: () => void;
}

export default function GridTile({ tile, onClick }: GridTileProps) {
  return (
    <motion.button
      whileHover={!tile.isDug ? { scale: 1.05 } : {}}
      whileTap={!tile.isDug ? { scale: 0.95 } : {}}
      onClick={onClick}
      className={`aspect-square flex items-center justify-center rounded-md text-xl sm:text-2xl font-bold transition-colors ${
        !tile.isDug
          ? 'bg-zinc-800 hover:bg-zinc-700 cursor-pointer shadow-[inset_0_-4px_0_rgba(0,0,0,0.5)]'
          : tile.hasFossil
          ? 'bg-amber-600/20 text-amber-500 border-2 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
          : 'bg-zinc-900/80 text-zinc-600 border border-zinc-800 shadow-inner'
      }`}
    >
      {tile.isDug && tile.hasFossil && (
        <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }}>
          <Skull className="w-8 h-8 sm:w-10 sm:h-10" />
        </motion.div>
      )}
      {tile.isDug && !tile.hasFossil && tile.adjacentFossils > 0 && (
        <span className={`
          ${tile.adjacentFossils === 1 ? 'text-blue-400' : ''}
          ${tile.adjacentFossils === 2 ? 'text-green-400' : ''}
          ${tile.adjacentFossils === 3 ? 'text-red-400' : ''}
          ${tile.adjacentFossils > 3 ? 'text-purple-400' : ''}
        `}>
          {tile.adjacentFossils}
        </span>
      )}
    </motion.button>
  );
}
