const SECOND = 1000
const CORRECTION = -0.5*Math.PI

const GREEN = 1
const RED = 0

const SPACE = 32
const LEFT = 37
const RIGHT = 39
const R = 82
const G = 71
const V = 86
const H = 72

const NOMBRE_FEUX = 5

const SETUP = 0
const DEMO = 1
const NOTHING = 2

let mode = NOTHING

const redColor = "#CF0000"
const greenColor = "#00CF00"
const blackColor = "000000"

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext("2d")
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;
ctx.font = "bold 100px Oswald"

const feux = []
for (let i = 0; i < 5; i++) feux.push(new Feu(i+1))
let current = 0

const prevBtn = document.getElementById("previous")
const nextBtn = document.getElementById("next")
const rBtn = document.getElementById("red-btn")
const startBtn = document.getElementById("start-btn")
const gBtn = document.getElementById("green-btn")
const toggleBtn = document.getElementById("toggle")
const buttons = document.getElementById("buttons")





















function Feu(id){
  this.id = id
  this.red = null
  this.green = null
  this.startGreen = null
}

Feu.prototype.setGreen = function(length){
  this.green = length * SECOND
}

Feu.prototype.setRed = function(length){
  this.red = length * SECOND
}

Feu.prototype.cycle = function(){
  return this.red + this.green
}

Feu.prototype.start = function () {
  this.startGreen = Date.now()
}

Feu.prototype.elapsed = function(){ return Date.now() - this.startGreen}

Feu.prototype.greenRatio = function(){
  return this.green / this.cycle()
}

Feu.prototype.redRatio = function(){
  return this.red / this.cycle()
}

Feu.prototype.cyclePosition = function(){
  const elapsed = this.elapsed()
  const cycles = elapsed / this.cycle()
  return cycles - Math.floor(cycles)
}

Feu.prototype.subcyclePosition = function(){
  const state = this.state()
  const cyclePosition = this.cyclePosition()
  const greenSub = cyclePosition / this.greenRatio()
  const redSub = (cyclePosition - this.greenRatio()) / this.redRatio()
  return (state === GREEN) ? greenSub : redSub
}

Feu.prototype.state = function(){
  const cyclePosition = this.cyclePosition()
  return (cyclePosition < this.greenRatio()) ? GREEN : RED
}



























const percent = () => Math.min(canvas.width, canvas.height) / 100

function clear(){
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function drawCircle(x, y, radius){
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI)
  ctx.fill()
}

function japanAnimation(feu){
  const radius = feu.subcyclePosition()
  ctx.fillStyle = (feu.state() === GREEN) ? greenColor : redColor
  drawCircle(canvas.width/2, canvas.height/2, (1-radius) * 50 * percent())
}

function drawArc(x, y, start, end){
  ctx.beginPath()
  ctx.arc(x, y, 30 * percent(), start, end)
  ctx.stroke()
}

function drawGreenPart(feu){
  const start = CORRECTION
  const end = feu.greenRatio() * 2 * Math.PI + CORRECTION
  ctx.strokeStyle = greenColor
  drawArc(canvas.width/2, canvas.height/2, start, end)
}

function drawLeftPart(feu){
  const start = feu.greenRatio() * 2 * Math.PI + CORRECTION
  const end = 2 * Math.PI + CORRECTION
  ctx.strokeStyle = redColor
  drawArc(canvas.width/2, canvas.height/2, start, end)
}

function displayText(feu){
  const fontSize = 24 * percent()
  ctx.font = `bold ${fontSize}px Oswald`
  ctx.fillStyle = (feu.state() === GREEN) ? greenColor : redColor
  let remaining = 1 - feu.subcyclePosition()
  remaining *= (feu.state() === GREEN) ? feu.green/1000 : feu.red/1000
  const text = `${Math.ceil(remaining)}s`
  const textDimension = ctx.measureText(text)
  ctx.fillText(text, (canvas.width-textDimension.width)/2, (canvas.height+fontSize*0.75)/2)
}

function displayId(feu){
  ctx.font = `bold ${8*percent()}px Oswald`
  ctx.fillStyle = "#444444"
  const text = `#${feu.id}`
  ctx.fillText(text, canvas.width - 30 * percent(), canvas.height - (20 * percent()))
}

function drawCursor(feu){
  ctx.save()
  ctx.translate(canvas.width/2, canvas.height/2)
  ctx.rotate(feu.cyclePosition() * 2 * Math.PI + CORRECTION)
  ctx.fillStyle = "#FFFFFF"
  drawCircle(30*percent(), 0, 2.3*percent())
  ctx.restore()
}

function leanAnimation(feu){
  ctx.lineWidth = 4 * percent()
  drawGreenPart(feu)
  drawLeftPart(feu)
  drawCursor(feu)
  displayText(feu)
  displayId(feu)
}

function draw(feu){
  clear()
  leanAnimation(feu)
  // japanAnimation(feu)
}

function resizeCanvas () {
  canvas.width = canvas.parentNode.getBoundingClientRect().width
  canvas.height = canvas.parentNode.getBoundingClientRect().height
}

function step(timestamp) {
  if (!start) start = timestamp
  var progress = timestamp - start
  draw(feux[current])
  window.requestAnimationFrame(step)
}






























function getSetRed(){
  const r = prompt("Durée du rouge (+ orange)")
  if (r) feux[current].setRed(r)
}

function getSetGreen(){
  const g = prompt("Durée du vert")
  if (g) feux[current].setGreen(g)
}

const next = () => (current < NOMBRE_FEUX - 1) ? current++ : null
const previous = () => (current > 0) ? current-- : null


const setClick = (btn, action) => btn.addEventListener("mousedown", action)
const setClickUp = (btn, action) => btn.addEventListener("mouseup", action)

const setUpButtons = () => {
  setClick(prevBtn, previous)
  setClick(nextBtn, next)
  setClick(rBtn, getSetRed)
  setClickUp(startBtn, start)
  setClick(gBtn, getSetGreen)
  setClick(toggleBtn, toggleIHM)
}

const start = () => feux[current].start()

document.body.addEventListener("keydown", e => {
  const code = e.keyCode
  if(code === SPACE) feux[current].start()
  if(code === RIGHT) next()
  if(code === LEFT) previous()
  if(code === R) getSetRed()
  if(code === G || code === V) getSetGreen()
  if(code === H) toggleIHM()
})











const viz = (elm, v) => elm.style.visibility = v
const hide = elm => viz(elm, "hidden")
const show = elm => viz(elm, "visible")

function hideIHM(){
  hide(prevBtn)
  hide(nextBtn)
  hide(buttons)
}

function setupIHM(){
  show(buttons)
  hide(prevBtn)
  hide(nextBtn)
}

function demoIHM(){
  show(prevBtn)
  show(nextBtn)
  hide(buttons)
}

function toggleIHM(){
  if (++mode > NOTHING) mode = SETUP
  if (mode === SETUP) setupIHM()
  if (mode === DEMO) demoIHM()
  if (mode === NOTHING) hideIHM()
}




function main(){
  toggleIHM()
  setUpButtons()
  window.addEventListener('resize', resizeCanvas)
  resizeCanvas()
  window.requestAnimationFrame(step)
}

window.onload = main
