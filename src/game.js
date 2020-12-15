import InputHandler from "/src/input.js";
import Brick from "/src/brick.js";

export default class Game {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.activeBrick = new Brick(this);
        this.inputHandler = new InputHandler(this.activeBrick);
        this.fallenBricksBlocksPositions = []
    }

    draw(ctx) {
        this.activeBrick.draw(ctx);

        this.fallenBricksBlocksPositions.forEach(position => {
            ctx.fillRect(position.x, position.y, this.activeBrick.blockSize, this.activeBrick.blockSize);
        });
    }

    update() {
        this.activeBrick.update();
    }

    clear(ctx) {
        ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
    }

    onBrickCollision() {
        this.fallenBricksBlocksPositions = [...this.fallenBricksBlocksPositions, ...this.activeBrick.brickBlocksPositions];
        this.activeBrick = new Brick(this);
        this.inputHandler.updateBrick(this.activeBrick);
        // console.log(JSON.stringify(this.fallenBricksBlocksPositions));
    }
}
