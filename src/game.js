import InputHandler from '/src/input.js';
import Brick from '/src/brick.js';
import { GAME_STATE } from '/src/gameStates.js';
import { drawBlock } from '/src/drawBlock.js';

export default class Game {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gameState = GAME_STATE.WELCOME_MENU;
    this.inputHandler = new InputHandler(this.activeBrick, this);
    this.initializeInfoPanels();
    this.initializeQuantities();
    this.initializeDefaults();
  }

  initializeInfoPanels() {
    this.gameOverInfoPanel = document.querySelector('.game-over-info-panel');
    this.welcomeInfoPanel = document.querySelector('.welcome-info-panel');
    this.pauseInfoPanel = document.querySelector('.pause-info-panel');
  }

  initializeQuantities() {
    this.linesQty = document.querySelector('.lines-qty');
    this.scoreQty = document.querySelector('.score-qty');
    this.bestScoreQty = document.querySelector('.best-score-qty');
    this.newBestScore = document.querySelector('.new-best-score');
    this.newBestScoreQty = document.querySelector('.new-best-score-qty');
  }

  initializeDefaults() {
    this.fallenBricksBlocksPositions = [];
    this.activeBrick = new Brick(this);
    this.inputHandler.updateBrick(this.activeBrick);
    this.linesQty.innerHTML = 0;
    this.scoreQty.innerHTML = 0;
    this.setBestScore();
  }

  setBestScore() {
    const localStorageBestScore = window.localStorage.getItem(
      'purpleTetrisBestScore'
    );
    let bestScore = localStorageBestScore ? localStorageBestScore : 0;
    if (parseInt(this.scoreQty.innerHTML) > bestScore)
      bestScore = parseInt(this.scoreQty.innerHTML);
    window.localStorage.setItem('purpleTetrisBestScore', bestScore);
    this.bestScoreQty.innerHTML = bestScore;
  }

  start() {
    if (
      this.gameState === GAME_STATE.WELCOME_MENU ||
      this.gameState === GAME_STATE.GAMEOVER
    ) {
      this.initializeDefaults();
      this.gameState = GAME_STATE.RUNNING;
    }
  }

  setFontStyle(ctx) {
    ctx.font = '15px PressStart2P';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
  }

  draw(ctx) {
    this.activeBrick.draw(ctx);
    this.fallenBricksBlocksPositions.forEach((position) =>
      drawBlock(ctx, position)
    );
  }

  update() {
    this.showInfo();
    if (this.gameState !== GAME_STATE.RUNNING) return;
    this.activeBrick.update();
  }

  showInfo() {
    this.gameOverInfoPanel.style.display =
      this.gameState === GAME_STATE.GAMEOVER ? 'block' : 'none';
    this.pauseInfoPanel.style.display =
      this.gameState === GAME_STATE.PAUSED ? 'block' : 'none';
    this.newBestScore.style.display =
      this.gameState === GAME_STATE.GAMEOVER &&
      parseInt(this.scoreQty.innerHTML) >=
        parseInt(this.bestScoreQty.innerHTML) &&
      parseInt(this.scoreQty.innerHTML) != 0
        ? 'block'
        : 'none';
    this.welcomeInfoPanel.style.display =
      this.gameState === GAME_STATE.WELCOME_MENU ? 'block' : 'none';
  }

  clear(ctx) {
    ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
  }

  pause() {
    if (
      this.gameState === GAME_STATE.RUNNING ||
      this.gameState === GAME_STATE.PAUSED
    ) {
      this.gameState =
        this.gameState === GAME_STATE.RUNNING
          ? GAME_STATE.PAUSED
          : GAME_STATE.RUNNING;
    }
  }

  onBrickCollision() {
    this.fallenBricksBlocksPositions = [
      ...this.fallenBricksBlocksPositions,
      ...this.activeBrick.brickBlocksPositions,
    ];
    this.activeBrick = new Brick(this);
    this.inputHandler.updateBrick(this.activeBrick);
    this.resolveFullLine();
    this.resolveGameOver();
  }

  getBlocksPosYQtyMap() {
    const blocksPosYQtyMap = new Map();

    this.fallenBricksBlocksPositions.forEach((block) => {
      const blockPosYQty = blocksPosYQtyMap.get(block.y);
      const incrementedBlockPosYQty = blockPosYQty ? blockPosYQty + 1 : 1;
      blocksPosYQtyMap.set(block.y, incrementedBlockPosYQty);
    });

    return blocksPosYQtyMap;
  }

  removeFullLines(fullLinesPosY) {
    this.fallenBricksBlocksPositions = this.fallenBricksBlocksPositions.filter(
      (position) => fullLinesPosY.indexOf(position.y) === -1
    );
  }

  updateFallenBlocksPosY(fullLinesPosY) {
    this.fallenBricksBlocksPositions.forEach((block, index) => {
      const fullLinesBelowQty = fullLinesPosY.filter(
        (posY) => posY > block.y
      ).length;
      this.fallenBricksBlocksPositions[index].y += fullLinesBelowQty * 20;
    });
  }

  updateScores(fullLinesPosY) {
    this.linesQty.innerHTML =
      parseInt(this.linesQty.innerHTML) + fullLinesPosY.length;

    let scoreQty = parseInt(this.scoreQty.innerHTML);
    scoreQty =
      parseInt(this.scoreQty.innerHTML) +
      (fullLinesPosY.length * 100 + (fullLinesPosY.length - 1) * 100);
    this.scoreQty.innerHTML = scoreQty;

    const bestScoreQty = parseInt(this.bestScoreQty.innerHTML);
    if (scoreQty >= bestScoreQty) {
      this.bestScoreQty.innerHTML = scoreQty;
      this.newBestScoreQty.innerHTML = scoreQty;
    }
  }

  resolveFullLine() {
    const blocksPosYQtyMap = this.getBlocksPosYQtyMap();
    const fullLinesPosY = [...blocksPosYQtyMap.keys()].filter(
      (posY) => blocksPosYQtyMap.get(posY) === 10
    );

    if (fullLinesPosY.length > 0) {
      this.removeFullLines(fullLinesPosY);
      this.updateFallenBlocksPosY(fullLinesPosY);
      this.updateScores(fullLinesPosY);
    }
  }

  resolveGameOver() {
    const isGameOver = this.fallenBricksBlocksPositions.some(
      (block) => block.y <= 0
    );
    if (isGameOver) {
      this.gameState = GAME_STATE.GAMEOVER;
      this.setBestScore();
    }
  }
}
