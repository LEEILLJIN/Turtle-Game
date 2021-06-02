//SELECT CVS
const cvs = document.getElementById("turtle");
const ctx = cvs.getContext("2d");

//GAME VARS AND CONSTS
let frames =0;

//GAME STATE
const state = {
    current : 1,
    getReady : 0,
    game : 1,
    over : 2
}
//LOAD IMAGE
const bgimg = new Image();
const turtle1 = new Image();
const turtle2 = new Image();
const turtle3 = new Image();
const garbage = new Image();
const fgimg = new Image();

bgimg.src = "img/rbackground3.png";
fgimg.src = "img/background1.png";
turtle1.src = "img/turtle1.png";
turtle2.src = "img/turtle2.png";
turtle3.src = "img/turtle3.png";
garbage.src = "img/marine-garbage.png";

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
        ctx.drawImage(bgimg, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    }
    
}

//FOREGROUND
const fg = {
    sX : 0,
    sY : 100,
    w : 2500,
    h : 339,
    x : 0,
    y : cvs.height-50,

    dx :2,

    draw : function(){
        ctx.drawImage(fgimg, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(fgimg, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },

    update : function(){
        if(state.current == state.game){
            this.x = (this.x - this.dx)%(this.w/2);
        }
    }
}

//DRAW
function draw(){
    // ctx.fillStyle = "black";
    // ctx.fillRect(0, 0, cvs.width, cvs.height );
    bg.draw();
    fg.draw();
}
//UPDATE
function update(){
    fg.update();
}
//LOOP
function loop(){
    draw();
    update();
    frames++;
    requestAnimationFrame(loop);
}
loop();