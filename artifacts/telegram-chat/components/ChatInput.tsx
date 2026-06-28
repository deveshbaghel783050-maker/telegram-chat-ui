import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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

      <View style={styles.row}>
        <View style={styles.inputPill}>
          <Pressable style={styles.emojiBtn}>
            <MaterialCommunityIcons name="emoticon-outline" size={27} color="#8a8a8a" />
          </Pressable>

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

          <Pressable style={styles.attachBtn} onPress={handlePickImage}>
            <Feather name="paperclip" size={22} color={pendingImage ? "#3390ec" : "#8a8a8a"} />
          </Pressable>
        </View>

        <Pressable style={styles.actionCircle} onPress={hasContent ? handleSend : undefined}>
          {hasContent ? (
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
  container: { paddingTop: 8, paddingHorizontal: 10, paddingBottom: 12 },
  row: { flexDirection: "row", alignItems: "flex-end", gap: 8 },

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
  emojiBtn: { paddingHorizontal: 8, paddingVertical: 2, justifyContent: "center" },
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
  attachBtn: { paddingHorizontal: 6, paddingVertical: 2, justifyContent: "center" },
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
