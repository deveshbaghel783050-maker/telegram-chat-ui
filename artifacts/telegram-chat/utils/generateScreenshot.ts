import { Message } from "@/context/ProfileContext";
// @ts-ignore
import html2canvas from "html2canvas";
import { RandomUser } from "./randomData";


const W = 390;
const H = 844;

const STATUS_H = 0;   // No status bar in automation screenshots
const HEADER_H = 72;
const INPUT_H  = 62;
const NAV_H    = 32;

// ─── Time seed per user ───────────────────────────────────────────────────────
const TIMES = ["5:55", "6:14", "7:45", "8:12", "9:03", "10:24", "11:07", "12:30"];
function seedTime(phone: string): string {
  const d = parseInt(phone.replace(/\D/g, "").slice(-2) || "0");
  return TIMES[d % TIMES.length];
}

const LAST_SEEN = [
  "last seen recently",
  "last seen 2 hours ago",
  "last seen today at 1:30 PM",
  "last seen yesterday",
  "last seen Jun 26 at 10:11 AM",
];
function seedLastSeen(phone: string): string {
  const d = Math.abs(parseInt(phone.replace(/\D/g, "").slice(-2) || "0"));
  return LAST_SEEN[d % LAST_SEEN.length];
}

// ─── Inline SVG icons (matching @expo/vector-icons used in /chat) ─────────────

const SVG_ARROW_BACK = `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.5 5L7.5 11L13.5 17" stroke="#1a1a1a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="7.5" y1="11" x2="18.5" y2="11" stroke="#1a1a1a" stroke-width="2.2" stroke-linecap="round"/>
</svg>`;

const SVG_PHONE = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.67 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.43 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.69a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
</svg>`;

const SVG_THREE_DOTS = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#1a1a1a" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="5"  r="1.5"/>
  <circle cx="12" cy="12" r="1.5"/>
  <circle cx="12" cy="19" r="1.5"/>
</svg>`;

const SVG_VOLUME_OFF = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <line x1="23" y1="9" x2="17" y2="15" stroke="#e53935" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="17" y1="9" x2="23" y2="15" stroke="#e53935" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

const SVG_SMILEY = `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="13" cy="13" r="11" stroke="#8a8a8a" stroke-width="1.7"/>
  <circle cx="9.5" cy="10.5" r="1.4" fill="#8a8a8a"/>
  <circle cx="16.5" cy="10.5" r="1.4" fill="#8a8a8a"/>
  <path d="M8.5 15.5 Q13 19.5 17.5 15.5" stroke="#8a8a8a" stroke-width="1.7" stroke-linecap="round" fill="none"/>
</svg>`;

const SVG_PAPERCLIP = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
</svg>`;

const SVG_MIC = `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="9" y="2" width="6" height="11" rx="3" fill="white"/>
  <path d="M5 10a7 7 0 0 0 14 0" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="12" y1="19" x2="12" y2="23" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="8" y1="23" x2="16" y2="23" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

const SVG_CHECK_DONE_READ = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1 12l5 5L18 5" stroke="#3390ec" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M7 12l5 5L23 5" stroke="#3390ec" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const SVG_CHECK_DONE_UNREAD = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1 12l5 5L18 5" stroke="#8ab88a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M7 12l5 5L23 5" stroke="#8ab88a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// ─── Status bar HTML ──────────────────────────────────────────────────────────
function buildStatusBar(phone: string): string {
  const time = seedTime(phone);
  return `
    <div style="position:absolute;top:0;left:0;right:0;height:${STATUS_H}px;display:flex;align-items:center;padding:0 14px;box-sizing:border-box;">
      <span style="color:#fff;font-size:13px;font-weight:700;font-family:'Inter_700Bold','Inter',sans-serif;">${time}</span>
    </div>`;
}

