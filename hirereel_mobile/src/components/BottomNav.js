import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getShadow } from '../theme';

const TABS = [
  { key: 'reels', label: 'Reels', icon: 'play-circle' },
  { key: 'search', label: 'Talent', icon: 'search' },
  { key: 'waitlist', label: 'Waitlist', icon: 'flash' },
  { key: 'projects', label: 'Escrow', icon: 'shield-checkmark' },
  { key: 'chat', label: 'Chat', icon: 'chatbubble-ellipses' },
  { key: 'assistant', label: 'AI RAG', icon: 'sparkles' },
];

export default function BottomNav({ activeTab, onChangeTab, theme }) {
  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderTopColor: theme.border, borderTopWidth: theme.borderWidth }]}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabBtn,
              isActive && [styles.activeTabBtn, { backgroundColor: theme.violetSoft, borderColor: theme.border, borderWidth: 1.5 }, getShadow(theme.shadowColor, 2)],
            ]}
            onPress={() => onChangeTab(tab.key)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={tab.icon}
              size={isActive ? 19 : 18}
              color={isActive ? theme.onAccent : theme.muted}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? theme.onAccent : theme.muted },
                isActive && styles.activeTabLabel,
              ]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
    paddingBottom: 4,
  },
  tabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 12,
    minWidth: 50,
  },
  activeTabBtn: {
    transform: [{ translateY: -2 }],
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  activeTabLabel: {
    fontWeight: '800',
  },
});
