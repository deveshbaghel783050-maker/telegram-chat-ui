import { Ionicons } from "@expo/vector-icons";

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
import MessageBubble from "@/components/MessageBubble";
import { Message, useProfile } from "@/context/ProfileContext";
import PatternSvg from "../assets/images/pattern.svg";
import { generateChatScreenshot } from "@/utils/generateScreenshot";
import { getRandomUser, getRandomConversation } from "@/utils/randomData";

const AUTO_REPLIES: [string, string[]][] = [
  ["hi",      ["Hello bhai! 👋", "Haan bol kya scene", "Hi hi!"]],
  ["hello",   ["Hello! 😊", "Haan bhai kya hua", "Bol bhai"]],
  ["how are", ["Main theek hun, tu bata 😄", "Bilkul fit hun bhai!", "Sab sahi hai"]],
  ["fine",    ["Good good 👌", "Achha", "Chal theek hai"]],
  ["ok",      ["Ok ok", "Theek hai", "Achha samjha"]],
  ["kya",     ["Kya hua bhai?", "Bata na", "Haan bata bhai"]],
  ["slow",    ["Haan yaar net bahut slow hai", "Server side issue hai shayad 😅", "Try karo reload"]],
  ["bhai",    ["Bata bhai 🙏", "Haan bhai bol", "Kya baat hai yaar"]],
  ["kuch",    ["Batao batao", "Kya kuch?", "Bol mat ruk"]],
  ["nhi",     ["Kyu nhi?", "Acha theek hai", "No problem"]],
  ["haan",    ["Theek hai bhai", "Ok noted", "Copy that 👍"]],
];

const GENERIC = [
  "Haan bhai 😄", "Ok ok", "Samjha", "Acha", "Theek hai bhai",
  "Dekh raha hun 👀", "Ha sahi hai", "Copy that 👍", "Hmm interesting",
  "Lol 😂", "Sahi keh rha hai", "Bata bhai aage",
];

function getReply(text: string): string {
  const low = text.toLowerCase();
  for (const [key, replies] of AUTO_REPLIES) {
    if (low.includes(key)) return replies[Math.floor(Math.random() * replies.length)];
  }
  return GENERIC[Math.floor(Math.random() * GENERIC.length)];
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function TypingBubble() {
  return (
    <View style={ts.row}>
      <View style={ts.bubble}>
        <View style={ts.dots}>
          <View style={ts.dot} />
          <View style={[ts.dot, { opacity: 0.55 }]} />
          <View style={[ts.dot, { opacity: 0.25 }]} />
        </View>
      </View>
    </View>
  );
}

const ts = StyleSheet.create({
  row: { flexDirection: "row", paddingHorizontal: 10, marginVertical: 3 },
  bubble: { backgroundColor: "#fff", borderRadius: 18, borderTopLeftRadius: 4, paddingHorizontal: 14, paddingVertical: 11, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  dots: { flexDirection: "row", gap: 5, alignItems: "center" },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#aaa" },
});

type ListItem = Message | { id: string; _typing: true };

export default function ChatScreen() {
  const { messages, addMessage, theirName, myName } = useProfile();
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  async function handleDownload() {
    if (Platform.OS !== "web") return;
    setDownloading(true);
    try {
      const user = getRandomUser();
      const msgs = getRandomConversation(user);
      const dataUrl = await generateChatScreenshot(user, msgs, myName);
      const link = document.createElement("a");
      link.download = `telegram-${user.name.split(" ")[0].toLowerCase()}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // silent
    }
    setDownloading(false);
  }

  function scrollToEnd(animated = true) {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated }), 80);
  }

  function handleSend(text: string, imageUri?: string) {
    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      time: nowTime(),
      sent: true,
      read: false,
      imageUri,
    };
    addMessage(userMsg);
    scrollToEnd();

    if (imageUri) return;

    setIsTyping(true);
    const delay = 900 + Math.random() * 1100;
    setTimeout(() => {
      setIsTyping(false);
      const replyMsg: Message = { id: (Date.now() + 1).toString(), text: getReply(text), time: nowTime(), sent: false };
      addMessage(replyMsg);
      scrollToEnd();
    }, delay);
  }

  function handleScroll(e: any) {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    setShowScrollBtn(contentSize.height - contentOffset.y - layoutMeasurement.height > 150);
  }

  const listData: ListItem[] = isTyping
    ? [...messages, { id: "__typing__", _typing: true as const }]
    : messages;

  return (
    <View style={styles.root}>
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: "#7ab870" }]} />
      <View style={[StyleSheet.absoluteFillObject, { opacity: 0.55 }]} pointerEvents="none">
        <PatternSvg
          width="100%"
          height="100%"
          viewBox="0 0 1440 2960"
          preserveAspectRatio="xMidYMid slice"
          fill="#559e4e"
        />
      </View>
      <ChatHeader />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={listData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            if ("_typing" in item) return <TypingBubble />;
            return <MessageBubble message={item as Message} />;
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          onScroll={handleScroll}
          scrollEventThrottle={100}
          onContentSizeChange={() => scrollToEnd(false)}
          onLayout={() => scrollToEnd(false)}
        />

        {showScrollBtn && (
          <Pressable style={styles.scrollBtn} onPress={() => flatListRef.current?.scrollToEnd({ animated: true })}>
            <Ionicons name="chevron-down" size={20} color="#555" />
          </Pressable>
        )}

        {isTyping && (
          <View style={styles.typingBar}>
            <Text style={styles.typingText}>{theirName} is typing...</Text>
          </View>
        )}

        <ChatInput onSend={handleSend} />
      </KeyboardAvoidingView>

      {Platform.OS === "web" && (
        <Pressable style={[styles.downloadBtn, downloading && { opacity: 0.6 }]} onPress={handleDownload} disabled={downloading}>
          {downloading
            ? <Ionicons name="hourglass-outline" size={22} color="#fff" />
            : <Ionicons name="download-outline" size={22} color="#fff" />
          }
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  listContent: { paddingVertical: 10, paddingBottom: 4, flexGrow: 1, justifyContent: "flex-end" },
  scrollBtn: {
    position: "absolute",
    right: 16,
    bottom: 90,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  typingBar: { paddingHorizontal: 14, paddingBottom: 2 },
  typingText: { fontSize: 12, color: "rgba(255,255,255,0.9)", fontFamily: "Inter_400Regular", fontStyle: "italic" },
  downloadBtn: {
    position: "absolute",
    left: 16,
    bottom: 90,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#3390ec",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
});
