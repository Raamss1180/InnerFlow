import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager,} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors, fontType } from '../../theme';
import JournalData from '../../components/JournalData';

// Aktifkan LayoutAnimation di Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DailyJournal = () => {
  const navigation = useNavigation();
  const [expandedId, setExpandedId] = useState(null);

  const handlePressJournal = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity
        style={styles.journalCard}
        onPress={() => handlePressJournal(item.id)}
      >
        <Text style={styles.journalTitle}>{item.title}</Text>
        <Text style={styles.journalAuthor}>oleh {item.author}</Text>
        <Text
          style={styles.journalContent}
          numberOfLines={isExpanded ? 0 : 2}
        >
          {item.content}
        </Text>
        <Text style={styles.expandText}>
          {isExpanded ? 'Tutup' : 'Baca selengkapnya...'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Jurnal</Text>

      <FlatList
        data={JournalData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('JournalForm')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default DailyJournal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: fontType.bold,
    color: colors.textDark,
    marginTop: 20,
    marginBottom: 15,
  },
  journalCard: {
    backgroundColor: '#D6D6D6',
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  journalTitle: {
    fontSize: 16,
    fontFamily: fontType.medium,
    color: colors.textDark,
  },
  journalAuthor: {
    fontSize: 14,
    fontFamily: fontType.regular,
    color: '#555',
    marginTop: 4,
  },
  journalContent: {
    fontSize: 13,
    fontFamily: fontType.regular,
    color: '#777',
    marginTop: 6,
  },
  expandText: {
    marginTop: 8,
    fontSize: 13,
    fontFamily: fontType.medium,
    color: colors.primary,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: colors.primary,
    width: 55,
    height: 55,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});