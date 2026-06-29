import { Message } from "@/context/ProfileContext";
import { RandomUser } from "./randomData";

// ─── Canvas dimensions (tall Android screenshot) ──────────────────────────────
const W = 390;
const H = 844;
const STATUS_H = 28;
const HEADER_H = 70;
const INPUT_H = 58;
const NAV_H = 32;
const CHAT_TOP = STATUS_H + HEADER_H;
const CHAT_BOT = H - INPUT_H - NAV_H;

// ─── Colors ──────────────────────────────────────────────────────────────────
const SENT_BG   = "#d4f5b8";
const RECV_BG   = "#ffffff";
const SENT_TIME = "#7ab65a";
const RECV_TIME = "#aaaaaa";
const BUBBLE_SHD = "rgba(0,0,0,0.13)";

// ─── Seeded LCG random ───────────────────────────────────────────────────────
function makeLCG(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ─── Doodle shape functions (centred at 0,0) ─────────────────────────────────
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
  ctx.beginPath(); ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2); ctx.stroke();
}

function doodleLeaf(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.bezierCurveTo(r * 0.8, -r * 0.3, r * 0.8, r * 0.5, 0, r * 0.7);
  ctx.bezierCurveTo(-r * 0.8, r * 0.5, -r * 0.8, -r * 0.3, 0, -r);
  ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(0, r * 0.7); ctx.stroke();
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
  ctx.moveTo(-r, r * 0.4); ctx.lineTo(-r, -r * 0.1); ctx.lineTo(-r * 0.5, r * 0.4);
  ctx.lineTo(0, -r * 0.6); ctx.lineTo(r * 0.5, r * 0.4); ctx.lineTo(r, -r * 0.1);
  ctx.lineTo(r, r * 0.4); ctx.closePath(); ctx.stroke();
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath(); ctx.arc(i * r * 0.5, r * 0.15, r * 0.12, 0, Math.PI * 2); ctx.stroke();
  }
}

function doodleBalloon(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath(); ctx.ellipse(0, -r * 0.3, r * 0.55, r * 0.7, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, r * 0.4); ctx.bezierCurveTo(r * 0.2, r * 0.6, -r * 0.1, r * 0.8, 0, r); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, r * 0.4, r * 0.08, 0, Math.PI * 2); ctx.stroke();
}

function doodleCatFace(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-r*0.65,-r*0.65); ctx.lineTo(-r*0.85,-r); ctx.lineTo(-r*0.35,-r*0.75); ctx.closePath(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(r*0.65,-r*0.65);  ctx.lineTo(r*0.85,-r);  ctx.lineTo(r*0.35,-r*0.75);  ctx.closePath(); ctx.stroke();
  [[-r*0.33,-r*0.15],[r*0.33,-r*0.15],[0,r*0.1]].forEach(([x,y]) => { ctx.beginPath(); ctx.arc(x,y,r*0.1,0,Math.PI*2); ctx.fill(); });
  ctx.beginPath(); ctx.moveTo(-r*0.2,r*0.3); ctx.quadraticCurveTo(0,r*0.45,r*0.2,r*0.3); ctx.stroke();
}

function doodlePineapple(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath(); ctx.ellipse(0, r * 0.2, r * 0.55, r * 0.72, 0, 0, Math.PI * 2); ctx.stroke();
  for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(i*r*0.3,-r*0.4); ctx.lineTo(i*r*0.3,r*0.88); ctx.stroke(); }
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-r*0.5,-r*0.2+i*r*0.38); ctx.lineTo(r*0.5,-r*0.2+i*r*0.38); ctx.stroke(); }
  ctx.beginPath();
  ctx.moveTo(0,-r*0.5); ctx.bezierCurveTo(-r*0.3,-r,  -r*0.6,-r*0.8,-r*0.4,-r*0.5);
  ctx.moveTo(0,-r*0.5); ctx.bezierCurveTo( r*0.3,-r,   r*0.6,-r*0.8, r*0.4,-r*0.5);
  ctx.moveTo(0,-r*0.5); ctx.bezierCurveTo(0,-r*1.15,0,-r*0.9,0,-r*0.5);
  ctx.stroke();
}

