import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  onSend: (text: string, imageUri?: string) => void;
};

export default function ChatInput({ onSend }: Props) {
  const [text, setText] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === "web" ? 16 : insets.bottom + 4;

  async function handlePickImage() {
    if (Platform.OS === "web") {
      Alert.alert("Info", "Image upload works on Expo Go (mobile app).");
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow photo access to upload images.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setPendingImage(result.assets[0].uri);
    }
  }

  function handleSend() {
    if (!text.trim() && !pendingImage) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSend(text.trim(), pendingImage ?? undefined);
    setText("");
    setPendingImage(null);
  }

  const hasContent = text.trim().length > 0 || !!pendingImage;

  return (
    <View style={[styles.container, { paddingBottom: bottomPad }]}>
      {pendingImage && (
        <View style={styles.previewRow}>
          <Image source={{ uri: pendingImage }} style={styles.previewThumb} contentFit="cover" />
          <View style={styles.previewInfo}>
            <Text style={styles.previewLabel}>Image ready to send</Text>
            {text.length > 0 && (
              <Text style={styles.previewCaption} numberOfLines={1}>Caption: {text}</Text>
            )}
          </View>
          <Pressable onPress={() => setPendingImage(null)} style={styles.previewRemove}>
            <Ionicons name="close-circle" size={22} color="#e53935" />
          </Pressable>
        </View>
      )}

      {/* Single pill — emoji | text | paperclip | mic circle — all inside, no gap */}
      <View style={styles.inputPill}>
        {/* Left: emoji button — real emoji character like Telegram/WhatsApp */}
        <Pressable style={styles.emojiBtn}>
          <Text style={styles.emojiChar}>😊</Text>
        </Pressable>

        {/* Middle: text input */}
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={pendingImage ? "Add a caption..." : "Message"}
          placeholderTextColor="#b0b0b0"
          style={styles.input}
          multiline
          returnKeyType="default"
          onSubmitEditing={handleSend}
        />

        {/* Paperclip */}
        <Pressable style={styles.attachBtn} onPress={handlePickImage}>
          <Feather name="paperclip" size={22} color={pendingImage ? "#3390ec" : "#8a8a8a"} />
        </Pressable>

        {/* Mic / Send — blue circle, flush inside the pill */}
        <Pressable style={styles.actionCircle} onPress={hasContent ? handleSend : undefined}>
          {hasContent ? (
            <Ionicons name="send" size={19} color="#ffffff" />
          ) : (
            <Ionicons name="mic" size={21} color="#ffffff" />
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

  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 10,
    marginBottom: 8,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  previewThumb: { width: 52, height: 52, borderRadius: 10 },
  previewInfo: { flex: 1 },
  previewLabel: { fontSize: 13, fontWeight: "600", color: "#3390ec", fontFamily: "Inter_600SemiBold" },
  previewCaption: { fontSize: 12, color: "#888", marginTop: 2, fontFamily: "Inter_400Regular" },
  previewRemove: { padding: 2 },

  inputPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingLeft: 6,
    paddingRight: 4,
    paddingVertical: Platform.OS === "ios" ? 8 : 4,
    minHeight: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },

  emojiBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  emojiChar: {
    fontSize: 24,
    lineHeight: 28,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
  },

  actionCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#3390ec",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3390ec",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
});
