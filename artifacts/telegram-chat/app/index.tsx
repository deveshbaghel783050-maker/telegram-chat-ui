import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PatternSvg from "../assets/images/pattern.svg";

function PatternOverlay() {
  return (
    <View
      style={[StyleSheet.absoluteFillObject, { opacity: 0.14 }]}
      pointerEvents="none"
    >
      <PatternSvg
        width="100%"
        height="100%"
        viewBox="0 0 1440 2960"
        preserveAspectRatio="xMidYMid slice"
      />
    </View>
  );
}

const INFO_ROWS = [
  { icon: "phone", label: "+91 84389 52382", sub: "Mobile" },
  { icon: "at-sign", label: "@flash_user", sub: "Username" },
  { icon: "info", label: "Hey there! I am using Telegram.", sub: "Bio" },
];

const RECENT_MSGS = [
  { text: "HD se jyda slow", time: "1:38 PM", sent: false },
  { text: "ok", time: "1:37 PM", sent: true },
  { text: "H", time: "1:37 PM", sent: false },
  { text: "ye done ha ab mat boLna ok", time: "1:36 PM", sent: true },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  function handleUploadPress() {
    Alert.alert(
      "Change Profile Photo",
      "Choose an option",
      [
        { text: "Upload Photo", onPress: () => {} },
        { text: "Cancel", style: "cancel" },
      ]
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#b2d4a8", "#6aab6a", "#4a8a4a"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFillObject}
      />
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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <Pressable onPress={handleUploadPress} style={styles.avatarWrap}>
            <Image
              source={
                avatarUri
                  ? { uri: avatarUri }
                  : require("../assets/images/flash_avatar.jpg")
              }
              style={styles.avatarImg}
              contentFit="cover"
            />
            <View style={styles.cameraOverlay}>
              <Ionicons name="camera" size={22} color="#fff" />
            </View>
          </Pressable>
          <Text style={styles.profileName}>FLASH</Text>
          <Text style={styles.profileStatus}>last seen recently</Text>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            style={styles.actionBtn}
            onPress={() => router.push("/chat")}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="chatbubble" size={22} color="#3390ec" />
            </View>
            <Text style={styles.actionLabel}>Message</Text>
          </Pressable>

          <Pressable style={styles.actionBtn}>
            <View style={styles.actionIcon}>
              <Feather name="phone" size={22} color="#3390ec" />
            </View>
            <Text style={styles.actionLabel}>Call</Text>
          </Pressable>

          <Pressable style={styles.actionBtn}>
            <View style={styles.actionIcon}>
              <Feather name="video" size={22} color="#3390ec" />
            </View>
            <Text style={styles.actionLabel}>Video</Text>
          </Pressable>

          <Pressable style={styles.actionBtn}>
            <View style={styles.actionIcon}>
              <MaterialIcons name="search" size={22} color="#3390ec" />
            </View>
            <Text style={styles.actionLabel}>Search</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          {INFO_ROWS.map((row, i) => (
            <View key={row.label} style={[styles.infoRow, i > 0 && styles.infoRowBorder]}>
              <Feather name={row.icon as any} size={20} color="#3390ec" style={styles.infoIcon} />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>{row.label}</Text>
                <Text style={styles.infoSub}>{row.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="message-text-outline" size={18} color="#3390ec" />
            <Text style={styles.sectionTitle}>Recent Messages</Text>
          </View>
          {RECENT_MSGS.map((msg, i) => (
            <Pressable
              key={i}
              style={[styles.recentRow, i > 0 && styles.infoRowBorder]}
              onPress={() => router.push("/chat")}
            >
              <View style={[styles.recentDot, { backgroundColor: msg.sent ? "#d4f5b8" : "#fff" }]} />
              <Text style={styles.recentText} numberOfLines={1}>{msg.text}</Text>
              <Text style={styles.recentTime}>{msg.time}</Text>
              {msg.sent && (
                <Ionicons name="checkmark-done" size={14} color="#3390ec" style={{ marginLeft: 2 }} />
              )}
            </Pressable>
          ))}
          <Pressable style={styles.viewAllBtn} onPress={() => router.push("/chat")}>
            <Text style={styles.viewAllText}>View Full Chat →</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.openChatBtn}
          onPress={() => router.push("/chat")}
        >
          <Ionicons name="chatbubbles" size={20} color="#fff" />
          <Text style={styles.openChatText}>Open Chat</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 8,
    justifyContent: "space-between",
  },
  topBarBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Inter_700Bold",
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 14, paddingTop: 10, gap: 14 },

  avatarSection: {
    alignItems: "center",
    paddingVertical: 10,
  },
  avatarWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  cameraOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingVertical: 7,
    alignItems: "center",
  },
  profileName: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Inter_700Bold",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  profileStatus: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },

  actionRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  actionBtn: { alignItems: "center", gap: 6 },
  actionIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#eaf4ff",
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: 12,
    color: "#3390ec",
    fontFamily: "Inter_500Medium",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    fontFamily: "Inter_600SemiBold",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  infoRowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#f0f0f0",
  },
  infoIcon: { marginRight: 14 },
  infoText: { flex: 1 },
  infoLabel: {
    fontSize: 15,
    color: "#0a0a0a",
    fontFamily: "Inter_400Regular",
  },
  infoSub: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
    fontFamily: "Inter_400Regular",
  },

  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 11,
    gap: 10,
  },
  recentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  recentText: {
    flex: 1,
    fontSize: 14,
    color: "#1a1a1a",
    fontFamily: "Inter_400Regular",
  },
  recentTime: {
    fontSize: 11,
    color: "#999",
    fontFamily: "Inter_400Regular",
  },
  viewAllBtn: {
    paddingVertical: 12,
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#f0f0f0",
  },
  viewAllText: {
    fontSize: 14,
    color: "#3390ec",
    fontFamily: "Inter_600SemiBold",
  },

  openChatBtn: {
    backgroundColor: "#3390ec",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
    shadowColor: "#3390ec",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  openChatText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Inter_700Bold",
  },
});
