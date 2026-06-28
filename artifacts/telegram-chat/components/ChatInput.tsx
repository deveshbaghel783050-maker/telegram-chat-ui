import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  onSend: (text: string) => void;
};

export default function ChatInput({ onSend }: Props) {
  const [text, setText] = useState("");
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === "web" ? 20 : insets.bottom;

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSend(trimmed);
    setText("");
  }

  return (
    <View style={[styles.container, { paddingBottom: bottomPad + 6 }]}>
      <View style={styles.row}>
        <Pressable style={styles.iconBtn}>
          <Ionicons name="happy-outline" size={25} color="#8a9a88" />
        </Pressable>

        <View style={styles.inputWrap}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Message"
            placeholderTextColor="#aaa"
            style={styles.input}
            multiline
            returnKeyType="default"
          />
        </View>

        <Pressable style={styles.iconBtn}>
          <Feather name="paperclip" size={22} color="#8a9a88" />
        </Pressable>

        {text.trim().length > 0 ? (
          <Pressable style={styles.sendBtn} onPress={handleSend}>
            <Ionicons name="send" size={20} color="#ffffff" />
          </Pressable>
        ) : (
          <Pressable style={styles.sendBtn}>
            <Ionicons name="mic" size={22} color="#ffffff" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    paddingTop: 8,
    paddingHorizontal: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ddd",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  iconBtn: {
    paddingBottom: 10,
    paddingHorizontal: 4,
  },
  inputWrap: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
    minHeight: 44,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  input: {
    fontSize: 15,
    color: "#0a0a0a",
    fontFamily: "Inter_400Regular",
    maxHeight: 120,
    minHeight: 20,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#3390ec",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
});
