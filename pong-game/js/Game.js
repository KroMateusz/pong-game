const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const playerPointsTable = document.querySelector('.player-points');
const computerPointsTable = document.querySelector('.computer-points');
const buttonReset = document.querySelector('.reset');
const buttonAdd = document.querySelector('.add-ball');
const buttonRemove = document.querySelector('.remove-ball');

canvas.width = 1000;
canvas.height = 500;
let gameWidth = canvas.width;
let playerPoints = 0;
let computerPoints = 0;
const startSpeed = 2;
let multiplayer = true;
const difficult = 0.2;

const updateScore = () => {
    playerPointsTable.textContent = playerPoints;
    computerPointsTable.textContent = computerPoints;
}

const addBall = () => {
    const addedBall = new Ball(15, 'white', canvas.width / 2 - 4, canvas.height / 2 - 4);
    collisionObjects.push(addedBall);
    ballsGame.push(addedBall);
}

const removeBall = () => {
    if (collisionObjects.length > 3)
        collisionObjects.pop();
    if (ballsGame.length > 1)
        ballsGame.pop();
}

const resetGame = () => {
    playerPoints = computerPoints = 0;
    ballsGame.forEach(ballGame => {
        ballGame.resetBall()
    })
    timer;
}

const keyboardSupport = event => {
    if (event.keyCode === 87) {
        playerPaddle.moveUp(ballsGame);
    } else if (event.keyCode === 83) {
        playerPaddle.moveDown(ballsGame);
    }
    if (multiplayer) {
        if (event.keyCode === 80) {
            computerPaddle.moveUp(ballsGame);
        } else if (event.keyCode === 186) {
            computerPaddle.moveDown(ballsGame);
        }
    }
}

const ballMove = ballsGame => {
    ballsGame.forEach(ballGame => {
        ballGame.move(collisionObjects)
    })
}

const updateGameWindow = () => {
    gameWidth = canvas.width;
    computerPaddle.positionX = canvas.width - 30;
}

const clearScreen = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

class Paddle {
    constructor(width, height, color, positionX, positionY) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.positionX = positionX;
        this.positionY = positionY;
        this.speed = 3;
        this.middleHeight = height / 2;

        this.autoMove = ballsGame => {
            let minX = canvas.width;
            let numberOfMinElements;
            let tempX;
            for (let i = 0; i < ballsGame.length; i++) {
                if (this.positionX > ballsGame[i].positionX) {
                    tempX = this.positionX - ballsGame[i].positionX;
                } else {
                    tempX = ballsGame[i].positionX - this.positionX;
                }

                if (minX > tempX) {
                    minX = tempX;
                    numberOfMinElements = i;
                }
            }
            if (this.positionY + this.middleHeight > ballsGame[numberOfMinElements].positionY + ballsGame[numberOfMinElements].middleHeight) {
                this.moveUp(ballsGame);
            } else {
                this.moveDown(ballsGame)
            }
        }

        this.moveUp = ballsGame => {
            const paddleTop = this.positionY;
            const paddleLeft = this.positionX;
            const paddleRight = this.positionX + this.width;
            let ballBottom;
            let ballLeft;
            let ballRight;
            let collision = false;

            for (let i = 0; i < ballsGame.length; i++) {
                ballBottom = ballsGame[i].positionY + ballsGame[i].height;
                ballLeft = ballsGame[i].positionX;
                ballRight = ballsGame[i].positionX + ballsGame[i].width;

                if (((paddleLeft <= ballLeft && ballLeft <= paddleRight) || (paddleLeft <= ballRight && ballRight <= paddleRight)) && (paddleTop >= ballBottom && (paddleTop - this.speed <= ballBottom))) {
                    this.positionY = ballBottom;
                    collision = !collision;
                    break;
                } else if (paddleTop - this.speed < 0) {
                    this.positionY = 0;
                    collision = !collision;
                    break;
                }
            }
            if (!collision) {
                this.positionY -= this.speed;
            }
        }

