'use strict'

import * as PIXI from './lib/pixi.mjs'
import { canvasWidth, canvasHeight, app } from './manager.js'
import { particles, generateParticles, maxParticles, } from './particles.js'
import { applyForceAllToOne, red, green, blue, redredPullForce} from './forces.js'


const fpsDiv = document.querySelector('#fps')
let framesPerSecond = 0

app.ticker.add(gameLoop)

generateParticles(red, maxParticles)
generateParticles(green, maxParticles)
generateParticles(blue, maxParticles)
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
  app.stage.removeChild(particle.container)
  particle.container.destroy()
}

sliderOption()


function forceSlider() {
  var slider = document.getElementById('forceRange')
  slider.value = redredPullForce
  var output = document.getElementById('demo2')
  output.innerHTML = slider.value // Display the default slider value
  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function () {
    console.log(slider)
    output.innerHTML = this.value
    redredPullForce = this.value
  }
}
forceSlider()
