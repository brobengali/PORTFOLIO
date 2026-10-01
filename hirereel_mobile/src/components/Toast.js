import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getShadow } from '../theme';

export default function Toast({ message, visible, onDismiss, theme, type = 'success' }) {
  const translateY = useRef(new Animated.Value(-80)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 12,
        useNativeDriver: true,
        friction: 6,
      }).start();

      const timer = setTimeout(() => {
        hide();
      }, 3500);

      return () => clearTimeout(timer);
    } else {
      hide();
    }
  }, [visible]);

  const hide = () => {
    Animated.timing(translateY, {
      toValue: -80,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (onDismiss) onDismiss();
    });
  };

  if (!visible) return null;

  const bgColor = type === 'error' ? theme.pink : theme.mint;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          borderColor: theme.border,
          borderWidth: theme.borderWidth,
          transform: [{ translateY }],
        },
        getShadow(theme.shadowColor, 3),
      ]}
    >
      <Ionicons
        name={type === 'error' ? 'alert-circle' : 'checkmark-circle'}
        size={20}
        color={theme.onAccent}
        style={styles.icon}
      />
      <Text style={[styles.message, { color: theme.onAccent }]} numberOfLines={2}>
        {message}
      </Text>
      <TouchableOpacity onPress={hide} style={styles.closeBtn}>
        <Ionicons name="close" size={16} color={theme.onAccent} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  icon: {
    marginRight: 8,
  },
  message: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
    marginLeft: 6,
  },
});
