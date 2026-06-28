import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useProfile } from "@/context/ProfileContext";
import PatternSvg from "../assets/images/pattern.svg";

function PatternOverlay() {
  return (
    <View style={[StyleSheet.absoluteFillObject, { opacity: 0.14 }]} pointerEvents="none">
      <PatternSvg width="100%" height="100%" viewBox="0 0 1440 2960" preserveAspectRatio="xMidYMid slice" />
    </View>
  );
}

type EditField = { key: "name" | "phone" | "username" | "bio"; label: string; value: string };

const RECENT_MSGS = [
  { text: "HD se jyda slow", time: "1:38 PM", sent: false },
  { text: "ok", time: "1:37 PM", sent: true },
  { text: "H", time: "1:37 PM", sent: false },
  { text: "ye done ha ab mat boLna ok", time: "1:36 PM", sent: true },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile, updateProfile } = useProfile();
  const [editField, setEditField] = useState<EditField | null>(null);
  const [editValue, setEditValue] = useState("");

  async function handleAvatarPress() {
    if (Platform.OS === "web") {
      Alert.alert("Upload Photo", "Image upload works on the mobile app.");
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow photo access to upload an image.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      updateProfile({ avatarUri: result.assets[0].uri });
    }
  }

  function openEdit(key: EditField["key"], label: string) {
    setEditField({ key, label, value: profile[key] });
    setEditValue(profile[key]);
  }

  function saveEdit() {
    if (editField) {
      updateProfile({ [editField.key]: editValue.trim() || profile[editField.key] });
    }
    setEditField(null);
  }

  const infoRows: Array<{ icon: string; key: EditField["key"]; label: string; sub: string }> = [
    { icon: "phone", key: "phone", label: profile.phone, sub: "Mobile (tap to edit)" },
    { icon: "at-sign", key: "username", label: profile.username, sub: "Username (tap to edit)" },
    { icon: "info", key: "bio", label: profile.bio, sub: "Bio (tap to edit)" },
  ];

  return (
    <View style={styles.root}>
      <LinearGradient colors={["#b2d4a8", "#6aab6a", "#4a8a4a"]} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFillObject} />
      <PatternOverlay />

      <View style={[styles.topBar, { paddingTop: Platform.OS === "web" ? 44 : insets.top + 4 }]}>
        <Pressable style={styles.topBarBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>
        <Text style={styles.topBarTitle}>Profile</Text>
        <Pressable style={styles.topBarBtn}>
          <Feather name="more-vertical" size={22} color="#fff" />
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <Pressable onPress={handleAvatarPress} style={styles.avatarWrap}>
            <Image
              source={profile.avatarUri ? { uri: profile.avatarUri } : require("../assets/images/flash_avatar.jpg")}
              style={styles.avatarImg}
              contentFit="cover"
            />
            <View style={styles.cameraOverlay}>
              <Ionicons name="camera" size={20} color="#fff" />
              <Text style={styles.cameraText}>Upload</Text>
            </View>
          </Pressable>

          <Pressable onPress={() => openEdit("name", "Name")} style={styles.nameWrap}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Feather name="edit-2" size={14} color="rgba(255,255,255,0.8)" style={{ marginLeft: 6, marginTop: 4 }} />
          </Pressable>
          <Text style={styles.profileStatus}>last seen recently</Text>
        </View>

        <View style={styles.actionRow}>
          {[
            { icon: "chatbubble", label: "Message", action: () => router.push("/chat") },
            { icon: "call", label: "Call", action: () => {} },
            { icon: "videocam", label: "Video", action: () => {} },
            { icon: "search", label: "Search", action: () => {} },
          ].map((btn) => (
            <Pressable key={btn.label} style={styles.actionBtn} onPress={btn.action}>
              <View style={styles.actionIcon}>
                <Ionicons name={btn.icon as any} size={22} color="#3390ec" />
              </View>
              <Text style={styles.actionLabel}>{btn.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.card}>
          {infoRows.map((row, i) => (
            <Pressable key={row.key} style={[styles.infoRow, i > 0 && styles.infoRowBorder]} onPress={() => openEdit(row.key, row.sub.split(" ")[0])}>
              <Feather name={row.icon as any} size={20} color="#3390ec" style={styles.infoIcon} />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>{row.label}</Text>
                <Text style={styles.infoSub}>{row.sub}</Text>
              </View>
              <Feather name="edit-2" size={15} color="#bbb" />
            </Pressable>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="message-text-outline" size={18} color="#3390ec" />
            <Text style={styles.sectionTitle}>Recent Messages</Text>
          </View>
          {RECENT_MSGS.map((msg, i) => (
            <Pressable key={i} style={[styles.recentRow, i > 0 && styles.infoRowBorder]} onPress={() => router.push("/chat")}>
              <View style={[styles.recentDot, { backgroundColor: msg.sent ? "#d4f5b8" : "#fff" }]} />
              <Text style={styles.recentText} numberOfLines={1}>{msg.text}</Text>
              <Text style={styles.recentTime}>{msg.time}</Text>
              {msg.sent && <Ionicons name="checkmark-done" size={14} color="#3390ec" style={{ marginLeft: 2 }} />}
            </Pressable>
          ))}
          <Pressable style={styles.viewAllBtn} onPress={() => router.push("/chat")}>
            <Text style={styles.viewAllText}>View Full Chat →</Text>
          </Pressable>
        </View>

        <Pressable style={styles.openChatBtn} onPress={() => router.push("/chat")}>
          <Ionicons name="chatbubbles" size={20} color="#fff" />
          <Text style={styles.openChatText}>Open Chat</Text>
        </Pressable>
      </ScrollView>

      <Modal visible={!!editField} transparent animationType="fade" onRequestClose={() => setEditField(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setEditField(null)}>
          <Pressable style={styles.modalBox} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Edit {editField?.label}</Text>
            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              autoFocus
              placeholder={editField?.label}
              placeholderTextColor="#bbb"
              onSubmitEditing={saveEdit}
            />
            <View style={styles.modalBtns}>
              <Pressable style={styles.modalCancel} onPress={() => setEditField(null)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalSave} onPress={saveEdit}>
                <Text style={styles.modalSaveText}>Save</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingBottom: 8, justifyContent: "space-between" },
  topBarBtn: { padding: 8, borderRadius: 20, backgroundColor: "rgba(0,0,0,0.15)" },
  topBarTitle: { fontSize: 18, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 14, paddingTop: 10, gap: 14 },

  avatarSection: { alignItems: "center", paddingVertical: 10 },
  avatarWrap: { width: 110, height: 110, borderRadius: 55, overflow: "hidden", borderWidth: 3, borderColor: "#fff", marginBottom: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 8 },
  avatarImg: { width: "100%", height: "100%" },
  cameraOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.5)", paddingVertical: 7, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 4 },
  cameraText: { color: "#fff", fontSize: 11, fontFamily: "Inter_600SemiBold" },
  nameWrap: { flexDirection: "row", alignItems: "center" },
  profileName: { fontSize: 26, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold", textShadowColor: "rgba(0,0,0,0.3)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  profileStatus: { fontSize: 14, color: "rgba(255,255,255,0.85)", fontFamily: "Inter_400Regular", marginTop: 4 },

  actionRow: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 16, paddingVertical: 14, paddingHorizontal: 8, justifyContent: "space-around", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  actionBtn: { alignItems: "center", gap: 6 },
  actionIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#eaf4ff", alignItems: "center", justifyContent: "center" },
  actionLabel: { fontSize: 12, color: "#3390ec", fontFamily: "Inter_500Medium" },

  card: { backgroundColor: "#fff", borderRadius: 16, paddingVertical: 6, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#eee" },
  sectionTitle: { fontSize: 14, fontWeight: "600", color: "#1a1a1a", fontFamily: "Inter_600SemiBold" },

  infoRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14 },
  infoRowBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#f0f0f0" },
  infoIcon: { marginRight: 14 },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 15, color: "#0a0a0a", fontFamily: "Inter_400Regular" },
  infoSub: { fontSize: 12, color: "#888", marginTop: 2, fontFamily: "Inter_400Regular" },

  recentRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 11, gap: 10 },
  recentDot: { width: 10, height: 10, borderRadius: 5, borderWidth: 1, borderColor: "#ddd" },
  recentText: { flex: 1, fontSize: 14, color: "#1a1a1a", fontFamily: "Inter_400Regular" },
  recentTime: { fontSize: 11, color: "#999", fontFamily: "Inter_400Regular" },
  viewAllBtn: { paddingVertical: 12, alignItems: "center", borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#f0f0f0" },
  viewAllText: { fontSize: 14, color: "#3390ec", fontFamily: "Inter_600SemiBold" },

  openChatBtn: { backgroundColor: "#3390ec", borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, gap: 10, shadowColor: "#3390ec", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 5 },
  openChatText: { fontSize: 17, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center", padding: 24 },
  modalBox: { backgroundColor: "#fff", borderRadius: 20, padding: 24, width: "100%", maxWidth: 340, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
  modalTitle: { fontSize: 17, fontWeight: "700", color: "#0a0a0a", fontFamily: "Inter_700Bold", marginBottom: 14 },
  modalInput: { borderWidth: 1.5, borderColor: "#3390ec", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: "#0a0a0a", fontFamily: "Inter_400Regular", marginBottom: 18 },
  modalBtns: { flexDirection: "row", gap: 12 },
  modalCancel: { flex: 1, paddingVertical: 13, borderRadius: 12, backgroundColor: "#f0f0f0", alignItems: "center" },
  modalCancelText: { fontSize: 15, color: "#555", fontFamily: "Inter_600SemiBold" },
  modalSave: { flex: 1, paddingVertical: 13, borderRadius: 12, backgroundColor: "#3390ec", alignItems: "center" },
  modalSaveText: { fontSize: 15, color: "#fff", fontFamily: "Inter_600SemiBold" },
});
