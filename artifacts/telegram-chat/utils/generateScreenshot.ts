import { Message } from "@/context/ProfileContext";
import { RandomUser } from "./randomData";

const W = 390;
const H = 780;
const BUBBLE_MAX = 260;
const FONT_SIZE = 14;
const TIME_FONT = 11;
const PADDING = 12;
const BUBBLE_PADDING_H = 12;
const BUBBLE_PADDING_V = 8;
const BUBBLE_RADIUS = 16;

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (ctx.measureText(test).width > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  tl: number, tr: number, br: number, bl: number
) {
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
  ctx.lineTo(x + w, y + h - br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
  ctx.lineTo(x + bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - bl);
  ctx.lineTo(x, y + tl);
  ctx.quadraticCurveTo(x, y, x + tl, y);
  ctx.closePath();
}

export async function generateChatScreenshot(
  user: RandomUser,
  messages: Message[],
  myName: string
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#b2d4a8");
  grad.addColorStop(0.5, "#6aab6a");
  grad.addColorStop(1, "#4a8a4a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Subtle pattern dots
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  for (let px = 0; px < W; px += 22) {
    for (let py = 0; py < H; py += 22) {
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Header
  const HEADER_H = 80;
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fillRect(0, 0, W, HEADER_H);

  // Back arrow
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "bold 22px sans-serif";
  ctx.fillText("←", 12, 52);

  // Avatar circle
  const AVA_X = 54, AVA_Y = 40, AVA_R = 20;
  ctx.fillStyle = user.avatarColor;
  ctx.beginPath();
  ctx.arc(AVA_X, AVA_Y, AVA_R, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 16px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(user.name.charAt(0), AVA_X, AVA_Y + 6);
  ctx.textAlign = "left";

  // Name & status
  ctx.fillStyle = "#fff";
  ctx.font = "bold 15px sans-serif";
  ctx.fillText(user.name, 82, 36);
  ctx.font = "12px sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillText("last seen recently", 82, 54);

  // Phone & more icons (right side)
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "20px sans-serif";
  ctx.fillText("📞", W - 76, 48);
  ctx.fillText("⋮", W - 32, 50);

  // Status bar (top)
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "11px sans-serif";
  ctx.fillText("9:41", 14, 16);
  ctx.textAlign = "right";
  ctx.fillText("●●● ▲", W - 10, 16);
  ctx.textAlign = "left";

  // Messages
  let cursorY = HEADER_H + 12;
  const visibleMessages = messages.slice(-8); // show last 8 msgs

  for (const msg of visibleMessages) {
    const isSent = msg.sent;
    ctx.font = `${FONT_SIZE}px sans-serif`;
    const lines = wrapText(ctx, msg.text, BUBBLE_MAX - BUBBLE_PADDING_H * 2 - 30);
    const lineH = FONT_SIZE + 5;
    const textH = lines.length * lineH;
    const bubbleH = textH + BUBBLE_PADDING_V * 2 + 16; // extra for time
    const textW = Math.min(
      Math.max(...lines.map((l) => ctx.measureText(l).width)) + BUBBLE_PADDING_H * 2 + 36,
      BUBBLE_MAX
    );

    const bubbleX = isSent ? W - PADDING - textW : PADDING;
    const bubbleY = cursorY;

    // Shadow
    ctx.shadowColor = "rgba(0,0,0,0.12)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;

    // Bubble
    ctx.fillStyle = isSent ? "#d4f5b8" : "#ffffff";
    const r = BUBBLE_RADIUS;
    const tr = isSent ? 4 : r;
    const tl = isSent ? r : 4;
    roundRect(ctx, bubbleX, bubbleY, textW, bubbleH, tl, tr, r, r);
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    // Text
    ctx.fillStyle = "#0a0a0a";
    ctx.font = `${FONT_SIZE}px sans-serif`;
    lines.forEach((line, li) => {
      ctx.fillText(line, bubbleX + BUBBLE_PADDING_H, bubbleY + BUBBLE_PADDING_V + FONT_SIZE + li * lineH);
    });

    // Time + checkmarks
    ctx.font = `${TIME_FONT}px sans-serif`;
    ctx.fillStyle = isSent ? "#7ab65a" : "#aaa";
    const timeW = ctx.measureText(msg.time).width;
    const timeX = bubbleX + textW - BUBBLE_PADDING_H - timeW - (isSent ? 18 : 0);
    ctx.fillText(msg.time, timeX, bubbleY + bubbleH - 6);

    if (isSent) {
      ctx.fillStyle = "#4a9d4a";
      ctx.font = "11px sans-serif";
      ctx.fillText("✓✓", bubbleX + textW - BUBBLE_PADDING_H - 4, bubbleY + bubbleH - 6);
    }

    cursorY += bubbleH + 6;
    if (cursorY > H - 80) break;
  }

  // Input bar at bottom
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fillRect(0, H - 60, W, 60);

  ctx.fillStyle = "#f0f0f0";
  roundRect(ctx, 12, H - 50, W - 100, 38, 20, 20, 20, 20);
  ctx.fill();

  ctx.fillStyle = "#aaa";
  ctx.font = "14px sans-serif";
  ctx.fillText("Message", 32, H - 26);

  // Send button circle
  ctx.fillStyle = "#3390ec";
  ctx.beginPath();
  ctx.arc(W - 34, H - 30, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 16px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("➤", W - 34, H - 23);
  ctx.textAlign = "left";

  return canvas.toDataURL("image/png");
}
