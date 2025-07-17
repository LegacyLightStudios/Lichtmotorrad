// script.js

/* Get the canvas */
var canvas = document.getElementById("myCanvas");

/* Get the height and width of the window */
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

/* Get the 2D context of the canvas */
var ctx = canvas.getContext("2d");

/* Fills or sets the color,gradient,pattern */
/* ctx.fillStyle = "transparent";
ctx.fillRect(0, 0, canvas.width, canvas.height); */
ctx.font = "50px Arial";
ctx.fillStyle = "red";

/* Writes the required text */

let particles = [];
    
/* Initialize particle object */
class Particle {
    constructor(x, y, radius, dx, dy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.alpha = 1;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = 'red';

        /* Begins or reset the path for 
        the arc created */
        ctx.beginPath();

        /* Some curve is created*/
        ctx.arc(this.x, this.y, this.radius,
            0, Math.PI * 2, false);

        ctx.fill();

        /* Restore the recent canvas context*/
        ctx.restore();
    }
    update() {
        this.draw();
        this.alpha -= 0.01;
        this.x += this.dx;
        this.y += this.dy;
    }
}

/* Timer is set for particle push 
    execution in intervals*/

    for (i = 0; i <= 200; i++) {
        let dx = (Math.random() - 0.5) * (Math.random() * 6);
        let dy = (Math.random() - 0.5) * (Math.random() * 6);
        let radius = Math.random() * 3;
        let particle = new Particle(100, 100, radius, dx, dy);

        /* Adds new items like particle*/
        particles.push(particle);
    }
    explode();


/* Particle explosion function */
function explode() {

    /* Clears the given pixels in the rectangle */
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    /* ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height); */
    particles.forEach((particle, i) => {
        if (particle.alpha <= 0) {
            particles.splice(i, 1);
        } else particle.update()
    })

    /* Performs a animation after request*/
    requestAnimationFrame(explode);
}
