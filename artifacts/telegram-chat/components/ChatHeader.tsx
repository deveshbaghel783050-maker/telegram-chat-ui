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
        <Pressable style={styles.pill} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
        </Pressable>

        <View style={styles.centerRow}>
          <View style={styles.avatarWrap}>
            <Image
              source={require("../assets/images/flash_avatar.jpg")}
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.avatarLabel}>
              <Text style={styles.avatarLabelText}>FLASH</Text>
            </View>
          </View>

          <View style={styles.info}>
            <Text style={styles.status}>last seen recently</Text>
          </View>

          <Pressable style={styles.muteBtn}>
            <MaterialIcons name="volume-off" size={20} color="#555" />
          </Pressable>
        </View>

        <View style={styles.pill}>
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
    paddingBottom: 8,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 58,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  pillAction: {
    paddingHorizontal: 6,
    paddingVertical: 2,
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
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
  },
  avatarLabel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingVertical: 2,
    alignItems: "center",
  },
  avatarLabelText: {
    color: "#ffffff",
    fontSize: 8,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.3,
  },
  info: {
    flex: 1,
  },
  status: {
    fontSize: 14,
    color: "#1a1a1a",
    fontFamily: "Inter_400Regular",
  },
  muteBtn: {
    padding: 4,
  },
});
