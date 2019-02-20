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

const redColor = "#CF0000"
const greenColor = "#00CF00"
const blackColor = "000000"

function Feu(id, vert, rouge){
  this.id = id
  this.red = rouge * SECOND
  this.green = vert * SECOND
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
};

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

Feu.prototype.log = function(){
  const state = this.state()
  const subPos = this.subcyclePosition()
  console.log(`${(state === GREEN) ? "VERT" : "ROUGE"} | ${this.cyclePosition()} | ${subPos}`)
}





























function clear(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawCircle(x, y, radius){
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI)
  ctx.fill()
}

function japanAnimation(feu){
  const radius = feu.subcyclePosition()
  ctx.fillStyle = (feu.state() === GREEN) ? greenColor : redColor
  drawCircle(400, 300, (1-radius) * 200)
}

function drawArc(x, y, start, end){
  ctx.beginPath()
  ctx.arc(x, y, 150, start, end)
  ctx.stroke()
}

function drawGreenPart(feu){
  const start = CORRECTION
  const end = feu.greenRatio() * 2 * Math.PI + CORRECTION
  ctx.strokeStyle = greenColor
  drawArc(400, 300, start, end)
}

function drawLeftPart(feu){
  const start = feu.greenRatio() * 2 * Math.PI + CORRECTION
  const end = 2 * Math.PI + CORRECTION
  ctx.strokeStyle = redColor
  drawArc(400, 300, start, end)
}

function displayText(feu){
  ctx.font = "bold 100px Oswald";
  ctx.fillStyle = (feu.state() === GREEN) ? greenColor : redColor
  let remaining = 1 - feu.subcyclePosition()
  remaining *= (feu.state() === GREEN) ? feu.green/1000 : feu.red/1000
  const text = `${Math.ceil(remaining)}s`
  const textWidth = ctx.measureText(text).width
  ctx.fillText(text, (canvas.width-textWidth)/2, 335);
}

function displayId(feu){
  ctx.font = "bold 50px Oswald";
  ctx.fillStyle = "#444444"
  const text = `#${feu.id}`
  ctx.fillText(text, 0, canvas.height - 100);
}

function drawCursor(feu){
  ctx.save()
  ctx.translate(canvas.width/2, canvas.height/2)
  ctx.rotate(feu.cyclePosition() * 2 * Math.PI + CORRECTION)
  ctx.fillStyle = "#FFFFFF"
  drawCircle(250, 0, 12)
  ctx.restore()
}

function leanAnimation(feu){
  ctx.lineWidth = 75;
  drawGreenPart(feu)
  drawLeftPart(feu)
  drawCursor(feu)
  displayText(feu)
  displayId(feu)
}

function draw(feu){
  clear()
  leanAnimation(feu)
}

function getSetRed(){
  const r = prompt("Durée du rouge (+ orange)")
  if (r) feux[current].setRed(r)
}

function getSetGreen(){
  const g = prompt("Durée du vert")
  if (g) feux[current].setGreen(g)
}

var start = null;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d")
ctx.font = "bold 100px Oswald";

function step(timestamp) {
  if (!start) start = timestamp;
  var progress = timestamp - start;
  draw(feux[current])
  window.requestAnimationFrame(step);
}


const feux = []
for (let i = 0; i < 5; i++) feux.push(new Feu(i+1, 0, 0))

function next(){
  if (current < NOMBRE_FEUX - 1) current++
}

function previous(){
  if (current > 0) current--
}

let current = 0

const rBtn = document.getElementById("red-btn")
const gBtn = document.getElementById("green-btn")
const nextBtn = document.getElementById("next")
const prevBtn = document.getElementById("previous")
const toggleBtn = document.getElementById("toggle")

nextBtn.addEventListener("click", e =>{
  next()
})

prevBtn.addEventListener("click", e =>{
  previous()
})


rBtn.addEventListener("click", e =>{
  getSetRed()
})

gBtn.addEventListener("click", e =>{
  getSetGreen()
})

toggle.addEventListener("click", e =>{
  toggleIHM()
})

window.addEventListener("click", e =>{
  feux[current].start()
})

document.body.addEventListener("keydown", e => {
  const code = e.keyCode
  console.log(code);
  if(code === SPACE) feux[current].start()
  if(code === RIGHT) next()
  if(code === LEFT) previous()
  if(code === R) getSetRed()
  if(code === G || code === V) getSetGreen()
  if(code === H) toggleIHM()
})

const buttons = document.getElementById("buttons")
let IHMdisplayed = true

function hideIHM(){
  prevBtn.style.visibility = "hidden"
  nextBtn.style.visibility = "hidden"
  buttons.style.visibility = "hidden"
}

function showIHM(){
  prevBtn.style.visibility = "visible"
  nextBtn.style.visibility = "visible"
  buttons.style.visibility = "visible"
}

function toggleIHM(){
  if (IHMdisplayed) hideIHM()
  else showIHM()
  IHMdisplayed = !IHMdisplayed
}

function main(){
  window.requestAnimationFrame(step);
}

main()
