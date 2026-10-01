import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getShadow } from '../theme';

const SUGGESTIONS = [
  'Who is best for high-performance React & Next.js?',
  'Find talent under $60/hr with top ratings',
  'Who has verified experience with AI/ML & Python?',
];

export default function AssistantScreen({ onSelectTalent, onShowToast, theme }) {
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'bot',
      text: "👋 Hi! I'm the HireReel AI Candidate Assistant powered by RAG vector search. Ask me anything about candidate portfolios, stack proficiency, or hourly budgets.",
      sources: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg = { id: 'usr-' + Date.now(), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Contextual RAG matching
    setTimeout(() => {
      let botResponse = '';
      let sources = [];

      const qLower = query.toLowerCase();
      if (qLower.includes('react') || qLower.includes('next.js') || qLower.includes('frontend')) {
        botResponse =
          "Based on indexed visumes, **Aria Kapoor** is your highest-rated React/Next.js engineer (★ 4.98). She has 6+ years shipping low-latency web apps and motion interfaces.";
        sources = ['Aria Kapoor (Visume 01:54)', 'Next.js 14 Benchmark'];
      } else if (qLower.includes('under') || qLower.includes('60') || qLower.includes('rate') || qLower.includes('budget')) {
        botResponse =
          "**Kenji Sato** ($50/hr, ★ 4.91) and **Dev Patel** ($55/hr, ★ 4.89) offer top verified value with 100% video milestone verification.";
        sources = ['Kenji Sato profile', 'Dev Patel visume'];
      } else if (qLower.includes('ai') || qLower.includes('python') || qLower.includes('ml')) {
        botResponse =
          "**Sofia Alvarez** is our verified AI/ML Systems specialist (★ 4.97, $85/hr). Her visume highlights ChromaDB, FastEmbed, and LLM orchestration deployments.";
        sources = ['Sofia Alvarez (Visume 02:00)', 'AI/ML Portfolio'];
      } else {
        botResponse =
          "I searched the HireReel database. We have 6 pre-vetted engineers & designers ready for same-day 15-minute visume screenings.";
        sources = ['HireReel Index v3'];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: botResponse,
          sources,
        },
      ]);
      setLoading(false);
    }, 900);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Bot Header Card */}
      <View
        style={[
          styles.botHeader,
          { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth },
          getShadow(theme.shadowColor, 3),
        ]}
      >
        <View style={[styles.botIconBadge, { backgroundColor: theme.violet }]}>
          <Ionicons name="sparkles" size={18} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.botTitle, { color: theme.ink }]}>HireReel RAG Copilot</Text>
          <Text style={[styles.botSubtitle, { color: theme.muted }]}>
            Semantic candidate matching from 1,200+ video visume transcripts
          </Text>
        </View>
        <View style={[styles.ragActiveDot, { backgroundColor: theme.mint }]} />
      </View>

      {/* Suggested queries */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsBar} contentContainerStyle={styles.suggestionsContent}>
        {SUGGESTIONS.map((s, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.suggestionChip,
              { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1.2 },
              getShadow(theme.shadowColor, 1),
            ]}
            onPress={() => handleSend(s)}
          >
            <Text style={[styles.suggestionText, { color: theme.ink }]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Messages */}
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
                styles.messageRow,
                isUser ? styles.messageRowUser : styles.messageRowBot,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  isUser
                    ? { backgroundColor: theme.violet, borderColor: theme.border, borderWidth: 1.5 }
                    : { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1.5 },
                  getShadow(theme.shadowColor, 2),
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    { color: isUser ? '#FFFFFF' : theme.ink },
                  ]}
                >
                  {m.text}
                </Text>

                {m.sources && m.sources.length > 0 && (
                  <View style={styles.sourcesContainer}>
                    <Text style={[styles.sourcesHeader, { color: theme.muted }]}>VERIFIED SOURCES:</Text>
                    <View style={styles.sourcesList}>
                      {m.sources.map((src, i) => (
                        <View
                          key={i}
                          style={[
                            styles.sourcePill,
                            { backgroundColor: theme.surfaceElevated, borderColor: theme.border, borderWidth: 1 },
                          ]}
                        >
                          <Ionicons name="document-text-outline" size={10} color={theme.violet} />
                          <Text style={[styles.sourceText, { color: theme.ink }]}>{src}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </View>
          );
        })}

        {loading && (
          <View style={styles.loadingBubble}>
            <View style={[styles.loadingDot, { backgroundColor: theme.violet }]} />
            <Text style={[styles.loadingText, { color: theme.muted }]}>Searching candidate transcripts...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={[styles.inputBar, { backgroundColor: theme.surface, borderColor: theme.border, borderTopWidth: theme.borderWidth }]}>
        <TextInput
          style={[
            styles.textInput,
            { backgroundColor: theme.surfaceElevated, borderColor: theme.border, borderWidth: 1.5, color: theme.ink },
          ]}
          placeholder="Ask about skills, rates, or experience..."
          placeholderTextColor={theme.muted}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => handleSend(input)}
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            { backgroundColor: theme.violet, borderColor: theme.border, borderWidth: 1.5 },
            getShadow(theme.shadowColor, 2),
          ]}
          onPress={() => handleSend(input)}
          activeOpacity={0.8}
        >
          <Ionicons name="send" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  botHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    padding: 12,
    borderRadius: 16,
    gap: 10,
  },
  botIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  botSubtitle: {
    fontSize: 10.5,
    marginTop: 1,
  },
  ragActiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  suggestionsBar: {
    flexGrow: 0,
    marginBottom: 8,
  },
  suggestionsContent: {
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 4,
  },
  suggestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  suggestionText: {
    fontSize: 11,
    fontWeight: '600',
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  messageRow: {
    width: '100%',
  },
  messageRowUser: {
    alignItems: 'flex-end',
  },
  messageRowBot: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 16,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  sourcesContainer: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  sourcesHeader: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sourcesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  sourcePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  sourceText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  loadingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  loadingText: {
    fontSize: 11,
    fontStyle: 'italic',
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
    paddingVertical: 10,
    borderRadius: 12,
    fontSize: 13,
    fontWeight: '500',
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
