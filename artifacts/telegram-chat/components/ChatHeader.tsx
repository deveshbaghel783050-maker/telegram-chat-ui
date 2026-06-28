import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatHeader() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 44 : insets.top;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.inner}>
        <Pressable style={styles.pillLeft} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
        </Pressable>

        <View style={styles.centerRow}>
          <View style={styles.avatarWrap}>
            <Image
              source={require("../assets/images/flash_avatar.jpg")}
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.flashBadge}>
              <Text style={styles.flashText}>FLASH</Text>
            </View>
          </View>

          <Text style={styles.statusText}>last seen recently</Text>

          <Pressable style={styles.muteBtn}>
            <MaterialIcons name="volume-off" size={21} color="#333" />
          </Pressable>
        </View>

        <View style={styles.pillRight}>
          <Pressable style={styles.pillAction}>
            <Feather name="phone" size={20} color="#1a1a1a" />
          </Pressable>
          <View style={styles.pillDivider} />
          <Pressable style={styles.pillAction}>
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
    minHeight: 62,
  },

  pillLeft: {
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.13,
    shadowRadius: 4,
    elevation: 3,
  },

  pillRight: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.13,
    shadowRadius: 4,
    elevation: 3,
  },
  pillAction: {
    paddingHorizontal: 6,
  },
  pillDivider: {
    width: 1,
    height: 18,
    backgroundColor: "#ddd",
    marginHorizontal: 2,
  },

  centerRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  avatarWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: "hidden",
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.9)",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  flashBadge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.52)",
    paddingVertical: 3,
    alignItems: "center",
  },
  flashText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },

  statusText: {
    flex: 1,
    fontSize: 14,
    color: "#111",
    fontFamily: "Inter_400Regular",
  },

  muteBtn: {
    padding: 4,
  },
});
