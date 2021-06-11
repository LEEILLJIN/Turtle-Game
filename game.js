/*2021-6-11 
    todo : 
        -장애물 움직이고 충돌 이벤트 clear
        -점수, gameover
        gameover 이벤트 처리

*/

//SELECT CVS
const cvs = document.getElementById("turtle");
const ctx = cvs.getContext("2d");
//GAMEOVER MESSAGE
const RESTART = document.querySelector(".restart");
const SHOWING = "showing";
//GAME VARS AND CONSTS
let frames =0;
const DEGREE = Math.PI/180;
//GAME STATE
const state = {
    current : 0,
    getReady : 0,
    game : 1,
    over : 2
}
//LOAD IMAGE
const bgimg = new Image();
const turtleimg = new Image();
const garbageimg = new Image();
const fgimg = new Image();

bgimg.src = "img/rbackground3.png";
fgimg.src = "img/floor9.jpg";
turtleimg.src = "img/turtle.png";
garbageimg.src = "img/marine-garbage.png";

//LOAD SOUNDS
// const SCORE_S = new Audio();
// SCORE_S.src = "audio/sfx_point.wav"

const SWIM = new Audio();
SWIM.src = "sound/swimming.wav"

const HIT = new Audio();
HIT.src = "sound/hit.wav"

const DIE = new Audio();
DIE.src = "sound/die.wav"


//CONTROL THE GAME
cvs.addEventListener("click",function(evt){
    switch(state.current){
        case state.getReady:
            state.current = state.game;

            break;
        case state.game:
            turtle.flap();
           // SWIM.play();
            break;
        case state.over:
            RESTART.addEventListener("click" , function(){
                console.log("Dd");
                turtle.speedReset();
                garbage.reset();
                score.reset();
                state.current = state.getReady;
            })

    }
});

