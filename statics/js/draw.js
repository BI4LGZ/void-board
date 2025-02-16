const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");
let isDrawing = false;
const touches = [];

canvas.width = window.innerWidth;
canvas.height =
  window.innerHeight - document.getElementById("controls").offsetHeight;

let currentColor = "#000000";

function startDrawing(e) {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
}

function draw(e) {
  if (!isDrawing) return;

  ctx.lineTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
}

function endDrawing() {
  isDrawing = false;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function selectColor(color, buttonId) {
  currentColor = color;
  document
    .querySelectorAll(".color-btn")
    .forEach((btn) => btn.classList.remove("selected"));
  document.getElementById(buttonId).classList.add("selected");
}

function handleTouchStart(e) {
  e.preventDefault();
  const touchesList = e.changedTouches;

  for (let i = 0; i < touchesList.length; i++) {
    const touch = touchesList[i];
    touches.push({
      identifier: touch.identifier,
      x: touch.pageX - canvas.offsetLeft,
      y: touch.pageY - canvas.offsetTop,
    });
  }
}

function handleTouchMove(e) {
  e.preventDefault();
  const touchesList = e.changedTouches;

  for (let i = 0; i < touchesList.length; i++) {
    const touch = touchesList[i];
    const index = touches.findIndex((t) => t.identifier === touch.identifier);

    if (index >= 0) {
      ctx.beginPath();
      ctx.moveTo(touches[index].x, touches[index].y);
      ctx.lineTo(
        touch.pageX - canvas.offsetLeft,
        touch.pageY - canvas.offsetTop
      );
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      touches[index].x = touch.pageX - canvas.offsetLeft;
      touches[index].y = touch.pageY - canvas.offsetTop;
    }
  }
}

function handleTouchEnd(e) {
  e.preventDefault();
  const touchesList = e.changedTouches;

  for (let i = 0; i < touchesList.length; i++) {
    const index = touches.findIndex(
      (t) => t.identifier === touchesList[i].identifier
    );
    if (index >= 0) {
      touches.splice(index, 1);
    }
  }
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", endDrawing);
canvas.addEventListener("mouseout", endDrawing);

canvas.addEventListener("touchstart", handleTouchStart);
canvas.addEventListener("touchmove", handleTouchMove);
canvas.addEventListener("touchend", handleTouchEnd);

document
  .getElementById("black")
  .addEventListener("click", () => selectColor("#000000", "black"));
document
  .getElementById("blue")
  .addEventListener("click", () => selectColor("#0000FF", "blue"));
document
  .getElementById("red")
  .addEventListener("click", () => selectColor("#FF0000", "red"));
document.getElementById("clear").addEventListener("click", clearCanvas);
