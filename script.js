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
} = {}) => {
  root.style.setProperty("--pointer-x", xPercent.toFixed(2));
  root.style.setProperty("--pointer-y", yPercent.toFixed(2));
  root.style.setProperty("--pointer-strength", strength.toFixed(3));
  root.style.setProperty("--tree-tilt-x", `${tiltX.toFixed(2)}deg`);
  root.style.setProperty("--tree-tilt-y", `${tiltY.toFixed(2)}deg`);
  root.style.setProperty("--cloud-shift", `${cloudShift.toFixed(2)}px`);
};

const defaultProps = {
  xPercent: 50,
  yPercent: 50,
  strength: 0.35,
  tiltX: 0,
  tiltY: 0,
  cloudShift: 0,
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
  const maxRadius = Math.max(treeRect.width, treeRect.height) * 0.7;
  const strength = clamp(1 - distance / maxRadius, 0.1, 1);

  const tiltX = (relativeX - 0.5) * 10;
  const tiltY = (0.5 - relativeY) * 8;
  const cloudShift = (relativeX - 0.5) * 60;

  setProperties({
    xPercent: relativeX * 100,
    yPercent: relativeY * 100,
    strength,
    tiltX,
    tiltY,
    cloudShift,
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
  });

  scene.addEventListener("touchend", () => {
    resetScene();
  });
}

resetScene();
