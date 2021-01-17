import Game from "/src/game.js";
import Position from "/src/position.js";
import {GAME_STATE} from "/src/gameStates.js";
import { shapes } from "/src/brickShapes.js";
import {drawBlock} from "/src/drawBlock.js";

export default class Brick {

    constructor(game) {
        this.game = game;
        this.position = new Position(40,-20);
        this.brickBlocksPositions = [];
        this.brickShape = this.getRandomBrickShape();
        this.brickShapeState = 0;
        this.blockSize = 20;
        this.speedX = 0;
        this.speedY = 0;
        this.setBrickFall();
    }

    getRandomBrickShape() {
        return shapes[Math.floor(Math.random() * shapes.length)];
    }

    setBrickFall() {
        setInterval(() => this.speedY = 20, 500);
    }

    draw(ctx) {
        this.brickBlocksPositions.forEach(position => drawBlock(ctx, position));
    }

    convertShapeToBlocksPositions(shape, position) {
        const blocksPositions = [];
        const columnsQty = 4;
        let row = 0;
        let column = 0;

        shape.forEach((number, index) => {
            if (number === 1) {
                row = Math.floor(index / columnsQty);
                column = index % columnsQty;
                const currentBlockPosX = position.x + (column * this.blockSize);
                const currentBlockPosY = position.y + (row * this.blockSize);
                blocksPositions.push(new Position(currentBlockPosX, currentBlockPosY));
            }
        });

        return blocksPositions;
    }

    checkIfAnyBlockHasSamePosition(brick, position) {
        const brickBlocksPositions = this.convertShapeToBlocksPositions(brick, position);
        return brickBlocksPositions.some(currentBlockPos => {
            return this.game.fallenBricksBlocksPositions
                .some(fallenBlockPos => fallenBlockPos.x === currentBlockPos.x && fallenBlockPos.y === currentBlockPos.y);
        });
    }

    update() {
        this.updatePositionBySpeed();

        this.brickBlocksPositions = this.convertShapeToBlocksPositions(this.brickShape[this.brickShapeState], this.position);

        const lastBrickPosY = this.brickBlocksPositions[this.brickBlocksPositions.length - 1].y + 20;

        if (lastBrickPosY >= this.game.gameHeight || this.checkIfAnyBlockHasSamePosition(this.brickShape[this.brickShapeState], new Position(this.position.x, this.position.y + 20))) {
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
        if (this.isBrickPositionValid(this.position, this.brickShape[newBrickShapeState])) {
            this.brickShapeState = newBrickShapeState;
        }
    }

    areAllBlocksWithinBorders(bricks, position) {
        const blocksPositions = this.convertShapeToBlocksPositions(bricks, position);
        return !blocksPositions.some(blockPosition => blockPosition.x < 0 || blockPosition.x > this.game.gameWidth - 20);
    }

    isBrickPositionValid(position, brickShape = this.brickShape[this.brickShapeState]) {
        return this.areAllBlocksWithinBorders(brickShape, position) &&
            !this.checkIfAnyBlockHasSamePosition(brickShape, position) &&
            this.game.gameState === GAME_STATE.RUNNING;
    }

    moveLeft() {
        if (this.isBrickPositionValid(new Position(this.position.x - 20, this.position.y))) {
            this.speedX = -20;
        }
    }

    moveRight() {
        if (this.isBrickPositionValid(new Position(this.position.x + 20, this.position.y))) {
            this.speedX = 20;
        }
    }

    moveDown() {
        this.speedY = 20;
    }
}