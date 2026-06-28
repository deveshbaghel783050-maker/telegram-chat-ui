import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Message, useProfile } from "@/context/ProfileContext";

type Tab = "you" | "them" | "chat";

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

async function pickImage(): Promise<string | null> {
  if (Platform.OS === "web") {
    Alert.alert("Info", "Image upload works on Expo Go (mobile app).");
    return null;
  }
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") return null;
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.85,
  });
  if (!result.canceled && result.assets[0]) return result.assets[0].uri;
  return null;
}

type EditModalState = {
  id: string;
  text: string;
  time: string;
} | null;

type AddModalState = {
  asSent: boolean;
} | null;

export default function EditorScreen() {
  const insets = useSafeAreaInsets();
  const ctx = useProfile();
  const [tab, setTab] = useState<Tab>("you");

  const [editMsg, setEditMsg] = useState<EditModalState>(null);
  const [editMsgText, setEditMsgText] = useState("");
  const [editMsgTime, setEditMsgTime] = useState("");

  const [addModal, setAddModal] = useState<AddModalState>(null);
  const [addText, setAddText] = useState("");
  const [addTime, setAddTime] = useState(nowTime());

  const [youNameEdit, setYouNameEdit] = useState(false);
  const [youNameVal, setYouNameVal] = useState(ctx.myName);

  const [themField, setThemField] = useState<string | null>(null);
  const [themVal, setThemVal] = useState("");

  function openEditMsg(msg: Message) {
    setEditMsg({ id: msg.id, text: msg.text, time: msg.time });
    setEditMsgText(msg.text);
    setEditMsgTime(msg.time);
  }

  function saveEditMsg() {
    if (editMsg) {
      ctx.editMessage(editMsg.id, editMsgText.trim() || editMsg.text);
    }
    setEditMsg(null);
  }

  function openAdd(asSent: boolean) {
    setAddText("");
    setAddTime(nowTime());
    setAddModal({ asSent });
  }

  function saveAdd() {
    if (!addText.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      text: addText.trim(),
      time: addTime.trim() || nowTime(),
      sent: addModal!.asSent,
      read: addModal!.asSent,
    };
    ctx.addMessage(msg);
    setAddModal(null);
  }

  function openThemEdit(field: string, val: string) {
    setThemField(field);
    setThemVal(val);
  }

  function saveThemEdit() {
    if (!themField) return;
    ctx.updateTheirProfile({ [themField]: themVal.trim() });
    setThemField(null);
  }

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: "you",  label: "You",  icon: "person"        },
    { key: "them", label: "Them", icon: "person-circle" },
    { key: "chat", label: "Chat", icon: "chatbubbles"   },
  ];

  return (
    <View style={[styles.root, { paddingTop: Platform.OS === "web" ? 44 : insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Fake Chat</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map((t) => (
          <Pressable
            key={t.key}
            style={[styles.tabBtn, tab === t.key && styles.tabBtnActive]}
            onPress={() => setTab(t.key)}
          >
            <Ionicons name={t.icon as any} size={16} color={tab === t.key ? "#3390ec" : "#888"} />
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]} showsVerticalScrollIndicator={false}>

        {/* ── YOU TAB ── */}
        {tab === "you" && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Your Profile</Text>

            <View style={styles.avatarRow}>
              <Pressable onPress={async () => { const u = await pickImage(); if (u) ctx.setMyAvatarUri(u); }} style={styles.avatarWrap}>
                {ctx.myAvatarUri
                  ? <Image source={{ uri: ctx.myAvatarUri }} style={styles.avatarImg} contentFit="cover" />
                  : <View style={styles.avatarPlaceholder}><Ionicons name="person" size={36} color="#aaa" /></View>
                }
                <View style={styles.avatarEdit}><Ionicons name="camera" size={14} color="#fff" /></View>
              </Pressable>
              <View style={styles.avatarInfo}>
                <Text style={styles.avatarInfoLabel}>Your avatar</Text>
                <Text style={styles.avatarInfoSub}>Tap photo to upload from gallery</Text>
                {ctx.myAvatarUri && (
                  <Pressable onPress={() => ctx.setMyAvatarUri(null)} style={styles.removeBtn}>
                    <Text style={styles.removeBtnText}>Remove photo</Text>
                  </Pressable>
                )}
              </View>
            </View>

            <View style={styles.fieldCard}>
              <View style={styles.fieldRow}>
                <Feather name="user" size={18} color="#3390ec" style={styles.fieldIcon} />
                <View style={styles.fieldBody}>
                  <Text style={styles.fieldLabel}>Your Name</Text>
                  {youNameEdit ? (
                    <View style={styles.inlineEditRow}>
                      <TextInput
                        style={styles.inlineInput}
                        value={youNameVal}
                        onChangeText={setYouNameVal}
                        autoFocus
                        placeholder="Your name"
                        placeholderTextColor="#ccc"
                      />
                      <Pressable style={styles.inlineSave} onPress={() => { ctx.setMyName(youNameVal.trim() || ctx.myName); setYouNameEdit(false); }}>
                        <Ionicons name="checkmark" size={18} color="#3390ec" />
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable style={styles.fieldValue} onPress={() => { setYouNameVal(ctx.myName); setYouNameEdit(true); }}>
                      <Text style={styles.fieldValueText}>{ctx.myName}</Text>
                      <Feather name="edit-2" size={13} color="#bbb" style={{ marginLeft: 6 }} />
                    </Pressable>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={16} color="#3390ec" />
              <Text style={styles.infoText}>Your name shows on sent messages. Your avatar appears in the message bubbles when enabled.</Text>
            </View>
          </View>
        )}

        {/* ── THEM TAB ── */}
        {tab === "them" && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Their Profile (FLASH)</Text>

            <View style={styles.avatarRow}>
              <Pressable onPress={async () => { const u = await pickImage(); if (u) ctx.updateTheirProfile({ avatarUri: u }); }} style={styles.avatarWrap}>
                {ctx.theirAvatarUri
                  ? <Image source={{ uri: ctx.theirAvatarUri }} style={styles.avatarImg} contentFit="cover" />
                  : <Image source={require("../assets/images/flash_avatar.jpg")} style={styles.avatarImg} contentFit="cover" />
                }
                <View style={styles.avatarEdit}><Ionicons name="camera" size={14} color="#fff" /></View>
              </Pressable>
              <View style={styles.avatarInfo}>
                <Text style={styles.avatarInfoLabel}>Their avatar</Text>
                <Text style={styles.avatarInfoSub}>Tap photo to upload a custom image</Text>
                {ctx.theirAvatarUri && (
                  <Pressable onPress={() => ctx.updateTheirProfile({ avatarUri: null })} style={styles.removeBtn}>
                    <Text style={styles.removeBtnText}>Remove photo</Text>
                  </Pressable>
                )}
              </View>
            </View>

            <View style={styles.fieldCard}>
              {[
                { icon: "user", key: "name", label: "Name", value: ctx.theirName },
                { icon: "phone", key: "phone", label: "Phone", value: ctx.theirPhone },
                { icon: "at-sign", key: "username", label: "Username", value: ctx.theirUsername },
                { icon: "info", key: "bio", label: "Bio", value: ctx.theirBio },
              ].map((f, i) => (
                <Pressable
                  key={f.key}
                  style={[styles.fieldRow, i > 0 && styles.fieldRowBorder]}
                  onPress={() => openThemEdit(f.key, f.value)}
                >
                  <Feather name={f.icon as any} size={18} color="#3390ec" style={styles.fieldIcon} />
                  <View style={styles.fieldBody}>
                    <Text style={styles.fieldLabel}>{f.label}</Text>
                    <Text style={styles.fieldValueText}>{f.value}</Text>
                  </View>
                  <Feather name="edit-2" size={14} color="#ccc" />
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* ── CHAT TAB ── */}
        {tab === "chat" && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Messages ({ctx.messages.length})</Text>

            <View style={styles.addRow}>
              <Pressable style={[styles.addBtn, { backgroundColor: "#d4f5b8" }]} onPress={() => openAdd(true)}>
                <Ionicons name="add" size={16} color="#2a7a2a" />
                <Text style={[styles.addBtnText, { color: "#2a7a2a" }]}>Add as You</Text>
              </Pressable>
              <Pressable style={[styles.addBtn, { backgroundColor: "#f0f0f0" }]} onPress={() => openAdd(false)}>
                <Ionicons name="add" size={16} color="#555" />
                <Text style={[styles.addBtnText, { color: "#555" }]}>Add as Them</Text>
              </Pressable>
            </View>

            {ctx.messages.map((msg, i) => (
              <View key={msg.id} style={[styles.msgEditorRow, i > 0 && { marginTop: 4 }]}>
                <View style={[styles.msgEditorBubble, msg.sent ? styles.msgSent : styles.msgReceived]}>
                  <Text style={styles.msgEditorSender}>{msg.sent ? "▶ You" : `◀ ${ctx.theirName}`}</Text>
                  <Text style={styles.msgEditorText}>{msg.text}</Text>
                  <Text style={styles.msgEditorTime}>{msg.time}</Text>
                </View>
                <View style={styles.msgActions}>
                  <Pressable style={styles.msgActionBtn} onPress={() => openEditMsg(msg)}>
                    <Feather name="edit-2" size={15} color="#3390ec" />
                  </Pressable>
                  <Pressable style={styles.msgActionBtn} onPress={() => ctx.flipSender(msg.id)}>
                    <MaterialCommunityIcons name="swap-horizontal" size={16} color="#f5a623" />
                  </Pressable>
                  <Pressable style={styles.msgActionBtn} onPress={() => ctx.deleteMessage(msg.id)}>
                    <Feather name="trash-2" size={15} color="#e53935" />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Edit Them field modal */}
      <Modal visible={!!themField} transparent animationType="fade" onRequestClose={() => setThemField(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setThemField(null)}>
          <Pressable style={styles.modalBox} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Edit {themField}</Text>
            <TextInput style={styles.modalInput} value={themVal} onChangeText={setThemVal} autoFocus placeholder="Enter value" placeholderTextColor="#bbb" />
            <View style={styles.modalBtns}>
              <Pressable style={styles.modalCancel} onPress={() => setThemField(null)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalSave} onPress={saveThemEdit}>
                <Text style={styles.modalSaveText}>Save</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Edit message modal */}
      <Modal visible={!!editMsg} transparent animationType="fade" onRequestClose={() => setEditMsg(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setEditMsg(null)}>
          <Pressable style={styles.modalBox} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Edit Message</Text>
            <Text style={styles.modalFieldLabel}>Text</Text>
            <TextInput style={[styles.modalInput, { minHeight: 60 }]} value={editMsgText} onChangeText={setEditMsgText} multiline autoFocus placeholder="Message text" placeholderTextColor="#bbb" />
            <Text style={styles.modalFieldLabel}>Time</Text>
            <TextInput style={styles.modalInput} value={editMsgTime} onChangeText={setEditMsgTime} placeholder="e.g. 2:30 PM" placeholderTextColor="#bbb" />
            <View style={styles.modalBtns}>
              <Pressable style={styles.modalCancel} onPress={() => setEditMsg(null)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalSave} onPress={saveEditMsg}>
                <Text style={styles.modalSaveText}>Save</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Add message modal */}
      <Modal visible={!!addModal} transparent animationType="fade" onRequestClose={() => setAddModal(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setAddModal(null)}>
          <Pressable style={styles.modalBox} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>
              Add Message as {addModal?.asSent ? "You" : ctx.theirName}
            </Text>
            <Text style={styles.modalFieldLabel}>Text</Text>
            <TextInput style={[styles.modalInput, { minHeight: 60 }]} value={addText} onChangeText={setAddText} multiline autoFocus placeholder="Type message..." placeholderTextColor="#bbb" />
            <Text style={styles.modalFieldLabel}>Time</Text>
            <TextInput style={styles.modalInput} value={addTime} onChangeText={setAddTime} placeholder="e.g. 2:30 PM" placeholderTextColor="#bbb" />
            <View style={styles.modalBtns}>
              <Pressable style={styles.modalCancel} onPress={() => setAddModal(null)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalSave} onPress={saveAdd}>
                <Text style={styles.modalSaveText}>Add</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f4f7fb" },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 14, backgroundColor: "#fff", borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#eee" },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#f0f0f0", alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 17, fontWeight: "700", color: "#0a0a0a", fontFamily: "Inter_700Bold" },

  tabRow: { flexDirection: "row", backgroundColor: "#fff", borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#eee" },
  tabBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 13, gap: 5, borderBottomWidth: 2.5, borderBottomColor: "transparent" },
  tabBtnActive: { borderBottomColor: "#3390ec" },
  tabText: { fontSize: 14, color: "#888", fontFamily: "Inter_600SemiBold" },
  tabTextActive: { color: "#3390ec" },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 14, paddingTop: 18, gap: 14 },
  section: { gap: 12 },
  sectionLabel: { fontSize: 13, fontWeight: "700", color: "#3390ec", fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 0.6 },

  avatarRow: { flexDirection: "row", alignItems: "center", gap: 16, backgroundColor: "#fff", borderRadius: 16, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  avatarWrap: { width: 72, height: 72, borderRadius: 36, overflow: "hidden", backgroundColor: "#f0f0f0" },
  avatarImg: { width: "100%", height: "100%" },
  avatarPlaceholder: { flex: 1, alignItems: "center", justifyContent: "center" },
  avatarEdit: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.5)", height: 22, alignItems: "center", justifyContent: "center" },
  avatarInfo: { flex: 1, gap: 3 },
  avatarInfoLabel: { fontSize: 15, fontWeight: "600", color: "#0a0a0a", fontFamily: "Inter_600SemiBold" },
  avatarInfoSub: { fontSize: 12.5, color: "#888", fontFamily: "Inter_400Regular" },
  removeBtn: { marginTop: 6 },
  removeBtnText: { fontSize: 13, color: "#e53935", fontFamily: "Inter_500Medium" },

  fieldCard: { backgroundColor: "#fff", borderRadius: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  fieldRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14 },
  fieldRowBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#f0f0f0" },
  fieldIcon: { marginRight: 12 },
  fieldBody: { flex: 1 },
  fieldLabel: { fontSize: 11.5, color: "#888", fontFamily: "Inter_400Regular", marginBottom: 2 },
  fieldValue: { flexDirection: "row", alignItems: "center" },
  fieldValueText: { fontSize: 15, color: "#0a0a0a", fontFamily: "Inter_400Regular" },
  inlineEditRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  inlineInput: { flex: 1, fontSize: 15, borderBottomWidth: 1.5, borderBottomColor: "#3390ec", paddingVertical: 4, color: "#0a0a0a", fontFamily: "Inter_400Regular" },
  inlineSave: { padding: 4 },

  infoBox: { flexDirection: "row", gap: 8, backgroundColor: "#eaf4ff", borderRadius: 12, padding: 12, alignItems: "flex-start" },
  infoText: { flex: 1, fontSize: 13, color: "#3390ec", fontFamily: "Inter_400Regular", lineHeight: 18 },

  addRow: { flexDirection: "row", gap: 10 },
  addBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 12, paddingVertical: 12, gap: 6, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  addBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },

  msgEditorRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  msgEditorBubble: { flex: 1, borderRadius: 14, padding: 10 },
  msgSent: { backgroundColor: "#d4f5b8" },
  msgReceived: { backgroundColor: "#fff" },
  msgEditorSender: { fontSize: 10.5, fontWeight: "700", color: "#3390ec", fontFamily: "Inter_700Bold", marginBottom: 3 },
  msgEditorText: { fontSize: 14, color: "#0a0a0a", fontFamily: "Inter_400Regular" },
  msgEditorTime: { fontSize: 10.5, color: "#999", fontFamily: "Inter_400Regular", marginTop: 4, textAlign: "right" },
  msgActions: { flexDirection: "column", gap: 4, paddingTop: 4 },
  msgActionBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2, elevation: 1 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center", padding: 24 },
  modalBox: { backgroundColor: "#fff", borderRadius: 20, padding: 24, width: "100%", maxWidth: 340 },
  modalTitle: { fontSize: 17, fontWeight: "700", color: "#0a0a0a", fontFamily: "Inter_700Bold", marginBottom: 14 },
  modalFieldLabel: { fontSize: 12, color: "#888", fontFamily: "Inter_500Medium", marginBottom: 4, marginTop: 4 },
  modalInput: { borderWidth: 1.5, borderColor: "#3390ec", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: "#0a0a0a", fontFamily: "Inter_400Regular", marginBottom: 10, textAlignVertical: "top" },
  modalBtns: { flexDirection: "row", gap: 10, marginTop: 4 },
  modalCancel: { flex: 1, paddingVertical: 13, borderRadius: 12, backgroundColor: "#f0f0f0", alignItems: "center" },
  modalCancelText: { fontSize: 15, color: "#555", fontFamily: "Inter_600SemiBold" },
  modalSave: { flex: 1, paddingVertical: 13, borderRadius: 12, backgroundColor: "#3390ec", alignItems: "center" },
  modalSaveText: { fontSize: 15, color: "#fff", fontFamily: "Inter_600SemiBold" },
});
