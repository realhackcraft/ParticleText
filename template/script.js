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

let particles = []

let mouse = {
  x: null,
  y: null,
  radius: 150,
}

window.addEventListener('mousemove', (event) => {
  mouse.x = event.x
  mouse.y = event.y
})

ctx.fillStyle = 'white'
ctx.font = '30px Verdana'
ctx.fillText('A', 0, 40)

// ctx.strokeStyle = 'white'
// ctx.strokeRect(0, 0, 100, 100)

const data = ctx.getImageData(0, 0, 100, 100)

class Particle {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.size = 3
    this.baseX = this.x
    this.baseY = this.y
    this.density = (Math.random() * 30) + 1
  }

  draw() {
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
  }

  update() {
    let dx = mouse.x - this.x
    let dy = mouse.y - this.y

    let distance = Math.hypot(dx, dy)
    if (distance <= 300) {
      this.size = 50
    } else {
      this.size = 3
    }
  }
}

function init() {
  particles = []
  for (let i = 0; i < 200; i++) {
    let x = Math.random() * canvasRect.width
    let y = Math.random() * canvasRect.height
    particles.push(new Particle(x, y))
  }
  animate()
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  particles.forEach(particle => {
    particle.update()
    particle.draw()
  })
  requestAnimationFrame(animate)
}

init()
