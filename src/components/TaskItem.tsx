import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Task } from '../types';
import { useStore } from '../store';
import { CheckCircle2, Circle, Clock } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { format, parseISO } from 'date-fns';

interface TaskItemProps {
  task: Task;
}

const PriorityColors = {
  low: '#3b82f6', // blue
  medium: '#f59e0b', // amber
  high: '#ef4444', // red
  urgent: '#991b1b', // dark red
};

export default function TaskItem({ task }: TaskItemProps) {
  const toggleTaskStatus = useStore(state => state.toggleTaskStatus);
  const deleteTask = useStore(state => state.deleteTask);

  const opacity = useSharedValue(1);

  const handleToggle = () => {
    toggleTaskStatus(task.id);
  };

  const handleDelete = () => {
    opacity.value = withTiming(0, { duration: 300 });
    setTimeout(() => {
      deleteTask(task.id);
    }, 300);
  };

  const renderRightActions = () => {
    return (
      <Pressable style={styles.deleteAction} onPress={handleDelete}>
        <Text style={styles.actionText}>Delete</Text>
      </Pressable>
    );
  };

  const renderLeftActions = () => {
    return (
      <View style={styles.doneAction}>
        <Text style={styles.actionText}>{task.isCompleted ? 'Undo' : 'Done'}</Text>
      </View>
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Swipeable 
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      onSwipeableOpen={(direction) => {
        if (direction === 'left') handleToggle();
      }}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={[styles.priorityIndicator, { backgroundColor: PriorityColors[task.priority] }]} />
        
        <Pressable onPress={handleToggle} style={styles.checkButton}>
          {task.isCompleted ? (
            <CheckCircle2 color="#10b981" size={26} />
          ) : (
            <Circle color="#9ca3af" size={26} />
          )}
        </Pressable>
        
        <View style={styles.content}>
          <Text style={[styles.title, task.isCompleted && styles.titleCompleted]}>
            {task.title}
          </Text>
          {task.description ? (
            <Text style={styles.description} numberOfLines={1}>
              {task.description}
            </Text>
          ) : null}
          
          {task.dueDate ? (
            <View style={styles.metaRow}>
              <Clock color="#6b7280" size={14} />
              <Text style={styles.metaText}>{format(parseISO(task.dueDate), 'MMM d, h:mm a')}</Text>
            </View>
          ) : null}
        </View>
      </Animated.View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: 'hidden',
  },
  priorityIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  checkButton: {
    marginRight: 12,
    marginLeft: 4,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  deleteAction: {
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
    minWidth: 80,
  },
  doneAction: {
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
    minWidth: 80,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
