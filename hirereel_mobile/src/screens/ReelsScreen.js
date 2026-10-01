import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getShadow } from '../theme';

const { width, height } = Dimensions.get('window');

export default function ReelsScreen({
  freelancers,
  onHire,
  onMessage,
  onShare,
  theme,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [likedMap, setLikedMap] = useState({});

  const talent = freelancers[currentIndex] || freelancers[0];
  const isLiked = !!likedMap[talent.id];

  const handleNext = () => {
    if (currentIndex < freelancers.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(freelancers.length - 1);
    }
  };

  const toggleLike = () => {
    setLikedMap((prev) => ({
      ...prev,
      [talent.id]: !prev[talent.id],
    }));
  };

  return (
    <View style={[styles.container, { backgroundColor: '#000000' }]}>
      {/* Background Visume Video Preview */}
      <Image source={{ uri: talent.poster }} style={styles.videoPoster} resizeMode="cover" />

      {/* Dim overlay gradient effect */}
      <View style={styles.vignette} />

      {/* Top Wave / Progress Indicator */}
      <View style={styles.topIndicatorRow}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { backgroundColor: theme.mint }]} />
        </View>
        <View style={[styles.badgePill, { backgroundColor: 'rgba(0,0,0,0.65)', borderColor: theme.border, borderWidth: 1 }]}>
          <Ionicons name="time-outline" size={12} color="#FFFFFF" />
          <Text style={styles.badgePillText}>{talent.duration} VISUME</Text>
        </View>
      </View>

      {/* Right Action Rail (TikTok/Reels style) */}
      <View style={styles.actionRail}>
        {/* Sound toggle */}
        <TouchableOpacity
          style={[styles.railBtn, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1.5 }, getShadow(theme.shadowColor, 3)]}
          onPress={() => setIsMuted(!isMuted)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isMuted ? 'volume-mute' : 'volume-high'}
            size={20}
            color={theme.ink}
          />
        </TouchableOpacity>

        {/* Play / Pause toggle */}
        <TouchableOpacity
          style={[styles.railBtn, { backgroundColor: theme.violet, borderColor: theme.border, borderWidth: 1.5 }, getShadow(theme.shadowColor, 3)]}
          onPress={() => setIsPlaying(!isPlaying)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {/* Like Button */}
        <TouchableOpacity
          style={[styles.railBtn, { backgroundColor: isLiked ? theme.pink : theme.surface, borderColor: theme.border, borderWidth: 1.5 }, getShadow(theme.shadowColor, 3)]}
          onPress={toggleLike}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={20}
            color={isLiked ? '#191A23' : theme.ink}
          />
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity
          style={[styles.railBtn, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1.5 }, getShadow(theme.shadowColor, 3)]}
          onPress={() => onShare(talent)}
          activeOpacity={0.8}
        >
          <Ionicons name="share-social-outline" size={19} color={theme.ink} />
        </TouchableOpacity>

        {/* Chat Button */}
        <TouchableOpacity
          style={[styles.railBtn, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1.5 }, getShadow(theme.shadowColor, 3)]}
          onPress={() => onMessage(talent)}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubble-outline" size={18} color={theme.ink} />
        </TouchableOpacity>
      </View>

      {/* Reel Vertical Navigation Arrows */}
      <View style={styles.navArrowsRow}>
        <TouchableOpacity
          style={[styles.navArrowBtn, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1.5 }, getShadow(theme.shadowColor, 2)]}
          onPress={handlePrev}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-up" size={18} color={theme.ink} />
        </TouchableOpacity>
        <Text style={styles.indexCounter}>
          {currentIndex + 1} / {freelancers.length}
        </Text>
        <TouchableOpacity
          style={[styles.navArrowBtn, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1.5 }, getShadow(theme.shadowColor, 2)]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-down" size={18} color={theme.ink} />
        </TouchableOpacity>
      </View>

      {/* Bottom Candidate Card Info Overlay */}
      <View style={styles.bottomOverlay}>
        <View style={styles.candidateHeader}>
          <Text style={styles.talentName}>{talent.name}</Text>
          {talent.verified && (
            <View style={[styles.verifiedPill, { backgroundColor: theme.mint, borderColor: '#000', borderWidth: 1.2 }]}>
              <Ionicons name="checkmark-sharp" size={10} color="#191A23" />
              <Text style={styles.verifiedText}>VERIFIED</Text>
            </View>
          )}
        </View>

        <Text style={styles.talentHeadline} numberOfLines={2}>
          {talent.headline}
        </Text>

        {/* Chips row */}
        <View style={styles.chipsRow}>
          <View style={[styles.chip, { backgroundColor: '#FFFFFF', borderColor: '#000', borderWidth: 1.2 }]}>
            <Text style={styles.chipTextBold}>${talent.hourlyRate}/hr</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: theme.sun, borderColor: '#000', borderWidth: 1.2 }]}>
            <Text style={styles.chipTextBold}>★ {talent.rating}</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: '#FFFFFF', borderColor: '#000', borderWidth: 1.2 }]}>
            <Ionicons name="location-sharp" size={10} color="#000" />
            <Text style={styles.chipText}>{talent.location}</Text>
          </View>
        </View>

        {/* Skill tags */}
        <View style={styles.tagsRow}>
          {talent.tags.map((tag) => (
            <View
              key={tag}
              style={[
                styles.tagChip,
                { backgroundColor: theme.violetSoft, borderColor: '#000', borderWidth: 1.2 },
              ]}
            >
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Hire Action CTA */}
        <TouchableOpacity
          style={[
            styles.hireCtaBtn,
            {
              backgroundColor: theme.violet,
              borderColor: '#000000',
              borderWidth: 2,
            },
            getShadow('#000000', 4),
          ]}
          onPress={() => onHire(talent)}
          activeOpacity={0.88}
        >
          <Ionicons name="flash" size={16} color="#FFFFFF" />
          <Text style={styles.hireCtaText}>Hire / Book Interview</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
  },
  videoPoster: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  topIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    zIndex: 10,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    width: '65%',
    height: '100%',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  badgePillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  actionRail: {
    position: 'absolute',
    right: 14,
    top: '28%',
    alignItems: 'center',
    gap: 12,
    zIndex: 20,
  },
  railBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrowsRow: {
    position: 'absolute',
    right: 14,
    top: 70,
    alignItems: 'center',
    gap: 4,
    zIndex: 20,
  },
  navArrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexCounter: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 4,
  },
  bottomOverlay: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
  },
  candidateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  talentName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 99,
    gap: 3,
  },
  verifiedText: {
    color: '#191A23',
    fontSize: 9,
    fontWeight: '800',
  },
  talentHeadline: {
    color: '#E5E7EB',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    gap: 3,
  },
  chipTextBold: {
    color: '#191A23',
    fontSize: 11,
    fontWeight: '800',
  },
  chipText: {
    color: '#191A23',
    fontSize: 11,
    fontWeight: '600',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 14,
  },
  tagChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  tagText: {
    color: '#191A23',
    fontSize: 10,
    fontWeight: '700',
  },
  hireCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  hireCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
