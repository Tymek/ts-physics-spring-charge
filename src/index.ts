import './style.css'
import { play, add } from './gameloop'
import gui from './gui'
import { circleAnimation } from './circleAnimation'

export const settings = {
  size: 6,
  gravity: 0,
  mass: 20,
  stiffness: 100,
  dumping: 100,
  charge: 500,
  chargeLimit: 250,
  time: 100,
  showForces: false,
}

gui.add(settings, 'size').min(1).max(10).step(0.1)
gui.add(settings, 'gravity').min(0).max(150).step(0.1)
gui.add(settings, 'mass').min(0.1).max(25).step(0.1)
gui.add(settings, 'stiffness').min(0.1).max(250).step(0.1)
gui.add(settings, 'time').min(10).max(100).step(1)
gui.add(settings, 'dumping').min(0).max(250).step(0.1)
gui.add(settings, 'charge').min(0).max(1000).step(10)
gui.add(settings, 'chargeLimit').min(1).max(1000).step(1)
gui.add(settings, 'showForces')

const ctx = (function canvasSetup() {
  const canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  const { width, height } = canvas.getBoundingClientRect()
  ctx.canvas.width = width
  ctx.canvas.height = height

  circleAnimation('c1', [width * 0.7, height / 4], ctx)
  circleAnimation('c2', [width / 2, height * 0.4], ctx)
  circleAnimation('c3', [width / 5, height / 2], ctx)
  circleAnimation('c4', [width / 4, height / 3], ctx)
  circleAnimation('c5', [width / 6, height / 5], ctx)
  circleAnimation('c6', [width * 0.4, height * 0.6], ctx)

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
