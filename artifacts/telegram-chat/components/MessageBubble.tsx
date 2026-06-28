import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type Message = {
  id: string;
  text: string;
  time: string;
  sent: boolean;
  edited?: boolean;
  editLabel?: string;
  read?: boolean;
};

type Props = {
  message: Message;
};

export default function MessageBubble({ message }: Props) {
  const { text, time, sent, edited, editLabel, read } = message;

  return (
    <View style={[styles.row, sent ? styles.rowSent : styles.rowReceived]}>
      <View
        style={[
          styles.bubble,
          sent ? styles.bubbleSent : styles.bubbleReceived,
        ]}
      >
        {edited && editLabel ? (
          <Text style={styles.editLabel}>{editLabel}</Text>
        ) : null}
        <Text style={[styles.text, sent ? styles.textSent : styles.textReceived]}>
          {text}
        </Text>
        <View style={styles.meta}>
          {edited && !editLabel ? (
            <Text style={[styles.editedTag, sent ? styles.editedSent : styles.editedReceived]}>
              edited{" "}
            </Text>
          ) : null}
          <Text style={[styles.time, sent ? styles.timeSent : styles.timeReceived]}>
            {time}
          </Text>
          {sent ? (
            <View style={styles.checks}>
              <Ionicons
                name="checkmark-done"
                size={15}
                color={read ? "#3390ec" : "#8ab88a"}
                style={styles.checkIcon}
              />
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginVertical: 2,
    paddingHorizontal: 10,
  },
  rowSent: {
    justifyContent: "flex-end",
  },
  rowReceived: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bubbleReceived: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 4,
  },
  bubbleSent: {
    backgroundColor: "#d4f5b8",
    borderTopRightRadius: 4,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "Inter_400Regular",
  },
  textReceived: {
    color: "#0a0a0a",
  },
  textSent: {
    color: "#0a0a0a",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 2,
  },
  time: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  timeReceived: {
    color: "#8a9a88",
  },
  timeSent: {
    color: "#6a8a6a",
  },
  editedTag: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
  },
  editedSent: {
    color: "#6a8a6a",
  },
  editedReceived: {
    color: "#8a9a88",
  },
  editLabel: {
    fontSize: 11,
    color: "#8a9a88",
    fontFamily: "Inter_400Regular",
    marginBottom: 2,
    fontStyle: "italic",
  },
  checks: {
    marginLeft: 3,
  },
  checkIcon: {
    marginTop: 0,
  },
});
