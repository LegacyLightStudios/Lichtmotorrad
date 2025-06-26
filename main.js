var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");


let speed= 0
let pressed=false

let tp={
    start:0,
    end: 100,
    func: "sin(x)"


}
let parts=[tp]
let player ={
    heigth: 100,
    x:0

}
let part={
    x:0,
    y:0
    
}

function drawPlayer(){
ctx.beginPath();
ctx.arc(100, 100-player.heigth, 4, 0, 2 * Math.PI);
ctx.stroke();

}


function drawPart(){

/* ctx.moveTo(0, 0);
ctx.lineTo(200, 100);
ctx.stroke(); */

for(let p in parts){

    for(let i=0;i<end-start){
        eval()
    }
}

}
function draw(){
ctx.clearRect(0, 0, c.width, c.height);
drawPlayer()
drawPart()
}

function changeSpeed(){
    console.log(speed)
    if(pressed){
        if (speed!=100){
            speed+=20

        }
    }else{
        if (speed!=0){
            speed-=4

        }
    }
    player.heigth-=10
}
function main(){
    changeSpeed()
    draw()
}
setInterval(main,10)





document.body.onkeydown = function(e) {
  if (e.key == " " ||
      e.code == "Space" ||      
      e.keyCode == 32      
  ) {
    pressed=true
  }
}

document.body.onkeyup = function(e) {
  if (e.key == " " ||
      e.code == "Space" ||      
      e.keyCode == 32      
  ) {
    pressed=false
  }
}