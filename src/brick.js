import Game from "/src/game.js";
import {GAME_STATE} from "/src/gameStates.js";
import { shapes } from "/src/brickShapes.js";
import {drawBlock} from "/src/drawBlock.js";

export default class Brick {

    getRandomBrickShape() {
        return shapes[Math.floor(Math.random() * shapes.length)];
    }

    constructor(game) {
        this.position = { x: 40, y: -20 };
        this.brickBlocksPositions = [];
        this.game = game;
        this.columnsQty = 4;
        this.brickShape = this.getRandomBrickShape();
        this.brickShapeState = 0;
        this.blockSize = 20;
        this.timeoutDone = true;
        this.speedX = 0;
        this.speedY = 0;
    }

    draw(ctx) {
        this.brickBlocksPositions.forEach(position => drawBlock(ctx, position));
    }

    convertShapeToPositions(shape, position) {
        const blocksPositions = [];
        let row = 0;
        let column = 0;

        shape.forEach((number, index) => {
            if (number === 1) {
                row = Math.floor(index / this.columnsQty);
                column = index % this.columnsQty;
                const currentBlockPosX = position.x + (column * this.blockSize);
                const currentBlockPosY = position.y + (row * this.blockSize);
                blocksPositions.push({ x: currentBlockPosX, y: currentBlockPosY });
            }
        });

        return blocksPositions;
    }

    checkIfAnyBlockHasSamePosition(brick, position) {
        const brickPositions = this.convertShapeToPositions(brick, position);
        return brickPositions.some(currentBlockPos => {
            return this.game.fallenBricksBlocksPositions
                .some(fallenBlockPos => fallenBlockPos.x === currentBlockPos.x && fallenBlockPos.y === currentBlockPos.y);
        });
    }

    update() {
        if (this.timeoutDone) {
            this.timeoutDone = !this.timeoutDone;
            setTimeout(() => {
                this.speedY = 20;
                this.timeoutDone = !this.timeoutDone;
            }, 500);
        }

        this.updatePositionBySpeed();

        this.brickBlocksPositions = this.convertShapeToPositions(this.brickShape[this.brickShapeState], this.position);

        const lastBrickPosY = this.brickBlocksPositions[this.brickBlocksPositions.length - 1].y + 20;

        if (lastBrickPosY >= this.game.gameHeight || this.checkIfAnyBlockHasSamePosition(this.brickShape[this.brickShapeState], { x: this.position.x, y: this.position.y + 20 })) {
            this.game.onBrickCollision();
            return;
        }
    }

    updatePositionBySpeed() {
        this.position.x += this.speedX;
        this.position.y += this.speedY;

        this.speedX = 0;
        this.speedY = 0;
    }

    rotate() {
        let newBrickShapeState = this.brickShapeState < this.brickShape.length - 1 ? this.brickShapeState + 1 : 0;
        if (this.areAllBlocksWithinBorders(this.brickShape[newBrickShapeState], this.position) &&
            !this.checkIfAnyBlockHasSamePosition(this.brickShape[newBrickShapeState], this.position)) {
            this.brickShapeState = newBrickShapeState;
        }
    }

    areAllBlocksWithinBorders(bricks, position) {
        const blocksPositions = this.convertShapeToPositions(bricks, position);
        return !blocksPositions.some(blockPosition => blockPosition.x < 0 || blockPosition.x > this.game.gameWidth - 20);
    }

    canChangeXPosition(speedX) {
        return this.areAllBlocksWithinBorders(this.brickShape[this.brickShapeState], { x: this.position.x + speedX, y: this.position.y }) &&
            !this.checkIfAnyBlockHasSamePosition(this.brickShape[this.brickShapeState], { x: this.position.x + speedX, y: this.position.y }) &&
            this.game.gameState === GAME_STATE.RUNNING;
    }

    moveLeft() {
        if (this.canChangeXPosition(-20)) {
            this.speedX = -20;
        }
    }

    moveRight() {
        if (this.canChangeXPosition(20)) {
            this.speedX = 20;
        }
    }

    moveDown() {
        this.speedY = 20;
    }
}