export const playWelcomeButton = () => {
  const audio = new Audio("../../sounds/welcome_button.mp3");
  audio.volume = 0.2;
  audio.play();
};

export const playClick01 = () => {
  const audio = new Audio("../../sounds/floraphonic-8-bit-game-2-186976.mp3");
  audio.volume = 0.2;
  audio.play();
};

export const playClick02 = () => {
  const audio = new Audio("../../sounds/floraphonic-8-bit-game-4-188106.mp3");
  audio.volume = 0.2;
  audio.play();
};

export const resultsAudio = () => {
  const audio = new Audio("../../sounds/results.mp3");
  audio.volume = 0.5;
  audio.play();
};


// Melodia de fondo
let backgroundMusic: HTMLAudioElement | null = null;

export const startBackgroundMusic = () => {
  if (backgroundMusic) return;

  backgroundMusic = new Audio("../../sounds/background.mp3");

  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.05;

  backgroundMusic.play().catch(() => {});
};

export const stopBackgroundMusic = () => {
  if (!backgroundMusic) return;

  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
};

// Melodia de game
let gameMusic: HTMLAudioElement | null = null;

export const startGameMusic = () => {
  if (gameMusic) return;

  gameMusic = new Audio("../../sounds/game.mp3");

  gameMusic.loop = true;
  gameMusic.volume = 0.05;

  gameMusic.play().catch(() => {});
};

export const stopGameMusic = () => {
  if (!gameMusic) return;

  gameMusic.pause();
  gameMusic.currentTime = 0;
};
