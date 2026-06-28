import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { ChatFolder, Project, useAutomation } from "@/context/AutomationContext";
import { generateChatScreenshot } from "@/utils/generateScreenshot";
import { getRandomConversation, getUniqueRandomUsers } from "@/utils/randomData";

const COUNT_OPTIONS = [5, 10, 15, 20, 25, 30];

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function AutomationModal({ visible, onClose }: Props) {
  const { addProject } = useAutomation();
  const [screenshotCount, setScreenshotCount] = useState(20);
  const [projectName, setProjectName] = useState("Om");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [done, setDone] = useState(false);
  const [lastProjectId, setLastProjectId] = useState<string | null>(null);

  async function runAutomation() {
    if (running) return;
    setRunning(true);
    setDone(false);
    setProgress(0);

    const name = projectName.trim() || "Om";
    const users = getUniqueRandomUsers(screenshotCount);
    const chats: ChatFolder[] = [];

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      setProgressLabel(`Generating chat with ${user.name}...`);
      const messages = getRandomConversation(user);

      let dataUrl = "";
      if (Platform.OS === "web") {
        try {
          dataUrl = await generateChatScreenshot(user, messages, "You");
        } catch {
          dataUrl = "";
        }
      }

      chats.push({
        id: `chat_${Date.now()}_${i}`,
        user,
        messages,
        screenshots: dataUrl
          ? [{ id: `ss_${Date.now()}_${i}`, dataUrl, label: `${user.name} - Chat ${i + 1}` }]
          : [],
        createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });

      setProgress(Math.round(((i + 1) / users.length) * 100));
      await delay(60);
    }

    const project: Project = {
      id: `proj_${Date.now()}`,
      name,
      chats,
      createdAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      screenshotCount: chats.reduce((s, c) => s + c.screenshots.length, 0),
    };

    addProject(project);
    setLastProjectId(project.id);
    setRunning(false);
    setDone(true);
    setProgressLabel("All done!");
  }

  function handleClose() {
    setRunning(false);
    setDone(false);
    setProgress(0);
    setProgressLabel("");
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>

          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIconWrap}>
              <Ionicons name="flash" size={22} color="#fff" />
            </View>
            <View>
              <Text style={styles.title}>Automation</Text>
              <Text style={styles.subtitle}>Generate fake chat screenshots</Text>
            </View>
            <Pressable style={styles.closeBtn} onPress={handleClose}>
              <Feather name="x" size={20} color="#666" />
            </Pressable>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

            {/* Project Name */}
            <Text style={styles.sectionLabel}>Project Name</Text>
            <TextInput
              style={styles.nameInput}
              value={projectName}
              onChangeText={setProjectName}
              placeholder="e.g. Om"
              placeholderTextColor="#bbb"
              editable={!running}
            />

            {/* Screenshot Count */}
            <Text style={styles.sectionLabel}>Screenshots to Generate</Text>
            <View style={styles.countGrid}>
              {COUNT_OPTIONS.map((c) => (
                <Pressable
                  key={c}
                  style={[styles.countChip, screenshotCount === c && styles.countChipActive, running && styles.disabled]}
                  onPress={() => !running && setScreenshotCount(c)}
                >
                  <Text style={[styles.countChipText, screenshotCount === c && styles.countChipTextActive]}>
                    {c}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Info cards */}
            <View style={styles.infoRow}>
              <View style={styles.infoCard}>
                <Ionicons name="person" size={18} color="#6c5ce7" />
                <Text style={styles.infoCardNum}>{screenshotCount}</Text>
                <Text style={styles.infoCardLabel}>Random Users</Text>
              </View>
              <View style={styles.infoCard}>
                <Ionicons name="chatbubbles" size={18} color="#00b894" />
                <Text style={styles.infoCardNum}>10</Text>
                <Text style={styles.infoCardLabel}>Msgs / Chat</Text>
              </View>
              <View style={styles.infoCard}>
                <Ionicons name="image" size={18} color="#3390ec" />
                <Text style={styles.infoCardNum}>{screenshotCount}</Text>
                <Text style={styles.infoCardLabel}>Screenshots</Text>
              </View>
            </View>

            {/* Progress */}
            {(running || done) && (
              <View style={styles.progressCard}>
                <View style={styles.progressHeader}>
                  {running
                    ? <ActivityIndicator size="small" color="#3390ec" />
                    : <Ionicons name="checkmark-circle" size={20} color="#00b894" />
                  }
                  <Text style={styles.progressLabel}>
                    {running ? progressLabel : "✅ All screenshots generated!"}
                  </Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${progress}%` as any }]} />
                </View>
                <Text style={styles.progressPct}>{progress}%</Text>
              </View>
            )}

            {/* Run button */}
            {!done && (
              <Pressable
                style={[styles.runBtn, running && styles.runBtnDisabled]}
                onPress={runAutomation}
                disabled={running}
              >
                {running
                  ? <ActivityIndicator size="small" color="#fff" />
                  : <Ionicons name="flash" size={20} color="#fff" />
                }
                <Text style={styles.runBtnText}>
                  {running ? "Running..." : `Run Automation (${screenshotCount} screenshots)`}
                </Text>
              </Pressable>
            )}

            {done && (
              <View style={styles.doneActions}>
                <Pressable style={styles.doneAgainBtn} onPress={() => { setDone(false); setProgress(0); }}>
                  <Feather name="refresh-cw" size={16} color="#3390ec" />
                  <Text style={styles.doneAgainText}>Run Again</Text>
                </Pressable>
                <Pressable style={styles.doneCloseBtn} onPress={handleClose}>
                  <Ionicons name="folder-open" size={16} color="#fff" />
                  <Text style={styles.doneCloseBtnText}>View in Files</Text>
                </Pressable>
              </View>
            )}

          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "88%",
    paddingBottom: 34,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e0e0e0",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f0f0f0",
  },
  headerIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#f9a825",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0a0a0a",
    fontFamily: "Inter_700Bold",
  },
  subtitle: {
    fontSize: 12,
    color: "#888",
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  closeBtn: {
    marginLeft: "auto",
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
    fontFamily: "Inter_600SemiBold",
    marginBottom: 10,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  nameInput: {
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: "#0a0a0a",
    fontFamily: "Inter_400Regular",
    marginBottom: 18,
    backgroundColor: "#fafafa",
  },
  countGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },
  countChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    backgroundColor: "#fafafa",
    minWidth: 56,
    alignItems: "center",
  },
  countChipActive: {
    borderColor: "#3390ec",
    backgroundColor: "#eaf4ff",
  },
  countChipText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
    fontFamily: "Inter_600SemiBold",
  },
  countChipTextActive: {
    color: "#3390ec",
  },
  disabled: {
    opacity: 0.5,
  },
  infoRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#f8f9ff",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#eef0ff",
  },
  infoCardNum: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0a0a0a",
    fontFamily: "Inter_700Bold",
  },
  infoCardLabel: {
    fontSize: 10,
    color: "#888",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  progressCard: {
    backgroundColor: "#f8fffe",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0f7ee",
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 13,
    color: "#444",
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#3390ec",
    borderRadius: 3,
  },
  progressPct: {
    fontSize: 12,
    color: "#3390ec",
    fontFamily: "Inter_600SemiBold",
    textAlign: "right",
  },
  runBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9a825",
    borderRadius: 16,
    paddingVertical: 16,
    gap: 10,
    marginBottom: 10,
    shadowColor: "#f9a825",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  runBtnDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
  },
  runBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Inter_700Bold",
  },
  doneActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  doneAgainBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#3390ec",
  },
  doneAgainText: {
    fontSize: 14,
    color: "#3390ec",
    fontFamily: "Inter_600SemiBold",
  },
  doneCloseBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#3390ec",
  },
  doneCloseBtnText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
  },
});
