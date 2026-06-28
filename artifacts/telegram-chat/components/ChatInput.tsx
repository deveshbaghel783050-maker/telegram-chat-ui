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
  const bottomPad = Platform.OS === "web" ? 16 : insets.bottom + 4;

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSend(trimmed);
    setText("");
  }

  return (
    <View style={[styles.container, { paddingBottom: bottomPad }]}>
      <View style={styles.row}>
        <View style={styles.inputPill}>
          <Pressable style={styles.emojiBtn}>
            <Ionicons name="happy-outline" size={26} color="#8a8a8a" />
          </Pressable>

          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Message"
            placeholderTextColor="#b0b0b0"
            style={styles.input}
            multiline
            returnKeyType="default"
            onSubmitEditing={handleSend}
          />

          <Pressable style={styles.attachBtn}>
            <Feather name="paperclip" size={22} color="#8a8a8a" />
          </Pressable>
        </View>

        <Pressable
          style={styles.actionCircle}
          onPress={text.trim().length > 0 ? handleSend : undefined}
        >
          {text.trim().length > 0 ? (
            <Ionicons name="send" size={20} color="#ffffff" />
          ) : (
            <Ionicons name="mic" size={22} color="#ffffff" />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingHorizontal: 10,
    paddingBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },

  inputPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingLeft: 6,
    paddingRight: 10,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
    minHeight: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },

  emojiBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    justifyContent: "center",
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#0a0a0a",
    fontFamily: "Inter_400Regular",
    maxHeight: 120,
    minHeight: 22,
    paddingVertical: 0,
    paddingHorizontal: 4,
  },

  attachBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: "center",
  },

  actionCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3390ec",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3390ec",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
  },
});