        this.moveDown = ballsGame => {
            const paddleBottom = this.positionY + this.height;
            const paddleLeft = this.positionX;
            const paddleRight = this.positionX + this.width;
            let ballTop;
            let ballLeft;
            let ballRight;
            let collision = false;;
            for (let i = 0; i < ballsGame.length; i++) {
                ballTop = ballsGame[i].positionY;
                ballLeft = ballsGame[i].positionX;
                ballRight = ballsGame[i].positionX + ballsGame[i].width;

                if (((paddleLeft <= ballLeft && ballLeft <= paddleRight) || (paddleLeft <= ballRight && ballRight <= paddleRight)) && (paddleBottom <= ballTop && (paddleBottom + this.speed >= ballTop))) {
                    this.positionY = ballTop - this.height;
                    collision = !collision;
                    break;
                } else if (paddleBottom + this.speed > canvas.height) {
                    this.positionY = canvas.height - this.height;
                    collision = !collision;
                    break;
                }
            }
            if (!collision) {
                this.positionY += this.speed;
            }
        }
    }
}
class Ball {
    constructor(size, color, positionX, positionY) {
        this.width = size;
        this.height = size;
        this.color = color;
        this.positionX = positionX;
        this.positionY = positionY;
        this.middleHeight = size / 2;
        this.speedX = startSpeed;
        this.speedY = startSpeed;
        this.directionX = true; //true -> right
        this.directionY = true; //true -> down

        this.resetBall = () => {
            if (Math.round(Math.random())) {
                this.directionX = !this.directionX;
            }
            if (Math.round(Math.random())) {
                this.directionY = !this.directionY;
            }
            this.speedX = startSpeed;
            this.speedY = startSpeed;
            this.positionX = canvas.width / 2 - this.width / 2;
            this.positionY = canvas.height / 2 - this.height / 2;
        }

        this.move = collisionObjects => {
            let collision = 0;
            const ballLeft = this.positionX;
            const ballRight = this.positionX + this.width;
            const ballTop = this.positionY;
            const ballBottom = this.positionY + this.height;

            if (this.directionX && this.directionY) {
                for (let i = 0; i < collisionObjects.length; i++) {
                    let objectLeft = collisionObjects[i].positionX;
                    let objectRight = collisionObjects[i].positionX + collisionObjects[i].width;
                    let objectTop = collisionObjects[i].positionY;
                    let objectBottom = collisionObjects[i].positionY + collisionObjects[i].height;

                    if (this === collisionObjects[i])
                        continue;
                    else if (((objectLeft <= ballLeft && ballLeft <= objectRight) || (objectLeft <= ballRight && ballRight <= objectRight)) && ((objectTop <= ballTop && ballTop <= objectBottom) || (objectTop <= ballBottom && ballBottom <= objectBottom))) {
                        this.directionX != this.directionX;
                        break;
                    }

                    if ((ballLeft < objectRight && ((objectLeft <= ballLeft + this.speedX && ballLeft + this.speedX <= objectRight) || ((objectLeft <= ballRight + this.speedX && ballRight + this.speedX <= objectRight))) && (ballTop < objectBottom && ((objectTop <= ballTop + this.speedY && ballTop + this.speedY <= objectBottom) || (objectTop <= ballBottom + this.speedY && ballBottom + this.speedY <= objectBottom))))) {
                        collision = 1;
                        break;
                    } else if (ballBottom + this.speedY > canvas.height) {
                        collision = 2;
                        break;
                    } else if (ballRight + this.speedX > canvas.width) {
                        collision = 3;
                        playerPoints++;
                        break;
                    }

                }

            } else if (this.directionX && !this.directionY) {
                for (let i = 0; i < collisionObjects.length; i++) {
                    let objectLeft = collisionObjects[i].positionX;
                    let objectRight = collisionObjects[i].positionX + collisionObjects[i].width;
                    let objectTop = collisionObjects[i].positionY;
                    let objectBottom = collisionObjects[i].positionY + collisionObjects[i].height;

                    if (this === collisionObjects[i])
                        continue;
                    else if (((objectLeft <= ballLeft && ballLeft <= objectRight) || (objectLeft <= ballRight && ballRight <= objectRight)) && ((objectTop <= ballTop && ballTop <= objectBottom) || (objectTop <= ballBottom && ballBottom <= objectBottom))) {
                        this.directionX != this.directionX;
                        break;
                    }

                    if ((ballLeft < objectRight && ((objectLeft <= ballLeft + this.speedX && ballLeft + this.speedX <= objectRight) || ((objectLeft <= ballRight + this.speedX && ballRight + this.speedX <= objectRight))) && (ballBottom > objectTop && ((objectTop <= ballTop - this.speedY && ballTop - this.speedY <= objectBottom) || (objectTop <= ballBottom - this.speedY && ballBottom - this.speedY <= objectBottom))))) {
                        collision = 1;
                        break;
                    } else if (ballTop - this.speedY < 0) {
                        collision = 2;
                        break;
                    } else if (ballLeft + this.speedX > canvas.width) {
                        collision = 3;
                        playerPoints++;
                        break;
                    }

                }

            } else if (!this.directionX && this.directionY) {
                for (let i = 0; i < collisionObjects.length; i++) {
                    let objectLeft = collisionObjects[i].positionX;
                    let objectRight = collisionObjects[i].positionX + collisionObjects[i].width;
                    let objectTop = collisionObjects[i].positionY;
                    let objectBottom = collisionObjects[i].positionY + collisionObjects[i].height;

                    if (this === collisionObjects[i])
                        continue;
                    else if (((objectLeft <= ballLeft && ballLeft <= objectRight) || (objectLeft <= ballRight && ballRight <= objectRight)) && ((objectTop <= ballTop && ballTop <= objectBottom) || (objectTop <= ballBottom && ballBottom <= objectBottom))) {
                        this.directionX != this.directionX;
                        break;
                    }

                    if ((ballRight > objectLeft && ((objectLeft <= ballLeft - this.speedX && ballLeft - this.speedX <= objectRight) || (objectLeft <= ballRight - this.speedX && ballRight - this.speedX <= objectRight))) && (ballTop < objectBottom && ((objectTop <= ballTop + this.speedY && ballTop + this.speedY <= objectBottom) || (objectTop <= ballBottom + this.speedY && ballBottom + this.speedY <= objectBottom)))) {
                        collision = 1;
                        break;
                    } else if (ballBottom + this.speedY > canvas.height) {
                        collision = 2;
                        break;
                    } else if (ballLeft - this.speedX < 0) {
                        collision = 3;
                        computerPoints++;
                        break;
                    }
                }
            } else {
                for (let i = 0; i < collisionObjects.length; i++) {
                    let objectLeft = collisionObjects[i].positionX;
                    let objectRight = collisionObjects[i].positionX + collisionObjects[i].width;
                    let objectTop = collisionObjects[i].positionY;
                    let objectBottom = collisionObjects[i].positionY + collisionObjects[i].height;

                    if (this === collisionObjects[i])
                        continue;
                    else if (((objectLeft <= ballLeft && ballLeft <= objectRight) || (objectLeft <= ballRight && ballRight <= objectRight)) && ((objectTop <= ballTop && ballTop <= objectBottom) || (objectTop <= ballBottom && ballBottom <= objectBottom))) {
                        this.directionX != this.directionX;
                        break;
                    }

                    if ((ballRight > objectLeft && ((objectLeft <= ballLeft - this.speedX && ballLeft - this.speedX <= objectRight) || (objectLeft <= ballRight - this.speedX && ballRight - this.speedX <= objectRight))) && (ballBottom > objectTop && ((objectTop <= ballTop - this.speedY && ballTop - this.speedY <= objectBottom) || (objectTop <= ballBottom - this.speedY && ballBottom - this.speedY <= objectBottom)))) {
                        collision = 1;
                        break;
                    } else if (ballTop - this.speedY < 0) {
                        collision = 2;
                        break;
                    } else if (ballLeft - this.speedX < 0) {
                        collision = 3;
                        computerPoints++;
                        break;
                    }
                }
            }
            if (collision) {

                if (Math.round(Math.random())) {
                    this.speedX += difficult + (Math.round(Math.random()) / 10);
                } else {
                    this.speedY += difficult + (Math.round(Math.random()) / 10);
                }

                if (collision === 1) {
                    this.directionX = !this.directionX;
                    if (Math.round(Math.random())) {
                        this.directionY = !this.directionY;
                    }
                } else if (collision === 2) {
                    this.directionY = !this.directionY;
                } else {
                    this.resetBall();
                }
            } else {
                if (this.directionX) {
                    this.positionX += this.speedX;
                } else {
                    this.positionX -= this.speedX;
                }
                if (this.directionY) {
                    this.positionY += this.speedY;
                } else {
                    this.positionY -= this.speedY;
                }
            }
        }
    }
}


