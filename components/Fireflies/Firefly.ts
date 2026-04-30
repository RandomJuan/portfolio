export type GroupTarget = { x: number; y: number; z: number };

export class Firefly {
  x: number;
  y: number;
  z: number;
  s: number;
  ang: number;
  targetAng: number;
  v: number;
  vz: number;
  glowColor: string;
  groupId: number;

  isOn: boolean;
  alpha: number;
  timer: number;
  onDuration: number;
  offDuration: number;

  isBeingEaten: boolean;

  constructor(w: number, h: number) {
    this.s = Math.random() * 40 + 20;
    this.v = Math.random() * 2 + 1;
    this.vz = (Math.random() - 0.5) * 2;
    this.ang = Math.random() * Math.PI * 2;
    this.targetAng = this.ang;

    this.glowColor = Math.random() > 0.5 ? '0, 120, 255' : '0, 160, 255';
    // this.glowColor = Math.random() > 0.5 ? '57, 255, 20' : '120, 255, 80';
    this.groupId = Math.floor(Math.random() * 5);

    this.x = (Math.random() - 0.5) * w * 3;
    this.y = (Math.random() - 0.5) * h * 3;
    this.z = Math.random() * 800 + 200;

    this.isOn = Math.random() > 0.5;
    this.alpha = this.isOn ? Math.random() : 0;
    this.timer = Math.random() * 300;
    this.onDuration = Math.random() * 100 + 50;
    this.offDuration = Math.random() * 400 + 100;

    this.isBeingEaten = false;
  }

  spawn(w: number, h: number) {
    this.x = (Math.random() - 0.5) * w * 3;
    this.y = (Math.random() - 0.5) * h * 3;
    this.z = 1500;
    this.isOn = false;
    this.alpha = 0;
    this.timer = 0;
    this.isBeingEaten = false;
  }

  updateWander(w: number, h: number, swarmTarget: GroupTarget, allFireflies: Firefly[]) {
    if (this.isBeingEaten) return;

    this.timer++;
    if (this.isOn && this.timer > this.onDuration) {
      this.isOn = false;
      this.timer = 0;
      this.offDuration = Math.random() * 500 + 200;
    } else if (!this.isOn && this.timer > this.offDuration) {
      this.isOn = true;
      this.timer = 0;
      this.onDuration = Math.random() * 150 + 50;
    }

    if (this.isOn) {
      this.alpha += 0.05;
      if (this.alpha > 1) this.alpha = 1;
    } else {
      this.alpha -= 0.03;
      if (this.alpha < 0) this.alpha = 0;
    }

    let tooClose = false;
    for (let i = 0; i < allFireflies.length; i++) {
        const other = allFireflies[i];
        if (other === this) continue;

        const dx = this.x - other.x;
        const dy = this.y - other.y;

        if (Math.abs(dx) > 100 || Math.abs(dy) > 100) continue;
        const dz = this.z - other.z;
        if (Math.abs(dz) > 100) continue;

        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < 6400) {
            tooClose = true;
            const angleAway = Math.atan2(dy, dx);
            let diffToAway = angleAway - this.targetAng;
            while (diffToAway > Math.PI) diffToAway -= Math.PI * 2;
            while (diffToAway < -Math.PI) diffToAway += Math.PI * 2;
            this.targetAng += diffToAway * 0.15;
        }
    }
    if (tooClose) {
      this.vz += (Math.random() - 0.5) * 2;
    }

    const angleToTarget = Math.atan2(swarmTarget.y - this.y, swarmTarget.x - this.x);
    let diffToTarget = angleToTarget - this.targetAng;
    while (diffToTarget > Math.PI) diffToTarget -= Math.PI * 2;
    while (diffToTarget < -Math.PI) diffToTarget += Math.PI * 2;

    this.targetAng += diffToTarget * 0.015;
    this.targetAng += (Math.random() - 0.5) * 0.25;

    const zDiff = swarmTarget.z - this.z;
    this.vz += zDiff * 0.0005;

    const worldLimitW = w * 1.5;
    const worldLimitH = h * 1.5;
    if (this.x < -worldLimitW) this.targetAng = 0;
    if (this.x > worldLimitW) this.targetAng = Math.PI;
    if (this.y < -worldLimitH) this.targetAng = Math.PI / 2;
    if (this.y > worldLimitH) this.targetAng = -Math.PI / 2;

    let diff = this.targetAng - this.ang;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    this.ang += diff * 0.04;

    if (this.vz > 3) this.vz = 3;
    if (this.vz < -3) this.vz = -3;

    this.x += Math.cos(this.ang) * this.v;
    this.y += Math.sin(this.ang) * this.v;
    this.z += this.vz;
  }

  draw(ctx: CanvasRenderingContext2D, w: number, h: number) {
    if (this.alpha <= 0.01) return;

    const focus = 400;
    const safeZ = Math.max(-150, this.z);
    const scale = focus / (focus + safeZ);

    const screenX = w / 2 + this.x * scale;
    const screenY = h / 2 + this.y * scale;
    const screenS = this.s * scale;

    ctx.save();
    ctx.translate(screenX, screenY);

    const dynamicRadius = screenS * (0.8 + this.alpha * 1.5);

    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, dynamicRadius);
    grad.addColorStop(0, `rgba(${this.glowColor}, ${this.alpha * 0.7})`);
    grad.addColorStop(1, `rgba(${this.glowColor}, 0)`);

    ctx.beginPath();
    ctx.arc(0, 0, dynamicRadius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.restore();
  }
}
