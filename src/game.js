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
        this.inputHandler = new InputHandler(this.activeBrick, this);
        this.initializeDefaults();
    }

    initializeDefaults() {
        this.fallenBricksBlocksPositions = [];
        this.activeBrick = new Brick(this);
        this.inputHandler.updateBrick(this.activeBrick);
        this.linesQty.innerHTML = 0;
    }

    start() {
        if (this.gameState === GAME_STATE.WELCOME_MENU && this.gameState !== GAME_STATE.GAMEOVER) {
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

    removeFullLines(posYFull) {
        this.fallenBricksBlocksPositions = this.fallenBricksBlocksPositions.filter(position => posYFull.indexOf(position.y) === -1);
    }

    updateFallenBlocksPosY(posYFull) {
        this.fallenBricksBlocksPositions.forEach((block, index) => {
            const fullLinesBelowQty = posYFull.filter(posY => posY > block.y).length;
            this.fallenBricksBlocksPositions[index].y += (fullLinesBelowQty * 20);
        });
    }

    resolveFullLine() {
        const blocksPosYQtyMap = this.getBlocksPosYQtyMap();
        const posYFull = [...blocksPosYQtyMap.keys()].filter(posY => blocksPosYQtyMap.get(posY) === 10);

        if (posYFull.length > 0) {
            this.removeFullLines(posYFull);
            this.updateFallenBlocksPosY(posYFull);
            this.linesQty.innerHTML = parseInt(this.linesQty.innerHTML) + 1;
        }
    }

    resolveGameOver() {
        const isGameOver = this.fallenBricksBlocksPositions.some(block => block.y <= 0);
        if (isGameOver) this.gameState = GAME_STATE.GAMEOVER;
    }
}
