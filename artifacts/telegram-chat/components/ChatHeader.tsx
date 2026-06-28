import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useProfile } from "@/context/ProfileContext";

export default function ChatHeader() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 44 : insets.top;
  const { theirName, clearMessages } = useProfile();
  const [showMenu, setShowMenu] = useState(false);

  function handleClearChat() {
    setShowMenu(false);
    if (Platform.OS === "web") {
      clearMessages();
      return;
    }
    Alert.alert(
      "Clear Chat",
      "All messages will be deleted. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: clearMessages },
      ]
    );
  }

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.inner}>
        {/* Back button */}
        <Pressable style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>

        {/* Name + Status (no avatar image) */}
        <Pressable style={styles.centerBlock} onPress={() => router.back()}>
          <View style={styles.textBlock}>
            <View style={styles.nameRow}>
              <Text style={styles.nameText} numberOfLines={1}>{theirName}</Text>
              <MaterialIcons name="volume-off" size={16} color="rgba(255,255,255,0.7)" style={{ marginLeft: 4 }} />
            </View>
            <Text style={styles.statusText}>last seen recently</Text>
          </View>
        </Pressable>

        {/* Right buttons */}
        <View style={styles.rightBtns}>
          <Pressable style={styles.iconBtn}>
            <Feather name="phone" size={20} color="#fff" />
          </Pressable>

          {/* Clear Chat button */}
          <Pressable style={styles.clearBtn} onPress={handleClearChat}>
            <Feather name="trash-2" size={15} color="#fff" />
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>

          <Pressable style={styles.iconBtn} onPress={() => router.push("/editor")}>
            <Feather name="more-vertical" size={20} color="#fff" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    minHeight: 52,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  centerBlock: {
    flex: 1,
    paddingHorizontal: 6,
    justifyContent: "center",
  },
  textBlock: {
    gap: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Inter_700Bold",
  },
  statusText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Inter_400Regular",
  },
  rightBtns: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  clearText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
});
