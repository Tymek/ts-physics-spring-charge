import { add } from './gameloop'
import { settings } from './index'

export type Vector = [number, number]
const vAdd = (a: Vector, b: Vector): Vector => [a[0] + b[0], a[1] + b[1]]
const vSub = (a: Vector, b: Vector): Vector => [a[0] - b[0], a[1] - b[1]]
const vMul = (a: Vector, x: Vector | number): Vector =>
  typeof x === 'number' ? [a[0] * x, a[1] * x] : [a[0] * x[0], a[1] * x[1]]

export const circleAnimation = (name: string, anchor: Vector, ctx: CanvasRenderingContext2D): void => {
  const { left, top, width, height } = ctx.canvas.getBoundingClientRect()
  let cursorX: number
  let cursorY: number
  ctx.canvas.addEventListener('mousemove', (e: MouseEvent) => {
    cursorX = e.pageX - left
    cursorY = e.pageY - top
  })

  const drawCircle = (x: number, y: number, radius: number) => {
    ctx.beginPath()
    ctx.fillStyle = 'rgb(241, 1, 169)'
    // ctx.lineWidth = 0
    // ctx.strokeStyle = '#333'
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    ctx.fill()
    // ctx.stroke()
    ctx.closePath()
  }

  const drawForce = (origin: Vector, magnitude: Vector, color: string) => {
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.moveTo(origin[0], origin[1])
    ctx.lineTo(origin[0] + magnitude[0], origin[1] + magnitude[1])
    ctx.stroke()
    ctx.closePath()
  }

  let prevPosition: Vector = [50, height / 10]
  let position: Vector = [50, height / 10]
  let velocity: Vector = [0, 0]
  let forces: Array<Vector> = []

  add(name, {
    onUpdate: (delta) => {
      // constants
      const {
        mass,
        charge: chargeMagnitude,
        chargeLimit,
        gravity,
        dumping,
        time,
        stiffness: k,
      } = settings
      const charge = Math.pow(chargeMagnitude, 2)

      // spring
      const displacement = vSub(position, anchor)
      const springForce: Vector = vMul(displacement, -k) // Hooke's Law
      const dumpingForce = vMul(velocity, -dumping)

      // gravity
      const gravitationForce: Vector = [0, mass * gravity]

      // charge
      const distance = vSub([cursorX, cursorY], position)
      let r = Math.sqrt(Math.pow(distance[0], 2) + Math.pow(distance[1], 2))
      if (r < 1) {
        r = 0
      }
      const theta = Math.atan2(distance[0], distance[1]) || 0
      const attraction = charge / (r < chargeLimit ? chargeLimit : Math.pow(r, 1.1)) || 0
      const chargeForce: Vector = [
        attraction * Math.sin(theta),
        attraction * Math.cos(theta),
      ]
      // console.log(repultion)

      forces = [springForce, gravitationForce, dumpingForce, chargeForce]
      const force = forces.reduce(vAdd, [0, 0]) as Vector
      const acceleration = vMul(force, 1 / mass)
      prevPosition = position
      velocity = vAdd(velocity, vMul(acceleration, 1 / time))
      position = vAdd(position, vMul(velocity, delta / time))
    },

    onDraw: (interp) => {
      const { showForces, size } = settings
      const x = prevPosition[0] + (position[0] - prevPosition[0]) * interp
      const y = prevPosition[1] + (position[1] - prevPosition[1]) * interp
      drawCircle(x, y, size)

      if (showForces) {
        forces.map((v, index) => {
          const colors = ['red', 'blue', 'green', 'yellow', 'black']

          drawForce([x, y], vMul(v, 1 / 25), colors[index % colors.length])
        })
      }
    },
  })
}
