import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useProfile } from "@/context/ProfileContext";

const AVATAR = 56;

export default function ChatHeader() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 44 : insets.top;
  const { profile } = useProfile();

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.inner}>
        <Pressable style={styles.backCircle} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
        </Pressable>

        <View style={styles.centerPillWrap}>
          <View style={styles.centerPill}>
            <View style={styles.pillTextBlock}>
              <View style={styles.nameRow}>
                <Text style={styles.nameText} numberOfLines={1}>{profile.name}</Text>
                <MaterialIcons name="volume-off" size={18} color="#555" style={styles.muteIcon} />
              </View>
              <Text style={styles.statusText} numberOfLines={1}>last seen recently</Text>
            </View>
          </View>

          <Pressable style={styles.avatarAbsolute} onPress={() => router.back()}>
            <Image
              source={
                profile.avatarUri
                  ? { uri: profile.avatarUri }
                  : require("../assets/images/flash_avatar.jpg")
              }
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.flashBadge}>
              <Text style={styles.flashText}>{profile.name}</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.rightPill}>
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
  container: { paddingHorizontal: 10, paddingBottom: 10 },
  inner: { flexDirection: "row", alignItems: "center", gap: 8, minHeight: 64 },

  backCircle: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#ffffff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 3 },

  centerPillWrap: { flex: 1, position: "relative", height: 56, justifyContent: "center" },
  centerPill: { flex: 1, backgroundColor: "#ffffff", borderRadius: 999, paddingLeft: AVATAR - 8, paddingRight: 14, paddingVertical: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 3, justifyContent: "center", minHeight: 56 },
  pillTextBlock: { gap: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  nameText: { fontSize: 15, fontWeight: "700", color: "#0a0a0a", fontFamily: "Inter_700Bold" },
  muteIcon: { marginTop: 1 },
  statusText: { fontSize: 12.5, color: "#666", fontFamily: "Inter_400Regular" },

  avatarAbsolute: { position: "absolute", left: -4, top: "50%", marginTop: -(AVATAR / 2), width: AVATAR, height: AVATAR, borderRadius: AVATAR / 2, overflow: "hidden", borderWidth: 2.5, borderColor: "#ffffff", zIndex: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.18, shadowRadius: 3, elevation: 4 },
  avatar: { width: "100%", height: "100%" },
  flashBadge: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.50)", paddingVertical: 2.5, alignItems: "center" },
  flashText: { color: "#ffffff", fontSize: 8, fontWeight: "800", fontFamily: "Inter_700Bold", letterSpacing: 0.4 },

  rightPill: { flexDirection: "row", alignItems: "center", backgroundColor: "#ffffff", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 3 },
  pillAction: { paddingHorizontal: 6 },
  pillDivider: { width: 1, height: 18, backgroundColor: "#ddd", marginHorizontal: 2 },
});
