import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import MessageBubble, { Message } from "@/components/MessageBubble";
import PatternSvg from "../assets/images/pattern.svg";

const INITIAL_MESSAGES: Message[] = [
  { id: "1", text: "ab3", time: "11:17 AM", sent: false },
  { id: "2", text: "Bej na", time: "11:17 AM", sent: false },
  { id: "3", text: "Bhai mere", time: "11:17 AM", sent: false },
  {
    id: "4",
    text: "Bej",
    time: "11:27 AM",
    sent: false,
    edited: true,
    editLabel: "edited Jun 10 at 11:27 AM",
  },
  { id: "5", text: "Naa", time: "11:27 AM", sent: false },
  { id: "6", text: "Lodee", time: "11:27 AM", sent: false },
  { id: "7", text: "Sale seen krrha he bss", time: "11:28 AM", sent: false },
  {
    id: "8",
    text: "ye done ha ab mat boLna ok and kheo mene host kar di jab batayega hata duga",
    time: "1:36 PM",
    sent: true,
    read: true,
  },
  { id: "9", text: "ok", time: "1:36 PM", sent: true, read: true },
  { id: "10", text: "H", time: "1:37 PM", sent: false },
  { id: "11", text: "ok", time: "1:37 PM", sent: true, read: true },
  { id: "12", text: "Bhot slow", time: "1:37 PM", sent: false },
  { id: "13", text: "He", time: "1:37 PM", sent: false },
  { id: "14", text: "Bhot", time: "1:37 PM", sent: false },
  { id: "15", text: "HD se jyda slow", time: "1:38 PM", sent: false },
];

function PatternOverlay() {
  return (
    <View
      style={[StyleSheet.absoluteFillObject, { opacity: 0.18 }]}
      pointerEvents="none"
    >
      <PatternSvg
        width="100%"
        height="100%"
        viewBox="0 0 1440 2960"
        preserveAspectRatio="xMidYMid slice"
      />
    </View>
  );
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  function handleSend(text: string) {
    const newMsg: Message = {
      id: Date.now().toString(),
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sent: true,
      read: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }

  function handleScroll(event: {
    nativeEvent: {
      contentOffset: { y: number };
      contentSize: { height: number };
      layoutMeasurement: { height: number };
    };
  }) {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const distanceFromBottom =
      contentSize.height - contentOffset.y - layoutMeasurement.height;
    setShowScrollBtn(distanceFromBottom > 150);
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#b2d4a8", "#6aab6a", "#4a8a4a"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      <PatternOverlay />
      <ChatHeader />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          onScroll={handleScroll}
          scrollEventThrottle={100}
          onContentSizeChange={() => {
            if (!showScrollBtn) {
              flatListRef.current?.scrollToEnd({ animated: false });
            }
          }}
        />

        {showScrollBtn ? (
          <Pressable
            style={styles.scrollBtn}
            onPress={() => flatListRef.current?.scrollToEnd({ animated: true })}
          >
            <Ionicons name="chevron-down" size={20} color="#555" />
          </Pressable>
        ) : null}

        <ChatInput onSend={handleSend} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  listContent: { paddingVertical: 10, paddingBottom: 4 },
  scrollBtn: {
    position: "absolute",
    right: 16,
    bottom: Platform.OS === "web" ? 80 : 80,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
});
