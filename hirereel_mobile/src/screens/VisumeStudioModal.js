import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getShadow } from '../theme';
import { STUDIO_PROMPTS } from '../data/mockData';

export default function VisumeStudioModal({ visible, onClose, onShowToast, theme }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((s) => {
          if (s >= 120) {
            setIsRecording(false);
            return 120;
          }
          return s + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (!isRecording) {
      setSeconds(0);
      setIsRecording(true);
      onShowToast('🔴 Recording 2-min Visume Studio started!');
    } else {
      setIsRecording(false);
      onShowToast('💾 Visume recorded! Processing AI auto-captions...');
    }
  };

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentPrompt = STUDIO_PROMPTS[activeStep];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth }, getShadow(theme.shadowColor, 6)]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.iconBadge, { backgroundColor: theme.violet }]}>
                <Ionicons name="videocam" size={16} color="#FFFFFF" />
              </View>
              <Text style={[styles.title, { color: theme.ink }]}>2-Min Visume Studio</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border, borderWidth: 1 }]}>
              <Ionicons name="close" size={18} color={theme.ink} />
            </TouchableOpacity>
          </View>

          {/* Camera Viewfinder Mock */}
          <View style={[styles.viewfinder, { backgroundColor: '#0F1016', borderColor: isRecording ? '#EF4444' : theme.border, borderWidth: 2 }]}>
            {/* Top camera status bar */}
            <View style={styles.viewfinderTop}>
              <View style={[styles.recBadge, isRecording && { backgroundColor: '#EF4444' }]}>
                <View style={[styles.recDot, { backgroundColor: isRecording ? '#FFFFFF' : '#9CA3AF' }]} />
                <Text style={styles.recText}>{isRecording ? 'LIVE REC' : 'STANDBY'}</Text>
              </View>
              <View style={[styles.timerBadge, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                <Text style={styles.timerText}>{formatTime(seconds)} / 2:00</Text>
              </View>
            </View>

            {/* Visual audio waveform mock */}
            <View style={styles.waveContainer}>
              {[12, 24, 40, 18, 30, 48, 26, 14, 38, 22].map((height, i) => (
                <View
                  key={i}
                  style={[
                    styles.waveBar,
                    {
                      height: isRecording ? height : 6,
                      backgroundColor: isRecording ? theme.mint : 'rgba(255,255,255,0.2)',
                    },
                  ]}
                />
              ))}
            </View>

            {/* Prompt overlay card */}
            <View style={[styles.promptCard, { backgroundColor: 'rgba(25, 26, 35, 0.92)', borderColor: theme.border, borderWidth: 1 }]}>
              <View style={styles.promptHeader}>
                <Text style={[styles.promptStepText, { color: theme.yellow }]}>PROMPT 0{activeStep + 1} OF 03</Text>
                <Text style={styles.promptTimeWindow}>{currentPrompt.time}</Text>
              </View>
              <Text style={styles.promptTitle}>{currentPrompt.title}</Text>
              <Text style={styles.promptGuide}>{currentPrompt.guide}</Text>
            </View>
          </View>

          {/* Step selector pills */}
          <View style={styles.stepsRow}>
            {STUDIO_PROMPTS.map((step, idx) => (
              <TouchableOpacity
                key={step.step}
                style={[
                  styles.stepPill,
                  {
                    backgroundColor: activeStep === idx ? theme.violet : theme.surfaceElevated,
                    borderColor: theme.border,
                    borderWidth: 1.2,
                  },
                ]}
                onPress={() => setActiveStep(idx)}
              >
                <Text
                  style={[
                    styles.stepPillText,
                    { color: activeStep === idx ? '#FFFFFF' : theme.ink },
                  ]}
                >
                  0{idx + 1}. {step.title.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Record Actions Bar */}
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[
                styles.recordBtn,
                { backgroundColor: isRecording ? '#EF4444' : theme.mint, borderColor: theme.border, borderWidth: 2 },
                getShadow(theme.shadowColor, 3),
              ]}
              onPress={toggleRecording}
              activeOpacity={0.8}
            >
              <Ionicons name={isRecording ? 'stop' : 'radio-button-on'} size={24} color="#191A23" />
              <Text style={styles.recordBtnText}>
                {isRecording ? 'Finish & Save' : 'Start 2-Min Visume'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
    maxHeight: '92%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinder: {
    height: 280,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'space-between',
    padding: 12,
  },
  viewfinderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    gap: 6,
  },
  recDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  recText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
  },
  timerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  waveBar: {
    width: 4,
    borderRadius: 2,
  },
  promptCard: {
    padding: 10,
    borderRadius: 12,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  promptStepText: {
    fontSize: 9,
    fontWeight: '900',
  },
  promptTimeWindow: {
    color: '#9CA3AF',
    fontSize: 9,
    fontWeight: '700',
  },
  promptTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  promptGuide: {
    color: '#D1D5DB',
    fontSize: 10.5,
    lineHeight: 14,
  },
  stepsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  stepPill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    alignItems: 'center',
  },
  stepPillText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  controlsRow: {
    marginTop: 14,
  },
  recordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 16,
    gap: 8,
  },
  recordBtnText: {
    color: '#191A23',
    fontSize: 14,
    fontWeight: '900',
  },
});
