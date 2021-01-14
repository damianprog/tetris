import InputHandler from "/src/input.js";
import Brick from "/src/brick.js";

const GAME_STATE = {
    WELCOME_MENU: 0,
    PAUSED: 1,
    RUNNING: 2,
    GAMEOVER: 3
};

export default class Game {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.gameState = GAME_STATE.WELCOME_MENU;
        this.gameOverInfo = document.querySelector(".game-over-info");
        this.welcomeInfo = document.querySelector(".welcome-info");
        this.linesQty = document.querySelector(".lines-qty");
        this.scoreQty = document.querySelector(".score-qty");
        this.bestScoreQty = document.querySelector(".best-score-qty");
        this.newBestScore = document.querySelector(".new-best-score");
        this.newBestScoreQty = document.querySelector(".new-best-score-qty");
        this.inputHandler = new InputHandler(this.activeBrick, this);
        this.initializeDefaults();
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
        const localStorageBestScore = window.localStorage.getItem("purpleTetrisBestScore");
        let bestScore = localStorageBestScore ? localStorageBestScore : 0;
        if (parseInt(this.scoreQty.innerHTML) > bestScore) bestScore = parseInt(this.scoreQty.innerHTML);
        window.localStorage.setItem("purpleTetrisBestScore", bestScore);
        this.bestScoreQty.innerHTML = bestScore;
    }

    start() {
        if (this.gameState === GAME_STATE.WELCOME_MENU || this.gameState === GAME_STATE.GAMEOVER) {
            this.initializeDefaults();
            this.gameState = GAME_STATE.RUNNING;
        }
    }

    setFontStyle(ctx) {
        ctx.font = "15px PressStart2P";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
    }

    draw(ctx) {
        this.activeBrick.draw(ctx);

        this.fallenBricksBlocksPositions.forEach(position => {
            ctx.fillRect(position.x, position.y, this.activeBrick.blockSize, this.activeBrick.blockSize);
        });
    }

    update() {
        this.gameOverInfo.style.display = this.gameState === GAME_STATE.GAMEOVER ? "block" : "none";
        this.newBestScore.style.display = this.gameState === GAME_STATE.GAMEOVER &&
             parseInt(this.scoreQty.innerHTML) >= parseInt(this.bestScoreQty.innerHTML) ? "block" : "none";
        this.welcomeInfo.style.display = this.gameState === GAME_STATE.WELCOME_MENU ? "block" : "none";
        if (this.gameState !== GAME_STATE.RUNNING) return;
        this.activeBrick.update();
    }

    clear(ctx) {
        ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
    }

    pause() {
        if (this.gameState === GAME_STATE.RUNNING || this.gameState === GAME_STATE.PAUSED) {
            this.gameState = this.gameState === GAME_STATE.RUNNING ? GAME_STATE.PAUSED : GAME_STATE.RUNNING;
        }
    }

    onBrickCollision() {
        this.fallenBricksBlocksPositions = [...this.fallenBricksBlocksPositions, ...this.activeBrick.brickBlocksPositions];
        this.activeBrick = new Brick(this);
        this.inputHandler.updateBrick(this.activeBrick);
        this.resolveFullLine();
        this.resolveGameOver();
    }

    getBlocksPosYQtyMap() {
        const blocksPosYQtyMap = new Map();

        this.fallenBricksBlocksPositions.forEach(block => {
            const blockPosYQty = blocksPosYQtyMap.get(block.y);
            const incrementedBlockPosYQty = blockPosYQty ? blockPosYQty + 1 : 1;
            blocksPosYQtyMap.set(block.y, incrementedBlockPosYQty);
        });

        return blocksPosYQtyMap;
    }

    removeFullLines(fullPositionsY) {
        this.fallenBricksBlocksPositions = this.fallenBricksBlocksPositions.filter(position => fullPositionsY.indexOf(position.y) === -1);
    }

    updateFallenBlocksPosY(fullPositionsY) {
        this.fallenBricksBlocksPositions.forEach((block, index) => {
            const fullLinesBelowQty = fullPositionsY.filter(posY => posY > block.y).length;
            this.fallenBricksBlocksPositions[index].y += (fullLinesBelowQty * 20);
        });
    }

    updateScores(fullPositionsY) {
        const bestScoreQty = parseInt(this.bestScoreQty.innerHTML);
        this.linesQty.innerHTML = parseInt(this.linesQty.innerHTML) + fullPositionsY.length;
        this.scoreQty.innerHTML = parseInt(this.scoreQty.innerHTML) + ((fullPositionsY.length * 100) + ((fullPositionsY.length - 1) * 100));
        const scoreQty = parseInt(this.scoreQty.innerHTML);
        if (scoreQty >= bestScoreQty) {
            this.bestScoreQty.innerHTML = scoreQty;
            this.newBestScoreQty.innerHTML = scoreQty;
        }
    }

    resolveFullLine() {
        const blocksPosYQtyMap = this.getBlocksPosYQtyMap();
        const fullPositionsY = [...blocksPosYQtyMap.keys()].filter(posY => blocksPosYQtyMap.get(posY) === 10);

        if (fullPositionsY.length > 0) {
            this.removeFullLines(fullPositionsY);
            this.updateFallenBlocksPosY(fullPositionsY);
            this.updateScores(fullPositionsY);
        }
    }

    resolveGameOver() {
        const isGameOver = this.fallenBricksBlocksPositions.some(block => block.y <= 0);
        if (isGameOver) {
            this.gameState = GAME_STATE.GAMEOVER;
            this.setBestScore();
        } 
    }
}