// ─── Header HTML ──────────────────────────────────────────────────────────────
function buildHeader(user: RandomUser): string {
  const initial = user.name.charAt(0).toUpperCase();
  const lastSeen = seedLastSeen(user.phone);
  return `
    <div style="position:absolute;top:${STATUS_H}px;left:0;right:0;height:${HEADER_H}px;display:flex;align-items:center;padding:0 10px;gap:8px;box-sizing:border-box;">

      <!-- Back circle -->
      <div style="width:48px;height:48px;border-radius:24px;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,0.13);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        ${SVG_ARROW_BACK}
      </div>

      <!-- Center pill -->
      <div style="flex:1;display:flex;align-items:center;background:#fff;border-radius:999px;padding:8px 14px 8px 8px;gap:10px;min-height:52px;box-shadow:0 1px 4px rgba(0,0,0,0.13);box-sizing:border-box;overflow:hidden;">
        <!-- Avatar -->
        <div style="width:36px;height:36px;border-radius:18px;background:${user.avatarColor};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <span style="color:#fff;font-size:16px;font-weight:700;font-family:'Inter_700Bold','Inter',sans-serif;">${initial}</span>
        </div>
        <!-- Name + status -->
        <div style="flex:1;overflow:hidden;">
          <div style="display:flex;align-items:center;">
            <span style="font-size:15px;font-weight:700;color:#0a0a0a;font-family:'Inter_700Bold','Inter',sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${user.name}</span>
          </div>
          <div style="font-size:12px;color:#777;font-family:'Inter_400Regular','Inter',sans-serif;margin-top:1px;">${lastSeen}</div>
        </div>
      </div>

      <!-- Right pill -->
      <div style="display:flex;align-items:center;background:#fff;border-radius:999px;padding:10px 6px;box-shadow:0 1px 4px rgba(0,0,0,0.13);">
        <div style="padding:2px 8px;display:flex;align-items:center;">${SVG_PHONE}</div>
        <div style="width:1px;height:18px;background:#e0e0e0;margin:0 2px;"></div>
        <div style="padding:2px 8px;display:flex;align-items:center;">${SVG_THREE_DOTS}</div>
      </div>

    </div>`;
}

// ─── Message bubble HTML ──────────────────────────────────────────────────────
function buildBubble(msg: Message): string {
  const sentBg   = "#dcf8c6";
  const recvBg   = "#ffffff";
  const bg       = msg.sent ? sentBg : recvBg;
  const timeCol  = msg.sent ? "#6a9a6a" : "#999";
  const br       = msg.sent
    ? "border-radius:18px;border-bottom-right-radius:4px;"
    : "border-radius:18px;border-bottom-left-radius:4px;";
  const align    = msg.sent ? "flex-end" : "flex-start";
  const tick     = msg.sent
    ? (msg.read ? SVG_CHECK_DONE_READ : SVG_CHECK_DONE_UNREAD)
    : "";

  const textHtml = msg.text
    ? `<div style="font-size:15px;line-height:20px;color:#0a0a0a;font-family:'Inter_400Regular','Inter',sans-serif;word-break:break-word;">${escHtml(msg.text)}</div>`
    : "";

  return `
    <div style="display:flex;justify-content:${align};padding:1px 8px;box-sizing:border-box;">
      <div style="max-width:82%;background:${bg};${br}padding:7px 10px 5px 10px;box-shadow:0 1px 2px rgba(0,0,0,0.08);box-sizing:border-box;">
        ${textHtml}
        <div style="display:flex;justify-content:flex-end;align-items:center;gap:2px;margin-top:2px;">
          <span style="font-size:11px;color:${timeCol};font-family:'Inter_400Regular','Inter',sans-serif;">${escHtml(msg.time)}</span>
          ${tick}
        </div>
      </div>
    </div>`;
}

// ─── Input bar HTML ───────────────────────────────────────────────────────────
function buildInputBar(): string {
  return `
    <div style="position:absolute;bottom:${NAV_H}px;left:0;right:0;height:${INPUT_H}px;display:flex;align-items:center;padding:0 10px;box-sizing:border-box;">
      <!-- Single pill — emoji | text | paperclip | mic circle — all inside (matches ChatInput.tsx) -->
      <div style="flex:1;display:flex;align-items:center;background:#fff;border-radius:999px;padding-left:6px;padding-right:4px;min-height:50px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <!-- Emoji button -->
        <div style="padding:4px 8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          ${SVG_SMILEY}
        </div>
        <!-- Placeholder text -->
        <div style="flex:1;font-size:16px;color:#b0b0b0;font-family:'Inter_400Regular','Inter',sans-serif;">Message</div>
        <!-- Paperclip -->
        <div style="padding:4px 8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          ${SVG_PAPERCLIP}
        </div>
        <!-- Blue mic circle — INSIDE pill (matching screen layout in ChatInput.tsx) -->
        <div style="width:42px;height:42px;border-radius:21px;background:#3390ec;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 6px rgba(51,144,236,0.35);">
          ${SVG_MIC}
        </div>
      </div>
    </div>`;
}

