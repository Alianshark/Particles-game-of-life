import { Graphics } from "./lib/pixi.mjs"
export const universalPushForceRange = 30

export function createUniversalForceCircle(particle) {
    const forceCircle = new Graphics()
    forceCircle.lineStyle(2, 'white')
    forceCircle.drawCircle(particle.x, particle.y, universalPushForceRange / 2)
    forceCircle.endFill()
    return forceCircle
  }
  