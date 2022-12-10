// CUSTOMISE HERE
function draw() {
  ctx.fillStyle = '#6bd8ff'
  ctx.font = '10px Verdana'
  ctx.fillText('Dog', 0, 25)
}

const offset = {
  x: 100,
  y: 0,
}

const connectDots = true
const lineRenderDistance = 50
const particleRepulsionRadius = 250
const particleSize = 3
const maxParticleDensity = 20
const minParticleDensity = 2
const dotSpread = 13

// DO NOT MODIFY

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const dpr = window.devicePixelRatio
const canvasRect = canvas.getBoundingClientRect()

canvas.width = canvasRect.width * dpr
canvas.height = canvasRect.height * dpr

ctx.scale(dpr, dpr)

canvas.style.width = `${canvasRect.width}px`
canvas.style.height = `${canvasRect.height}px`

draw()

let particles = []

let mouse = {
  x: null,
  y: null,
  radius: particleRepulsionRadius,
}

window.addEventListener('mousemove', (event) => {
  mouse.x = event.x
  mouse.y = event.y
})

const textCords = ctx.getImageData(0, 0, 50, 50)

class Particle {
  constructor(x, y, r, g, b) {
    this.x = x
    this.y = y
    this.r = r
    this.g = g
    this.b = b
    this.color = r.toString() + ',' + g.toString() + ',' + b.toString()
    this.size = particleSize
    this.baseX = this.x
    this.baseY = this.y
    this.density = (Math.random() * maxParticleDensity) + minParticleDensity
    this.move = (Math.random() * this.density * this.density / 5 + 3) + 1
  }

  draw() {
    ctx.fillStyle = 'rgb(' + this.color + ')'
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
  }

  update() {
    const dx = mouse.x - this.x
    const dy = mouse.y - this.y

    const distance = Math.hypot(dx, dy)
    const maxDistance = mouse.radius + this.move

    const forceDirectionX = dx / distance
    const forceDirectionY = dy / distance

    const force = (maxDistance - distance) / maxDistance

    const directionX = forceDirectionX * force * this.density
    const directionY = forceDirectionY * force * this.density

    if (distance <= mouse.radius + this.move) {
      this.x -= directionX
      this.y -= directionY
    } else {
      if (this.x !== this.baseX) {
        const dx = this.x - this.baseX
        this.x -= dx / 10
      }
      if (this.y !== this.baseY) {
        const dy = this.y - this.baseY
        this.y -= dy / 10
      }
    }
  }
}

function init() {
  particles = []

  for (let i = 0, y = textCords.height; i < y; i++) {
    for (let j = 0, x = textCords.width; j < x; j++) {
      if (textCords.data[(i * 4 * textCords.width) + (j * 4) + 3] > 128) {
        const r = textCords.data[(i * 4 * textCords.width) + (j * 4)]
        const g = textCords.data[(i * 4 * textCords.width) + (j * 4) + 1]
        const b = textCords.data[(i * 4 * textCords.width) + (j * 4) + 2]
        particles.push(new Particle(j * dotSpread + offset.x, i * dotSpread + offset.y, r, g, b))
      }
    }
  }

  animate()
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  particles.forEach(particle => {
    particle.update()
    particle.draw()
  })
  if (connectDots) connect()
  requestAnimationFrame(animate)
}

function connect() {
  let opacity = 1

  for (let i = 0; i < particles.length; i++) {
    for (let j = i; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y

      const distance = Math.hypot(dx, dy)

      if (distance < lineRenderDistance) {
        opacity = 1 - (distance / lineRenderDistance)
        ctx.strokeStyle = `rgba(${particles[i].r}, ${particles[i].g}, ${particles[i].b}, ${opacity})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.stroke()
        ctx.closePath()

      }
    }
  }
}
