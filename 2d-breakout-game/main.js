// setup canvas
const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext('2d');
const width = canvas.width = "480";
const height = canvas.height = "320";
let relativeX = -1;
class Ball {
    constructor(x,y,velX,velY,size,color){
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
        ctx.fill();
    }

    update(board) {
        if( (this.x+this.size > width) || (this.x-this.size<0) ){
            this.velX = - this.velX;
        }
        if(this.y - this.size < 0) {
            this.velY = -this.velY;
        }

        if(this.y + this.size > height) {
            //alert("Game over");
            this.x = board.x + board.width / 2;
            this.y = board.y - this.size;
            this.velY = - this.velY;
            return true;
        }

        if((this.y+this.size > board.y && this.y+this.size < board.y + board.height/2) && (this.x+this.size >= board.x && this.x-this.size <= board.x+board.width)){
            this.velY = -this.velY;
        }

        this.x += this.velX;
        this.y += this.velY;
        return false;
    }
}


class Board {
    constructor(x,y,width,height,color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.velX=0;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fill();
    }

    update() {
        if (relativeX > this.width/2 && relativeX < width - this.width/2){
            this.x = relativeX - this.width/2;
        }
            if (movingLeft && !movingRight)
            this.velX = -5;
            else if (movingRight && !movingLeft)
                this.velX = 5;
            else
                this.velX = 0
            if (!((this.x+this.velX <0) || (this.x + this.width + this.velX > canvas.width)))
                this.x += this.velX;
        
    }
}

class Brick {
    constructor(x,y,width,height,color,isAlive){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isAlive = isAlive;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fill();
    }

    update(ball) {
        if((ball.x+ball.size > this.x && ball.x-ball.size < this.x+this.width) && (((ball.y - ball.size < this.y +this.height) &&(ball.y - ball.size > this.y )) || (ball.y+ball.size > this.y) && (ball.y+ball.size < this.y + this.height))) {
            this.isAlive = 0;
        }
    }
}


// listeners for keyboard presses
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
document.addEventListener("mousemove", handleMouseMovement);
let movingLeft = false;
let movingRight = false;

function handleKeyDown(event) {
    if ((event.code == "KeyA") || (event.code == "ArrowLeft")) {
        movingLeft = true;
        }
    if ((event.code == "KeyD") || (event.code == "ArrowRight")) {
        movingRight = true;
    }
}

function handleKeyUp(event) {
    if ((event.code == "KeyA") || (event.code == "ArrowLeft")) {
        movingLeft = false;
    }
    if ((event.code == "KeyD") || (event.code == "ArrowRight")) {
        movingRight = false;
    }
}

function handleMouseMovement(event) {
    relativeX = event.clientX - canvas.offsetLeft;
    console.log(relativeX);
    return relativeX;
}

class BreakingBlocksGame {
    constructor() {
        this.ball = new Ball(canvas.width/2,canvas.height-20-5,2,-2,5, "purple");
        this.board = new Board((canvas.width - 80)/2, canvas.height - 20, 80, 10, 'red' );
        this.bricks = [];
        this.nRows = 3;
        this.nCols = 6;
        this.populateBricks()
        this.lives = 3;
        this.gameOver = false;
    }
    populateBricks() {
        for (let i=0;i<this.nRows;i++){
            for(let j=0;j<this.nCols;j++){
                let b = new Brick(35 + j*70, 40 + i * 30, 60, 20, "red", 1);
                this.bricks.push(b);
            }
        }
    }

    drawScore() {
        this.calcualteScore();
        ctx.fillStyle = "red";
        ctx.fillText('Score:'+this.score,0,10);
    }
    drawLives() {
        ctx.fillStyle="red";
        ctx.fillText('Lives:'+this.lives,width-40,10);
    }
    draw() {
        ctx.clearRect(0,0,width, height);
        this.drawScore();
        this.drawLives();
        this.ball.draw();
        this.board.draw();
        // drawing remaining bricks
        for(let brick of this.bricks){
            if (brick.isAlive)
                brick.draw();
        }
    }

    update() {
        if(this.ball.update(this.board))
            this.lives--;
        this.board.update()
        for(let brick of this.bricks){
            if (brick.isAlive)
                brick.update(this.ball);
        }
    }
    calcualteScore(){
        this.score = this.bricks.map(b=>1-b.isAlive).reduce((a,b)=>a+b);
    }
    finished() {
        if (this.lives<=0)
            this.gameOver = true;
        this.calcualteScore();
        return this.gameOver || this.score == this.nCols * this.nRows;
    }
}


const game = new BreakingBlocksGame();
function loop() {
    game.draw();
    game.update();

    if (!game.finished()){
        requestAnimationFrame(loop);
    }
    else{
        game.draw();
        let alertText = 'You Lose';
        if(!game.gameOver) 
            alertText = 'You win';
        setTimeout(()=> {
            alert(alertText);
            location.reload();
        }, 10);  
    }
}
    

let requestId = loop();
