import JSZip from "jszip";
import { generateChatScreenshot } from "./generateScreenshot";
import { getRandomConversation, getRandomUser } from "./randomData";

export type AutoMode = "light" | "dark" | "mix";

export type AutoProgress = {
  current: number;
  total: number;
  status: "idle" | "running" | "done" | "error";
  message: string;
};

export type AutoResult = {
  zipBlob: Blob;
  count: number;
  folderName: string;
};

export async function runAutomation(
  mode: AutoMode,
  count: number,
  projectName: string,
  onProgress: (p: AutoProgress) => void,
): Promise<AutoResult> {
  const zip = new JSZip();
  const folderName = projectName.trim() || `screenshots_${Date.now()}`;
  const folder = zip.folder(folderName)!;

  onProgress({ current: 0, total: count, status: "running", message: "Starting..." });

  for (let i = 0; i < count; i++) {
    const user = getRandomUser();
    const messages = getRandomConversation(user);

    let darkMode: boolean;
    if (mode === "light") darkMode = false;
    else if (mode === "dark") darkMode = true;
    else darkMode = Math.random() > 0.5;

    onProgress({
      current: i + 1,
      total: count,
      status: "running",
      message: `Generating ${i + 1}/${count} — ${user.name} (${darkMode ? "dark" : "light"})`,
    });

    const dataUrl = await generateChatScreenshot(user, messages, user.name, darkMode);

    const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
    const modeLabel = darkMode ? "dark" : "light";
    const filename = `chat_${String(i + 1).padStart(3, "0")}_${user.username.replace("@", "")}_${modeLabel}.png`;
    folder.file(filename, base64, { base64: true });

    await new Promise((r) => setTimeout(r, 80));
  }

  onProgress({ current: count, total: count, status: "running", message: "Packing ZIP..." });

  const zipBlob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });

  onProgress({ current: count, total: count, status: "done", message: `Done! ${count} screenshots ready.` });

  return { zipBlob, count, folderName };
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
