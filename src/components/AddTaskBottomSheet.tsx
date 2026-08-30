import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Keyboard, Platform } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { Calendar, Flag } from 'lucide-react-native';
import { format } from 'date-fns';
import { useStore } from '../store';
import { Priority } from '../types';

export type AddTaskBottomSheetRef = BottomSheetModal;

const AddTaskBottomSheet = forwardRef<AddTaskBottomSheetRef, {}>((props, ref) => {
  const { t } = useTranslation();
  const addTask = useStore(state => state.addTask);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const snapPoints = useMemo(() => ['50%', '80%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      Keyboard.dismiss();
      setTitle('');
      setDescription('');
      setDueDate(null);
      setPriority('medium');
    }
  }, []);

  const renderBackdrop = useCallback(
    (backdropProps: any) => (
      <BottomSheetBackdrop
        {...backdropProps}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  const handleSave = async () => {
    if (!title.trim()) return;
    
    await addTask({
      title: title.trim(),
      description: description.trim(),
      listId: 'default', // Ideally selected by user
      tagIds: [],
      priority,
      dueDate: dueDate ? dueDate.toISOString() : null,
      reminderAt: null,
      subtasks: [],
    });
    
    setTitle('');
    setDescription('');
    setDueDate(null);
    setPriority('medium');
    // @ts-ignore
    ref?.current?.dismiss();
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const togglePriority = () => {
    const priorities: Priority[] = ['low', 'medium', 'high', 'urgent'];
    const idx = priorities.indexOf(priority);
    setPriority(priorities[(idx + 1) % priorities.length]);
  };

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <View style={styles.container}>
        <Text style={styles.headerTitle}>{t('addTask')}</Text>
        
        <BottomSheetTextInput
          style={styles.input}
          placeholder={t('title')}
          placeholderTextColor="#9ca3af"
          value={title}
          onChangeText={setTitle}
          autoFocus
        />
        
        <BottomSheetTextInput
          style={[styles.input, styles.textArea]}
          placeholder={t('description')}
          placeholderTextColor="#9ca3af"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <View style={styles.actionsRow}>
          <Pressable style={[styles.actionButton, dueDate && styles.actionButtonActive]} onPress={() => setShowDatePicker(true)}>
            <Calendar color={dueDate ? '#3b82f6' : '#6b7280'} size={20} />
            {dueDate && <Text style={styles.actionText}>{format(dueDate, 'MMM d')}</Text>}
          </Pressable>
          <Pressable style={styles.actionButton} onPress={togglePriority}>
            <Flag color={priority === 'high' || priority === 'urgent' ? '#ef4444' : (priority === 'low' ? '#3b82f6' : '#f59e0b')} size={20} />
            <Text style={styles.actionText}>{priority}</Text>
          </Pressable>
          
          <View style={{ flex: 1 }} />
          
          <Pressable 
            style={[styles.saveButton, !title.trim() && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={!title.trim()}
          >
            <Text style={styles.saveButtonText}>{t('save')}</Text>
          </Pressable>
        </View>
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 12,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginRight: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  actionButtonActive: {
    backgroundColor: '#eff6ff',
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#4b5563',
    textTransform: 'capitalize',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddTaskBottomSheet;
