'use strict';

let particle = {
 x: 10,
 y: 10,
 r: 10,
 vx: 10,
 vy: 10,
}

let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');

canvas.width = '1000';
canvas.height = '700';

console.log(context);
console.log('Hello World');

gameLoop();

function gameLoop() {
    setTimeout(gameLoop, 1000/60);
    console.log('time');
    
    context.fillStyle = '#777';
    context.fillRect(0,0,1000,700); //ochistka
    

    context.beginPath();
    context.arc(particle.x,particle.y,particle.r,0,2*Math.PI,false);
    context.fillStyle = 'blue';
    context.fill();
    

    particle.x += particle.vx;
    particle.y += particle.vy;

    
    if (particle.x < 0 || particle.x > 1000) {
        particle.vx = particle.vx * (-1);
    }
    if (particle.y < 0 || particle.y > 700) {
        particle.vy = particle.vy * (-1);
    }
    
}