import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { Plus, Folder as FolderIcon } from 'lucide-react-native';
import { useStore } from '../../store';

export default function ListsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const lists = useStore(state => state.lists);
  const addList = useStore(state => state.addList);
  
  const [newListName, setNewListName] = useState('');

  const handleAddList = () => {
    if (!newListName.trim()) return;
    addList({
      name: newListName.trim(),
      color: '#3b82f6', // default blue
      icon: 'folder',
      order: lists.length
    });
    setNewListName('');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.header}>{t('lists')}</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New list name..."
          placeholderTextColor="#9ca3af"
          value={newListName}
          onChangeText={setNewListName}
        />
        <Pressable style={styles.addButton} onPress={handleAddList}>
          <Plus color="white" size={24} />
        </Pressable>
      </View>

      <FlashList
        data={lists}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
              <FolderIcon color={item.color} size={24} />
            </View>
            <Text style={styles.listName}>{item.name}</Text>
          </View>
        )}
        // @ts-ignore
        estimatedItemSize={70}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No custom lists yet.</Text>
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
    paddingBottom: 16,
    color: '#1f2937',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
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
