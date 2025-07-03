var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

let maxspeed=0
let speedx = 0
let speedy = 1
let pressed = false
let active = 0
let offset = 100
let rot=0
let tp = {
    start: 0,
    end: 400,
    func: "100*Math.sin(0.01*i)+200",
    der: "Math.cos(0.01*i)"
}
tp2={
    start: 400,
    end: 800,
    func: "-1*Math.pow(1.0111,i)+200",
    der: "-1*Math.pow(1.0111,i)"
}
tp3={
    start: 0,
    end: 8000,
    func: "200+i*-0.01",
    der: "-0.01"
}
let parts = [tp3]
let player = {
    y: 0,
    x: 0
}
let part = {
    x: 0,
    y: 0
}
const playeri = new Image();
playeri.src = "assets/autoRot.png"


function drawPlayer() {
    ctx.beginPath();
    ctx.arc(offset, player.y, 4, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.drawImage(playeri, offset-playeri.width*0.05, player.y-playeri.height*0.05,playeri.width*0.1,playeri.height*0.1)
    
}


function drawPart() {

    /* ctx.moveTo(0, 0);
    ctx.lineTo(200, 100);
    ctx.stroke(); */

    for (let p = 0; p < parts.length; p++) {
        if(player.x<=parts[p].end&&player.x>parts[p].start){

            active=p
        }
        for (let i = 0; i < parts[p].end - parts[p].start; i++) {


            ctx.fillRect(i - player.x+parts[p].start, eval(parts[p].func), 1, 1);
            
        }
    }

}
function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    drawPlayer()
    drawPart()
}

function changeSpeed() {
    
    if (pressed) {
        
        if (!(maxspeed > 100)) {
            maxspeed += 2

        }
    } else {
        if (maxspeed != 0) {
            maxspeed -= 1

        }
    }
    
   
    let i = 0 + offset + player.x
    //console.log(player.y >= eval(parts[active].func))
    let temp = eval(parts[active].func)
    let tempd = eval(parts[active].der)
    rot=tempd
    
    if (player.y > temp) {
        speedx=Math.cos(Math.atan(tempd))*maxspeed
        speedy=Math.sin(Math.atan(tempd))*maxspeed
        player.y=temp-1
        //speedy = Math.min(Math.max(temp - player.y,-3)*2,Math.min(tempd,0)*7)
    } else
        if (player.y < temp ) {
            
            speedy = speedy+ 0.5
        }

    if (speedy > -10) {
        //speedy--
    }
    player.x += 0.1 * speedx
    player.y += speedy *0.05


}
function main() {
    changeSpeed()
    draw()
}
setInterval(main, 10)





document.body.onkeydown = function (e) {
    if (e.key == " " ||
        e.code == "Space" ||
        e.keyCode == 32
    ) {
        pressed = true
    }
}

document.body.onkeyup = function (e) {
    if (e.key == " " ||
        e.code == "Space" ||
        e.keyCode == 32
    ) {
        pressed = false
    }
}