//BACKGROUND
const bg={
    sX : 0,
    sY : 50,
    w : cvs.width,
    h : cvs.height,
    x : 0,
    y : 0,

    draw : function(){
        ctx.drawImage(bgimg, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
       
    }
    
}

//FOREGROUND(부족해)
const fg = {
    sX : 0,
    sY : 0,
    w : cvs.width,
    h : 50,
    x : 0,
    y : cvs.height-50,

    dx :2,

    draw : function(){
        ctx.drawImage(fgimg, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);

        ctx.drawImage(fgimg, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },

    update : function(){
        if(state.current == state.game){
            this.x = (this.x - this.dx)%(this.w);
        }
    }
}
//TURTLE
const turtle = {
    animation : [
        { sX : 0, sY : 0, sW : 367 ,sH : 184 },//frame :0에 해당
        { sX : 0, sY : 185, sW : 295 ,sH : 212 },//frame :1에 해당
        { sX : 0, sY : 0, sW : 367 ,sH : 184 }//frame :2에 해당
    ],
    x : 60,
    y : 150,
    w : 150,
    h : 100,

    frame : 0,

    gravity : 0.25,
    jump : 4.6,
    speed : 0,
    rotation : 0,
    w_radius : 60,
    h_radius : 40,

    draw : function(){
        let turtle = this.animation[this.frame];
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(turtleimg, turtle.sX, turtle.sY, turtle.sW, turtle.sH, -this.w/4, -this.h/4, this.w, this.h);
        //rotate할때 this.x-this.w/2 -> -this.w/2로 this.y-this.h/2 -> -this.h2로 바뀐게 잘 이해가 안됨

        ctx.restore();

    },

    update : function(){
        this.period = state.current == state.getReady ? 10 : 5;
        this.frame += frames%this.period == 0 ? 1 : 0;
        this.frame = this.frame%this.animation.length;

        if(state.current == state.getReady){
            this.y = 150;//RESET POSITION OF THE BIRD AFTER GAME OVER
            this.rotation = 0 * DEGREE
        }else{
            this.speed += this.gravity;
            this.y += this.speed;

            if(this.y + this.w/2 >= cvs.height-50){//바닥에 닿았을 때 게임 종료
             this.y = cvs.height - 50 - this.w/2
             if(state.current == state.game){
                state.current = state.over;
                DIE.play();
             }
            }
            //IF THE SPEED IS GREATER THAN THE JUMP MEANS THE BIRDS IS FALLING DOWN
            if(this.speed < this.jump){
                this.rotation = -10 * DEGREE;
            }else{
                this.frame = 1;
            }
        }
    },

    flap : function(){
        this.speed -= this.jump;
    },

    speedReset : function(){
        this.speed = 0;
    }
    
}

//GARBAGE
const garbage = {
    position : [],
    dx : 2,

    draw : function(){
        for(let i =0; i<this.position.length; i++){
            let p = this.position[i];

            ctx.drawImage(garbageimg, p.sX, p.sY, p.sW, p.sH, p.x, p.y, p.w, p.h);
        }
    },
    update : function(){
        const gar = [
            {sX : 0, sY : 0, sW : 94, sH : 247},//gar[0] 페트병1
            {sX : 640, sY : 0, sW : 155, sH : 141},//gar[1] 비닐1
            {sX : 246, sY : 0, sW : 178, sH : 81},//gar[2] 페트병2
            {sX : 806, sY : 178, sW : 170, sH : 79},//gar[3] 페트병3
            {sX : 334, sY : 112, sW : 64, sH : 87},//gar[4] 종이컵1
            {sX : 212, sY : 76, sW : 100, sH : 73}//gar[5] 작은 페트병
        ];
        if(state.current !== state.game) return;

        if(frames%100 == 0){
            let k = Math.floor(Math.random()*6);
            switch(k){
                case 0 :
                case 1 :
                    this.position.push({
                        sX : gar[k].sX,
                        sY : gar[k].sY,
                        sW : gar[k].sW,
                        sH : gar[k].sH,
                        x : cvs.width,
                        y : (Math.random()*450)+1,
                        w : 40,
                        h : 75
                    });
                    break;
                case 2 :
                case 3 :
                    this.position.push({
                        sX : gar[k].sX,
                        sY : gar[k].sY,
                        sW : gar[k].sW,
                        sH : gar[k].sH,
                        x : cvs.width,
                        y : (Math.random()*500)+1,
                        w : 90,
                        h : 40
                    });
                    break;

                case 4 :
                    this.position.push({
                        sX : gar[k].sX,
                        sY : gar[k].sY,
                        sW : gar[k].sW,
                        sH : gar[k].sH,
                        x : cvs.width,
                        y : (Math.random()*500)+1,
                        w : 30,
                        h : 60
                    });
                    break;
                
                case 5 :
                    this.position.push({
                        sX : gar[k].sX,
                        sY : gar[k].sY,
                        sW : gar[k].sW,
                        sH : gar[k].sH,
                        x : cvs.width,
                        y : (Math.random()*500)+1,
                        w : 60,
                        h : 30
                    });
                    break;
            }
        }

        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i];
            //COLLECTION DETECTION
            if(turtle.x + turtle.w_radius > p.x-p.w/2 && turtle.x - turtle.w_radius < p.x+p.w/2 && turtle.y + turtle.h_radius > p.y-p.h/2 && turtle.y - turtle.h_radius < p.y + p.h/2){
                state.current = state.over;
                turtle.rotation = 90 * DEGREE;
                HIT.play();
            }

            //MOVE THE PIPES TO THE LEFT
            p.x -= this.dx;

             //IF THE GARBAGE GO BEYOND CANVAS, WE DELETE THEM FROM THE ARRAY

            score.best = Math.max(score.value, score.best);
            localStorage.setItem("best",score.best);
            
        }

    },

    reset : function(){
        this.position = [];
    }
}
//SCORE
const score = {
    best : parseInt(localStorage.getItem("best")) || 0,
    value : 0,

    draw : function(){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";

        if(state.current == state.game){
            if(frames%4 == 0){
                this.value++;
            }
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText(this.value, cvs.width/2, 50);
            ctx.strokeText(this.value, cvs.width/2, 50);
        }else if(state.current == state.over){
            //SCORE VALUE
            ctx.font = "25px Teko";
            ctx.fillText("SCORE : "+this.value, cvs.width/2-30, 50);
            ctx.strokeText("SCORE : "+this.value,cvs.width/2-30, 50);
            //BEST SCORE
            ctx.fillText("BEST : "+this.best, cvs.width/2-30, 100);
            ctx.strokeText("BEST : "+this.best, cvs.width/2-30, 100);
        }
    },
    reset : function(){
        this.value = 0;
    }
}

//GAMEOVER MESSAGE
const gameOver = {
    draw : function(){
        if(state.current == state.over){
            RESTART.classList.add(SHOWING);
            RESTART.innerText = "START";
            ctx.font = "35px Teko";
            ctx.fillText(RESTART.innerText, cvs.width/2-30, 150);
            ctx.strokeText(RESTART.innerText, cvs.width/2-30, 150);
        }
    }
}

//DRAW
function draw(){
    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#000";
    bg.draw();
    fg.draw();
    turtle.draw();
    garbage.draw();
    score.draw();
    gameOver.draw();
}
//UPDATE
function update(){
   fg.update();
   turtle.update();
   garbage.update();
}
//LOOP
function loop(){
    update();
    draw();
    frames++;
    requestAnimationFrame(loop);
}
loop();