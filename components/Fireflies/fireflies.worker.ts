import { Firefly, GroupTarget } from './Firefly';

let canvasBg: OffscreenCanvas | null = null;
let canvasFg: OffscreenCanvas | null = null;
let ctxBg: OffscreenCanvasRenderingContext2D | null = null;
let ctxFg: OffscreenCanvasRenderingContext2D | null = null;

let width = 0;
let height = 0;
let primaryColor = '0,0,0';
let secondaryColor = '0,0,0';

const fireflies: Firefly[] = [];
let groupTargets: GroupTarget[] = Array.from({ length: 5 }, () => ({ x: 0, y: 0, z: 0 }));

let animationFrameId: number;
let randomizeTimeoutId: ReturnType<typeof setTimeout>;

function randomizeTargets() {
  groupTargets = Array.from({ length: 5 }, () => ({
    x: (Math.random() - 0.5) * width,
    y: (Math.random() - 0.5) * height,
    z: Math.random() * 1500 - 100
  }));

  const nextInterval = Math.random() * 10000 + 10000;
  randomizeTimeoutId = setTimeout(randomizeTargets, nextInterval);
}

function render() {
  if (!ctxBg || !ctxFg || !canvasBg || !canvasFg) return;

  ctxBg.clearRect(0, 0, width, height);
  ctxFg.clearRect(0, 0, width, height);

  for (const fly of fireflies) {
    fly.updateWander(width, height, groupTargets[fly.groupId], fireflies);

    if (fly.z > 400) {
      // Background canvas: using OffscreenCanvasRenderingContext2D which has standard Canvas context methods
      fly.draw(ctxBg as any, width, height);
    } else {
      // Foreground canvas
      fly.draw(ctxFg as any, width, height);
    }
  }

  animationFrameId = self.requestAnimationFrame(render);
}

self.onmessage = (event: MessageEvent) => {
  const data = event.data;

  if (data.type === 'init') {
    canvasBg = data.canvasBg;
    canvasFg = data.canvasFg;
    width = data.width;
    height = data.height;
    primaryColor = data.primaryColor;
    secondaryColor = data.secondaryColor;

    ctxBg = canvasBg!.getContext('2d') as OffscreenCanvasRenderingContext2D;
    ctxFg = canvasFg!.getContext('2d') as OffscreenCanvasRenderingContext2D;

    // Initialize ecosystem
    const ecosystemSize = 200;
    fireflies.length = 0; // clear existing
    for (let i = 0; i < ecosystemSize; i++) {
      fireflies.push(new Firefly(width, height, primaryColor, secondaryColor));
    }

    randomizeTargets();
    render();
  } else if (data.type === 'resize') {
    width = data.width;
    height = data.height;
    
    if (canvasBg && canvasFg) {
      canvasBg.width = width;
      canvasBg.height = height;
      canvasFg.width = width;
      canvasFg.height = height;
    }
  } else if (data.type === 'theme') {
    primaryColor = data.primaryColor;
    secondaryColor = data.secondaryColor;
    
    // Update existing fireflies colors
    for (const fly of fireflies) {
      fly.basePrimary = primaryColor;
      fly.baseSecondary = secondaryColor;
      fly.glowColor = Math.random() > 0.5 ? primaryColor : secondaryColor;
    }
  } else if (data.type === 'destroy') {
    clearTimeout(randomizeTimeoutId);
    self.cancelAnimationFrame(animationFrameId);
    fireflies.length = 0;
  }
};
