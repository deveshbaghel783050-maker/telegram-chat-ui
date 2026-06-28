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
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </Pressable>

        <View style={styles.avatarWrap}>
          <Image
            source={require("../assets/images/flash_avatar.jpg")}
            style={styles.avatar}
            contentFit="cover"
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>FLASH</Text>
          <Text style={styles.status}>last seen recently</Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.actionBtn}>
            <MaterialIcons name="volume-off" size={22} color="#6a6a6a" />
          </Pressable>
          <Pressable style={styles.actionBtn}>
            <Feather name="phone" size={21} color="#1a1a1a" />
          </Pressable>
          <Pressable style={styles.actionBtn}>
            <Feather name="more-vertical" size={21} color="#1a1a1a" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 3,
    zIndex: 10,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    height: 56,
  },
  backBtn: {
    padding: 4,
    marginRight: 2,
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0a0a0a",
    fontFamily: "Inter_600SemiBold",
  },
  status: {
    fontSize: 13,
    color: "#7a7a7a",
    fontFamily: "Inter_400Regular",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionBtn: {
    padding: 6,
    marginLeft: 2,
  },
});
