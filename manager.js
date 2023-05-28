import { Application } from "./lib/pixi.mjs"
export const canvasWidth = 1280
export const canvasHeight = 720

export let app = new Application({ width: canvasWidth, height: canvasHeight })
document.body.prepend(app.view)
