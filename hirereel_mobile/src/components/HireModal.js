import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getShadow } from '../theme';

export default function HireModal({ visible, talent, onClose, onConfirm, theme }) {
  if (!talent) return null;

  const [milestoneTitle, setMilestoneTitle] = useState('Phase 1: Discovery & Prototype');
  const [budget, setBudget] = useState(String(talent.hourlyRate * 20));
  const [note, setNote] = useState('Loved your 2-min visume. Want to kick off this week!');

  const handleHire = () => {
    onConfirm({
      talentId: talent.id,
      talentName: talent.name,
      milestoneTitle,
      amount: budget,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              borderWidth: theme.borderWidth,
            },
            getShadow(theme.shadowColor, 6),
          ]}
        >
          {/* Top handle bar */}
          <View style={[styles.handle, { backgroundColor: theme.muted }]} />

          <View style={styles.headerRow}>
            <View>
              <View style={styles.nameRow}>
                <Text style={[styles.talentName, { color: theme.ink }]}>{talent.name}</Text>
                {talent.verified && (
                  <View style={[styles.verifiedBadge, { backgroundColor: theme.mint, borderColor: theme.border, borderWidth: 1.2 }]}>
                    <Ionicons name="checkmark-sharp" size={10} color={theme.onAccent} />
                    <Text style={[styles.verifiedText, { color: theme.onAccent }]}>Verified</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.roleText, { color: theme.muted }]}>
                {talent.role} · ${talent.hourlyRate}/hr
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { borderColor: theme.border, borderWidth: 1.5 }]}>
              <Ionicons name="close" size={16} color={theme.ink} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            {/* Escrow Guarantee Pill */}
            <View style={[styles.guaranteeBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border, borderWidth: 1.5 }, getShadow(theme.shadowColor, 2)]}>
              <Ionicons name="shield-checkmark" size={18} color={theme.violet} />
              <Text style={[styles.guaranteeText, { color: theme.ink }]}>
                Milestone Escrow Protection: Funds are only released when you approve the deliverable.
              </Text>
            </View>

            <Text style={[styles.fieldLabel, { color: theme.ink }]}>Milestone Deliverable</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surfaceElevated, color: theme.ink, borderColor: theme.border, borderWidth: 1.5 }]}
              value={milestoneTitle}
              onChangeText={setMilestoneTitle}
              placeholder="e.g. Design System Phase 1"
              placeholderTextColor={theme.muted}
            />

            <Text style={[styles.fieldLabel, { color: theme.ink }]}>Escrow Amount ($ USD)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surfaceElevated, color: theme.ink, borderColor: theme.border, borderWidth: 1.5 }]}
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
              placeholder="1200"
              placeholderTextColor={theme.muted}
            />

            <Text style={[styles.fieldLabel, { color: theme.ink }]}>Project Kickoff Note</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: theme.surfaceElevated, color: theme.ink, borderColor: theme.border, borderWidth: 1.5 }]}
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
              placeholder="Brief message to candidate..."
              placeholderTextColor={theme.muted}
            />

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: theme.violet, borderColor: theme.border, borderWidth: 1.8 }, getShadow(theme.shadowColor, 3)]}
              onPress={handleHire}
              activeOpacity={0.85}
            >
              <Ionicons name="lock-closed" size={16} color="#FFFFFF" />
              <Text style={styles.submitBtnText}>Fund Escrow & Send Offer (${budget})</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    maxHeight: '85%',
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
    opacity: 0.4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  talentName: {
    fontSize: 20,
    fontWeight: '800',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 99,
    gap: 3,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: '800',
  },
  roleText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formScroll: {
    marginTop: 4,
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    gap: 8,
    marginBottom: 14,
  },
  guaranteeText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 15,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  textArea: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '500',
    minHeight: 70,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    marginBottom: 12,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
