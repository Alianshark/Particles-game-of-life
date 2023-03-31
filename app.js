'use strict';

const canvasWidth = 1000;
const canvasHeight = 700;
const maxParticles = 500;
const colors = ['red', 'green', 'blue'];
const forceConstant = 1000;
const colorForceRange = 100;
const universalPushForceRange = 20;
const radius = canvasHeight / 4;

const fpsDiv = document.querySelector('#fps');

let framesPerSecond = 0;

let particles = [];

let context = createContext();
generateParticles('red');
//generateParticles('green');
//generateParticles('blue')
requestAnimationFrame(gameLoop);
setInterval(measureFps, 1000);

function createContext() {
    let canvas = document.querySelector('canvas');
    let context = canvas.getContext('2d');
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    return context;
}

function generateParticles(color) {
    let numP = 0;
    while (numP < maxParticles) {
        let particle = {
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight,
            r: 4,
            vx: 0,
            vy: 0,
            color: color,
        };

        particles.push(particle);

        numP += 1;
    }
}

function gameLoop() {
    framesPerSecond += 1;
    requestAnimationFrame(gameLoop);
    
    clearScreen();
    particles.forEach(renderParticle);
    particles.forEach(moveParticle);
    particles.forEach(applyForceAllToOne);
    particles.forEach(reflection);
}

function measureFps() {
    fpsDiv.innerHTML = 'fps: ' + framesPerSecond;
    framesPerSecond = 0;
}

function clearScreen () {
    context.fillStyle = '#777';
    context.fillRect(0,0,canvasWidth,canvasHeight); 
}

function renderParticle (particle) {
    context.beginPath();
    context.arc(particle.x, particle.y, particle.r, 0, 2 * Math.PI, false);
    context.fillStyle = particle.color;
    context.fill();
 
    //drawUniversalForce(particle);
    //drawColorForce(particle);
}

function drawUniversalForce(particle) {
    context.beginPath();
    context.setLineDash([]);
    context.arc(particle.x, particle.y, universalPushForceRange/2, 0, 2 * Math.PI , false);
    context.strokeStyle = particle.color;
    context.stroke();
}

function drawColorForce(particle) {
    context.beginPath();
    context.setLineDash([5, 15]);
    context.arc(particle.x, particle.y, colorForceRange/2, 0, 2 * Math.PI , false);
    context.strokeStyle = particle.color;
    context.stroke();
    
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

function applyForceAllToOne (particle) {
    particles.forEach(applyForce);

    function applyForce (otherParticle) {
        if (otherParticle === particle) return;
        
        const distX = particle.x - otherParticle.x;
        const distY = particle.y - otherParticle.y;
        const dist = Math.sqrt(distX * distX + distY * distY);

        if (dist < universalPushForceRange) {
            //universalPush(particle, otherParticle);
            push('red', 'red', 0.05/2, otherParticle);
        } else if (dist < colorForceRange) {
            pull('red', 'red', 0.05, otherParticle);
           // pull('red', 'blue', 0.05, otherParticle);
        }
/*
        if (dist < colorForceRange) {
            pull('green', 'green', 0.32, otherParticle);
            pull('green', 'red', 0.17, otherParticle);
            push('green', 'blue', 0.34, otherParticle);
            pull('red', 'green', 0.34, otherParticle);
        }
 */       
    }

    function universalPush(particle, otherParticle) {
        const distX = particle.x - otherParticle.x;
        const distY = particle.y - otherParticle.y;
        const dist = Math.sqrt(distX * distX + distY * distY);

        const xDirection = distX / dist;
        const yDirection = distY / dist;
        const force = forceConstant / dist * 0.2;
        const forceX = xDirection * force;
        const forceY = yDirection * force;
        const frictionConstant = 0.2;
        particle.vx = (particle.vx + forceX) * frictionConstant;
        particle.vy = (particle.vy + forceY) * frictionConstant;
   
    }

    function push(color1, color2, sila, otherParticle) {
        if (otherParticle.color === color1 && particle.color === color2) {
            applyColorForce(particle, otherParticle, +sila);
        }
    }

    function pull(color1, color2, sila, otherParticle) {
        if (otherParticle.color === color1 && particle.color === color2) {
            applyColorForce(particle, otherParticle, -sila);
        }
    }

    function applyColorForce(particle, otherParticle, sila) {
        const distX = particle.x - otherParticle.x;
        const distY = particle.y - otherParticle.y;
        const dist = Math.sqrt(distX * distX + distY * distY);

        if (dist > colorForceRange) return;

        const xDirection = distX / dist;
        const yDirection = distY / dist;
        const force = forceConstant / dist * sila;
        const forceX = xDirection * force;
        const forceY = yDirection * force;

        const frictionConstant = 0.9;
        particle.vx = (particle.vx + forceX) * frictionConstant;
        particle.vy = (particle.vy + forceY) * frictionConstant;
    }
}

