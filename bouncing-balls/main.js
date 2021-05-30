const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

function random(min, max) {
    const num = Math.floor(Math.random()*(max - min + 1)) + min;
    return num;
}

class Ball {
    constructor(x, y, velX, velY, color, size) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.size = size;
    }

    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
        ctx.fill();
    }

    update(){
        if(this.x + this.size >= width) {
            this.velX = -(this.velX);
        }
        else if(this.x - this.size <= 0) {
            this.velX = -(this.velX);
        }

        if(this.y + this.size >= height) {
            this.velY = -(this.velY);
        }
        else if(this.y - this.size <= 0) {
            this.velY = -(this.velY);
        }

        this.x += this.velX;
        this.y += this.velY;
        
    }

    collisionDetect() {
        // console.log("detect funciton");
        for( let ball of balls){
            if (this !== ball) {
                // console.log(ball.color);
                let dx = this.x - ball.x;
                let dy = this.y - ball.y;

                let distance = Math.sqrt(dx*dx + dy*dy);

                if (distance <= this.size + ball.size){
                    // console.log(distance);
                    this.color = ball.color =  'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0,255) + ')';
                }
            }
        }
    }
}

let balls = [];
while(balls.length < 4) {
    let size = random(10, 20);
    let ball = new Ball(random(size, width - size),
                        random(size, height - size),
                        random(-7 , 7),
                        random(-7, 7),
                        'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0,255) + ')',
                        size
                        );
    balls.push(ball);
}

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    for(let ball of balls) {
        ball.draw();
        ball.update();
        ball.collisionDetect();
    }

    requestAnimationFrame(loop);
}

loop();