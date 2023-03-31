'use strict';

const canvasWidth = 1000;
const canvasHeight = 700;
const maxParticles = 10;
const colors = ['red', 'green', 'blue'];

let particles = [];

let numP = 0;
while (numP < maxParticles) {
    const promezhytok = canvasWidth / maxParticles;

    // random color index is 0, 1, 2
    const randomColorIndex = Math.round(Math.random() * 3);
    // random color is 'red', 'green', 'blue'
    const randomColor = colors[randomColorIndex];

    let particle = {
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        r: 10,
        vx: 10,
        vy: 10,
        color: randomColor,
    };

    particles.push(particle);

    numP += 1;
}

let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');

canvas.width = canvasWidth;
canvas.height = canvasHeight;

gameLoop();

function gameLoop() {
    setTimeout(gameLoop, 1000/60);
    
    clearScreen();
    particles.forEach(renderParticle);
    particles.forEach(moveParticle);
    particles.forEach(reflection);    
}

function clearScreen () {
    context.fillStyle = '#777';
    context.fillRect(0,0,canvasWidth,canvasHeight); 
}

function renderParticle (particle) {
    context.beginPath();
    context.arc(particle.x,particle.y,particle.r,0,2*Math.PI,false);
    context.fillStyle = particle.color;
    context.fill();
}

function moveParticle (particle) {
    particle.x += particle.vx;
    particle.y += particle.vy;
}

function reflection (particle) {
    if (particle.x < 0 || particle.x > canvasWidth) {
        particle.vx = particle.vx * (-1);
    }
    if (particle.y < 0 || particle.y > canvasHeight) {
        particle.vy = particle.vy * (-1);
    }
}

