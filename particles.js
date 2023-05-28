import { Graphics, Container} from "./lib/pixi.mjs"
import { canvasHeight, canvasWidth, app } from "./manager.js"
import { createUniversalForceCircle} from "./forces.js"
export let particles = []
export const maxParticles = 500


const circleTemplate = new Graphics()
circleTemplate.beginFill('white')
circleTemplate.drawCircle(0, 0, 1)
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
    return particle
    /*
    const pixiCircleColorForce = drawColorForce(particle)
    particle.pixiCircle.pixiCircleColorForce = pixiCircleColorForce
    container.addChild(pixiCircleColorForce)
    */
}

export function generateParticles(color, numParticles) {
    let numP = 0
  
    while (numP < numParticles) {
      const newParticle = createParticle(color)
  
      particles.push(newParticle)
  
      numP += 1
    }
  }