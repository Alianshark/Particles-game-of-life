'use strict';

const canvasWidth = 1000;
const canvasHeight = 700;
const maxParticles = 100;
let particles = [];

let particle = {
    x: 10,
    y: 10,
    r: 10,
    vx: 10,
    vy: 10,
};

let numP = 0;
while (numP < maxParticles) {
    const promezhytok = canvasWidth / maxParticles;

    let particle = {
        x: promezhytok * numP,
        y: 10,
        r: 10,
        vx: 10,
        vy: 10,
    };

    particles.push(particle);

    numP += 1;
}

console.log('Generated particles: ', particles);


let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');

canvas.width = canvasWidth;
canvas.height = canvasHeight;

gameLoop();

function gameLoop() {
    setTimeout(gameLoop, 1000/60);
    
    clearScreen();
    renderParticle();
    moveParticle();
    reflection();    
}

function clearScreen () {
    context.fillStyle = '#777';
    context.fillRect(0,0,canvasWidth,canvasHeight); 
}

function renderParticle () {
    context.beginPath();
    context.arc(particle.x,particle.y,particle.r,0,2*Math.PI,false);
    context.fillStyle = 'blue';
    context.fill();
}

function moveParticle () {
    particle.x += particle.vx;
    particle.y += particle.vy;
}

function reflection () {
    if (particle.x < 0 || particle.x > canvasWidth) {
        particle.vx = particle.vx * (-1);
    }
    if (particle.y < 0 || particle.y > canvasHeight) {
        particle.vy = particle.vy * (-1);
    }
}

