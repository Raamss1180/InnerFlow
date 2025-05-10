import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import MeditationCard from '../../components/MeditationCard';
import SearchBar from '../../components/SearchBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, fontType } from '../../theme';

const recoveryChecklist = [
  'Tidur minimal 7 jam',
  'Minum air 2 liter',
  'Berlatih pernapasan',
  'Stretching ringan',
];

const tips = [
  { id: 1, icon: '🛌', title: 'Istirahat Cukup', content: 'Tidur teratur bantu pemulihan optimal.' },
  { id: 2, icon: '💧', title: 'Hidrasi', content: 'Minum cukup air menjaga metabolisme.' },
  { id: 3, icon: '🥗', title: 'Nutrisi', content: 'Makanan sehat bantu perbaiki jaringan.' },
];

const RecoveryScreen = () => {
  const [checked, setChecked] = useState([]);// State untuk menyimpan checklist yang sudah dicentang

  const toggleChecklist = (item) => {// Fungsi toggle checklist (menambah atau menghapus centang)
    setChecked((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>InnerFlow</Text>
        <Ionicons name="person-circle-outline" size={35} color={colors.textDark} />
      </View>
      <SearchBar />
      <Text style={styles.heading}>Recovery Meditation</Text>
      <MeditationCard title="Body Scan Recovery" duration={12} onStart={() => {}} />
      <MeditationCard title="Cooling Breath" duration={7} onStart={() => {}} />

      <Text style={styles.heading}>Recovery Checklist</Text>
      <View style={styles.checklistWrapper}>
      {recoveryChecklist.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => toggleChecklist(item)}
          style={[styles.checkItem, checked.includes(item) && styles.checked]}
        >
          <Text style={styles.checkText}>
            {checked.includes(item) ? '✅ ' : '⬜️ '} {item}
          </Text>
        </TouchableOpacity>
      ))}
      </View>

      <Text style={styles.heading}>Tips Pemulihan</Text>
      {tips.map((tip) => (
        <View key={tip.id} style={styles.tipCard}>
          <Text style={styles.tipIcon}>{tip.icon}</Text>
          <View>
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipContent}>{tip.content}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default RecoveryScreen;

const styles = StyleSheet.create({
  title: { fontSize: 28, fontFamily: fontType.bold, color: colors.textDark },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },

  checklistWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 5,
  },
  checkItemGrid: {
    width: '48%',
    backgroundColor: '#F0F4F8',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 10,
  },

  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  heading: { fontSize: 20, fontWeight: 'bold', marginTop: 24, marginBottom: 12 },
  checkItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#F0F4F8',
    marginBottom: 10,
  },
  checked: { backgroundColor: '#D6F5D6' },
  checkText: { fontSize: 16 },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'flex-start',
    gap: 10,
  },
  tipIcon: { fontSize: 24, marginTop: 4 },
  tipTitle: { fontSize: 16, fontWeight: 'bold' },
  tipContent: { fontSize: 14, color: '#555' },
});
