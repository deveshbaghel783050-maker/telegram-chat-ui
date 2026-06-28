import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ChatFolder, Project, useAutomation } from "@/context/AutomationContext";

type View = "projects" | "chats" | "screenshots";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function FilesModal({ visible, onClose }: Props) {
  const { projects, deleteProject, clearAll } = useAutomation();
  const [view, setView] = useState<View>("projects");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatFolder | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  function goBack() {
    if (lightboxUrl) { setLightboxUrl(null); return; }
    if (view === "screenshots") { setView("chats"); setSelectedChat(null); return; }
    if (view === "chats") { setView("projects"); setSelectedProject(null); return; }
    onClose();
  }

  function handleClose() {
    setView("projects");
    setSelectedProject(null);
    setSelectedChat(null);
    setLightboxUrl(null);
    onClose();
  }

  function handleDeleteProject(p: Project) {
    if (Platform.OS === "web") {
      deleteProject(p.id);
      return;
    }
    Alert.alert("Delete Project", `Delete "${p.name}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteProject(p.id) },
    ]);
  }

  const breadcrumb =
    view === "projects" ? "Files"
    : view === "chats" ? selectedProject?.name ?? ""
    : selectedChat?.user.name ?? "";

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.root}>

        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={goBack}>
            <Ionicons name="arrow-back" size={22} color="#0a0a0a" />
          </Pressable>
          <View style={styles.headerCenter}>
            <Ionicons name="folder-open" size={18} color="#3390ec" />
            <Text style={styles.headerTitle}>{breadcrumb}</Text>
          </View>
          <Pressable style={styles.closeBtn} onPress={handleClose}>
            <Feather name="x" size={20} color="#666" />
          </Pressable>
        </View>

        {/* Breadcrumb path */}
        {view !== "projects" && (
          <View style={styles.breadcrumbBar}>
            <Pressable onPress={() => { setView("projects"); setSelectedProject(null); setSelectedChat(null); }}>
              <Text style={styles.breadcrumbLink}>Files</Text>
            </Pressable>
            {selectedProject && (
              <>
                <Text style={styles.breadcrumbSep}> / </Text>
                <Pressable onPress={() => view === "screenshots" ? (setView("chats"), setSelectedChat(null)) : null}>
                  <Text style={[styles.breadcrumbLink, view === "chats" && styles.breadcrumbCurrent]}>
                    {selectedProject.name}
                  </Text>
                </Pressable>
              </>
            )}
            {selectedChat && (
              <>
                <Text style={styles.breadcrumbSep}> / </Text>
                <Text style={styles.breadcrumbCurrent}>{selectedChat.user.name}</Text>
              </>
            )}
          </View>
        )}

        <ScrollView style={styles.content} contentContainerStyle={styles.contentPad} showsVerticalScrollIndicator={false}>

          {/* PROJECTS VIEW */}
          {view === "projects" && (
            <>
              {projects.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons name="folder-open-outline" size={64} color="#ccc" />
                  <Text style={styles.emptyTitle}>No Projects Yet</Text>
                  <Text style={styles.emptySubtitle}>Run Automation to generate chat screenshot projects</Text>
                </View>
              )}
              {projects.map((p) => (
                <Pressable
                  key={p.id}
                  style={styles.projectCard}
                  onPress={() => { setSelectedProject(p); setView("chats"); }}
                >
                  <View style={styles.folderIconWrap}>
                    <Ionicons name="folder" size={36} color="#f9a825" />
                    <Text style={styles.folderCount}>{p.chats.length}</Text>
                  </View>
                  <View style={styles.projectInfo}>
                    <Text style={styles.projectName}>{p.name}</Text>
                    <Text style={styles.projectMeta}>{p.chats.length} chats · {p.screenshotCount} screenshots</Text>
                    <Text style={styles.projectDate}>{p.createdAt}</Text>
                  </View>
                  <Pressable style={styles.deleteBtn} onPress={() => handleDeleteProject(p)}>
                    <Feather name="trash-2" size={17} color="#ff7675" />
                  </Pressable>
                </Pressable>
              ))}
              {projects.length > 0 && (
                <Pressable style={styles.clearBtn} onPress={() => {
                  if (Platform.OS === "web") { clearAll(); return; }
                  Alert.alert("Clear All", "Delete all projects?", [
                    { text: "Cancel", style: "cancel" },
                    { text: "Clear All", style: "destructive", onPress: clearAll },
                  ]);
                }}>
                  <Feather name="trash" size={15} color="#ff7675" />
                  <Text style={styles.clearBtnText}>Clear All Projects</Text>
                </Pressable>
              )}
            </>
          )}

          {/* CHATS VIEW */}
          {view === "chats" && selectedProject && (
            <>
              <Text style={styles.viewHint}>{selectedProject.chats.length} chat folders</Text>
              {selectedProject.chats.map((chat) => (
                <Pressable
                  key={chat.id}
                  style={styles.chatCard}
                  onPress={() => { setSelectedChat(chat); setView("screenshots"); }}
                >
                  <View style={[styles.chatAvatar, { backgroundColor: chat.user.avatarColor }]}>
                    <Text style={styles.chatAvatarText}>{chat.user.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.chatInfo}>
                    <Text style={styles.chatName}>{chat.user.name}</Text>
                    <Text style={styles.chatUsername}>{chat.user.username}</Text>
                    <Text style={styles.chatMeta}>{chat.messages.length} messages · {chat.screenshots.length} screenshot{chat.screenshots.length !== 1 ? "s" : ""}</Text>
                  </View>
                  <View style={styles.chatRight}>
                    <Ionicons name="image-outline" size={16} color="#aaa" />
                    <Text style={styles.chatTime}>{chat.createdAt}</Text>
                    <Ionicons name="chevron-forward" size={16} color="#ccc" />
                  </View>
                </Pressable>
              ))}
            </>
          )}

          {/* SCREENSHOTS VIEW */}
          {view === "screenshots" && selectedChat && (
            <>
              <Text style={styles.viewHint}>{selectedChat.screenshots.length} screenshot{selectedChat.screenshots.length !== 1 ? "s" : ""}</Text>

              {/* Chat preview */}
              <View style={styles.chatPreviewCard}>
                <View style={[styles.chatPreviewAvatar, { backgroundColor: selectedChat.user.avatarColor }]}>
                  <Text style={styles.chatAvatarText}>{selectedChat.user.name.charAt(0)}</Text>
                </View>
                <View>
                  <Text style={styles.chatName}>{selectedChat.user.name}</Text>
                  <Text style={styles.chatUsername}>{selectedChat.user.username} · {selectedChat.user.phone}</Text>
                </View>
              </View>

              {/* Messages preview */}
              <View style={styles.messagesPreview}>
                {selectedChat.messages.map((m) => (
                  <View key={m.id} style={[styles.msgRow, m.sent && styles.msgRowSent]}>
                    <View style={[styles.msgBubble, m.sent ? styles.msgSent : styles.msgReceived]}>
                      <Text style={styles.msgText}>{m.text}</Text>
                      <Text style={styles.msgTime}>{m.time}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Screenshots grid */}
              {selectedChat.screenshots.length > 0 && (
                <>
                  <Text style={[styles.viewHint, { marginTop: 12 }]}>📸 Screenshots</Text>
                  <View style={styles.ssGrid}>
                    {selectedChat.screenshots.map((ss) => (
                      <Pressable key={ss.id} style={styles.ssCard} onPress={() => setLightboxUrl(ss.dataUrl)}>
                        <Image source={{ uri: ss.dataUrl }} style={styles.ssThumb} contentFit="cover" />
                        <Text style={styles.ssLabel} numberOfLines={1}>{ss.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                </>
              )}

              {selectedChat.screenshots.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons name="image-outline" size={44} color="#ccc" />
                  <Text style={styles.emptySubtitle}>No screenshots (web only feature)</Text>
                </View>
              )}
            </>
          )}
        </ScrollView>

        {/* Lightbox */}
        {lightboxUrl && (
          <Modal visible transparent animationType="fade" onRequestClose={() => setLightboxUrl(null)}>
            <Pressable style={styles.lightboxOverlay} onPress={() => setLightboxUrl(null)}>
              <Image source={{ uri: lightboxUrl }} style={styles.lightboxImg} contentFit="contain" />
              <Pressable style={styles.lightboxClose} onPress={() => setLightboxUrl(null)}>
                <Feather name="x" size={22} color="#fff" />
              </Pressable>
            </Pressable>
          </Modal>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingTop: Platform.OS === "web" ? 50 : 54,
    paddingBottom: 14,
    gap: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e8e8e8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  backBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0a0a0a",
    fontFamily: "Inter_700Bold",
  },
  closeBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  breadcrumbBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f0f0f0",
  },
  breadcrumbLink: {
    fontSize: 13,
    color: "#3390ec",
    fontFamily: "Inter_500Medium",
  },
  breadcrumbSep: {
    fontSize: 13,
    color: "#bbb",
    fontFamily: "Inter_400Regular",
  },
  breadcrumbCurrent: {
    color: "#444",
    fontFamily: "Inter_600SemiBold",
  },
  content: { flex: 1 },
  contentPad: { padding: 16, paddingBottom: 40 },
  viewHint: {
    fontSize: 12,
    color: "#999",
    fontFamily: "Inter_400Regular",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 40,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#666",
    fontFamily: "Inter_700Bold",
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#aaa",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  projectCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  folderIconWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 52,
    height: 52,
  },
  folderCount: {
    position: "absolute",
    bottom: 2,
    right: 2,
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
    backgroundColor: "#f9a825",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    fontFamily: "Inter_700Bold",
  },
  projectInfo: { flex: 1 },
  projectName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0a0a0a",
    fontFamily: "Inter_700Bold",
  },
  projectMeta: {
    fontSize: 12,
    color: "#777",
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  projectDate: {
    fontSize: 11,
    color: "#bbb",
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  deleteBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#fff0f0",
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#ffcdd2",
    backgroundColor: "#fff5f5",
    marginTop: 6,
  },
  clearBtnText: {
    fontSize: 14,
    color: "#ff7675",
    fontFamily: "Inter_600SemiBold",
  },
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  chatAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  chatPreviewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  chatAvatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Inter_700Bold",
  },
  chatInfo: { flex: 1 },
  chatName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0a0a0a",
    fontFamily: "Inter_700Bold",
  },
  chatUsername: {
    fontSize: 12,
    color: "#888",
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  chatMeta: {
    fontSize: 11,
    color: "#bbb",
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  chatRight: {
    alignItems: "center",
    gap: 4,
  },
  chatTime: {
    fontSize: 11,
    color: "#bbb",
    fontFamily: "Inter_400Regular",
  },
  chatPreviewCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  messagesPreview: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    gap: 6,
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  msgRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  msgRowSent: {
    justifyContent: "flex-end",
  },
  msgBubble: {
    maxWidth: "78%",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 2,
  },
  msgSent: { backgroundColor: "#d4f5b8", borderTopRightRadius: 4 },
  msgReceived: { backgroundColor: "#f2f2f2", borderTopLeftRadius: 4 },
  msgText: {
    fontSize: 14,
    color: "#0a0a0a",
    fontFamily: "Inter_400Regular",
  },
  msgTime: {
    fontSize: 10,
    color: "#aaa",
    fontFamily: "Inter_400Regular",
    alignSelf: "flex-end",
  },
  ssGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  ssCard: {
    width: "46%",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  ssThumb: {
    width: "100%",
    height: 180,
  },
  ssLabel: {
    fontSize: 11,
    color: "#555",
    fontFamily: "Inter_400Regular",
    padding: 8,
    backgroundColor: "#fafafa",
  },
  lightboxOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.93)",
    justifyContent: "center",
    alignItems: "center",
  },
  lightboxImg: {
    width: "90%",
    height: "85%",
    borderRadius: 12,
  },
  lightboxClose: {
    position: "absolute",
    top: 50,
    right: 20,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 24,
  },
});
