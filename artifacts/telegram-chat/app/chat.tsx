import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
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
  { id: "4", text: "Bej", time: "11:27 AM", sent: false, edited: true, editLabel: "edited Jun 10 at 11:27 AM" },
  { id: "5", text: "Naa", time: "11:27 AM", sent: false },
  { id: "6", text: "Lodee", time: "11:27 AM", sent: false },
  { id: "7", text: "Sale seen krrha he bss", time: "11:28 AM", sent: false },
  { id: "8", text: "ye done ha ab mat boLna ok and kheo mene host kar di jab batayega hata duga", time: "1:36 PM", sent: true, read: true },
  { id: "9", text: "ok", time: "1:36 PM", sent: true, read: true },
  { id: "10", text: "H", time: "1:37 PM", sent: false },
  { id: "11", text: "ok", time: "1:37 PM", sent: true, read: true },
  { id: "12", text: "Bhot slow", time: "1:37 PM", sent: false },
  { id: "13", text: "He", time: "1:37 PM", sent: false },
  { id: "14", text: "Bhot", time: "1:37 PM", sent: false },
  { id: "15", text: "HD se jyda slow", time: "1:38 PM", sent: false },
];

const AUTO_REPLIES: Record<string, string[]> = {
  hi: ["Hello bhai!", "Haan bol", "Kya scene hai"],
  hello: ["Hello!", "Haan bhai kya hua", "Bol bhai"],
  ok: ["Theek hai", "Ok ok", "Achha"],
  haan: ["Ok bhai", "Samjha", "Bol aage"],
  kya: ["Kya hua bhai?", "Bata", "Haan bata bhai"],
  slow: ["Haan yaar net bahut slow hai", "Server side issue hai shayad", "Try karo reload"],
  bhai: ["Bata bhai", "Haan bhai bol", "Kya baat hai"],
};

const GENERIC_REPLIES = [
  "Haan bhai",
  "Ok",
  "Samjha",
  "Acha",
  "Theek hai",
  "Dekh raha hun",
  "Ha sahi hai",
  "Ok done",
  "Copy that bhai",
  "Hmm",
];

function getAutoReply(text: string): string {
  const lower = text.toLowerCase().trim();
  for (const [key, replies] of Object.entries(AUTO_REPLIES)) {
    if (lower.includes(key)) {
      return replies[Math.floor(Math.random() * replies.length)];
    }
  }
  return GENERIC_REPLIES[Math.floor(Math.random() * GENERIC_REPLIES.length)];
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function PatternOverlay() {
  return (
    <View style={[StyleSheet.absoluteFillObject, { opacity: 0.18 }]} pointerEvents="none">
      <PatternSvg width="100%" height="100%" viewBox="0 0 1440 2960" preserveAspectRatio="xMidYMid slice" />
    </View>
  );
}

function TypingBubble() {
  return (
    <View style={typingStyles.row}>
      <View style={typingStyles.bubble}>
        <View style={typingStyles.dotsRow}>
          <View style={[typingStyles.dot, typingStyles.dot1]} />
          <View style={[typingStyles.dot, typingStyles.dot2]} />
          <View style={[typingStyles.dot, typingStyles.dot3]} />
        </View>
      </View>
    </View>
  );
}

const typingStyles = StyleSheet.create({
  row: { flexDirection: "row", paddingHorizontal: 10, marginVertical: 4 },
  bubble: { backgroundColor: "#fff", borderRadius: 18, borderTopLeftRadius: 4, paddingHorizontal: 14, paddingVertical: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  dotsRow: { flexDirection: "row", gap: 5, alignItems: "center" },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#aaa" },
  dot1: {},
  dot2: { opacity: 0.6 },
  dot3: { opacity: 0.3 },
});

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  function scrollToBottom(animated = true) {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated });
    }, 80);
  }

  function handleSend(text: string) {
    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      time: nowTime(),
      sent: true,
      read: false,
    };
    setMessages((prev) => [...prev, userMsg]);
    scrollToBottom();

    const delay = 1000 + Math.random() * 1200;
    setIsTyping(true);
    scrollToBottom();

    setTimeout(() => {
      setIsTyping(false);
      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: getAutoReply(text),
        time: nowTime(),
        sent: false,
      };
      setMessages((prev) => {
        const updated = [...prev];
        const lastSentIdx = [...updated].reverse().findIndex((m) => m.sent);
        if (lastSentIdx !== -1) {
          updated[updated.length - 1 - lastSentIdx] = {
            ...updated[updated.length - 1 - lastSentIdx],
            read: true,
          };
        }
        return [...updated, replyMsg];
      });
      scrollToBottom();
    }, delay);
  }

  function handleScroll(event: {
    nativeEvent: { contentOffset: { y: number }; contentSize: { height: number }; layoutMeasurement: { height: number } };
  }) {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    setShowScrollBtn(contentSize.height - contentOffset.y - layoutMeasurement.height > 150);
  }

  const data: Array<Message | { id: string; type: "typing" }> = isTyping
    ? [...messages, { id: "__typing__", type: "typing" as const }]
    : messages;

  return (
    <View style={styles.root}>
      <LinearGradient colors={["#b2d4a8", "#6aab6a", "#4a8a4a"]} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFillObject} />
      <PatternOverlay />
      <ChatHeader />

      <KeyboardAvoidingView style={styles.flex} behavior="padding" keyboardVerticalOffset={0}>
        <FlatList
          ref={flatListRef}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            if ("type" in item && item.type === "typing") return <TypingBubble />;
            return <MessageBubble message={item as Message} />;
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          onScroll={handleScroll}
          scrollEventThrottle={100}
          onContentSizeChange={() => { if (!showScrollBtn) scrollToBottom(false); }}
        />

        {showScrollBtn && (
          <Pressable style={styles.scrollBtn} onPress={() => flatListRef.current?.scrollToEnd({ animated: true })}>
            <Ionicons name="chevron-down" size={20} color="#555" />
          </Pressable>
        )}

        <View style={styles.typingLabel}>
          {isTyping && <Text style={styles.typingText}>FLASH is typing...</Text>}
        </View>

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
    position: "absolute", right: 16,
    bottom: Platform.OS === "web" ? 90 : 90,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#ffffff", alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 4,
  },
  typingLabel: { minHeight: 18, paddingHorizontal: 14 },
  typingText: { fontSize: 12, color: "rgba(255,255,255,0.9)", fontFamily: "Inter_400Regular", fontStyle: "italic" },
});
