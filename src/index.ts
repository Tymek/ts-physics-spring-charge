import './style.css'
import { play, add } from './gameloop'
import gui from './gui'
import { circleAnimation } from './circleAnimation'

export const settings = {
  gravity: 75,
  mass: 3,
  stiffness: 2,
  dumping: 2,
  charge: 500,
  chargeLimit: 5,
  time: 100,
  showForces: true,
}

gui.add(settings, 'gravity').min(0).max(150).step(0.1)
gui.add(settings, 'mass').min(0.1).max(25).step(0.1)
gui.add(settings, 'stiffness').min(0.1).max(25).step(0.1)
gui.add(settings, 'time').min(10).max(100).step(1)
gui.add(settings, 'dumping').min(0).max(25).step(0.1)
gui.add(settings, 'charge').min(0).max(1000).step(10)
gui.add(settings, 'chargeLimit').min(1).max(25).step(1)
gui.add(settings, 'showForces')

const ctx = (function canvasSetup() {
  const canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  const { width, height } = canvas.getBoundingClientRect()
  ctx.canvas.width = width
  ctx.canvas.height = height

  return ctx
})()

;(function addFPS() {
  const fpsDisplay = document.createElement('div')
  fpsDisplay.setAttribute('id', 'fps')
  document.body.appendChild(fpsDisplay)

  add('fps', {
    onEnd: (fps) => {
      fpsDisplay.textContent = `${fps.toFixed(1).toString()}fps`
    },
  })
})()

add('clear', {
  onBeforeDraw: () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  },
})

play()

circleAnimation(ctx)
