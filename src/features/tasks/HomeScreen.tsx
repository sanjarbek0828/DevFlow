import React, { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { useStore } from '../../store';
import TaskItem from '../../components/TaskItem';
import FAB from '../../components/FAB';
import AddTaskBottomSheet from '../../components/AddTaskBottomSheet';

export default function HomeScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const tasks = useStore(state => state.tasks);
  
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const todayTasks = tasks.filter(task => !task.isCompleted); // Simplifying "Today" for now

  const handleOpenAddTask = () => {
    bottomSheetModalRef.current?.present();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.header}>{t('today')}</Text>
      
      <FlashList
        data={todayTasks}
        renderItem={({ item }) => <TaskItem task={item} />}
        // @ts-ignore
        estimatedItemSize={75}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('noTasksToday')}</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
      
      <FAB onPress={handleOpenAddTask} />
      <AddTaskBottomSheet ref={bottomSheetModalRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // gray-100
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    color: '#1f2937', // gray-800
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Make room for FAB
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280', // gray-500
    fontSize: 16,
  }
});
