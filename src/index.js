import Game from '/src/game.js';

const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d');

const GAME_WIDTH = 200;
const GAME_HEIGHT = 400;

const game = new Game(GAME_WIDTH, GAME_HEIGHT);

function gameLoop() {
  game.clear(ctx);

  game.update();
  game.draw(ctx);

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
