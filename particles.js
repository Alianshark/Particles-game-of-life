import { Graphics, Container } from './lib/pixi.mjs'
import { canvasHeight, canvasWidth, app } from './manager.js'
import { createUniversalForceCircle } from './forces.js'
export let particles = []
export const maxParticles = 2

const circleTemplate = new Graphics()
//circleTemplate.lineStyle(1, 0x0000ff)
circleTemplate.beginFill('white')
circleTemplate.drawCircle(0, 0, 2)
circleTemplate.endFill()

function newLine(particle) {
  const grafics = new Graphics()

  grafics.lineStyle(5, 'yellow', 1)
  grafics.position.x = particle.x
  grafics.position.y = particle.y
  //grafics.moveTo(0, 0)
  grafics.lineTo(particle.r, 0)
  return grafics
}
function createCircle(particle) {
  let circle = new Graphics(circleTemplate.geometry)
  circle.x = particle.x
  circle.y = particle.y
  circle.scale.set(particle.r, particle.r)
  circle.tint = particle.color

  return circle
}

export function createParticle(color, numP) {
  let particle = {
    x: numP * 350, //canvasWidth,
    y: canvasHeight / 2, //canvasHeight,
    r: 100,
    vx: 0,
    vy: 0,
    color: color,
  }

  const partikleCircle = createCircle(particle)
  particle.pixiCircle = partikleCircle
  app.stage.addChild(partikleCircle)

  const partikleLine = newLine(particle)
  particle.pixiLine = partikleLine
  app.stage.addChild(partikleLine)
  console.log('line:', partikleLine)

  return particle
}

export function generateParticles(color, numParticles) {
  let numP = 0

  while (numP < numParticles) {
    const newParticle = createParticle(color, numP)

    particles.push(newParticle)

    numP += 1
  }
}
