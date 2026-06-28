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
            <Image source={{ uri: imageUri }} style={styles.msgImage} contentFit="cover" />
            {text ? (
              <Text style={[styles.text, styles.captionPad, sent ? styles.textSent : styles.textReceived]}>
                {text}
              </Text>
            ) : null}
          </View>
        ) : (
          <Text style={[styles.text, sent ? styles.textSent : styles.textReceived]} selectable>
            {edited && (
              <Text style={[styles.editedTag, sent ? styles.metaSent : styles.metaReceived]}>
                edited{" "}
              </Text>
            )}
            {text}
          </Text>
        )}

        <View style={[styles.meta, sent ? styles.metaRight : styles.metaRight]}>
          <Text style={[styles.time, sent ? styles.metaSent : styles.metaReceived]}>{time}</Text>
          {sent && (
            <Ionicons
              name="checkmark-done"
              size={13}
              color={read ? "#3390ec" : "#8ab88a"}
              style={{ marginLeft: 2 }}
            />
          )}
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginVertical: 1,
    paddingHorizontal: 8,
  },
  rowSent: { justifyContent: "flex-end" },
  rowReceived: { justifyContent: "flex-start" },

  bubble: {
    maxWidth: "82%",
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingTop: 7,
    paddingBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  bubbleReceived: {
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 4,
  },
  bubbleSent: {
    backgroundColor: "#dcf8c6",
    borderBottomRightRadius: 4,
  },

  text: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "Inter_400Regular",
    color: "#0a0a0a",
  },
  textSent: { color: "#0a0a0a" },
  textReceived: { color: "#0a0a0a" },
  captionPad: { marginTop: 5 },

  meta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  metaRight: { justifyContent: "flex-end" },

  time: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  metaSent: { color: "#6a9a6a" },
  metaReceived: { color: "#999" },

  editedTag: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
  },

  imageWrap: { borderRadius: 12, overflow: "hidden" },
  msgImage: { width: 220, height: 220, borderRadius: 12 },
});
