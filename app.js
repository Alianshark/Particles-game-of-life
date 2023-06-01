'use strict'

import * as PIXI from './lib/pixi.mjs'
import { canvasWidth, canvasHeight, app } from './manager.js'
import { particles, generateParticles, maxParticles } from './particles.js'
import {
  applyForceAllToOne,
  red,
  green,
  blue,
  redredPullForce,
} from './forces.js'

const fpsDiv = document.querySelector('#fps')
let framesPerSecond = 0

//app.ticker.add(gameLoop)
app.ticker.minFPS = 0
app.ticker.maxFPS = 1

generateParticles(red, maxParticles)
//generateParticles(green, maxParticles)
//generateParticles(blue, maxParticles)
requestAnimationFrame(gameLoop)
setInterval(measureFps, 1000)

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
  particles.forEach(handleScreenEdgeCollision)
}

function renderPixiParticle(particle) {
  particle.pixiCircle.x = particle.x
  particle.pixiCircle.y = particle.y
  particle.pixiLine.x = particle.x
  particle.pixiLine.y = particle.y
}

function measureFps() {
  fpsDiv.innerHTML = 'fps: ' + framesPerSecond
  framesPerSecond = 0
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

function handleScreenEdgeCollision(particle) {
  const r = Math.ceil(particle.pixiCircle.width)
  // right edge
  if (particle.x > canvasWidth + r) {
    particle.x = 0 - r
  }

  // bottom edge
  if (particle.y > canvasHeight + r) {
    particle.y = 0 - r
  }

  // left edge
  if (particle.x < 0 - r) {
    particle.x = canvasWidth + r
  }

  // top edge
  if (particle.y < 0 - r) {
    particle.y = canvasHeight + r
  }
}

function sliderOption() {
  var slider = document.getElementById('myRange')
  slider.value = maxParticles
  var output = document.getElementById('demo')
  output.innerHTML = slider.value // Display the default slider value
  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function () {
    deleteAllParticles()
    generateParticles(red, this.value)
    generateParticles(green, this.value)
    generateParticles(blue, this.value)
    output.innerHTML = this.value
  }
}

function deleteAllParticles() {
  particles.forEach(deleteParticle)
  particles = []
}

function deleteParticle(particle) {
  app.stage.removeChild(particle.pixiCircle)
  app.stage.removeChild(particle.pixiLine)
  particle.pixiCircle.destroy()
  particle.pixiLine.destroy()
}

//sliderOption()

function forceSlider() {
  var slider = document.getElementById('forceRange')
  slider.value = redredPullForce
  var output = document.getElementById('demo2')
  output.innerHTML = slider.value // Display the default slider value
  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function () {
    output.innerHTML = this.value
    redredPullForce = this.value
  }
}
//forceSlider()
