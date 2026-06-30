import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AutoMode, downloadBlob, runAutomation } from "@/utils/automationRunner";

type CountOption = 30 | 40 | 50 | 60;
const COUNT_OPTIONS: CountOption[] = [30, 40, 50, 60];

const MODE_OPTIONS: { key: AutoMode; label: string; icon: string; desc: string; color: string }[] = [
  { key: "light", label: "Light Mode",  icon: "sunny",    desc: "All in green bg",   color: "#4caf50" },
  { key: "dark",  label: "Dark Mode",   icon: "moon",     desc: "All in dark navy",  color: "#2b5278" },
  { key: "mix",   label: "Mix",         icon: "shuffle",  desc: "Random light+dark", color: "#8e44ad" },
];

export default function AutomationScreen() {
  const insets = useSafeAreaInsets();

  const [mode, setMode]             = useState<AutoMode>("mix");
  const [count, setCount]           = useState<CountOption>(30);
  const [projectName, setProjectName] = useState("my_screenshots");
  const [running, setRunning]       = useState(false);
  const [progress, setProgress]     = useState({ current: 0, total: 0, message: "" });
  const [zipResult, setZipResult]   = useState<{ blob: Blob; filename: string } | null>(null);
  const cancelRef = useRef(false);

  async function handleStart() {
    if (Platform.OS !== "web") {
      alert("Automation works on web only.");
      return;
    }
    cancelRef.current = false;
    setRunning(true);
    setZipResult(null);

    try {
      const result = await runAutomation(mode, count, projectName, (p) => {
        setProgress({ current: p.current, total: p.total, message: p.message });
      });
      const filename = `${result.folderName}.zip`;
      setZipResult({ blob: result.zipBlob, filename });
    } catch (e: any) {
      alert("Error: " + (e?.message ?? String(e)));
    } finally {
      setRunning(false);
    }
  }

  function handleDownloadZip() {
    if (!zipResult) return;
    downloadBlob(zipResult.blob, zipResult.filename);
  }

  const pct = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 44 : insets.top + 4 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Batch Automation</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]} showsVerticalScrollIndicator={false}>

        {/* Project Name */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>📁  Project / Folder Name</Text>
          <TextInput
            style={styles.nameInput}
            value={projectName}
            onChangeText={setProjectName}
            placeholder="my_screenshots"
            placeholderTextColor="#aaa"
            editable={!running}
          />
        </View>

        {/* Mode Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>🎨  Screenshot Mode</Text>
          <View style={styles.modeRow}>
            {MODE_OPTIONS.map((opt) => {
              const active = mode === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  style={[styles.modeCard, active && { borderColor: opt.color, backgroundColor: opt.color + "18" }]}
                  onPress={() => !running && setMode(opt.key)}
                >
                  <Ionicons name={opt.icon as any} size={22} color={active ? opt.color : "#999"} />
                  <Text style={[styles.modeCardLabel, active && { color: opt.color }]}>{opt.label}</Text>
                  <Text style={styles.modeCardDesc}>{opt.desc}</Text>
                  {active && (
                    <View style={[styles.modeCheck, { backgroundColor: opt.color }]}>
                      <Ionicons name="checkmark" size={11} color="#fff" />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Count Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>📸  How many screenshots?</Text>
          <View style={styles.countRow}>
            {COUNT_OPTIONS.map((c) => {
              const active = count === c;
              return (
                <Pressable
                  key={c}
                  style={[styles.countPill, active && styles.countPillActive]}
                  onPress={() => !running && setCount(c)}
                >
                  <Text style={[styles.countPillText, active && styles.countPillTextActive]}>{c}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.countHint}>Each screenshot = unique random user + unique conversation</Text>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Ionicons name="information-circle" size={18} color="#3390ec" />
          <Text style={styles.summaryText}>
            Will generate{" "}
            <Text style={{ fontWeight: "700", color: "#3390ec" }}>{count} screenshots</Text>{" "}
            with <Text style={{ fontWeight: "700", color: "#3390ec" }}>{mode === "mix" ? "random light & dark" : mode + " mode"}</Text> background,
            pack them into <Text style={{ fontWeight: "700", color: "#3390ec" }}>{projectName || "my_screenshots"}.zip</Text>
          </Text>
        </View>

        {/* Start Button */}
        {!running && !zipResult && (
          <Pressable style={styles.startBtn} onPress={handleStart}>
            <Ionicons name="play-circle" size={22} color="#fff" />
            <Text style={styles.startBtnText}>Start Automation</Text>
          </Pressable>
        )}

        {/* Progress */}
        {running && (
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <ActivityIndicator color="#3390ec" />
              <Text style={styles.progressTitle}>Running…</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${pct}%` as any }]} />
            </View>
            <Text style={styles.progressLabel}>{progress.message}</Text>
            <Text style={styles.progressPct}>{Math.round(pct)}%  ({progress.current} / {progress.total})</Text>
          </View>
        )}

        {/* Done — Download ZIP */}
        {zipResult && (
          <View style={styles.doneCard}>
            <Ionicons name="checkmark-circle" size={40} color="#4caf50" />
            <Text style={styles.doneTitle}>Done! 🎉</Text>
            <Text style={styles.doneSubtitle}>{count} screenshots ready inside {zipResult.filename}</Text>

            <Pressable style={styles.downloadZipBtn} onPress={handleDownloadZip}>
              <Ionicons name="download" size={20} color="#fff" />
              <Text style={styles.downloadZipText}>Download ZIP ({count} files)</Text>
            </Pressable>

            <Pressable style={styles.runAgainBtn} onPress={() => { setZipResult(null); setProgress({ current: 0, total: 0, message: "" }); }}>
              <Text style={styles.runAgainText}>Run Again</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f0f2f5" },

  header: { backgroundColor: "#3390ec", flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingBottom: 12, justifyContent: "space-between" },
  backBtn: { padding: 8, borderRadius: 20, width: 38, height: 38, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 16 },

  section: { gap: 10 },
  sectionLabel: { fontSize: 13, fontWeight: "700", color: "#555", fontFamily: "Inter_700Bold", letterSpacing: 0.3 },

  nameInput: { backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, color: "#111", fontFamily: "Inter_400Regular", borderWidth: 1.5, borderColor: "#e0e0e0" },

  modeRow: { flexDirection: "row", gap: 10 },
  modeCard: { flex: 1, backgroundColor: "#fff", borderRadius: 14, padding: 12, alignItems: "center", gap: 6, borderWidth: 2, borderColor: "#e8e8e8", position: "relative" },
  modeCardLabel: { fontSize: 12, fontWeight: "700", color: "#666", fontFamily: "Inter_700Bold", textAlign: "center" },
  modeCardDesc: { fontSize: 10, color: "#aaa", fontFamily: "Inter_400Regular", textAlign: "center" },
  modeCheck: { position: "absolute", top: 6, right: 6, width: 18, height: 18, borderRadius: 9, alignItems: "center", justifyContent: "center" },

  countRow: { flexDirection: "row", gap: 10 },
  countPill: { flex: 1, paddingVertical: 14, backgroundColor: "#fff", borderRadius: 12, alignItems: "center", borderWidth: 2, borderColor: "#e8e8e8" },
  countPillActive: { backgroundColor: "#3390ec", borderColor: "#3390ec" },
  countPillText: { fontSize: 18, fontWeight: "700", color: "#666", fontFamily: "Inter_700Bold" },
  countPillTextActive: { color: "#fff" },
  countHint: { fontSize: 11.5, color: "#999", fontFamily: "Inter_400Regular" },

  summaryCard: { backgroundColor: "#e8f1fd", borderRadius: 14, padding: 14, flexDirection: "row", gap: 10, alignItems: "flex-start" },
  summaryText: { flex: 1, fontSize: 13, color: "#333", fontFamily: "Inter_400Regular", lineHeight: 19 },

  startBtn: { backgroundColor: "#3390ec", borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, gap: 10, shadowColor: "#3390ec", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 6 },
  startBtnText: { fontSize: 16, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" },

  progressCard: { backgroundColor: "#fff", borderRadius: 16, padding: 20, gap: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  progressHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  progressTitle: { fontSize: 16, fontWeight: "700", color: "#333", fontFamily: "Inter_700Bold" },
  progressBarBg: { height: 8, backgroundColor: "#e8e8e8", borderRadius: 4, overflow: "hidden" },
  progressBarFill: { height: "100%", backgroundColor: "#3390ec", borderRadius: 4 },
  progressLabel: { fontSize: 13, color: "#555", fontFamily: "Inter_400Regular" },
  progressPct: { fontSize: 12, color: "#999", fontFamily: "Inter_400Regular" },

  doneCard: { backgroundColor: "#fff", borderRadius: 20, padding: 24, alignItems: "center", gap: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 5 },
  doneTitle: { fontSize: 24, fontWeight: "700", color: "#111", fontFamily: "Inter_700Bold" },
  doneSubtitle: { fontSize: 13, color: "#666", fontFamily: "Inter_400Regular", textAlign: "center" },
  downloadZipBtn: { marginTop: 8, backgroundColor: "#4caf50", borderRadius: 14, flexDirection: "row", alignItems: "center", paddingVertical: 15, paddingHorizontal: 28, gap: 10, shadowColor: "#4caf50", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 5, width: "100%" as any, justifyContent: "center" },
  downloadZipText: { fontSize: 15, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" },
  runAgainBtn: { paddingVertical: 12, paddingHorizontal: 24 },
  runAgainText: { fontSize: 14, color: "#3390ec", fontFamily: "Inter_600SemiBold" },
});
