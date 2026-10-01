import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
  Platform,
} from 'react-native';

import { lightTheme, darkTheme } from './src/theme';
import { FREELANCERS, PROJECTS, CONVERSATIONS } from './src/data/mockData';

import Header from './src/components/Header';
import BottomNav from './src/components/BottomNav';
import Toast from './src/components/Toast';
import HireModal from './src/components/HireModal';

import ReelsScreen from './src/screens/ReelsScreen';
import SearchScreen from './src/screens/SearchScreen';
import WaitlistScreen from './src/screens/WaitlistScreen';
import ProjectsScreen from './src/screens/ProjectsScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import AssistantScreen from './src/screens/AssistantScreen';
import VisumeStudioModal from './src/screens/VisumeStudioModal';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState('reels');
  const [selectedTalentForHire, setSelectedTalentForHire] = useState(null);
  const [studioOpen, setStudioOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Selected reel talent for switching from Search to Reels screen
  const [activeReelIndex, setActiveReelIndex] = useState(0);

  const theme = isDark ? darkTheme : lightTheme;

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  const handleSelectTalentFromSearch = (talent) => {
    const idx = FREELANCERS.findIndex((f) => f.id === talent.id);
    if (idx !== -1) {
      setActiveReelIndex(idx);
    }
    setActiveTab('reels');
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.bg }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />

      {/* Responsive mobile container */}
      <View style={[styles.mobileWrapper, { backgroundColor: theme.bg }]}>
        {/* Top Header */}
        <Header
          theme={theme}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
          onOpenStudio={() => setStudioOpen(true)}
        />

        {/* Dynamic Screen Area */}
        <View style={styles.screenContainer}>
          {activeTab === 'reels' && (
            <ReelsScreen
              freelancers={FREELANCERS}
              initialIndex={activeReelIndex}
              onHireTalent={(talent) => setSelectedTalentForHire(talent)}
              onShowToast={showToast}
              theme={theme}
            />
          )}

          {activeTab === 'search' && (
            <SearchScreen
              freelancers={FREELANCERS}
              onSelectTalent={handleSelectTalentFromSearch}
              onHireTalent={(talent) => setSelectedTalentForHire(talent)}
              theme={theme}
            />
          )}

          {activeTab === 'waitlist' && (
            <WaitlistScreen
              onShowToast={showToast}
              theme={theme}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsScreen
              projects={PROJECTS}
              onShowToast={showToast}
              theme={theme}
            />
          )}

          {activeTab === 'chat' && (
            <MessagesScreen
              conversations={CONVERSATIONS}
              onShowToast={showToast}
              theme={theme}
            />
          )}

          {activeTab === 'assistant' && (
            <AssistantScreen
              onSelectTalent={handleSelectTalentFromSearch}
              onShowToast={showToast}
              theme={theme}
            />
          )}
        </View>

        {/* Bottom Tab Navigation */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          theme={theme}
        />

        {/* Modals & Overlays */}
        <HireModal
          visible={!!selectedTalentForHire}
          talent={selectedTalentForHire}
          onClose={() => setSelectedTalentForHire(null)}
          onConfirm={(payload) => {
            setSelectedTalentForHire(null);
            showToast(`✅ Escrow funded for ${payload.talentName}!`);
          }}
          theme={theme}
        />

        <VisumeStudioModal
          visible={studioOpen}
          onClose={() => setStudioOpen(false)}
          onShowToast={showToast}
          theme={theme}
        />

        {/* Global Toast */}
        <Toast
          visible={!!toastMessage}
          message={toastMessage || ''}
          onDismiss={() => setToastMessage(null)}
          theme={theme}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  mobileWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 480, // Mobile device frame simulation on web/desktop
    overflow: 'hidden',
    ...Platform.select({
      web: {
        height: '100vh',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      },
    }),
  },
  screenContainer: {
    flex: 1,
  },
});
