import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getShadow } from '../theme';

export default function MessagesScreen({ conversations, onShowToast, theme }) {
  const [activeThread, setActiveThread] = useState(conversations[0]);
  const [messages, setMessages] = useState(conversations[0].messages);
  const [inputMessage, setInputMessage] = useState('');
  const [interviewConfirmed, setInterviewConfirmed] = useState(false);

  const handleSelectThread = (thread) => {
    setActiveThread(thread);
    setMessages(thread.messages);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMsg = {
      id: 'm-' + Date.now(),
      sender: 'user',
      text: inputMessage.trim(),
      time: 'Just now',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Simulated reply after 1.2s
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: 'm-reply-' + Date.now(),
          sender: 'them',
          text: "Awesome! Looking forward to reviewing the contract scope. Let me know if you need any other sample visumes.",
          time: 'Just now',
        },
      ]);
    }, 1200);
  };

  const handleConfirmInterview = () => {
    setInterviewConfirmed(true);
    onShowToast('📅 15-min Screening confirmed! Calendar invite sent.');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Threads list horizontal bar */}
      <View style={styles.threadsBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.threadsScroll}>
          {conversations.map((t) => {
            const isSelected = activeThread.id === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                style={[
                  styles.threadChip,
                  {
                    backgroundColor: isSelected ? theme.violet : theme.surface,
                    borderColor: theme.border,
                    borderWidth: 1.5,
                  },
                  getShadow(theme.shadowColor, isSelected ? 2 : 1),
                ]}
                onPress={() => handleSelectThread(t)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: t.avatar }} style={styles.threadAvatar} />
                <View>
                  <Text
                    style={[
                      styles.threadName,
                      { color: isSelected ? '#FFFFFF' : theme.ink },
                    ]}
                  >
                    {t.name}
                  </Text>
                  {t.unread > 0 && !isSelected && (
                    <View style={[styles.unreadBadge, { backgroundColor: theme.yellow }]} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Interview Scheduling Banner */}
      <View
        style={[
          styles.interviewCard,
          { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth },
          getShadow(theme.shadowColor, 3),
        ]}
      >
        <View style={styles.interviewHeader}>
          <View style={[styles.calIcon, { backgroundColor: theme.yellow, borderColor: theme.border, borderWidth: 1 }]}>
            <Ionicons name="calendar" size={14} color="#191A23" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.interviewTitle, { color: theme.ink }]}>
              {interviewConfirmed ? 'Screening Confirmed' : 'Instant 15-Min Visume Call'}
            </Text>
            <Text style={[styles.interviewSub, { color: theme.muted }]}>
              {interviewConfirmed
                ? 'Tomorrow @ 3:00 PM EST (Google Meet link generated)'
                : `Slot proposed by ${activeThread.name}: Tomorrow @ 3:00 PM EST`}
            </Text>
          </View>
        </View>

        {!interviewConfirmed && (
          <TouchableOpacity
            style={[
              styles.confirmBtn,
              { backgroundColor: theme.mint, borderColor: theme.border, borderWidth: 1.5 },
              getShadow(theme.shadowColor, 2),
            ]}
            onPress={handleConfirmInterview}
          >
            <Ionicons name="checkmark-sharp" size={14} color={theme.onAccent} />
            <Text style={[styles.confirmBtnText, { color: theme.onAccent }]}>Confirm Meeting</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Messages Scroll Area */}
      <ScrollView
        style={styles.messagesScroll}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <View
              key={m.id}
              style={[
                styles.bubbleWrapper,
                isUser ? styles.bubbleWrapperUser : styles.bubbleWrapperThem,
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  isUser
                    ? {
                        backgroundColor: theme.violet,
                        borderColor: theme.border,
                        borderWidth: 1.5,
                      }
                    : {
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                        borderWidth: 1.5,
                      },
                  getShadow(theme.shadowColor, 2),
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    { color: isUser ? '#FFFFFF' : theme.ink },
                  ]}
                >
                  {m.text}
                </Text>
                <Text
                  style={[
                    styles.bubbleTime,
                    { color: isUser ? 'rgba(255,255,255,0.7)' : theme.muted },
                  ]}
                >
                  {m.time}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Chat Input Bar */}
      <View style={[styles.inputBar, { backgroundColor: theme.surface, borderColor: theme.border, borderTopWidth: theme.borderWidth }]}>
        <TextInput
          style={[
            styles.textInput,
            { backgroundColor: theme.surfaceElevated, borderColor: theme.border, borderWidth: 1.5, color: theme.ink },
          ]}
          placeholder={`Message ${activeThread.name}...`}
          placeholderTextColor={theme.muted}
          value={inputMessage}
          onChangeText={setInputMessage}
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            { backgroundColor: theme.violet, borderColor: theme.border, borderWidth: 1.5 },
            getShadow(theme.shadowColor, 2),
          ]}
          onPress={handleSendMessage}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  threadsBar: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  threadsScroll: {
    gap: 8,
  },
  threadChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
    gap: 8,
  },
  threadAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  threadName: {
    fontSize: 12,
    fontWeight: '700',
  },
  unreadBadge: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    top: -2,
    right: -8,
  },
  interviewCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    borderRadius: 14,
    gap: 8,
  },
  interviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  calIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  interviewTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  interviewSub: {
    fontSize: 10.5,
    marginTop: 1,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  confirmBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 10,
  },
  bubbleWrapper: {
    width: '100%',
  },
  bubbleWrapperUser: {
    alignItems: 'flex-end',
  },
  bubbleWrapperThem: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 14,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  bubbleTime: {
    fontSize: 9,
    marginTop: 4,
    textAlign: 'right',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    fontSize: 13,
    fontWeight: '500',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
