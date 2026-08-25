import { Level, Trivia } from './types';

export const LEVELS: Level[] = [
  { levelNumber: 1, gridSize: 5, fossilCount: 3, maxDigs: 10 },
  { levelNumber: 2, gridSize: 6, fossilCount: 5, maxDigs: 15 },
  { levelNumber: 3, gridSize: 7, fossilCount: 7, maxDigs: 22 },
  { levelNumber: 4, gridSize: 8, fossilCount: 10, maxDigs: 30 },
  { levelNumber: 5, gridSize: 9, fossilCount: 12, maxDigs: 35 },
  { levelNumber: 6, gridSize: 10, fossilCount: 15, maxDigs: 45 },
];

export const TRIVIA: Trivia[] = [
  {
    id: 't1',
    question: "Which dinosaur name means 'fast thief'?",
    options: ["Velociraptor", "Oviraptor", "Utahraptor", "Microraptor"],
    correctIndex: 0,
    fact: "Velociraptors were actually much smaller than depicted in movies, roughly the size of a turkey, and covered in feathers."
  },
  {
    id: 't2',
    question: "During which geological period did the T-Rex live?",
    options: ["Jurassic", "Triassic", "Cretaceous", "Permian"],
    correctIndex: 2,
    fact: "Despite the popular movie title 'Jurassic Park', the Tyrannosaurus Rex actually lived during the late Cretaceous period."
  },
  {
    id: 't3',
    question: "Which of these dinosaurs was a herbivore?",
    options: ["Spinosaurus", "Allosaurus", "Triceratops", "Carnotaurus"],
    correctIndex: 2,
    fact: "Triceratops used their massive frill and three horns for defense against predators like T-Rex, and possibly for courtship displays."
  },
  {
    id: 't4',
    question: "What is the study of fossils called?",
    options: ["Archaeology", "Paleontology", "Geology", "Anthropology"],
    correctIndex: 1,
    fact: "Paleontology is the scientific study of life that existed prior to, and sometimes including, the start of the Holocene Epoch."
  },
  {
    id: 't5',
    question: "Which dinosaur is known for having a club on its tail?",
    options: ["Stegosaurus", "Ankylosaurus", "Brachiosaurus", "Iguanodon"],
    correctIndex: 1,
    fact: "The Ankylosaurus was heavily armored with osteoderms (bone plates) and a massive tail club capable of breaking a predator's bones."
  },
  {
    id: 't6',
    question: "Which modern animals are the closest living relatives to dinosaurs?",
    options: ["Crocodiles", "Lizards", "Birds", "Sharks"],
    correctIndex: 2,
    fact: "Birds are actually considered to be living theropod dinosaurs, making them the direct descendants of the dinosaurs that survived the extinction event."
  },
  {
    id: 't7',
    question: "What was the supercontinent called when dinosaurs first appeared?",
    options: ["Gondwana", "Laurasia", "Pangea", "Rodinia"],
    correctIndex: 2,
    fact: "During the Triassic period, all of Earth's major landmasses were joined together in the supercontinent Pangea."
  },
  {
    id: 't8',
    question: "Which of these was the largest meat-eating dinosaur yet discovered?",
    options: ["Tyrannosaurus Rex", "Spinosaurus", "Giganotosaurus", "Carcharodontosaurus"],
    correctIndex: 1,
    fact: "Spinosaurus is currently considered the largest known carnivorous dinosaur, and evidence suggests it was semi-aquatic."
  },
  {
    id: 't9',
    question: "What element is found in a distinct layer across the globe, marking the dinosaur extinction?",
    options: ["Uranium", "Iridium", "Platinum", "Titanium"],
    correctIndex: 1,
    fact: "The K-Pg boundary contains high levels of Iridium, which is rare on Earth's crust but common in asteroids, supporting the impact theory."
  },
  {
    id: 't10',
    question: "How many horns did a Styracosaurus have on its nose?",
    options: ["One", "Two", "Three", "Four"],
    correctIndex: 0,
    fact: "While it had a spectacular frill adorned with long spikes, the Styracosaurus only had one massive horn on its nose."
  }
];
