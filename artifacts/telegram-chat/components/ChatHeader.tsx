import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useProfile } from "@/context/ProfileContext";

export default function ChatHeader() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 44 : insets.top;
  const { theirName, theirAvatarUri } = useProfile();

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.inner}>
        {/* Back button */}
        <Pressable style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>

        {/* Avatar + Name/Status */}
        <Pressable style={styles.centerBlock} onPress={() => router.back()}>
          <View style={styles.avatarWrap}>
            <Image
              source={
                theirAvatarUri
                  ? { uri: theirAvatarUri }
                  : require("../assets/images/flash_avatar.jpg")
              }
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.onlineDot} />
          </View>
          <View style={styles.textBlock}>
            <View style={styles.nameRow}>
              <Text style={styles.nameText} numberOfLines={1}>{theirName}</Text>
              <MaterialIcons name="volume-off" size={16} color="rgba(255,255,255,0.7)" style={{ marginLeft: 4 }} />
            </View>
            <Text style={styles.statusText}>last seen recently</Text>
          </View>
        </Pressable>

        {/* Right action buttons */}
        <View style={styles.rightBtns}>
          <Pressable style={styles.iconBtn}>
            <Feather name="phone" size={20} color="#fff" />
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
    gap: 4,
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
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 4,
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  onlineDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4cd964",
    borderWidth: 2,
    borderColor: "#6aab6a",
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
  },
});
