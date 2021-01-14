import Game from "/src/game.js";

const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");

const GAME_WIDTH = 200;
const GAME_HEIGHT = 400;

const game = new Game(GAME_WIDTH, GAME_HEIGHT);

const mainContainer = document.querySelector(".main-container");

function drawMesh() {
    const mainContainerTable = document.createElement("table");
    let tableContent = ""
    for (let i = 0; i < 20; i++) {
        tableContent = tableContent.concat(
            "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>"
        );
    }
    mainContainerTable.innerHTML += tableContent;
    mainContainer.insertAdjacentElement("afterbegin", mainContainerTable);
}

drawMesh();

function gameLoop() {
    game.clear(ctx);

    game.update();
    game.draw(ctx);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);












