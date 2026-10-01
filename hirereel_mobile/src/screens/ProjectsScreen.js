import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getShadow } from '../theme';

export default function ProjectsScreen({ projects, onShowToast, theme }) {
  const [projectList, setProjectList] = useState(projects);

  const handleAction = (projId, actionName) => {
    onShowToast(`Contract action: ${actionName} applied!`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Released':
        return theme.mint;
      case 'Funded in Escrow':
        return theme.yellow;
      case 'In Review':
        return theme.violet;
      default:
        return theme.surfaceElevated;
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <View style={styles.titleRow}>
        <View>
          <Text style={[styles.mainTitle, { color: theme.ink }]}>Milestone Escrow</Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>
            Funds held securely & released on verified approval.
          </Text>
        </View>
      </View>

      {/* Escrow summary widget */}
      <View
        style={[
          styles.summaryCard,
          { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth },
          getShadow(theme.shadowColor, 4),
        ]}
      >
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: theme.violet }]}>$3,200</Text>
          <Text style={[styles.statLabel, { color: theme.muted }]}>Total Active</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: theme.yellow }]}>$1,400</Text>
          <Text style={[styles.statLabel, { color: theme.muted }]}>In Escrow</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: theme.mint }]}>$1,800</Text>
          <Text style={[styles.statLabel, { color: theme.muted }]}>Paid Out</Text>
        </View>
      </View>

      {/* Projects List */}
      {projectList.map((proj) => (
        <View
          key={proj.id}
          style={[
            styles.projectCard,
            { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth },
            getShadow(theme.shadowColor, 4),
          ]}
        >
          {/* Project Title Row */}
          <View style={styles.projectHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.projectTitle, { color: theme.ink }]}>{proj.title}</Text>
              <Text style={[styles.clientName, { color: theme.muted }]}>
                Client: {proj.client} · Total: ${proj.totalBudget.toLocaleString()}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: theme.surfaceElevated, borderColor: theme.border, borderWidth: 1.2 }]}>
              <Text style={[styles.statusBadgeText, { color: theme.ink }]}>
                {proj.milestones.filter((m) => m.status === 'Released').length}/{proj.milestones.length} Done
              </Text>
            </View>
          </View>

          {/* Milestones accordion list */}
          <View style={styles.milestonesList}>
            {proj.milestones.map((ms, index) => {
              const chipColor = getStatusColor(ms.status);
              return (
                <View
                  key={ms.id}
                  style={[
                    styles.milestoneItem,
                    { backgroundColor: theme.surfaceElevated, borderColor: theme.border, borderWidth: 1.2 },
                  ]}
                >
                  <View style={styles.msLeft}>
                    <Text style={[styles.msIndex, { color: theme.muted }]}>0{index + 1}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.msTitle, { color: theme.ink }]}>{ms.title}</Text>
                      <Text style={[styles.msAmount, { color: theme.muted }]}>
                        ${ms.amount} · Due {ms.due}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.msChip, { backgroundColor: chipColor, borderColor: theme.border, borderWidth: 1 }]}>
                    <Text
                      style={[
                        styles.msChipText,
                        { color: ms.status === 'In Review' ? '#FFFFFF' : '#191A23' },
                      ]}
                    >
                      {ms.status}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Bottom Actions */}
          <View style={styles.cardFooter}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: theme.surfaceElevated, borderColor: theme.border, borderWidth: 1.5 },
                getShadow(theme.shadowColor, 2),
              ]}
              onPress={() => handleAction(proj.id, 'Submit Deliverables')}
            >
              <Ionicons name="cloud-upload-outline" size={14} color={theme.ink} />
              <Text style={[styles.actionBtnText, { color: theme.ink }]}>Submit Work</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: theme.mint, borderColor: theme.border, borderWidth: 1.5 },
                getShadow(theme.shadowColor, 2),
              ]}
              onPress={() => handleAction(proj.id, 'Release Next Milestone')}
            >
              <Ionicons name="checkmark-done" size={14} color={theme.onAccent} />
              <Text style={[styles.actionBtnText, { color: theme.onAccent }]}>Release Funds</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 36,
  },
  titleRow: {
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  summaryCard: {
    flexDirection: 'row',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 28,
  },
  projectCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  clientName: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  milestonesList: {
    gap: 8,
    marginBottom: 14,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 12,
  },
  msLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  msIndex: {
    fontSize: 12,
    fontWeight: '800',
  },
  msTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  msAmount: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  msChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  msChipText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 4,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 5,
  },
  actionBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
});
