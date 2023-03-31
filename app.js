'use strict';

const canvasWidth = 1000;
const canvasHeight = 700;
const maxParticles = 30;
const colors = ['red', 'green', 'blue'];
const forceConstant = 100;
const colorForceRange = 100;
// How much velocity decreases every frame
const frictionConstant = 0.9;

const fpsDiv = document.querySelector('#fps');

let framesPerSecond = 0;

let particles = [];

let context = createContext();
generateParticles('red');
generateParticles('green');
generateParticles('blue')
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
        // random color index is 0, 1, 2
        const randomColorIndex = Math.round(Math.random() * 3);
        // random color is 'red', 'green', 'blue'
        const randomColor = colors[randomColorIndex];

        let particle = {
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight,
            r: 4,
            vx: 0,
            vy: 0,
            color: color,//randomColor,
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

    context.beginPath();
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

        push('green','green', 0.5, otherParticle);
        push('green', 'blue', 0.5, otherParticle);
        push('green','red', 0.5, otherParticle);
        push('red', 'red', 0.5, otherParticle);
        push('red', 'blue', 0.5, otherParticle);
        push('red', 'green', 0.5, otherParticle);
        push('blue', 'blue', 0.5, otherParticle);
        push('blue', 'red', 0.5, otherParticle);
        push('blue', 'green', 0.5, otherParticle);
        
        //push('blue', 'red', otherParticle);
       // push('blue', 'blue', 0.5, otherParticle);
        //push('blue', 'red', otherParticle);
        //push('green', 'red', otherParticle);
        //push('red', 'red', otherParticle);
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

        particle.vx = (particle.vx + forceX) * frictionConstant;
        particle.vy = (particle.vy + forceY) * frictionConstant;
    }
}

