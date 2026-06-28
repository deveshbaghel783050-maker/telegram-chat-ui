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
import Svg, { Path } from "react-native-svg";

import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import MessageBubble, { Message } from "@/components/MessageBubble";

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
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.12 }}
      >
        <Path
          d="M50 60 C50 50, 60 40, 70 50 C80 40, 90 50, 90 60 C90 75, 70 90, 70 90 C70 90, 50 75, 50 60Z"
          fill="#2a6a2a"
        />
        <Path
          d="M150 120 C150 108, 162 96, 174 108 C186 96, 198 108, 198 120 C198 138, 174 156, 174 156 C174 156, 150 138, 150 120Z"
          fill="#2a6a2a"
        />
        <Path
          d="M320 80 C320 68, 332 56, 344 68 C356 56, 368 68, 368 80 C368 98, 344 116, 344 116 C344 116, 320 98, 320 80Z"
          fill="#2a6a2a"
        />
        <Path
          d="M30 200 C30 188, 42 176, 54 188 C66 176, 78 188, 78 200 C78 218, 54 236, 54 236 C54 236, 30 218, 30 200Z"
          fill="#2a6a2a"
        />
        <Path
          d="M370 250 C370 238, 382 226, 394 238 C406 226, 418 238, 418 250 C418 268, 394 286, 394 286 C394 286, 370 268, 370 250Z"
          fill="#2a6a2a"
        />
        <Path
          d="M200 300 C200 288, 212 276, 224 288 C236 276, 248 288, 248 300 C248 318, 224 336, 224 336 C224 336, 200 318, 200 300Z"
          fill="#2a6a2a"
        />
        <Path
          d="M80 380 C80 368, 92 356, 104 368 C116 356, 128 368, 128 380 C128 398, 104 416, 104 416 C104 416, 80 398, 80 380Z"
          fill="#2a6a2a"
        />
        <Path
          d="M300 420 C300 408, 312 396, 324 408 C336 396, 348 408, 348 420 C348 438, 324 456, 324 456 C324 456, 300 438, 300 420Z"
          fill="#2a6a2a"
        />
        <Path
          d="M40 500 C40 488, 52 476, 64 488 C76 476, 88 488, 88 500 C88 518, 64 536, 64 536 C64 536, 40 518, 40 500Z"
          fill="#2a6a2a"
        />
        <Path
          d="M360 540 C360 528, 372 516, 384 528 C396 516, 408 528, 408 540 C408 558, 384 576, 384 576 C384 576, 360 558, 360 540Z"
          fill="#2a6a2a"
        />
        <Path
          d="M170 600 C170 588, 182 576, 194 588 C206 576, 218 588, 218 600 C218 618, 194 636, 194 636 C194 636, 170 618, 170 600Z"
          fill="#2a6a2a"
        />
        <Path
          d="M290 660 C290 648, 302 636, 314 648 C326 636, 338 648, 338 660 C338 678, 314 696, 314 696 C314 696, 290 678, 290 660Z"
          fill="#2a6a2a"
        />
        <Path
          d="M100 720 C100 708, 112 696, 124 708 C136 696, 148 708, 148 720 C148 738, 124 756, 124 756 C124 756, 100 738, 100 720Z"
          fill="#2a6a2a"
        />
        <Path
          d="M120 40 A12 12 0 1 1 144 40 A12 12 0 1 1 120 40Z"
          fill="none"
          stroke="#2a6a2a"
          strokeWidth="2.5"
        />
        <Path
          d="M260 180 A10 10 0 1 1 280 180 A10 10 0 1 1 260 180Z"
          fill="none"
          stroke="#2a6a2a"
          strokeWidth="2"
        />
        <Path
          d="M20 350 A8 8 0 1 1 36 350 A8 8 0 1 1 20 350Z"
          fill="#2a6a2a"
          opacity="0.6"
        />
        <Path
          d="M340 320 A8 8 0 1 1 356 320 A8 8 0 1 1 340 320Z"
          fill="#2a6a2a"
          opacity="0.6"
        />
        <Path
          d="M230 460 A10 10 0 1 1 250 460 A10 10 0 1 1 230 460Z"
          fill="none"
          stroke="#2a6a2a"
          strokeWidth="2.5"
        />
        <Path
          d="M60 620 A12 12 0 1 1 84 620 A12 12 0 1 1 60 620Z"
          fill="none"
          stroke="#2a6a2a"
          strokeWidth="2"
        />
        <Path
          d="M350 700 A8 8 0 1 1 366 700 A8 8 0 1 1 350 700Z"
          fill="#2a6a2a"
          opacity="0.6"
        />
        <Path
          d="M240 760 A10 10 0 1 1 260 760 A10 10 0 1 1 240 760Z"
          fill="none"
          stroke="#2a6a2a"
          strokeWidth="2"
        />
        <Path
          d="M190 150 L200 130 L210 150 L230 160 L210 170 L200 190 L190 170 L170 160 Z"
          fill="#2a6a2a"
          opacity="0.5"
        />
        <Path
          d="M50 460 L58 445 L66 460 L81 467 L66 474 L58 489 L50 474 L35 467 Z"
          fill="#2a6a2a"
          opacity="0.5"
        />
        <Path
          d="M320 560 L327 548 L334 560 L346 565 L334 570 L327 582 L320 570 L308 565 Z"
          fill="#2a6a2a"
          opacity="0.5"
        />
        <Path
          d="M100 280 C120 260, 150 260, 170 280"
          fill="none"
          stroke="#2a6a2a"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Path
          d="M240 540 C260 520, 290 520, 310 540"
          fill="none"
          stroke="#2a6a2a"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Path
          d="M30 680 C50 660, 80 660, 100 680"
          fill="none"
          stroke="#2a6a2a"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
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
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sent: true,
      read: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }

  function handleScroll(event: { nativeEvent: { contentOffset: { y: number }; contentSize: { height: number }; layoutMeasurement: { height: number } } }) {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const distanceFromBottom = contentSize.height - contentOffset.y - layoutMeasurement.height;
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
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 10,
    paddingBottom: 4,
  },
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
