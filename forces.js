import { Graphics } from './lib/pixi.mjs'
import { particles, createLine } from './particles.js'
import { canvasWidth, canvasHeight, app } from './manager.js'
export const universalPushForceRange = 50
export const forceConstant = 10
const colorForceRange = 100
export const red = 0xcb4335
export const green = 0x6bff33
export const blue = 0x2fafe6
export let redredPullForce = 0.2

export function createUniversalForceCircle(particle) {
  const forceCircle = new Graphics()
  forceCircle.lineStyle(2, 'white')
  forceCircle.drawCircle(particle.x, particle.y, universalPushForceRange / 2)
  forceCircle.endFill()
  return forceCircle
}

function getDistToScreenEdges(particle) {
  const screenEdgesDist = {
    top: particle.y - 0,
    bottom: canvasHeight - particle.y,
    left: particle.x - 0,
    right: canvasWidth - particle.x,
  }
  return screenEdgesDist
}

function applyForce(particle, otherParticle, sila, range) {
  applyForceNaEkrane()
  applyForceCherezEkran()

  console.log('position.x:', particle.x)
  console.log('position.y:', particle.y)
  app.stage.removeChild(particle.pixiLine)
  particle.pixiLine.destroy()
  const newLine = createLine(particle)
  particle.pixiLine = newLine
  app.stage.addChild(newLine)

  particle.pixiLine.x = particle.x
  particle.pixiLine.y = particle.y
  particle.pixiLine.moveTo(0, 0)
  particle.pixiLine.lineTo(
    otherParticle.x - particle.x,
    otherParticle.y - particle.y
  )

  console.log('otherPosition.x:', otherParticle.x)
  console.log('otherPosition.y:', otherParticle.y)

  function applyForceNaEkrane() {
    const distX = particle.x - otherParticle.x
    const distY = particle.y - otherParticle.y
    const dist = Math.sqrt(distX * distX + distY * distY)

    if (dist > range) return

    const xDirection = distX / dist
    const yDirection = distY / dist
    const force = (forceConstant / dist) * sila
    const forceX = xDirection * force
    const forceY = yDirection * force

    const frictionConstant = 0.99
    particle.vx = (particle.vx + forceX) * frictionConstant
    particle.vy = (particle.vy + forceY) * frictionConstant
  }

  function applyForceCherezEkran() {
    const particleDist = getDistToScreenEdges(particle)
    const otherParticleDist = getDistToScreenEdges(particle)
    if (particle.x > otherParticle.x) {
      const virtualParticleE = {
        x: canvasWidth - particle.x,
        y: canvasHeight - particle.y,
      }
      const distX = virtualParticleE.x - otherParticle.x
      const distY = virtualParticleE.y - otherParticle.y
      const dist = Math.sqrt(distX * distX + distY * distY)
      //console.log('test distX:', distX)
      //console.log('test distY:', distY)
      if (dist > range) return

      const xDirection = distX / dist
      const yDirection = distY / dist
      const force = (forceConstant / dist) * sila
      const forceX = xDirection * force
      const forceY = yDirection * force

      const frictionConstant = 0.99
      particle.vx = (particle.vx + forceX) * frictionConstant
      particle.vy = (particle.vy + forceY) * frictionConstant
    }
  }
}

export function applyForceAllToOne(particle) {
  particles.forEach(applyAllForceTypes)

  function applyAllForceTypes(otherParticle) {
    if (otherParticle === particle) return

    universalPush(particle, otherParticle, 1.6)
    //lightCircleLines(particle)
    //pull(red, red, redredPullForce, otherParticle)
    //pull(red, green, 1, otherParticle)
    //push(blue, blue, 0.5, otherParticle)
    //push(blue, red, 0.5, otherParticle)
    //push(blue, green, 0.5, otherParticle)
    //pull(red, blue, 2.1, otherParticle)
    //noLightCircleLines(particle)
  }

  function universalPush(particle, otherParticle, sila) {
    applyForce(particle, otherParticle, sila / 2, universalPushForceRange)
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
    applyForce(particle, otherParticle, sila, colorForceRange)
  }
}
