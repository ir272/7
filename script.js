const root = document.documentElement;
const scene = document.querySelector(".grove");
const tree = document.querySelector(".grove__tree");

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const setProperties = ({
  xPercent = 50,
  yPercent = 50,
  strength = 0.35,
  tiltX = 0,
  tiltY = 0,
  cloudShift = 0,
  treeShiftX = 0,
  treeShiftY = 0,
  glow = 0.45,
} = {}) => {
  root.style.setProperty("--pointer-x", xPercent.toFixed(2));
  root.style.setProperty("--pointer-y", yPercent.toFixed(2));
  root.style.setProperty("--pointer-strength", strength.toFixed(3));
  root.style.setProperty("--tree-tilt-x", `${tiltX.toFixed(2)}deg`);
  root.style.setProperty("--tree-tilt-y", `${tiltY.toFixed(2)}deg`);
  root.style.setProperty("--cloud-shift", `${cloudShift.toFixed(2)}px`);
  root.style.setProperty("--tree-shift-x", `${treeShiftX.toFixed(2)}px`);
  root.style.setProperty("--tree-shift-y", `${treeShiftY.toFixed(2)}px`);
  root.style.setProperty("--tree-glow", glow.toFixed(3));
};

const defaultProps = {
  xPercent: 50,
  yPercent: 50,
  strength: 0.35,
  tiltX: 0,
  tiltY: 0,
  cloudShift: 0,
  treeShiftX: 0,
  treeShiftY: 0,
  glow: 0.45,
};

const updateFromPoint = (clientX, clientY) => {
  if (!scene || !tree) return;

  const sceneRect = scene.getBoundingClientRect();
  const treeRect = tree.getBoundingClientRect();

  const relativeX = clamp((clientX - sceneRect.left) / sceneRect.width, 0, 1);
  const relativeY = clamp((clientY - sceneRect.top) / sceneRect.height, 0, 1);

  const treeCenterX = treeRect.left + treeRect.width / 2;
  const treeCenterY = treeRect.top + treeRect.height / 2;
  const distanceX = clientX - treeCenterX;
  const distanceY = clientY - treeCenterY;
  const distance = Math.hypot(distanceX, distanceY);
  const maxRadius = Math.max(sceneRect.width, sceneRect.height) * 0.9;
  const strength = clamp(1 - distance / maxRadius, 0.15, 1);

  const tiltX = (relativeX - 0.5) * 14;
  const tiltY = (0.6 - relativeY) * 10;
  const cloudShift = (relativeX - 0.5) * 60;
  const treeShiftX = (relativeX - 0.5) * 32;
  const treeShiftY = (0.55 - relativeY) * 26;
  const glow = clamp(strength * 1.15, 0.25, 1.1);

  setProperties({
    xPercent: relativeX * 100,
    yPercent: relativeY * 100,
    strength,
    tiltX,
    tiltY,
    cloudShift,
    treeShiftX,
    treeShiftY,
    glow,
  });
};

const resetScene = () => {
  setProperties(defaultProps);
};

if (scene) {
  scene.addEventListener("pointermove", (event) => {
    updateFromPoint(event.clientX, event.clientY);
  });

  scene.addEventListener("pointerdown", (event) => {
    updateFromPoint(event.clientX, event.clientY);
  });

  scene.addEventListener("pointerleave", () => {
    resetScene();
  });

  scene.addEventListener("touchmove", (event) => {
    if (event.touches.length === 0) return;
    const touch = event.touches[0];
    updateFromPoint(touch.clientX, touch.clientY);
  }, { passive: true });

  scene.addEventListener("touchend", () => {
    resetScene();
  });
}

resetScene();
