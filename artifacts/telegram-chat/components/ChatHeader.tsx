import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useProfile } from "@/context/ProfileContext";

export default function ChatHeader() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 8 : insets.top;
  const { theirName, theirAvatarUri, clearMessages } = useProfile();

  const initial = theirName.charAt(0).toUpperCase();

  function handleClearChat() {
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

        {/* Back button — white circle */}
        <Pressable style={styles.backCircle} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
        </Pressable>

        {/* Center pill: avatar/initial + name + mute + last seen */}
        <Pressable style={styles.centerPill} onPress={() => router.back()}>
          {theirAvatarUri ? (
            <Image
              source={{ uri: theirAvatarUri }}
              style={styles.avatarImg}
              contentFit="cover"
            />
          ) : (
            <View style={styles.initialCircle}>
              <Text style={styles.initialText}>{initial}</Text>
            </View>
          )}

          <View style={styles.textBlock}>
            <View style={styles.nameRow}>
              <Text style={styles.nameText} numberOfLines={1}>{theirName}</Text>
              <MaterialIcons name="volume-off" size={16} color="#666" style={{ marginLeft: 4 }} />
            </View>
            <Text style={styles.statusText} numberOfLines={1}>last seen recently</Text>
          </View>
        </Pressable>

        {/* Right pill: phone + more */}
        <View style={styles.rightPill}>
          <Pressable style={styles.pillBtn}>
            <Feather name="phone" size={20} color="#1a1a1a" />
          </Pressable>
          <View style={styles.pillDivider} />
          <Pressable style={styles.pillBtn} onPress={handleClearChat}>
            <Feather name="more-vertical" size={20} color="#1a1a1a" />
          </Pressable>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  backCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },

  centerPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingLeft: 8,
    paddingRight: 14,
    paddingVertical: 8,
    gap: 10,
    minHeight: 52,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },

  avatarImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    flexShrink: 0,
  },
  initialCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3390ec",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  initialText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },

  textBlock: {
    flex: 1,
    gap: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0a0a0a",
    fontFamily: "Inter_700Bold",
  },
  statusText: {
    fontSize: 12,
    color: "#777",
    fontFamily: "Inter_400Regular",
  },

  rightPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  pillBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  pillDivider: {
    width: 1,
    height: 18,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 2,
  },
});
