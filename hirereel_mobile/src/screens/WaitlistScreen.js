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

export default function WaitlistScreen({ onShowToast, theme }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('freelancer');
  const [joined, setJoined] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [waitlistCount, setWaitlistCount] = useState(1847);

  const handleJoin = () => {
    if (!email || !email.includes('@')) {
      onShowToast('Please enter a valid email address');
      return;
    }

    const code = 'HR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setReferralCode(code);
    setWaitlistCount((prev) => prev + 1);
    setJoined(true);
    onShowToast(`🎉 You're #${waitlistCount + 1} in queue!`);
  };

  const handleCopyLink = () => {
    onShowToast('📋 Referral link copied to clipboard!');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Pill */}
      <View style={styles.headerPillContainer}>
        <View style={[styles.statusPill, { backgroundColor: theme.yellow, borderColor: theme.border, borderWidth: 1.5 }, getShadow(theme.shadowColor, 2)]}>
          <Text style={styles.statusPillText}>⚡ EARLY ACCESS COHORT 03</Text>
        </View>
      </View>

      {/* Main Title */}
      <Text style={[styles.heroTitle, { color: theme.ink }]}>
        Skip the 500-resume black hole.
      </Text>
      <Text style={[styles.heroSubtitle, { color: theme.muted }]}>
        Join top 1% tech talent & fast-hiring startups meeting through 2-minute verified video visumes.
      </Text>

      {/* Social Proof Counter Card */}
      <View
        style={[
          styles.counterCard,
          { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth },
          getShadow(theme.shadowColor, 4),
        ]}
      >
        <View style={styles.counterHeader}>
          <View style={[styles.liveDot, { backgroundColor: theme.mint }]} />
          <Text style={[styles.liveText, { color: theme.ink }]}>LIVE QUEUE STATUS</Text>
        </View>

        <View style={styles.counterNumberRow}>
          <Text style={[styles.counterNumber, { color: theme.violet }]}>
            {waitlistCount.toLocaleString()}
          </Text>
          <Text style={[styles.counterSub, { color: theme.muted }]}>members waiting</Text>
        </View>

        {/* Progress Bar for Wave 03 */}
        <View style={styles.progressContainer}>
          <View style={styles.progressLabelRow}>
            <Text style={[styles.progressLabel, { color: theme.muted }]}>Wave 3 Allocation</Text>
            <Text style={[styles.progressPercent, { color: theme.ink }]}>88% Full</Text>
          </View>
          <View style={[styles.progressBarBg, { backgroundColor: theme.surfaceElevated, borderColor: theme.border, borderWidth: 1 }]}>
            <View style={[styles.progressBarFill, { backgroundColor: theme.mint, width: '88%' }]} />
          </View>
        </View>
      </View>

      {/* Form or Success State */}
      {!joined ? (
        <View
          style={[
            styles.formCard,
            { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth },
            getShadow(theme.shadowColor, 4),
          ]}
        >
          <Text style={[styles.formTitle, { color: theme.ink }]}>Claim Your Priority Spot</Text>

          {/* Role selector */}
          <View style={styles.roleSelector}>
            {[
              { id: 'freelancer', label: 'Talent / Creator' },
              { id: 'client', label: 'Company / Recruiter' },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.roleButton,
                  role === item.id
                    ? { backgroundColor: theme.violet, borderColor: theme.border, borderWidth: 1.5 }
                    : { backgroundColor: theme.surfaceElevated, borderColor: theme.border, borderWidth: 1 },
                ]}
                onPress={() => setRole(item.id)}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    { color: role === item.id ? '#FFFFFF' : theme.ink },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Input field */}
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.surfaceElevated, borderColor: theme.border, borderWidth: 1.5, color: theme.ink },
            ]}
            placeholder="Enter your work email"
            placeholderTextColor={theme.muted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Submit button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: theme.violet, borderColor: theme.border, borderWidth: 1.5 },
              getShadow(theme.shadowColor, 3),
            ]}
            onPress={handleJoin}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Join Priority Waitlist</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={[
            styles.successCard,
            { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth },
            getShadow(theme.shadowColor, 4),
          ]}
        >
          <View style={[styles.successIconBadge, { backgroundColor: theme.mint, borderColor: theme.border, borderWidth: 1.5 }]}>
            <Ionicons name="checkmark-sharp" size={28} color={theme.onAccent} />
          </View>

          <Text style={[styles.successTitle, { color: theme.ink }]}>You're On The List!</Text>
          <Text style={[styles.successSubtitle, { color: theme.muted }]}>
            Check your inbox at <Text style={{ color: theme.ink, fontWeight: '700' }}>{email}</Text> for confirmation.
          </Text>

          {/* Referral Box */}
          <View style={[styles.referralBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border, borderWidth: 1.5 }]}>
            <Text style={[styles.referralHint, { color: theme.muted }]}>Skip 25 spots for every friend who joins:</Text>
            <View style={styles.codeRow}>
              <Text style={[styles.codeText, { color: theme.violet }]}>hirereel.io/join?ref={referralCode}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.copyBtn,
                { backgroundColor: theme.violet, borderColor: theme.border, borderWidth: 1.5 },
                getShadow(theme.shadowColor, 2),
              ]}
              onPress={handleCopyLink}
            >
              <Ionicons name="copy-outline" size={14} color="#FFFFFF" />
              <Text style={styles.copyBtnText}>Copy Link</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Perks summary */}
      <View style={styles.perksContainer}>
        {[
          { icon: 'shield-checkmark', title: 'Zero Commission Wave 01', desc: 'Keep 100% of your earnings for the first 90 days.' },
          { icon: 'videocam', title: 'Free Studio Polish', desc: 'Automated 1080p remastering & AI caption generation.' },
          { icon: 'flash', title: 'Instant Escrow Payouts', desc: 'Same-day release upon milestone approval.' },
        ].map((p, idx) => (
          <View
            key={idx}
            style={[
              styles.perkCard,
              { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1.5 },
              getShadow(theme.shadowColor, 2),
            ]}
          >
            <Ionicons name={p.icon} size={20} color={theme.violet} style={styles.perkIcon} />
            <View style={styles.perkContent}>
              <Text style={[styles.perkTitle, { color: theme.ink }]}>{p.title}</Text>
              <Text style={[styles.perkDesc, { color: theme.muted }]}>{p.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  headerPillContainer: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 99,
  },
  statusPillText: {
    color: '#191A23',
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 32,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 18,
  },
  counterCard: {
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
  },
  counterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  counterNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 12,
  },
  counterNumber: {
    fontSize: 34,
    fontWeight: '900',
  },
  counterSub: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: 4,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 11,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 99,
  },
  formCard: {
    padding: 18,
    borderRadius: 18,
    marginBottom: 18,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
  },
  roleButtonText: {
    fontSize: 11,
    fontWeight: '700',
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 14,
    gap: 6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  successCard: {
    padding: 22,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 18,
  },
  successIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
  referralBox: {
    width: '100%',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  referralHint: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },
  codeRow: {
    marginBottom: 10,
  },
  codeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  copyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  perksContainer: {
    gap: 10,
  },
  perkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
  },
  perkIcon: {
    marginRight: 12,
  },
  perkContent: {
    flex: 1,
  },
  perkTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  perkDesc: {
    fontSize: 11,
    marginTop: 2,
  },
});
