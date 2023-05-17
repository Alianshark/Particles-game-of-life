'use strict'

import * as PIXI from './lib/pixi.mjs'
import { Container } from './lib/pixi.mjs'

const canvasWidth = 1000
const canvasHeight = 700
const maxParticles = 300
const colors = ['red', 'green', 'blue']
const forceConstant = 10
const colorForceRange = 100
const universalPushForceRange = 30
const fpsDiv = document.querySelector('#fps')
let framesPerSecond = 0
let particles = []

let app = new PIXI.Application({ width: canvasWidth, height: canvasHeight })
document.body.appendChild(app.view)
app.ticker.add(gameLoop)

function createCircle(particle) {
  const circle = new PIXI.Graphics()
  circle.beginFill(particle.color)
  circle.drawCircle(particle.x, particle.y, particle.r)
  circle.endFill()
  return circle
}

generateParticles('red')
generateParticles('green')
//generateParticles('blue')
requestAnimationFrame(gameLoop)
setInterval(measureFps, 1000)

function generateParticles(color) {
  let numP = 0
  while (numP < maxParticles) {
    let particle = {
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      r: 4,
      vx: 0,
      vy: 0,
      color: color,
    }
    const container = new Container()
    app.stage.addChild(container)
    particle.container = container

    const partikleCircle = createCircle(particle)
    particle.pixiCircle = partikleCircle
    container.addChild(partikleCircle)

    const forceCircle = createUniversalForceCircle(particle)
    particle.pixiCircle.forceCircle = forceCircle
    //container.addChild(forceCircle)
    /*
      const pixiCircleColorForce = drawColorForce(particle)
      particle.pixiCircle.pixiCircleColorForce = pixiCircleColorForce
      container.addChild(pixiCircleColorForce)
    */
    particles.push(particle)

    numP += 1
  }
}

function noLightCircleLines(particle) {
  particle.pixiCircle.forceCircle.tint = 'white'
}

function lightCircleLines(particle) {
  particle.pixiCircle.forceCircle.tint = 'blue'
}

function gameLoop() {
  framesPerSecond += 1

  particles.forEach(renderPixiParticle)
  particles.forEach(moveParticle)

  particles.forEach(applyForceAllToOne)
  particles.forEach(reflection)
}

function renderPixiParticle(particle) {
  particle.container.x = particle.x
  particle.container.y = particle.y
}

function measureFps() {
  fpsDiv.innerHTML = 'fps: ' + framesPerSecond
  framesPerSecond = 0
}

function createUniversalForceCircle(particle) {
  const forceCircle = new PIXI.Graphics()
  forceCircle.lineStyle(2, 'white')
  forceCircle.drawCircle(particle.x, particle.y, universalPushForceRange / 2)
  forceCircle.endFill()
  return forceCircle
}

function drawColorForce(particle) {
  const forceCircle = new PIXI.Graphics()
  forceCircle.lineStyle(0.5, particle.color)
  forceCircle.drawCircle(particle.x, particle.y, colorForceRange / 2)
  forceCircle.endFill()
  return forceCircle
}

function moveParticle(particle) {
  particle.x += particle.vx
  particle.y += particle.vy
}

function reflection(particle) {
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

function applyForceAllToOne(particle) {
  particles.forEach(applyForce)

  function applyForce(otherParticle) {
    if (otherParticle === particle) return

    const distX = particle.x - otherParticle.x
    const distY = particle.y - otherParticle.y
    const dist = Math.sqrt(distX * distX + distY * distY)

    if (dist < universalPushForceRange) {
      universalPush(particle, otherParticle, 0.6)
      //lightCircleLines(particle)
    } else {
      pull('red', 'red', 0.1, otherParticle)
      pull('red', 'green', 1, otherParticle)
      //noLightCircleLines(particle)
    }
  }

  function universalPush(particle, otherParticle, sila) {
    const distX = particle.x - otherParticle.x
    const distY = particle.y - otherParticle.y
    const dist = Math.sqrt(distX * distX + distY * distY)

    const xDirection = distX / dist
    const yDirection = distY / dist
    const force = ((forceConstant / dist) * sila) / 2
    const forceX = xDirection * force
    const forceY = yDirection * force
    const frictionConstant = 0.9
    particle.vx = (particle.vx + forceX) * frictionConstant
    particle.vy = (particle.vy + forceY) * frictionConstant
  }

  function push(color1, color2, sila, otherParticle) {
    if (otherParticle.color === color1 && particle.color === color2) {
      applyColorForce(particle, otherParticle, +sila)
    }
  }

  function pull(color1, color2, sila, otherParticle) {
    if (otherParticle.color === color1 && particle.color === color2) {
      applyColorForce(particle, otherParticle, -sila)
    }
  }

  function applyColorForce(particle, otherParticle, sila) {
    const distX = particle.x - otherParticle.x
    const distY = particle.y - otherParticle.y
    const dist = Math.sqrt(distX * distX + distY * distY)

    if (dist > colorForceRange) return

    const xDirection = distX / dist
    const yDirection = distY / dist
    const force = (forceConstant / dist) * sila
    const forceX = xDirection * force
    const forceY = yDirection * force

    const frictionConstant = 0.9
    particle.vx = (particle.vx + forceX) * frictionConstant
    particle.vy = (particle.vy + forceY) * frictionConstant
  }
}
