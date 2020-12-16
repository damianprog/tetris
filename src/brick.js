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
    }

    draw(ctx) {
        ctx.fillStyle = "#0d47a1";

        this.brickBlocksPositions = this.convertShapeToPositions(this.brickShape[this.brickShapeState], this.position);
        this.brickBlocksPositions.forEach(position => ctx.fillRect(position.x, position.y, this.blockSize, this.blockSize))

        const lastBrickPosY = this.brickBlocksPositions[this.brickBlocksPositions.length - 1].y + 20;

        if (lastBrickPosY >= this.game.gameHeight || this.checkIfAnyBlockHasSamePosition(this.brickShape[this.brickShapeState], { x: this.position.x, y: this.position.y + 20 })) {
            this.game.onBrickCollision();
            return;
        }
    }

    convertShapeToPositions(shape, position) {
        const blocksPositions = [];
        let row = 0;
        let column = 0;

        shape.forEach((number, index) => {
            if (number === 1) {
                row = Math.floor(index / this.colNumber);
                column = index % this.colNumber;
                const currentBlockPosX = position.x + (column * this.blockSize);
                const currentBlockPosY = position.y + (row * this.blockSize);
                blocksPositions.push({ x: currentBlockPosX, y: currentBlockPosY });
            }
        });

        return blocksPositions;
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
        let row = 0;
        let column = 0;

        const brickPositions = this.convertShapeToPositions(brick, position);
        brickPositions.some(currentBlockPos => {
            return this.game.fallenBricksBlocksPositions
            .some(fallenBlockPos => fallenBlockPos.x === currentBlockPos.x && fallenBlockPos.y === currentBlockPos.y); 
        });
    }

    rotate() {
        let newBrickShapeState = this.brickShapeState < this.brickShape.length - 1 ? this.brickShapeState + 1 : 0;
        if (this.areAllBlocksBeforeBorder(this.brickShape[newBrickShapeState], 0) &&
            this.areAllBlocksBeforeBorder(this.brickShape[newBrickShapeState], this.game.gameWidth - 20) && 
            !this.checkIfAnyBlockHasSamePosition(this.brickShape[newBrickShapeState], this.position)) {
            this.brickShapeState = newBrickShapeState;
        }
    }

    areAllBlocksBeforeBorder(bricks, border) {
        const brickPositions = this.convertShapeToPositions(bricks, this.position);
        return !brickPositions.some(position => position.x === border);
    }

    moveLeft() {
        if (this.areAllBlocksBeforeBorder(this.brickShape[this.brickShapeState], 0) && 
            !this.checkIfAnyBlockHasSamePosition(this.brickShape[this.brickShapeState], { x: this.position.x - 20, y: this.position.y})) {
            this.position.x -= 20;
        }
    }

    moveRight() {
        if (this.areAllBlocksBeforeBorder(this.brickShape[this.brickShapeState], this.game.gameWidth - 20) && 
            !this.checkIfAnyBlockHasSamePosition(this.brickShape[this.brickShapeState], { x: this.position.x + 20, y: this.position.y})) {
            this.position.x += 20;
        }
    }

    moveDown() {
        this.position.y += 20;
    }
}