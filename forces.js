import { Graphics } from "./lib/pixi.mjs"
import { particles } from "./particles.js"
export const universalPushForceRange = 30
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

export function applyForceAllToOne(particle) {
    particles.forEach(applyForce)
  
    function applyForce(otherParticle) {
      if (otherParticle === particle) return
  
      const distX = particle.x - otherParticle.x
      const distY = particle.y - otherParticle.y
      const dist = Math.sqrt(distX * distX + distY * distY)
  
      if (dist < universalPushForceRange) {
        console.log('test')
        //universalPush(particle, otherParticle, 0.6)
        //lightCircleLines(particle)
      } else {
       // pull(red, red, redredPullForce, otherParticle)
       // pull(red, green, 1, otherParticle)
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
  