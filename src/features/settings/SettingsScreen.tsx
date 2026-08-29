import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Globe, Moon, Sun, Monitor } from 'lucide-react-native';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.header}>{t('settings')}</Text>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Globe color="#6b7280" size={20} />
          <Text style={styles.sectionTitle}>{t('language')}</Text>
        </View>
        <View style={styles.card}>
          <Pressable 
            style={[styles.row, i18n.language === 'en' && styles.rowActive]} 
            onPress={() => changeLanguage('en')}
          >
            <Text style={styles.rowText}>English</Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable 
            style={[styles.row, i18n.language === 'uz' && styles.rowActive]} 
            onPress={() => changeLanguage('uz')}
          >
            <Text style={styles.rowText}>O'zbekcha</Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable 
            style={[styles.row, i18n.language === 'ru' && styles.rowActive]} 
            onPress={() => changeLanguage('ru')}
          >
            <Text style={styles.rowText}>Русский</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Monitor color="#6b7280" size={20} />
          <Text style={styles.sectionTitle}>Theme (Coming soon)</Text>
        </View>
        <View style={styles.card}>
          <Pressable style={styles.row}>
            <Sun color="#4b5563" size={20} style={{ marginRight: 12 }} />
            <Text style={styles.rowText}>{t('lightTheme')}</Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.row}>
            <Moon color="#4b5563" size={20} style={{ marginRight: 12 }} />
            <Text style={styles.rowText}>{t('darkTheme')}</Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.row}>
            <Monitor color="#4b5563" size={20} style={{ marginRight: 12 }} />
            <Text style={styles.rowText}>{t('systemTheme')}</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
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
    paddingBottom: 24,
    color: '#1f2937',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  rowActive: {
    backgroundColor: '#eff6ff', // blue-50
  },
  rowText: {
    fontSize: 16,
    color: '#1f2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginLeft: 16,
  }
});
