import { Message } from "@/context/ProfileContext";
import { RandomUser } from "./randomData";

// ─── Canvas dimensions ───────────────────────────────────────────────────────
const W = 390;
const H = 844;
const STATUS_H = 24;
const HEADER_H  = 62;
const INPUT_H   = 62;
const NAV_H     = 36;
const CHAT_TOP  = STATUS_H + HEADER_H;
const CHAT_BOT  = H - INPUT_H - NAV_H;

// ─── Colors ──────────────────────────────────────────────────────────────────
const SENT_BG    = "#d4f5b8";
const RECV_BG    = "#ffffff";
const SENT_TIME  = "#7ab65a";
const RECV_TIME  = "#aaaaaa";
const TICK_COLOR = "#4fc3f7";
const BUBBLE_SHD = "rgba(0,0,0,0.12)";

// ─── Seeded LCG random ───────────────────────────────────────────────────────
function makeLCG(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ─── Individual doodle shape drawing (all centred at 0,0) ────────────────────
function doodleStar(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const ang = (i * Math.PI) / 5 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.4;
    ctx[i === 0 ? "moveTo" : "lineTo"](Math.cos(ang) * rad, Math.sin(ang) * rad);
  }
  ctx.closePath();
  ctx.stroke();
}

function doodleFlower(ctx: CanvasRenderingContext2D, r: number) {
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    ctx.beginPath();
    ctx.ellipse(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55, r * 0.38, r * 0.22, a, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
  ctx.stroke();
}

function doodleLeaf(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.bezierCurveTo(r * 0.8, -r * 0.3, r * 0.8, r * 0.5, 0, r * 0.7);
  ctx.bezierCurveTo(-r * 0.8, r * 0.5, -r * 0.8, -r * 0.3, 0, -r);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.lineTo(0, r * 0.7);
  ctx.stroke();
}

function doodleHeart(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  ctx.moveTo(0, r * 0.3);
  ctx.bezierCurveTo(-r * 0.6, -r * 0.2, -r * 0.6, -r * 0.9, 0, -r * 0.35);
  ctx.bezierCurveTo(r * 0.6, -r * 0.9, r * 0.6, -r * 0.2, 0, r * 0.3);
  ctx.stroke();
}

function doodleCrown(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  ctx.moveTo(-r, r * 0.4);
  ctx.lineTo(-r, -r * 0.1);
  ctx.lineTo(-r * 0.5, r * 0.4);
  ctx.lineTo(0, -r * 0.6);
  ctx.lineTo(r * 0.5, r * 0.4);
  ctx.lineTo(r, -r * 0.1);
  ctx.lineTo(r, r * 0.4);
  ctx.closePath();
  ctx.stroke();
  // gems
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.arc(i * r * 0.5, r * 0.15, r * 0.12, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function doodleBalloon(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  ctx.ellipse(0, -r * 0.3, r * 0.55, r * 0.7, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, r * 0.4);
  ctx.bezierCurveTo(r * 0.2, r * 0.6, -r * 0.1, r * 0.8, 0, r);
  ctx.stroke();
  // knot
  ctx.beginPath();
  ctx.arc(0, r * 0.4, r * 0.08, 0, Math.PI * 2);
  ctx.stroke();
}

function doodleCatFace(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();
  // ears
  ctx.beginPath();
  ctx.moveTo(-r * 0.65, -r * 0.65);
  ctx.lineTo(-r * 0.85, -r);
  ctx.lineTo(-r * 0.35, -r * 0.75);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(r * 0.65, -r * 0.65);
  ctx.lineTo(r * 0.85, -r);
  ctx.lineTo(r * 0.35, -r * 0.75);
  ctx.closePath();
  ctx.stroke();
  // eyes
  ctx.beginPath();
  ctx.arc(-r * 0.33, -r * 0.15, r * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(r * 0.33, -r * 0.15, r * 0.12, 0, Math.PI * 2);
  ctx.fill();
  // nose + mouth
  ctx.beginPath();
  ctx.arc(0, r * 0.1, r * 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-r * 0.2, r * 0.3);
  ctx.quadraticCurveTo(0, r * 0.45, r * 0.2, r * 0.3);
  ctx.stroke();
  // whiskers
  ctx.beginPath();
  ctx.moveTo(-r * 0.65, r * 0.1); ctx.lineTo(-r * 0.15, r * 0.15);
  ctx.moveTo(-r * 0.65, r * 0.25); ctx.lineTo(-r * 0.15, r * 0.2);
  ctx.moveTo(r * 0.65, r * 0.1);  ctx.lineTo(r * 0.15, r * 0.15);
  ctx.moveTo(r * 0.65, r * 0.25); ctx.lineTo(r * 0.15, r * 0.2);
  ctx.stroke();
}

function doodlePineapple(ctx: CanvasRenderingContext2D, r: number) {
  // Body
  ctx.beginPath();
  ctx.ellipse(0, r * 0.2, r * 0.55, r * 0.72, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Grid lines
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.moveTo(i * r * 0.3, -r * 0.4); ctx.lineTo(i * r * 0.3, r * 0.88);
    ctx.stroke();
  }
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(-r * 0.5, -r * 0.2 + i * r * 0.38);
    ctx.lineTo(r * 0.5, -r * 0.2 + i * r * 0.38);
    ctx.stroke();
  }
  // Top leaves
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.5);
  ctx.bezierCurveTo(-r * 0.3, -r * 1.0, -r * 0.6, -r * 0.8, -r * 0.4, -r * 0.5);
  ctx.moveTo(0, -r * 0.5);
  ctx.bezierCurveTo(r * 0.3, -r * 1.0, r * 0.6, -r * 0.8, r * 0.4, -r * 0.5);
  ctx.moveTo(0, -r * 0.5);
  ctx.bezierCurveTo(0, -r * 1.15, 0, -r * 0.9, 0, -r * 0.5);
  ctx.stroke();
}

function doodleStrawberry(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  ctx.arc(0, r * 0.15, r * 0.7, 0, Math.PI);
  ctx.bezierCurveTo(-r * 0.7, r * 0.15, -r * 0.2, r, 0, r);
  ctx.bezierCurveTo(r * 0.2, r, r * 0.7, r * 0.15, r * 0.7, r * 0.15);
  ctx.stroke();
  // dots
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(-r * 0.25 + (i % 3) * r * 0.28, r * 0.4 + Math.floor(i / 3) * r * 0.35, r * 0.07, 0, Math.PI * 2);
    ctx.fill();
  }
  // leaf
  ctx.beginPath();
  ctx.moveTo(-r * 0.3, r * 0.1); ctx.lineTo(0, -r * 0.3);
  ctx.moveTo(r * 0.3, r * 0.1);  ctx.lineTo(0, -r * 0.3);
  ctx.moveTo(0, r * 0.1);        ctx.lineTo(0, -r * 0.3);
  ctx.stroke();
}

function doodleButterfly(ctx: CanvasRenderingContext2D, r: number) {
  // Upper wings
  ctx.beginPath();
  ctx.ellipse(-r * 0.55, -r * 0.35, r * 0.5, r * 0.35, -0.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(r * 0.55, -r * 0.35, r * 0.5, r * 0.35, 0.5, 0, Math.PI * 2);
  ctx.stroke();
  // Lower wings
  ctx.beginPath();
  ctx.ellipse(-r * 0.4, r * 0.3, r * 0.38, r * 0.28, 0.4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(r * 0.4, r * 0.3, r * 0.38, r * 0.28, -0.4, 0, Math.PI * 2);
  ctx.stroke();
  // Body
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.1, r * 0.6, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Antennae
  ctx.beginPath();
  ctx.moveTo(-r * 0.05, -r * 0.5);
  ctx.bezierCurveTo(-r * 0.3, -r * 0.9, -r * 0.5, -r, -r * 0.4, -r * 1.1);
  ctx.moveTo(r * 0.05, -r * 0.5);
  ctx.bezierCurveTo(r * 0.3, -r * 0.9, r * 0.5, -r, r * 0.4, -r * 1.1);
  ctx.stroke();
}

function doodleCloud(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  ctx.arc(-r * 0.35, 0, r * 0.42, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, -r * 0.2, r * 0.55, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(r * 0.42, r * 0.05, r * 0.38, 0, Math.PI * 2);
  ctx.stroke();
}

function doodleSun(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const x1 = Math.cos(a) * r * 0.55;
    const y1 = Math.sin(a) * r * 0.55;
    const x2 = Math.cos(a) * r;
    const y2 = Math.sin(a) * r;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

function doodleGiftBox(ctx: CanvasRenderingContext2D, r: number) {
  // Box
  ctx.strokeRect(-r * 0.7, -r * 0.2, r * 1.4, r * 0.9);
  // Lid
  ctx.strokeRect(-r * 0.8, -r * 0.45, r * 1.6, r * 0.25);
  // Ribbon vertical
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.45); ctx.lineTo(0, r * 0.7);
  ctx.stroke();
  // Ribbon horizontal
  ctx.beginPath();
  ctx.moveTo(-r * 0.8, -r * 0.32); ctx.lineTo(r * 0.8, -r * 0.32);
  ctx.stroke();
  // Bow loops
  ctx.beginPath();
  ctx.bezierCurveTo(-r * 0.55, -r * 0.45, -r * 0.55, -r * 0.95, 0, -r * 0.45);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.45);
  ctx.bezierCurveTo(r * 0.55, -r * 0.95, r * 0.55, -r * 0.45, 0, -r * 0.45);
  ctx.stroke();
}

function doodleMusicNote(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  ctx.arc(-r * 0.3, r * 0.5, r * 0.28, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(r * 0.35, r * 0.3, r * 0.23, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-r * 0.02, r * 0.22);
  ctx.lineTo(-r * 0.02, -r * 0.6);
  ctx.lineTo(r * 0.6, -r * 0.8);
  ctx.lineTo(r * 0.6, r * 0.08);
  ctx.stroke();
}

function doodleTeddy(ctx: CanvasRenderingContext2D, r: number) {
  // Body
  ctx.beginPath();
  ctx.ellipse(0, r * 0.35, r * 0.5, r * 0.6, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Head
  ctx.beginPath();
  ctx.arc(0, -r * 0.3, r * 0.42, 0, Math.PI * 2);
  ctx.stroke();
  // Ears
  ctx.beginPath();
  ctx.arc(-r * 0.36, -r * 0.65, r * 0.18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(r * 0.36, -r * 0.65, r * 0.18, 0, Math.PI * 2);
  ctx.stroke();
  // Face
  ctx.beginPath();
  ctx.arc(-r * 0.15, -r * 0.35, r * 0.07, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(r * 0.15, -r * 0.35, r * 0.07, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, -r * 0.2, r * 0.12, 0, Math.PI);
  ctx.stroke();
}

function doodleDiamond(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.lineTo(r * 0.65, -r * 0.2);
  ctx.lineTo(0, r);
  ctx.lineTo(-r * 0.65, -r * 0.2);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-r * 0.65, -r * 0.2); ctx.lineTo(0, r * 0.2); ctx.lineTo(r * 0.65, -r * 0.2);
  ctx.moveTo(-r * 0.3, -r);        ctx.lineTo(0, -r * 0.2);
  ctx.moveTo(r * 0.3, -r);         ctx.lineTo(0, -r * 0.2);
  ctx.moveTo(0, -r);               ctx.lineTo(0, -r * 0.2);
  ctx.stroke();
}

function doodleIceCream(ctx: CanvasRenderingContext2D, r: number) {
  // Cone
  ctx.beginPath();
  ctx.moveTo(-r * 0.5, r * 0.1);
  ctx.lineTo(0, r);
  ctx.lineTo(r * 0.5, r * 0.1);
  ctx.closePath();
  ctx.stroke();
  // Waffle lines
  ctx.beginPath();
  ctx.moveTo(-r * 0.4, r * 0.35); ctx.lineTo(r * 0.4, r * 0.35);
  ctx.moveTo(-r * 0.2, r * 0.6);  ctx.lineTo(r * 0.2, r * 0.6);
  ctx.stroke();
  // Scoop
  ctx.beginPath();
  ctx.arc(0, -r * 0.15, r * 0.5, 0, Math.PI * 2);
  ctx.stroke();
  // Sprinkles
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(-r * 0.25 + (i % 3) * r * 0.25, -r * 0.25 + Math.floor(i / 3) * r * 0.25, r * 0.06, 0, Math.PI * 2);
    ctx.fill();
  }
}

function doodleApple(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.6);
  ctx.bezierCurveTo(-r * 0.1, -r * 0.75, -r * 0.9, -r * 0.8, -r * 0.8, -r * 0.2);
  ctx.bezierCurveTo(-r * 0.7, r * 0.4, -r * 0.3, r, 0, r);
  ctx.bezierCurveTo(r * 0.3, r, r * 0.7, r * 0.4, r * 0.8, -r * 0.2);
  ctx.bezierCurveTo(r * 0.9, -r * 0.8, r * 0.1, -r * 0.75, 0, -r * 0.6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.6);
  ctx.bezierCurveTo(r * 0.3, -r * 0.9, r * 0.2, -r * 1.05, 0, -r * 0.85);
  ctx.stroke();
}

const SHAPES = [
  doodleStar, doodleFlower, doodleLeaf, doodleHeart, doodleCrown,
  doodleBalloon, doodleCatFace, doodlePineapple, doodleStrawberry,
  doodleButterfly, doodleCloud, doodleSun, doodleGiftBox,
  doodleMusicNote, doodleTeddy, doodleDiamond, doodleIceCream, doodleApple,
];

// ─── Draw the Telegram-like doodle background pattern ────────────────────────
function drawTelegramPattern(ctx: CanvasRenderingContext2D) {
  const rand = makeLCG(7351);
  ctx.save();
  ctx.globalAlpha = 0.19;
  ctx.strokeStyle = "#0d2e0d";
  ctx.fillStyle   = "#0d2e0d";
  ctx.lineWidth   = 1.6;
  ctx.lineCap     = "round";
  ctx.lineJoin    = "round";

  const count = 52;
  for (let i = 0; i < count; i++) {
    const px    = rand() * W;
    const py    = rand() * H;
    const rot   = rand() * Math.PI * 2;
    const scale = 0.6 + rand() * 0.75;
    const si    = Math.floor(rand() * SHAPES.length);

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(rot);
    ctx.scale(scale, scale);
    SHAPES[si](ctx, 14);
    ctx.restore();
  }
  ctx.restore();
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function bubblePath(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  sent: boolean
) {
  const r = 16, tail = 4;
  const tl = sent ? r : tail;
  const tr = sent ? tail : r;
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + tl);
  ctx.quadraticCurveTo(x, y, x + tl, y);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  ctx.font = "15px -apple-system,'Segoe UI',sans-serif";
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; }
    else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ─── Status bar ──────────────────────────────────────────────────────────────
function drawStatusBar(ctx: CanvasRenderingContext2D, phone: string) {
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  ctx.save();
  // Phone number (top center like carrier)
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.font = "9px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(phone, W / 2, 3);

  // Time left
  ctx.fillStyle = "#fff";
  ctx.font = "bold 11.5px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("4G  " + time, 8, 10);

  // Icons right
  ctx.textAlign = "right";
  ctx.font = "11px sans-serif";
  ctx.fillText("▲ ⌁ 🔋", W - 6, 10);
  ctx.restore();
}

// ─── Telegram header ─────────────────────────────────────────────────────────
function drawHeader(ctx: CanvasRenderingContext2D, user: RandomUser) {
  const y = STATUS_H;

  // Subtle darkening strip
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.07)";
  ctx.fillRect(0, y, W, HEADER_H);
  ctx.restore();

  // Back button — white rounded rect
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.shadowColor = BUBBLE_SHD;
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 2;
  drawRoundRect(ctx, 8, y + 13, 36, 36, 18);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "#333";
  ctx.font = "bold 17px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("←", 26, y + 31);
  ctx.restore();

  // Avatar circle
  const AVA_X = 57, AVA_Y = y + 30, AVA_R = 19;
  ctx.save();
  ctx.shadowColor = BUBBLE_SHD;
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 1;
  const grad = ctx.createRadialGradient(AVA_X - 5, AVA_Y - 5, 2, AVA_X, AVA_Y, AVA_R);
  grad.addColorStop(0, user.avatarColor);
  grad.addColorStop(1, "#111");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(AVA_X, AVA_Y, AVA_R, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "#fff";
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(user.name.charAt(0).toUpperCase(), AVA_X, AVA_Y);
  ctx.restore();

  // Name + status
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 15px -apple-system,sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(user.name, 82, y + 25);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "12px sans-serif";
  ctx.fillText("last seen recently", 82, y + 43);
  ctx.restore();

  // Mute icon after name
  ctx.save();
  ctx.font = "13px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  const nw = (() => {
    ctx.font = "bold 15px -apple-system,sans-serif";
    return ctx.measureText(user.name).width;
  })();
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = "13px sans-serif";
  ctx.fillText("🔕", 82 + nw + 5, y + 25);
  ctx.restore();

  // Phone icon circle
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.shadowColor = BUBBLE_SHD;
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.arc(W - 52, y + 30, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.font = "16px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("📞", W - 52, y + 31);
  ctx.restore();

  // Three dots
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 22px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("⋮", W - 22, y + 30);
  ctx.restore();
}

// ─── Single message bubble ───────────────────────────────────────────────────
function drawBubble(
  ctx: CanvasRenderingContext2D,
  msg: Message,
  y: number
): number {
  const SPAD = 12, VPAD = 8, MAX_W = 255, LINE_H = 20, TIME_H = 16;
  const isSent = msg.sent;

  ctx.font = "15px -apple-system,'Segoe UI',sans-serif";
  const lines = wrapText(ctx, msg.text, MAX_W - SPAD * 2 - 48);

  ctx.font = "11px sans-serif";
  const timeW = ctx.measureText(msg.time).width + (isSent ? 22 : 0) + 6;

  ctx.font = "15px -apple-system,'Segoe UI',sans-serif";
  const maxLineW = Math.max(...lines.map((l) => ctx.measureText(l).width));
  const bubbleW = Math.min(Math.max(maxLineW + SPAD * 2 + 4, timeW + SPAD * 2), MAX_W);
  const bubbleH = VPAD + lines.length * LINE_H + TIME_H + VPAD - 2;
  const bx = isSent ? W - 12 - bubbleW : 12;
  const by = y;

  // Shadow + bubble fill
  ctx.save();
  ctx.shadowColor = BUBBLE_SHD;
  ctx.shadowBlur  = 6;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = isSent ? SENT_BG : RECV_BG;
  bubblePath(ctx, bx, by, bubbleW, bubbleH, isSent);
  ctx.fill();
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;

  // Message text
  ctx.fillStyle = "#111";
  ctx.font = "15px -apple-system,'Segoe UI',sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  lines.forEach((line, i) => ctx.fillText(line, bx + SPAD, by + VPAD + i * LINE_H));

  // Edited label
  if (msg.edited) {
    ctx.font = "italic 10px sans-serif";
    ctx.fillStyle = "#aaa";
    ctx.fillText("edited", bx + SPAD, by + VPAD + lines.length * LINE_H);
  }

  // Timestamp bottom-right
  const tY = by + bubbleH - TIME_H;
  ctx.font = "11px sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillStyle = isSent ? SENT_TIME : RECV_TIME;
  const tickOff = isSent ? 22 : 0;
  ctx.fillText(msg.time, bx + bubbleW - SPAD - tickOff, tY + 2);

  // Blue double ticks for sent
  if (isSent) {
    ctx.fillStyle = TICK_COLOR;
    ctx.font = "bold 11px sans-serif";
    ctx.fillText("✓✓", bx + bubbleW - SPAD + 2, tY + 2);
  }

  ctx.restore();
  return bubbleH + 6;
}

// ─── Input bar ───────────────────────────────────────────────────────────────
function drawInputBar(ctx: CanvasRenderingContext2D) {
  const iy = H - INPUT_H - NAV_H;
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, iy, W, INPUT_H);

  // Emoji icon
  ctx.font = "21px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🙂", 22, iy + INPUT_H / 2);

  // Input field
  ctx.fillStyle = "#efefef";
  drawRoundRect(ctx, 44, iy + 10, W - 44 - 56, INPUT_H - 20, 22);
  ctx.fill();
  ctx.fillStyle = "#c0c0c0";
  ctx.font = "14px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Message", 60, iy + INPUT_H / 2);

  // Paperclip
  ctx.fillStyle = "#888";
  ctx.font = "20px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("📎", W - 44, iy + INPUT_H / 2);

  // Blue mic circle
  ctx.fillStyle = "#3390ec";
  ctx.shadowColor = "rgba(51,144,236,0.4)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 2;
  ctx.beginPath();
  ctx.arc(W - 20, iy + INPUT_H / 2, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
  ctx.fillStyle = "#fff";
  ctx.font = "15px sans-serif";
  ctx.fillText("🎤", W - 20, iy + INPUT_H / 2 + 1);
  ctx.restore();
}

// ─── Android nav bar ─────────────────────────────────────────────────────────
function drawNavBar(ctx: CanvasRenderingContext2D) {
  const ny = H - NAV_H;
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.72)";
  ctx.fillRect(0, ny, W, NAV_H);
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.font = "16px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("≡",  W / 2 - 100, ny + NAV_H / 2);
  ctx.fillText("○",  W / 2,        ny + NAV_H / 2);
  ctx.fillText("←",  W / 2 + 100, ny + NAV_H / 2);
  ctx.restore();
}

