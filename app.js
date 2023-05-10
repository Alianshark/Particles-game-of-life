'use strict';
import * as PIXI from './node_modules/pixi.js/dist/pixi.mjs'
const canvasWidth = 1000;
const canvasHeight = 700;
const maxParticles = 300;
const colors = ['red', 'green', 'blue'];
const forceConstant = 10;
const centerX = canvasWidth/2; 
const centerY = canvasHeight/2; 
const colorForceRange = 100;
const universalPushForceRange = 30;
const radius = canvasHeight / 4;
let app = new PIXI.Application({ width: canvasWidth, height: canvasHeight });
document.body.appendChild(app.view);
function createCircle (x,y) { 
    const circle  = new PIXI.Graphics();
    circle.beginFill(0xffffff);
    circle.drawCircle(x, y, 5);
    circle.endFill();
    app.stage.addChild(circle)
}

app.ticker.add(gameLoop)

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
            vx: 1,
            vy: 0,
            color: color,
        };
        createCircle(particle.x, particle.y);

        particles.push(particle);

        numP += 1;
    }
}



function gameLoop() {
    framesPerSecond += 1;
    
    clearScreen();
    particles.forEach(renderParticle);
    particles.forEach(moveParticle);
   // particles.forEach(applyForceAllToOne);
  //  particles.forEach(reflection);
}

function measureFps() {
    fpsDiv.innerHTML = 'fps: ' + framesPerSecond;
    framesPerSecond = 0;
}

function clearScreen () {
    context.fillStyle = '#000';
    context.fillRect(0,0,canvasWidth,canvasHeight); 
}

function renderParticle (particle) {
    context.beginPath();
    context.arc(particle.x, particle.y, particle.r, 0, 2 * Math.PI, false);
    context.fillStyle = particle.color;
    context.fill();
 
    //drawUniversalForce(particle);
    drawColorForce(particle);
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
    if (particle.x < 0) {
        particle.x = canvasWidth + particle.x
    }
    if (particle.x > canvasWidth) {
        particle.x = 0 
    }
    if (particle.y < 0) {
        particle.y = canvasHeight + particle.y
    }
    if (particle.y > canvasHeight) {
        particle.y = 0 
    }
}

function applyForceAllToOne (particle) {
    particles.forEach(applyForce);

    function applyForce (otherParticle) {
        if (otherParticle === particle) return;
        
        const distX = particle.x - otherParticle.x;
        const distY = particle.y - otherParticle.y;
        const dist = Math.sqrt(distX * distX + distY * distY);

        function universalForce() {

            const distCenterX = particle.x - centerX;
            const distCenterY = particle.y - centerY;
            const distCenter = Math.sqrt(distCenterX * distCenterX + distCenterY * distCenterY);
            const xDirection = distX / distCenter;
            const yDirection = distY / distCenter;

            const universalForceX = -xDirection * 0.0001;
            const universalForceY = -yDirection * 0.0001;

            const frictionConstant = 1;
            particle.vx = (particle.vx + universalForceX) * frictionConstant;
            particle.vy = (particle.vy + universalForceY) * frictionConstant;
        }

        universalForce();

        if (dist < universalPushForceRange) {
            universalPush(particle, otherParticle, 0.6);
        } else if (dist < colorForceRange) {
            pull('red', 'red', 0.1, otherParticle);
            pull('red', 'green', 1, otherParticle);
        }    
    }

    function universalPush(particle, otherParticle, sila) {
        const distX = particle.x - otherParticle.x;
        const distY = particle.y - otherParticle.y;
        const dist = Math.sqrt(distX * distX + distY * distY);

        const xDirection = distX / dist;
        const yDirection = distY / dist;
        const force = forceConstant / dist * sila/2;
        const forceX = xDirection * force;
        const forceY = yDirection * force;
        const frictionConstant = 0.9;
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

