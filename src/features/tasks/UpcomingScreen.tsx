import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SectionList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { format, isFuture, parseISO } from 'date-fns';
import { useStore } from '../../store';
import TaskItem from '../../components/TaskItem';
import { Task } from '../../types';

export default function UpcomingScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const tasks = useStore(state => state.tasks);

  const sections = useMemo(() => {
    const upcomingTasks = tasks.filter(task => !task.isCompleted && task.dueDate && isFuture(parseISO(task.dueDate)));
    
    const groups: { [key: string]: Task[] } = {};
    
    upcomingTasks.forEach(task => {
      if (!task.dueDate) return;
      const dateKey = format(parseISO(task.dueDate), 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(task);
    });
    
    return Object.keys(groups).sort().map(date => ({
      title: format(parseISO(date), 'MMMM d, yyyy'),
      data: groups[date]
    }));
  }, [tasks]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.header}>{t('upcoming')}</Text>
      
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TaskItem task={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No upcoming tasks scheduled.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    color: '#1f2937',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
    paddingVertical: 12,
    backgroundColor: '#f3f4f6',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
  }
});