function doodleButterfly(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath(); ctx.ellipse(-r*0.55,-r*0.35,r*0.5,r*0.35,-0.5,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse( r*0.55,-r*0.35,r*0.5,r*0.35, 0.5,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(-r*0.4, r*0.3, r*0.38,r*0.28, 0.4,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse( r*0.4, r*0.3, r*0.38,r*0.28,-0.4,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(0,0,r*0.1,r*0.6,0,0,Math.PI*2); ctx.stroke();
}

function doodleCloud(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath(); ctx.arc(-r*0.35,0,r*0.42,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(0,-r*0.2,r*0.55,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(r*0.42,r*0.05,r*0.38,0,Math.PI*2); ctx.stroke();
}

function doodleSun(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath(); ctx.arc(0,0,r*0.45,0,Math.PI*2); ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    ctx.beginPath(); ctx.moveTo(Math.cos(a)*r*0.55,Math.sin(a)*r*0.55); ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r); ctx.stroke();
  }
}

function doodleMusicNote(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath(); ctx.arc(-r*0.3,r*0.5,r*0.28,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc( r*0.35,r*0.3,r*0.23,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-r*0.02,r*0.22); ctx.lineTo(-r*0.02,-r*0.6); ctx.lineTo(r*0.6,-r*0.8); ctx.lineTo(r*0.6,r*0.08); ctx.stroke();
}

function doodleTeddy(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath(); ctx.ellipse(0,r*0.35,r*0.5,r*0.6,0,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(0,-r*0.3,r*0.42,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(-r*0.36,-r*0.65,r*0.18,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc( r*0.36,-r*0.65,r*0.18,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(-r*0.15,-r*0.35,r*0.07,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc( r*0.15,-r*0.35,r*0.07,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(0,-r*0.2,r*0.12,0,Math.PI); ctx.stroke();
}

function doodleDiamond(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  ctx.moveTo(0,-r); ctx.lineTo(r*0.65,-r*0.2); ctx.lineTo(0,r); ctx.lineTo(-r*0.65,-r*0.2); ctx.closePath(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-r*0.65,-r*0.2); ctx.lineTo(0,r*0.2); ctx.lineTo(r*0.65,-r*0.2);
  ctx.moveTo(-r*0.3,-r); ctx.lineTo(0,-r*0.2);
  ctx.moveTo(r*0.3,-r); ctx.lineTo(0,-r*0.2);
  ctx.moveTo(0,-r); ctx.lineTo(0,-r*0.2);
  ctx.stroke();
}

function doodleIceCream(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath(); ctx.moveTo(-r*0.5,r*0.1); ctx.lineTo(0,r); ctx.lineTo(r*0.5,r*0.1); ctx.closePath(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-r*0.4,r*0.35); ctx.lineTo(r*0.4,r*0.35); ctx.moveTo(-r*0.2,r*0.6); ctx.lineTo(r*0.2,r*0.6); ctx.stroke();
  ctx.beginPath(); ctx.arc(0,-r*0.15,r*0.5,0,Math.PI*2); ctx.stroke();
}

function doodleApple(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  ctx.moveTo(0,-r*0.6);
  ctx.bezierCurveTo(-r*0.1,-r*0.75,-r*0.9,-r*0.8,-r*0.8,-r*0.2);
  ctx.bezierCurveTo(-r*0.7,r*0.4,-r*0.3,r,0,r);
  ctx.bezierCurveTo(r*0.3,r,r*0.7,r*0.4,r*0.8,-r*0.2);
  ctx.bezierCurveTo(r*0.9,-r*0.8,r*0.1,-r*0.75,0,-r*0.6);
  ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0,-r*0.6); ctx.bezierCurveTo(r*0.3,-r*0.9,r*0.2,-r*1.05,0,-r*0.85); ctx.stroke();
}

const SHAPES = [
  doodleStar, doodleFlower, doodleLeaf, doodleHeart, doodleCrown,
  doodleBalloon, doodleCatFace, doodlePineapple, doodleButterfly,
  doodleCloud, doodleSun, doodleMusicNote, doodleTeddy, doodleDiamond,
  doodleIceCream, doodleApple,
];

// ─── Telegram doodle pattern ──────────────────────────────────────────────────
function drawTelegramPattern(ctx: CanvasRenderingContext2D) {
  const rand = makeLCG(7351);
  ctx.save();
  ctx.globalAlpha = 0.17;
  ctx.strokeStyle = "#0d2e0d";
  ctx.fillStyle   = "#0d2e0d";
  ctx.lineWidth   = 1.5;
  ctx.lineCap     = "round";
  ctx.lineJoin    = "round";
  for (let i = 0; i < 55; i++) {
    const px  = rand() * W;
    const py  = rand() * H;
    const rot = rand() * Math.PI * 2;
    const sc  = 0.65 + rand() * 0.7;
    const si  = Math.floor(rand() * SHAPES.length);
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(rot);
    ctx.scale(sc, sc);
    SHAPES[si](ctx, 14);
    ctx.restore();
  }
  ctx.restore();
}

// ─── Rounded rect helper ─────────────────────────────────────────────────────
function rrect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  const R = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + R, y);
  ctx.lineTo(x + w - R, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + R);
  ctx.lineTo(x + w, y + h - R);
  ctx.quadraticCurveTo(x + w, y + h, x + w - R, y + h);
  ctx.lineTo(x + R, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - R);
  ctx.lineTo(x, y + R);
  ctx.quadraticCurveTo(x, y, x + R, y);
  ctx.closePath();
}

// ─── Draw a white pill / circle with shadow ───────────────────────────────────
function drawWhitePill(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.save();
  ctx.shadowColor   = "rgba(0,0,0,0.18)";
  ctx.shadowBlur    = 8;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = "#ffffff";
  rrect(ctx, x, y, w, h, r);
  ctx.fill();
  ctx.restore();
}

// ─── Status bar (matching real Android) ──────────────────────────────────────
function drawStatusBar(ctx: CanvasRenderingContext2D, phone: string) {
  const times = ["7:45", "8:12", "9:03", "10:24", "11:07", "6:14", "5:55", "12:30"];
  const time = times[Math.floor((parseInt(phone.replace(/\D/g, "").slice(-2) || "0")) % times.length)];

  ctx.save();

  // Time — left
  ctx.fillStyle = "#fff";
  ctx.font = "bold 13.5px -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(time, 10, STATUS_H / 2);

  // Phone number small — center
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "8.5px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(phone, W / 2, STATUS_H / 2);

  // Right icons: signal + wifi + battery
  ctx.textAlign = "right";
  ctx.fillStyle = "#fff";

  // Battery icon (rect)
  const bx = W - 8, by = STATUS_H / 2;
  ctx.save();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(bx - 24, by - 6, 22, 12);
  ctx.strokeRect(bx - 2, by - 3, 2.5, 6);
  ctx.fillStyle = "#fff";
  ctx.fillRect(bx - 23, by - 5, 16, 10); // charge fill
  ctx.restore();

  // Signal bars
  const sbx = W - 38;
  ctx.fillStyle = "#fff";
  [4, 7, 10, 13].forEach((h, i) => {
    ctx.fillRect(sbx - 20 + i * 5, by + 6 - h, 3.5, h);
  });

  // Wifi icon (arcs)
  ctx.save();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.3;
  ctx.lineCap = "round";
  const wx = sbx - 32, wy = by;
  [5, 9, 13].forEach((r2, i) => {
    ctx.globalAlpha = i < 2 ? 0.5 : 1;
    ctx.beginPath();
    ctx.arc(wx, wy + 5, r2, Math.PI * 1.25, Math.PI * 1.75);
    ctx.stroke();
  });
  ctx.globalAlpha = 1;
  ctx.beginPath(); ctx.arc(wx, wy + 5, 2, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  ctx.restore();
}

// ─── Header — exact pill style matching the real Telegram screenshot ──────────
function drawHeader(ctx: CanvasRenderingContext2D, user: RandomUser) {
  const hy = STATUS_H;
  const CY = hy + HEADER_H / 2; // vertical center of header

  // ── Back button: white circle ──────────────────────────────────────────────
  const CIRCLE_R = 24;
  const CIRCLE_X = 10;
  drawWhitePill(ctx, CIRCLE_X, CY - CIRCLE_R, CIRCLE_R * 2, CIRCLE_R * 2, CIRCLE_R);

  // Arrow icon inside
  ctx.save();
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "bold 18px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("←", CIRCLE_X + CIRCLE_R, CY);
  ctx.restore();

  // ── Right pill: phone + divider + three-dots ───────────────────────────────
  const RPILL_W = 76, RPILL_H = 46, RPILL_X = W - RPILL_W - 10;
  drawWhitePill(ctx, RPILL_X, CY - RPILL_H / 2, RPILL_W, RPILL_H, RPILL_H / 2);

  // Phone icon
  ctx.save();
  ctx.font = "17px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("📞", RPILL_X + 19, CY);
  ctx.restore();

  // Divider
  ctx.save();
  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(RPILL_X + 38, CY - 11);
  ctx.lineTo(RPILL_X + 38, CY + 11);
  ctx.stroke();
  ctx.restore();

  // Three-dots icon
  ctx.save();
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "bold 21px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("⋮", RPILL_X + 57, CY);
  ctx.restore();

  // ── Center pill: avatar + name + mute + last seen ─────────────────────────
  const LEFT_EDGE = CIRCLE_X + CIRCLE_R * 2 + 8;
  const RIGHT_EDGE = RPILL_X - 8;
  const CPILL_W = RIGHT_EDGE - LEFT_EDGE;
  const CPILL_H = 50;
  drawWhitePill(ctx, LEFT_EDGE, CY - CPILL_H / 2, CPILL_W, CPILL_H, CPILL_H / 2);

  // Avatar circle inside pill
  const AVA_R = 18;
  const AVA_X = LEFT_EDGE + AVA_R + 7;
  const AVA_Y = CY;
  ctx.save();
  // Avatar gradient
  const grad = ctx.createRadialGradient(AVA_X - 4, AVA_Y - 4, 2, AVA_X, AVA_Y, AVA_R);
  grad.addColorStop(0, user.avatarColor);
  grad.addColorStop(1, adjustColor(user.avatarColor, -40));
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(AVA_X, AVA_Y, AVA_R, 0, Math.PI * 2);
  ctx.fill();
  // Initial letter
  ctx.fillStyle = "#fff";
  ctx.font = "bold 14px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(user.name.charAt(0).toUpperCase(), AVA_X, AVA_Y);
  ctx.restore();

  // Name text
  const TXT_X = AVA_X + AVA_R + 9;
  ctx.save();
  ctx.fillStyle = "#0a0a0a";
  ctx.font = "bold 14.5px -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  const nameW = ctx.measureText(user.name).width;
  ctx.fillText(user.name, TXT_X, CY - 3);

  // Mute icon after name
  ctx.font = "12px sans-serif";
  ctx.fillStyle = "#666";
  ctx.fillText("🔕", TXT_X + nameW + 4, CY - 3);

  // Last seen
  ctx.font = "11.5px -apple-system, sans-serif";
  ctx.fillStyle = "#777";
  ctx.textBaseline = "top";
  const lastSeenOptions = [
    "last seen recently",
    "last seen 2 hours ago",
    "last seen today at 1:30 PM",
    "last seen yesterday",
    "last seen Jun 26 at 10:11 AM",
  ];
  const lsText = lastSeenOptions[Math.floor(Math.abs(parseInt(user.phone.replace(/\D/g,"").slice(-2) || "0") % lastSeenOptions.length))];
  ctx.fillText(lsText, TXT_X, CY + 4);
  ctx.restore();
}

// ─── Darken/lighten a hex color ───────────────────────────────────────────────
function adjustColor(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (n & 0xff) + amount));
  return `rgb(${r},${g},${b})`;
}

// ─── Bubble path helper ───────────────────────────────────────────────────────
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

// ─── Text wrap ────────────────────────────────────────────────────────────────
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

// ─── Message bubble ──────────────────────────────────────────────────────────
function drawBubble(
  ctx: CanvasRenderingContext2D,
  msg: Message,
  y: number
): number {
  const SPAD = 11, VPAD = 7, MAX_W = 260, LINE_H = 20, TIME_H = 16;
  const isSent = msg.sent;

  ctx.font = "15px -apple-system,'Segoe UI',sans-serif";
  const lines = wrapText(ctx, msg.text, MAX_W - SPAD * 2 - 46);

  ctx.font = "11px sans-serif";
  const timeW = ctx.measureText(msg.time).width + (isSent ? 20 : 0) + 6;

  ctx.font = "15px -apple-system,'Segoe UI',sans-serif";
  const maxLineW = Math.max(...lines.map((l) => ctx.measureText(l).width));
  const bubbleW  = Math.min(Math.max(maxLineW + SPAD * 2 + 4, timeW + SPAD * 2), MAX_W);
  const bubbleH  = VPAD + lines.length * LINE_H + TIME_H + VPAD - 2;
  const bx = isSent ? W - 10 - bubbleW : 10;

  // Shadow + fill
  ctx.save();
  ctx.shadowColor   = BUBBLE_SHD;
  ctx.shadowBlur    = 5;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = isSent ? SENT_BG : RECV_BG;
  bubblePath(ctx, bx, y, bubbleW, bubbleH, isSent);
  ctx.fill();
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;

  // Text
  ctx.fillStyle = "#111";
  ctx.font = "15px -apple-system,'Segoe UI',sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  lines.forEach((line, i) => ctx.fillText(line, bx + SPAD, y + VPAD + i * LINE_H));

  // Edited label
  if (msg.edited) {
    ctx.font = "italic 10px sans-serif";
    ctx.fillStyle = "#aaa";
    ctx.fillText("edited", bx + SPAD, y + VPAD + lines.length * LINE_H);
  }

  // Timestamp bottom-right
  const tY = y + bubbleH - TIME_H;
  ctx.font = "11px sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillStyle = isSent ? SENT_TIME : RECV_TIME;
  const tickOff = isSent ? 20 : 0;
  ctx.fillText(msg.time, bx + bubbleW - SPAD - tickOff, tY + 2);

  // Double ticks for sent
  if (isSent) {
    ctx.fillStyle = msg.read ? "#4fc3f7" : "#8ab88a";
    ctx.font = "bold 10px sans-serif";
    ctx.fillText("✓✓", bx + bubbleW - SPAD + 2, tY + 2);
  }

  ctx.restore();
  return bubbleH + 5;
}

// ─── Input bar ───────────────────────────────────────────────────────────────
function drawInputBar(ctx: CanvasRenderingContext2D) {
  const iy = H - INPUT_H - NAV_H;
  ctx.save();

  // White background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, iy, W, INPUT_H);

  // Thin top border
  ctx.strokeStyle = "#e8e8e8";
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(0, iy); ctx.lineTo(W, iy); ctx.stroke();

  // Emoji button
  ctx.font = "20px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🙂", 22, iy + INPUT_H / 2);

  // Message input field (grey pill)
  ctx.fillStyle = "#f0f0f0";
  rrect(ctx, 42, iy + 9, W - 42 - 52, INPUT_H - 18, 20);
  ctx.fill();

  ctx.fillStyle = "#bbb";
  ctx.font = "14px -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("Message", 58, iy + INPUT_H / 2);

  // Paperclip icon
  ctx.fillStyle = "#888";
  ctx.font = "19px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("📎", W - 40, iy + INPUT_H / 2);

  // Blue mic circle
  ctx.fillStyle = "#3390ec";
  ctx.shadowColor = "rgba(51,144,236,0.35)";
  ctx.shadowBlur  = 8;
  ctx.shadowOffsetY = 2;
  ctx.beginPath();
  ctx.arc(W - 17, iy + INPUT_H / 2, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;

  ctx.fillStyle = "#fff";
  ctx.font = "14px sans-serif";
  ctx.fillText("🎤", W - 17, iy + INPUT_H / 2 + 1);

  ctx.restore();
}

// ─── Android nav bar ─────────────────────────────────────────────────────────
function drawNavBar(ctx: CanvasRenderingContext2D) {
  const ny = H - NAV_H;
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.68)";
  ctx.fillRect(0, ny, W, NAV_H);
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "15px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("≡", W / 2 - 95, ny + NAV_H / 2);
  ctx.fillText("○", W / 2,      ny + NAV_H / 2);
  ctx.fillText("←", W / 2 + 95, ny + NAV_H / 2);
  ctx.restore();
}

// ─── Scroll-to-bottom button ─────────────────────────────────────────────────
function drawScrollBtn(ctx: CanvasRenderingContext2D) {
  const bx = W - 46, by = H - INPUT_H - NAV_H - 50;
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.shadowColor = "rgba(0,0,0,0.18)";
  ctx.shadowBlur  = 8;
  ctx.shadowOffsetY = 2;
  ctx.beginPath(); ctx.arc(bx, by, 17, 0, Math.PI * 2); ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "#555";
  ctx.font = "bold 14px sans-serif";
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

  // 1. Green gradient background (matching real Telegram green chat background)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0,    "#b2d4a8");
  bgGrad.addColorStop(0.45, "#6aab6a");
  bgGrad.addColorStop(1,    "#4a8a4a");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Doodle pattern overlay
  drawTelegramPattern(ctx);

  // 3. Status bar
  drawStatusBar(ctx, user.phone);

  // 4. Header (pill-style matching screenshot)
  drawHeader(ctx, user);

  // 5. Messages — draw as many as fit in the visible chat area
  let cursor = CHAT_TOP + 8;
  const visibleMsgs = messages.slice(-10);
  for (const msg of visibleMsgs) {
    const mh = drawBubble(ctx, msg, cursor);
    cursor += mh;
    if (cursor > CHAT_BOT - 10) break;
  }

  // 6. Scroll button
  drawScrollBtn(ctx);

  // 7. Input bar
  drawInputBar(ctx);

  // 8. Android nav bar
  drawNavBar(ctx);

  return canvas.toDataURL("image/png");
}
