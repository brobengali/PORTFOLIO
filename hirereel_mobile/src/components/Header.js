import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getShadow } from '../theme';

export default function Header({ theme, isDark, onToggleTheme, activeTab, onOpenStudio }) {
  return (
    <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border, borderBottomWidth: theme.borderWidth }]}>
      <View style={styles.leftRow}>
        <Text style={[styles.logo, { color: theme.ink }]}>hirereel</Text>
        <View style={[styles.liveBadge, { backgroundColor: theme.mint, borderColor: theme.border, borderWidth: 1.5 }, getShadow(theme.shadowColor, 2)]}>
          <View style={[styles.dot, { backgroundColor: theme.ink }]} />
          <Text style={[styles.liveText, { color: theme.onAccent }]}>MOBILE</Text>
        </View>
      </View>

      <View style={styles.rightRow}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border, borderWidth: 1.5 }, getShadow(theme.shadowColor, 2)]}
          onPress={onOpenStudio}
          activeOpacity={0.8}
        >
          <Ionicons name="videocam-outline" size={18} color={theme.violet} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: isDark ? theme.sun : theme.surfaceElevated, borderColor: theme.border, borderWidth: 1.5 }, getShadow(theme.shadowColor, 2)]}
          onPress={onToggleTheme}
          activeOpacity={0.8}
        >
          <Ionicons name={isDark ? "sunny" : "moon"} size={17} color={isDark ? "#191A23" : theme.ink} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 40,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 99,
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