// ─── Scroll button ───────────────────────────────────────────────────────────
function drawScrollBtn(ctx: CanvasRenderingContext2D) {
  const bx = W - 50, by = H - INPUT_H - NAV_H - 52;
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.shadowColor = BUBBLE_SHD;
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 2;
  ctx.beginPath();
  ctx.arc(bx, by, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "#555";
  ctx.font = "bold 15px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("⌄", bx, by + 1);
  ctx.restore();
}

// ─── Main export ─────────────────────────────────────────────────────────────
export async function generateChatScreenshot(
  user: RandomUser,
  messages: Message[],
  _myName: string
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // 1. Green gradient background (matching Telegram exactly)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0,   "#c0d9b5");
  bgGrad.addColorStop(0.35,"#70b870");
  bgGrad.addColorStop(0.7, "#5aA05a");
  bgGrad.addColorStop(1,   "#4a8a4a");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Doodle pattern (food, toys, animals, stars…)
  drawTelegramPattern(ctx);

  // 3. Status bar
  drawStatusBar(ctx, user.phone);

  // 4. Header
  drawHeader(ctx, user);

  // 5. Messages
  let cursor = CHAT_TOP + 10;
  const visibleMsgs = messages.slice(-9);
  for (const msg of visibleMsgs) {
    const h = drawBubble(ctx, msg, cursor);
    cursor += h;
    if (cursor > CHAT_BOT - 20) break;
  }

  // 6. Scroll button
  drawScrollBtn(ctx);

  // 7. Input bar
  drawInputBar(ctx);

  // 8. Android nav bar
  drawNavBar(ctx);

  return canvas.toDataURL("image/png");
}