function drawObject(collisionObjects, context) {
    collisionObjects.forEach(collisionObject => {
        context.fillStyle = collisionObject.color;
        context.fillRect(collisionObject.positionX, collisionObject.positionY, collisionObject.width, collisionObject.height);
    });
}

const collisionObjects = [];
const ballsGame = [];

const playerPaddle = new Paddle(20, 120, 'green', 10, 50);
const computerPaddle = new Paddle(20, 120, 'red', canvas.width - 30, 100);
const ball1 = new Ball(15, 'white', canvas.width / 2 - 4, canvas.height / 2 - 4);

collisionObjects.push(playerPaddle, computerPaddle, ball1);
ballsGame.push(ball1);


const run = () => {
    if (gameWidth !== canvas.width)
        updateGameWindow();
    clearScreen();
    ballMove(ballsGame);
    computerPaddle.autoMove(ballsGame);
    updateScore();
    drawObject(collisionObjects, ctx);
    if (playerPoints === 10 || computerPoints === 10) {
        clearInterval(timer)
    }
}

buttonRemove.addEventListener('click', removeBall);
buttonAdd.addEventListener('click', addBall);
buttonReset.addEventListener('click', resetGame);
window.addEventListener('keydown', keyboardSupport);
let timer = setInterval(run, 1000 / 60);
