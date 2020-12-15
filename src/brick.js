import { shapes } from "/src/brickShapes.js";

export default class Brick {

    getRandomBrickShape() {
        return shapes[Math.floor(Math.random() * shapes.length)];
    }

    constructor(game) {
        this.position = { x: 40, y: 0 };
        this.brickBlocksPositions = [this.position];
        this.game = game;
        this.colNumber = 4;
        this.brickShape = this.getRandomBrickShape();
        this.brickShapeState = 0;
        this.blockSize = 20;
        this.timeoutDone = true;
        this.blockRotate = false;
    }

    draw(ctx) {
        ctx.fillStyle = "#0d47a1";

        let row = 0;
        let column = 0;
        const newBrickBlocksPositions = [];
        this.brickShape[this.brickShapeState].forEach((number, index) => {
            if (number === 1) {
                row = Math.floor(index / this.colNumber);
                column = index % this.colNumber;
                const currentBlockPosX = this.position.x + (column * this.blockSize);
                const currentBlockPosY = this.position.y + (row * this.blockSize);
                ctx.fillRect(currentBlockPosX, currentBlockPosY, this.blockSize, this.blockSize);
                newBrickBlocksPositions.push({ x: currentBlockPosX, y: currentBlockPosY });
            }
        });
        this.brickBlocksPositions = newBrickBlocksPositions;

        const lastBrickPosY = this.brickBlocksPositions[this.brickBlocksPositions.length - 1].y + 20;

        if (lastBrickPosY >= this.game.gameHeight || this.checkIfAnyBlockHasSamePosition(this.brickShape[this.brickShapeState], { x: this.position.x, y: this.position.y + 20 })) {
            this.blockRotate = true;
            this.game.onBrickCollision();
            return;
        }
    }

    update() {
        if (this.timeoutDone) {
            this.timeoutDone = !this.timeoutDone;
            setTimeout(() => {
                this.position.y += 20;
                this.timeoutDone = !this.timeoutDone;
            }, 500);
        }
    }

    checkIfAnyBlockHasSamePosition(brick, position) {
        let hasAnyBlockSamePosition = false;
        let row = 0;
        let column = 0;
        return brick.some((number, index) => {
            if (number === 1) {
                row = Math.floor(index / this.colNumber);
                column = index % this.colNumber;
                const currentBlockPosX = position.x + (column * this.blockSize);
                const currentBlockPosY = position.y + (row * this.blockSize);

                return this.game.fallenBricksBlocksPositions
                    .some(position => position.x === currentBlockPosX && position.y === currentBlockPosY);
            }
        });
    }

    rotate() {
        let newBrickShapeState = this.brickShapeState < this.brickShape.length - 1 ? this.brickShapeState + 1 : 0;
        if (this.areAllBlocksBeforeBorder(this.brickShape[newBrickShapeState], 0) &&
            this.areAllBlocksBeforeBorder(this.brickShape[newBrickShapeState], this.game.gameWidth - 20) && !this.blockRotate) {
            this.brickShapeState = newBrickShapeState;
        }
    }

    areAllBlocksBeforeBorder(bricks, border) {
        return !bricks.some(position => position.x === border);
    }

    moveLeft() {
        if (this.areAllBlocksBeforeBorder(this.brickBlocksPositions, 0)) {
            this.position.x -= 20;
        }
    }

    moveRight() {
        if (this.areAllBlocksBeforeBorder(this.brickBlocksPositions, this.game.gameWidth - 20)) {
            this.position.x += 20;
        }
    }

    moveDown() {
        this.position.y += 20;
    }
}