'use strict'

import * as PIXI from './lib/pixi.mjs'
import { canvasWidth, canvasHeight, app } from './manager.js'
import { particles, generateParticles, maxParticles, } from './particles.js'
import { applyForceAllToOne, red, green, blue, redredPullForce} from './forces.js'

const fpsDiv = document.querySelector('#fps')
let framesPerSecond = 0

app.ticker.add(gameLoop)

generateParticles(red, maxParticles)
console.log('generate PArticles:', particles)
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
 particles.forEach(handleScreenEdgeCollision)
}

function renderPixiParticle(particle) {
  particle.pixiCircle.x = particle.x
  particle.pixiCircle.y = particle.y
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
  // right edge
  if (particle.x > canvasWidth + particle.r) {
    particle.x = 0 - particle.r
  }

  // bottom edge
  if (particle.y > canvasHeight + particle.r) {
    particle.y = 0 - particle.r
  }
  
  // left edge
  if (particle.x < 0 - particle.r) {
    particle.x = canvasWidth + particle.r
  }

  // top edge
  if (particle.y < 0 - particle.r) {
    particle.y = canvasHeight + particle.r
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
  particle.pixiCircle.destroy()
}

//sliderOption()

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
//forceSlider()
