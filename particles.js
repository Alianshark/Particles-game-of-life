import { Graphics, Container } from "./lib/pixi.mjs"
import { canvasHeight, canvasWidth, app } from "./manager.js"
import { createUniversalForceCircle} from "./forces.js"
export let particles = []
export const maxParticles = 100


const circleTemplate = new Graphics()
circleTemplate.lineStyle(1, 0x0000ff);
circleTemplate.beginFill('white')
circleTemplate.drawCircle(0, 0, 2)
circleTemplate.endFill()


function createCircle(particle) {
    let circle = new Graphics(circleTemplate.geometry)
    circle.x = particle.x
    circle.y = particle.y
    circle.scale.set(particle.r, particle.r)
    circle.tint = particle.color

    return circle
  }


export function createParticle(color) {
    let particle = {
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        r: 10,
        vx: 0,
        vy: 0,
        color: color,
    }
 
    const partikleCircle = createCircle(particle)
    particle.pixiCircle = partikleCircle
    app.stage.addChild(partikleCircle)

    return particle
}

export function generateParticles(color, numParticles) {
    let numP = 0
  
    while (numP < numParticles) {
      const newParticle = createParticle(color)
  
      particles.push(newParticle)
  
      numP += 1
    }
  }