// ─── Nav bar HTML ─────────────────────────────────────────────────────────────
function buildNavBar(): string {
  return `
    <div style="position:absolute;bottom:0;left:0;right:0;height:${NAV_H}px;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:space-around;">
      <!-- Squares (recent apps) -->
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1" stroke="rgba(255,255,255,0.6)" stroke-width="1.5"/>
        <rect x="11" y="1" width="6" height="6" rx="1" stroke="rgba(255,255,255,0.6)" stroke-width="1.5"/>
        <rect x="1" y="11" width="6" height="6" rx="1" stroke="rgba(255,255,255,0.6)" stroke-width="1.5"/>
        <rect x="11" y="11" width="6" height="6" rx="1" stroke="rgba(255,255,255,0.6)" stroke-width="1.5"/>
      </svg>
      <!-- Home circle -->
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7.5" stroke="rgba(255,255,255,0.6)" stroke-width="1.5"/>
      </svg>
      <!-- Back chevron -->
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M11 4L6 9L11 14" stroke="rgba(255,255,255,0.6)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>`;
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ─── Filler messages to fill empty space ─────────────────────────────────────
const FILLER_MSGS: { sent: boolean; text: string }[] = [
  { sent: true,  text: "Theek hai yaar 👍" },
  { sent: false, text: "Haan bilkul" },
  { sent: true,  text: "Okay" },
  { sent: false, text: "Chal baat karte hain baad mein" },
  { sent: true,  text: "Sure, talk later!" },
  { sent: false, text: "Haan, bye 😊" },
];

function padMessages(messages: Message[], minCount: number): Message[] {
  if (messages.length >= minCount) return messages;
  const padded = [...messages];
  let fi = 0;
  const baseHour = 15;
  while (padded.length < minCount) {
    const f = FILLER_MSGS[fi % FILLER_MSGS.length];
    const idx = padded.length;
    padded.push({
      id: `filler_${idx}`,
      text: f.text,
      sent: f.sent,
      time: `${baseHour}:${(idx * 6) % 60 < 10 ? "0" : ""}${(idx * 6) % 60} PM`,
      read: f.sent,
    });
    fi++;
  }
  return padded;
}

// ─── Load pre-rendered pattern PNG → HTMLCanvasElement ───────────────────────
// Pattern embedded as base64 — no require(), no fetch(), always works in Metro web.
const PATTERN_DATA_URL = "data:image/png;base64,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";

async function renderPatternToCanvas(targetW: number, targetH: number): Promise<HTMLCanvasElement | null> {
  return new Promise<HTMLCanvasElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(null); return; }
      ctx.drawImage(img, 0, 0, targetW, targetH);
      resolve(canvas);
    };
    img.onerror = () => resolve(null);
    img.src = PATTERN_DATA_URL;
  });
}

// ─── Main builder ─────────────────────────────────────────────────────────────
function buildChatHtml(user: RandomUser, messages: Message[], patternPngUrl: string | null): string {
  const msgAreaTop    = HEADER_H;
  const msgAreaBottom = INPUT_H + NAV_H;

  const filled      = padMessages(messages, 14);
  const bubblesHtml = filled.map(buildBubble).join("");

  // patternPngUrl is a real PNG data URL — html2canvas renders this perfectly
  const patternHtml = patternPngUrl
    ? `<img src="${patternPngUrl}"
           style="position:absolute;inset:0;width:100%;height:100%;opacity:1;object-fit:cover;pointer-events:none;" />`
    : "";

  return `
    <!-- Solid green background matching chat.tsx (#7ab870) -->
    <div style="position:absolute;inset:0;background:#7ab870;"></div>

    <!-- Pattern overlay — real PNG rendered from SVG, html2canvas handles PNG perfectly -->
    ${patternHtml}

    <!-- Header -->
    ${buildHeader(user)}

    <!-- Messages area — flex-end so messages anchor at bottom, overflow hidden at top -->
    <div style="position:absolute;top:${msgAreaTop}px;left:0;right:0;bottom:${msgAreaBottom}px;
                display:flex;flex-direction:column;justify-content:flex-end;padding:8px 0 4px;
                overflow:hidden;box-sizing:border-box;">
      ${bubblesHtml}
    </div>

    <!-- Input bar -->
    ${buildInputBar()}

    <!-- Nav bar -->
    ${buildNavBar()}
  `;
}

