export default class InputHandler {
    constructor(brick) {
        this.brick = brick;
        document.addEventListener("keydown", event => {
            switch (event.key) {
                case "ArrowLeft":
                    this.brick.moveLeft();
                    break;

                case "ArrowRight":
                    this.brick.moveRight();
                    break;

                case "ArrowDown":
                    this.brick.moveDown();
                    break;

                case "ArrowUp":
                    this.brick.rotate();
                    break;
            }
        });
    }

    updateBrick(brick) {
        this.brick = brick;
    }
}