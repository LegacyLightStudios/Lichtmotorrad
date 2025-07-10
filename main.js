//Lichtmotorad

//initialize the canvas
var c = document.getElementById("myCanvas");
c.width = window.innerWidth;
c.height = window.innerHeight;
var ctx = c.getContext("2d");
ctx.fillStyle = "#1F51FF";
//initialize global game variables
let maxspeed = 0
let speedx = 0
let speedy = 1
let pressed = false
let active = 0 //active part of the level
let offset = 100//offset of the player in x-direction
let rot = 0//rotation
let rotspeed = 0//speed of rotation
let on = false //on the path
let mi//main interval
let score = 0
let mayo = 0
let flip=0
let scoreelement = document.getElementById("score");
let mayoelement = document.getElementById("mayo");
let fliptext=document.getElementById("add")

let flipreset
let player = {
    y: 0,
    x: 0
}
let scale = 2
//Player image
const playeri = new Image();
playeri.src = "assets/autoRot.png"
const itemi = new Image();
itemi.src = "assets/MayoFlasche.png"

let item = {
    x: 240,
    y: 320
}
let items = [item]
//Parts of the level. "start" and "end" define the x-coordinates of the part in the level, Function is defined in Interval [0;end-start] , "func" is the function of the path, and "der" is the derivative of that function for calculating speed and rotation.
// Currently only used for testing purposes. Advanced level system will be developed later.
let tp = {
    start: 0,
    end: 400,
    func: i => 100 * Math.sin(0.01 * i) + 270,
    der: i => Math.cos(0.01 * i)
}
let tp2 = {
    start: 0,
    end: 400,
    func: i => -1 * Math.pow(1.0111, i) + 270,
    der: i => -1 * Math.log(1.0111) * Math.pow(1.0111, i)
}
let tp3 = {
    start: 0,
    end: 400,
    func: i => 270 + i * -0.01,
    der: i => -0.01 + i * 0
}
let possibleParts = [tp, tp2, tp3]
let parts = [tp]
function spawnPart(start) {
    
    //spawn a new part of the level
    let rand = Math.floor(Math.random() * 3)
    let temp = Object.assign({}, possibleParts[rand])//copy the objkect not the reference
    let length = temp.end - temp.start
    temp.start = start
    temp.end = start + length
    parts.push(temp)
}
function update() {
    // calculate speed of the player. Accelerate when space is pressed, decelerate when released.
    if (pressed) {
        if (on) {
            if (!(maxspeed > 100)) {
                maxspeed += 2
            }
        } else {
            rotspeed -= 0.01
            rotspeed = Math.max(rotspeed, -0.16)
        }

    } else {
        if (on) {
            if (maxspeed != 0) {
                maxspeed -= 1
            }
        } else {
            if (rotspeed <= 0) {
                rotspeed += 0.005
            }
            rotspeed = Math.min(rotspeed, 0)

        }
    }

    //calculate the current "position" of the player (x-coordinate). Needed for eval functions.
    let i = offset + player.x - parts[active].start
    //eval functions for calculating the current y-coordinate of the player and the derivative for rotation and to split the speed.
    let temp = parts[active].func(i)
    let tempd = parts[active].der(i)
    on = (player.y > temp - 20)
    if (on) {
        if (Math.abs(rot - Math.atan(tempd)) > 1 && Math.abs(rot - Math.atan(tempd)) < Math.PI * 2 - 1) {//check if angle is greater than 60degrees relative to the derivative
           
            clearInterval(mi)
            alert("You crashed! Your score: " + score + " Mayo collected: " + mayo)
            reset()
        }else{
        console.log(flip)
        
        rotspeed = 0
        rot = Math.atan(tempd)
        score+=flip
        scoreelement.innerHTML=score
        
        
        flip=0
        }
    }
    rot += rotspeed
    
    if(Math.abs(rot)>=2*Math.PI){
        flip++
        
        fliptext.innerHTML="+ "+ flip.toString()
        clearTimeout(flipreset)
        flipreset=setTimeout(()=>{fliptext.innerHTML=""},2000)
    }
    
    rot = rot % (2 * Math.PI)

    //variable to check if the player is on the path or not

    if (player.y > temp) {
        //split up speed into x and y components based on the derivative of the path and the current speed.
        speedx = Math.cos(Math.atan(tempd)) * maxspeed
        speedy = Math.sin(Math.atan(tempd)) * maxspeed
        //prevent glitching and normalize the y-coordinate of the player to the path. 
        player.y = temp - 1
    } else
        //calculate gravity if player is not on the path.
        if (player.y < temp) {
            //linear gravity speed increase -> quadratic position increase
            speedy = speedy + 0.4
        }
    //apply the speed to the player position.
    player.x += 0.1 * speedx
    player.y += speedy * 0.05

    for (let j = 0; j < items.length; j++) {
        //check if player is on the item and remove it if so.
        if (player.x + offset >= items[j].x - 30 && player.x + offset <= items[j].x + 30 && player.y >= items[j].y - 30 && player.y <= items[j].y + 30) {
            console.log("Item collected at: " + items[j].x + ", " + items[j].y);
            items.splice(j, 1)
            j--
            mayo++
            mayoelement.innerHTML = mayo
        }
    }
}

