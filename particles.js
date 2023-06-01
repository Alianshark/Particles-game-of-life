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

export function createLine(particle) {
  const grafics = new Graphics()

  grafics.lineStyle(2, 'yellow', 1)
  grafics.position.x = particle.x
  grafics.position.y = particle.y
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
    x: numP * 450, //canvasWidth,
    y: numP * 500, //canvasHeight,
    r: 100,
    vx: 0,
    vy: 0,
    color: color,
  }

  const partikleCircle = createCircle(particle)
  particle.pixiCircle = partikleCircle
  app.stage.addChild(partikleCircle)

  const partikleLine = createLine(particle)
  particle.pixiLine = partikleLine
  app.stage.addChild(partikleLine)
  //console.log('line:', partikleLine)
  const virtualParticle = createVirtualParticle(particle)
  console.log('virtualparticle:', virtualParticle)
  console.log('virtualparticleX:', virtualParticle.pixiCircle.x)
  console.log('virtualparticleY:', virtualParticle.pixiCircle.y)
  particle.virtualParticleE = virtualParticle
  app.stage.addChild(virtualParticle.pixiCircle)

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

export function createVirtualParticle(particle) {
  const virtualParticleE = {
    ...particle,
    pixiCircle: createCircle(particle),
    x: canvasWidth - particle.x,
    y: canvasHeight - particle.y,
  }
  return virtualParticleE
}
