import { Graphics } from "./lib/pixi.mjs"
import { particles } from "./particles.js"
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
    bottom: screenHeight - particle.y,
    left: particle.x - 0,
    right: screenWidth - particle.x,
  };
  return screenEdgesDist
}

function applyForce(particle, otherParticle, sila, range) {
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

export function applyForceAllToOne(particle) {
    particles.forEach(applyAllForceTypes)
  
    function applyAllForceTypes(otherParticle) {
      if (otherParticle === particle) return
  
      universalPush(particle, otherParticle, 1.6)
      //lightCircleLines(particle)
      //pull(red, red, redredPullForce, otherParticle)
      pull(red, green, 1, otherParticle)
      //push(blue, blue, 0.5, otherParticle)
      //push(blue, red, 0.5, otherParticle)
      //push(blue, green, 0.5, otherParticle)
      //pull(red, blue, 2.1, otherParticle)
      //noLightCircleLines(particle)
    }
  
    function universalPush(particle, otherParticle, sila) {
      applyForce(particle, otherParticle, sila / 2, universalPushForceRange);
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
      applyForce(particle, otherParticle, sila, colorForceRange);
    }
  }
  
