const root = document.documentElement;
const scene = document.querySelector(".scene");
let raf = null;
let targetX = 0.5;
let targetY = 0.5;

const updateCSSVars = () => {
  root.style.setProperty("--cursor-x", targetX.toFixed(4));
  root.style.setProperty("--cursor-y", targetY.toFixed(4));
  raf = null;
};

const requestUpdate = () => {
  if (raf !== null) return;
  raf = requestAnimationFrame(updateCSSVars);
};

const setFromEvent = (event) => {
  const bounds = scene.getBoundingClientRect();
  const point = event.touches ? event.touches[0] : event;

  const x = (point.clientX - bounds.left) / bounds.width;
  const y = (point.clientY - bounds.top) / bounds.height;

  targetX = Math.min(Math.max(x, 0), 1);
  targetY = Math.min(Math.max(y, 0), 1);
  requestUpdate();
};

scene.addEventListener("pointermove", setFromEvent);
scene.addEventListener("pointerdown", setFromEvent);
scene.addEventListener("touchmove", (event) => {
  setFromEvent(event);
  event.preventDefault();
});

scene.addEventListener("pointerleave", () => {
  targetX = 0.5;
  targetY = 0.5;
  requestUpdate();
});

window.addEventListener("resize", requestUpdate);

requestUpdate();
