export type TileData = {
  id: string;
  x: number;
  y: number;
  hasFossil: boolean;
  isDug: boolean;
  adjacentFossils: number;
};

export type Level = {
  levelNumber: number;
  gridSize: number;
  fossilCount: number;
  maxDigs: number;
};

export type Trivia = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  fact: string;
};

export type ScoreEntry = {
  id: string;
  name: string;
  score: number;
  levelReached: number;
  date: string;
};
