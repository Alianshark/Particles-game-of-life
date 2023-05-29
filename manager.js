import { Application } from "./lib/pixi.mjs"
export const canvasWidth = 1280
export const canvasHeight = 720

export let app = new Application({ width: canvasWidth, height: canvasHeight })

const pixiAppContainer = document.querySelector('#pixi-app-container');
pixiAppContainer.append(app.view)