function drawPlayer() {
    
    ctx.save();
    //rotate canvas
    ctx.translate(scale * offset, scale * player.y);
    ctx.rotate(rot);
    ctx.translate(scale * -offset, scale * -player.y);
    //draw player centered an x and y coordinates
    ctx.drawImage(playeri, scale * (offset - playeri.width * 0.05), scale * (player.y - playeri.height * 0.05), scale * (playeri.width * 0.1), scale * playeri.height * 0.1)
    ctx.restore();
}

function drawPart() {
    for (let p = 0; p < parts.length; p++) {
        //set active part of the level in order to calculate correct collision
        if (player.x + offset <= parts[p].end && player.x + offset > parts[p].start) {
            if (active != p) {
                spawnPart(parts[p].end)
                addscore()
            }
            active = p
        }
        //draw functtion by drawin 1x1 rectangles
        if (p >= active - 2) {
            for (let i = 0; i < parts[p].end - parts[p].start; i++) {
                
                ctx.fillRect(scale * (i - player.x + parts[p].start), scale * (parts[p].func(i)), scale * 2, scale * 2,);
            }
        }
    }
}
function drawItems() {
    //draw items on the canvas
    for (let j = 0; j < items.length; j++) {
        ctx.drawImage(itemi, scale * (items[j].x - player.x - 25), scale * (items[j].y - 25), scale * 50, scale * 50)
    }
}
// Function to clear the canvas and draws the player and parts.
function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    drawPlayer()
    drawPart()
    drawItems()
}


function addscore() {
    score++
    scoreelement.innerHTML = score
}

function init() {
    spawnPart(400)
}
// Main function that updates movement and draws the player and parts.
function main() {
    update()
    draw()
}
function reset() {
    //reset all variables to initial state
    maxspeed = 0
    speedx = 0
    speedy = 1
    pressed = false
    active = 0 //active part of the level
    offset = 100//offset of the player in x-direction
    rot = 0
    rotspeed = 0
    on = false
    score = 0
    mayo = 0
    scoreelement.innerHTML = score;
    mayoelement.innerHTML = mayo;
    player.x = 0;
    player.y = 0;
    items = [item];
    parts = [tp];
    flip=0
    init()
    mi = setInterval(main, 10)
}
// Event listeners for space presses; sets `pressed` to true when space is pressed and false when released.
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
// Event listeners for touch events; sets `pressed` to true when the screen is touched and false when released.
document.addEventListener("touchstart", () => {
    pressed = true
});
document.addEventListener("touchend", () => {
    pressed = false
});


//Spawn first parts of the map
init()
// Set an interval to call the main function every 10 milliseconds.
mi = setInterval(main, 10)
