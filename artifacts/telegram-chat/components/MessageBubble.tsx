import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Message } from "@/context/ProfileContext";

type Props = {
  message: Message;
};

export default function MessageBubble({ message }: Props) {
  const { text, time, sent, edited, read, imageUri } = message;

  return (
    <View style={[styles.row, sent ? styles.rowSent : styles.rowReceived]}>
      <View style={[styles.bubble, sent ? styles.bubbleSent : styles.bubbleReceived]}>
        {imageUri ? (
          <View style={styles.imageWrap}>
            <Image
              source={{ uri: imageUri }}
              style={styles.msgImage}
              contentFit="cover"
            />
            {text ? (
              <Text style={[styles.caption, sent ? styles.textSent : styles.textReceived]}>{text}</Text>
            ) : null}
          </View>
        ) : (
          <Text style={[styles.text, sent ? styles.textSent : styles.textReceived]}>{text}</Text>
        )}

        <View style={styles.meta}>
          {edited && (
            <Text style={[styles.editedTag, sent ? styles.editedSent : styles.editedReceived]}>edited </Text>
          )}
          <Text style={[styles.time, sent ? styles.timeSent : styles.timeReceived]}>{time}</Text>
          {sent ? (
            <Ionicons
              name="checkmark-done"
              size={15}
              color={read ? "#3390ec" : "#8ab88a"}
              style={{ marginLeft: 3 }}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", marginVertical: 2, paddingHorizontal: 10 },
  rowSent: { justifyContent: "flex-end" },
  rowReceived: { justifyContent: "flex-start" },

  bubble: {
    maxWidth: "80%",
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bubbleReceived: { backgroundColor: "#ffffff", borderTopLeftRadius: 4 },
  bubbleSent: { backgroundColor: "#d4f5b8", borderTopRightRadius: 4 },

  imageWrap: { borderRadius: 12, overflow: "hidden" },
  msgImage: { width: 220, height: 220, borderRadius: 12 },
  caption: { fontSize: 13, marginTop: 5, fontFamily: "Inter_400Regular" },

  text: { fontSize: 15, lineHeight: 20, fontFamily: "Inter_400Regular" },
  textReceived: { color: "#0a0a0a" },
  textSent: { color: "#0a0a0a" },

  meta: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginTop: 3 },
  time: { fontSize: 11, fontFamily: "Inter_400Regular" },
  timeReceived: { color: "#8a9a88" },
  timeSent: { color: "#6a8a6a" },
  editedTag: { fontSize: 11, fontFamily: "Inter_400Regular", fontStyle: "italic" },
  editedSent: { color: "#6a8a6a" },
  editedReceived: { color: "#8a9a88" },
});