// ─── Capture actual visible screen DOM → PNG (9:16) ─────────────────────────
// This captures whatever is rendered on screen right now — exact match guaranteed.
// patternElement is hidden temporarily because html2canvas can't render SVG.
export async function captureDomScreenshot(
  rootElement: HTMLElement,
  patternElement: HTMLElement | null,
): Promise<string> {
  const SCALE = 2;
  const W = rootElement.offsetWidth;
  const H = rootElement.offsetHeight;

  // Step 1: Pre-load pattern PNG in parallel — must finish before compositing
  const patternCanvas = await renderPatternToCanvas(W * SCALE, H * SCALE);

  // Step 2: Hide BOTH the green background View AND the SVG pattern so
  //         html2canvas captures chat UI with transparent background only.
  //         If we leave the green bg div visible, it paints over the pattern layer.
  const bgEl = document.getElementById("chat-bg");
  if (bgEl)      bgEl.style.visibility      = "hidden";
  if (patternElement) patternElement.style.visibility = "hidden";

  // Step 3: Wait one animation frame + extra buffer for DOM to repaint
  await new Promise<void>((r) => requestAnimationFrame(() => setTimeout(r, 200)));

  let chatCanvas: HTMLCanvasElement;
  try {
    chatCanvas = await html2canvas(rootElement, {
      width:  W,
      height: H,
      scale:  SCALE,
      useCORS:         true,
      allowTaint:      true,
      backgroundColor: null,   // transparent — so our composite bg shows through
      logging:         false,
    });
  } finally {
    // Restore immediately so screen flicker is minimal
    if (bgEl)      bgEl.style.visibility      = "";
    if (patternElement) patternElement.style.visibility = "";
  }

  // Step 4: Composite — green fill → pattern (0.55 opacity) → chat UI (transparent bg)
  const final = document.createElement("canvas");
  final.width  = W * SCALE;
  final.height = H * SCALE;
  const ctx = final.getContext("2d")!;

  // Layer 1: solid green base
  ctx.fillStyle = "#7ab870";
  ctx.fillRect(0, 0, final.width, final.height);

  // Layer 2: pattern doodles at 0.55 opacity
  if (patternCanvas) {
    ctx.globalAlpha = 0.55;
    ctx.drawImage(patternCanvas, 0, 0, final.width, final.height);
    ctx.globalAlpha = 1.0;
  }

  // Layer 3: chat UI (header + bubbles + input — transparent bg, pattern shows through)
  ctx.drawImage(chatCanvas, 0, 0);

  return final.toDataURL("image/jpeg", 0.95);
}

// ─── Main export (used by automation / bulk screenshots) ──────────────────────
export async function generateChatScreenshot(
  user: RandomUser,
  messages: Message[],
  _myName: string,
): Promise<string> {
  const SCALE = 2;

  // Step 1: Render the chat UI (NO pattern — pure HTML/CSS only)
  const container = document.createElement("div");
  container.style.cssText = [
    `position:fixed`,
    `left:-9999px`,
    `top:0`,
    `width:${W}px`,
    `height:${H}px`,
    `overflow:hidden`,
    `box-sizing:border-box`,
    `font-family:'Inter_400Regular','Inter',-apple-system,sans-serif`,
  ].join(";");

  // Pass PATTERN_DATA_URL directly so html2canvas renders green bg + pattern + chat in one shot.
  // Previously pattern was composited separately AFTER html2canvas, but the solid green
  // chat canvas was drawn on top and covered the pattern completely.
  container.innerHTML = buildChatHtml(user, messages, PATTERN_DATA_URL);
  document.body.appendChild(container);

  await document.fonts.ready;
  await new Promise<void>((r) => setTimeout(r, 120));

  let chatCanvas: HTMLCanvasElement;
  try {
    chatCanvas = await html2canvas(container, {
      width:  W,
      height: H,
      scale:  SCALE,
      useCORS:         true,
      allowTaint:      true,
      backgroundColor: null,   // HTML already has green bg div + pattern img
      logging:         false,
    });
  } finally {
    if (container.parentNode) document.body.removeChild(container);
  }

  return chatCanvas.toDataURL("image/jpeg", 0.95);
}
