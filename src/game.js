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
        this.gameState = GAME_STATE.RUNNING;
        this.activeBrick = new Brick(this);
        this.inputHandler = new InputHandler(this.activeBrick, this);
        this.fallenBricksBlocksPositions = []
    }

    draw(ctx) {
        this.activeBrick.draw(ctx);

        this.fallenBricksBlocksPositions.forEach(position => {
            ctx.fillRect(position.x, position.y, this.activeBrick.blockSize, this.activeBrick.blockSize);
        });
    }

    update() {
        if (this.gameState === GAME_STATE.GAMEOVER || this.gameState === GAME_STATE.PAUSED) return;
        this.activeBrick.update();
    }

    clear(ctx) {
        ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
    }

    pause() {
        if (this.gameState !== GAME_STATE.GAMEOVER) {
            this.gameState = this.gameState === GAME_STATE.RUNNING ? GAME_STATE.PAUSED : GAME_STATE.RUNNING;
            console.log("this.gameState: " + this.gameState);
        } 
    }

    onBrickCollision() {
        this.fallenBricksBlocksPositions = [...this.fallenBricksBlocksPositions, ...this.activeBrick.brickBlocksPositions];
        this.activeBrick = new Brick(this);
        this.inputHandler.updateBrick(this.activeBrick);
        this.resolveFullLine();
    }

    resolveFullLine() {
        const yPosOccurencies = new Map();
        const yPosFull = [];
        this.fallenBricksBlocksPositions.forEach(block => {
            const currentPosYQty = yPosOccurencies.get(block.y);
            const newCurrentPosYQty = currentPosYQty ? currentPosYQty + 1 : 1;
            if (newCurrentPosYQty === 10) yPosFull.push(block.y);
            yPosOccurencies.set(block.y, newCurrentPosYQty);
        });

        if (yPosFull.length > 0) {
            this.fallenBricksBlocksPositions = this.fallenBricksBlocksPositions.filter(position => yPosFull.indexOf(position.y) === -1);

            this.fallenBricksBlocksPositions.forEach((block, index) => {
                const smallerYQty = yPosFull.filter(yPos => yPos > block.y).length;
                this.fallenBricksBlocksPositions[index].y += (smallerYQty * 20);
            });
        }
    }
}
