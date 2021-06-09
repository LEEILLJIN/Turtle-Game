//SELECT CVS
const cvs = document.getElementById("turtle");
const ctx = cvs.getContext("2d");

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
//CONTROL THE GAME
cvs.addEventListener("click",function(evt){
    switch(state.current){
        case state.getReady:
            state.current = state.game;

            break;
        case state.game:
            turtle.flap();
            break;
        case state.over:
            state.current = state.getReady;
            turtle.speedReset();
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
    x : 50,
    y : 150,
    w : 150,
    h : 100,

    frame : 0,

    gravity : 0.25,
    jump : 4.6,
    speed : 0,
    rotation : 0,
    radius : 12,

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
             }
            }
            //IF THE SPEED IS GREATER THAN THE JUMP MEANS THE BIRDS IS FALLING DOWN
            if(this.speed >= this.jump){
                this.rotation = 90 * DEGREE;
                this.frame = 1;
            }else{
                this.rotation = -25 * DEGREE;
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
    sX : 0,
    sY : 0,
    sW : 94,
    sH : 247,
    w : 70,
    h : 70,
    x : 400,
    y : 100,
    dx : 2,

    draw : function(){
        ctx.drawImage(garbageimg, this.sX, this.sY, this.sW, this.sH, this.x, this.y, this.w, this.h);
    }
}

//DRAW
function draw(){
    // ctx.fillStyle = "black";
    // ctx.fillRect(0, 0, cvs.width, cvs.height );
    bg.draw();
    fg.draw();
    turtle.draw();
    garbage.draw();
}
//UPDATE
function update(){
   fg.update();
   turtle.update();
}
//LOOP
function loop(){
    draw();
    update();
    frames++;
    requestAnimationFrame(loop);
}
loop();