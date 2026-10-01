import React, { useState, useMemo } from 'react';
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

const SKILLS = ['All', 'React', 'Next.js', 'Figma', 'UI/UX', 'AI/ML', 'Python'];

export default function SearchScreen({ freelancers, onSelectTalent, onHireTalent, theme }) {
  const [query, setQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filtered = useMemo(() => {
    return freelancers.filter((f) => {
      const matchQuery =
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.role.toLowerCase().includes(query.toLowerCase()) ||
        f.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));

      const matchSkill =
        selectedSkill === 'All' ||
        f.tags.some((t) => t.toLowerCase().includes(selectedSkill.toLowerCase())) ||
        f.skills.some((s) => s.toLowerCase().includes(selectedSkill.toLowerCase()));

      const matchVerified = !verifiedOnly || f.verified;

      return matchQuery && matchSkill && matchVerified;
    });
  }, [freelancers, query, selectedSkill, verifiedOnly]);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Search Header Bar */}
      <View style={styles.searchBoxContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth }, getShadow(theme.shadowColor, 3)]}>
          <Ionicons name="search" size={18} color={theme.muted} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.ink }]}
            placeholder="Search talent, skills, or roles..."
            placeholderTextColor={theme.muted}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={theme.muted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Skill filter chips horizontal scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterScrollContent}>
          {SKILLS.map((skill) => {
            const isSelected = selectedSkill === skill;
            return (
              <TouchableOpacity
                key={skill}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? theme.violet : theme.surface,
                    borderColor: theme.border,
                    borderWidth: 1.5,
                  },
                  getShadow(theme.shadowColor, isSelected ? 2 : 1),
                ]}
                onPress={() => setSelectedSkill(skill)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: isSelected ? '#FFFFFF' : theme.ink },
                  ]}
                >
                  {skill}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor: verifiedOnly ? theme.mint : theme.surface,
                borderColor: theme.border,
                borderWidth: 1.5,
              },
              getShadow(theme.shadowColor, verifiedOnly ? 2 : 1),
            ]}
            onPress={() => setVerifiedOnly(!verifiedOnly)}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle" size={14} color={theme.onAccent} />
            <Text style={[styles.filterChipText, { color: theme.onAccent }]}>
              Verified Only
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Talent Count */}
      <View style={styles.countRow}>
        <Text style={[styles.countText, { color: theme.muted }]}>
          Showing <Text style={{ color: theme.ink, fontWeight: '800' }}>{filtered.length}</Text> verified freelancers
        </Text>
      </View>

      {/* Talent List */}
      <ScrollView style={styles.listScroll} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filtered.map((talent) => (
          <View
            key={talent.id}
            style={[
              styles.talentCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                borderWidth: theme.borderWidth,
              },
              getShadow(theme.shadowColor, 4),
            ]}
          >
            <View style={styles.cardHeader}>
              <Image source={{ uri: talent.poster }} style={styles.avatar} />
              <View style={styles.cardHeaderInfo}>
                <View style={styles.nameRow}>
                  <Text style={[styles.cardName, { color: theme.ink }]}>{talent.name}</Text>
                  {talent.verified && (
                    <View style={[styles.verifiedBadge, { backgroundColor: theme.mint, borderColor: theme.border, borderWidth: 1.2 }]}>
                      <Ionicons name="checkmark-sharp" size={9} color={theme.onAccent} />
                      <Text style={[styles.verifiedText, { color: theme.onAccent }]}>Verified</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.cardRole, { color: theme.muted }]}>
                  {talent.role} · ${talent.hourlyRate}/hr
                </Text>
                <Text style={[styles.ratingText, { color: theme.ink }]}>
                  ★ {talent.rating} ({talent.reviewCount} reviews) · {talent.location}
                </Text>
              </View>
            </View>

            <Text style={[styles.cardHeadline, { color: theme.ink }]} numberOfLines={2}>
              "{talent.headline}"
            </Text>

            {/* Skills chips */}
            <View style={styles.skillsRow}>
              {talent.tags.map((tag) => (
                <View
                  key={tag}
                  style={[
                    styles.tagBadge,
                    { backgroundColor: theme.surfaceElevated, borderColor: theme.border, borderWidth: 1.2 },
                  ]}
                >
                  <Text style={[styles.tagBadgeText, { color: theme.ink }]}>{tag}</Text>
                </View>
              ))}
            </View>

            {/* Action buttons */}
            <View style={styles.cardActionsRow}>
              <TouchableOpacity
                style={[
                  styles.watchReelBtn,
                  { backgroundColor: theme.surfaceElevated, borderColor: theme.border, borderWidth: 1.5 },
                  getShadow(theme.shadowColor, 2),
                ]}
                onPress={() => onSelectTalent(talent)}
                activeOpacity={0.8}
              >
                <Ionicons name="play" size={14} color={theme.violet} />
                <Text style={[styles.watchReelText, { color: theme.violet }]}>Watch Visume ({talent.duration})</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.hireBtn,
                  { backgroundColor: theme.violet, borderColor: theme.border, borderWidth: 1.5 },
                  getShadow(theme.shadowColor, 2),
                ]}
                onPress={() => onHireTalent(talent)}
                activeOpacity={0.8}
              >
                <Text style={styles.hireBtnText}>Hire</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {filtered.length === 0 && (
          <View style={[styles.emptyBox, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1.5 }]}>
            <Ionicons name="search-outline" size={36} color={theme.muted} />
            <Text style={[styles.emptyTitle, { color: theme.ink }]}>No talent found</Text>
            <Text style={[styles.emptySubtitle, { color: theme.muted }]}>
              Try adjusting your search query or removing the filters.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBoxContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterScrollContent: {
    gap: 8,
    paddingVertical: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    gap: 4,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  countRow: {
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  countText: {
    fontSize: 12,
  },
  listScroll: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 14,
  },
  talentCard: {
    padding: 14,
    borderRadius: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#191A23',
    marginRight: 12,
  },
  cardHeaderInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '800',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 99,
    gap: 2,
  },
  verifiedText: {
    fontSize: 8.5,
    fontWeight: '800',
  },
  cardRole: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  cardHeadline: {
    fontSize: 13,
    fontWeight: '500',
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: 10,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 12,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  tagBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  watchReelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 12,
    gap: 6,
  },
  watchReelText: {
    fontSize: 12,
    fontWeight: '800',
  },
  hireBtn: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hireBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  emptyBox: {
    padding: 30,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});
