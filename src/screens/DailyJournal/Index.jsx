import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors, fontType } from '../../theme';
import {
  collection,
  getFirestore,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy
} from '@react-native-firebase/firestore';

// Aktifkan animasi layout Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DailyJournal = () => {
  const navigation = useNavigation();
  const [journals, setJournals] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const db = getFirestore();
      const journalRef = collection(db, 'journal');
      const q = query(journalRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(q, snapshot => {
        const journalList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJournals(journalList);
      });

      return () => unsubscribe();
    }, [])
  );

  const handlePressJournal = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = (id) => {
    Alert.alert('Konfirmasi', 'Yakin ingin menghapus jurnal ini?', [
      {
        text: 'Batal',
        style: 'cancel',
      },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            const db = getFirestore();
            await deleteDoc(doc(db, 'journal', id));
          } catch (err) {
            Alert.alert('Gagal', 'Gagal menghapus jurnal.');
          }
        },
      },
    ]);
  };

  const handleEdit = (item) => {
    navigation.navigate('JournalForm', { journal: item }); // kirim data untuk diedit
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity
        style={styles.journalCard}
        onPress={() => handlePressJournal(item.id)}
        activeOpacity={0.9}
      >
        <Text style={styles.journalTitle}>{item.title}</Text>
        <Text style={styles.journalAuthor}>oleh {item.author}</Text>
        <Text style={styles.journalContent} numberOfLines={isExpanded ? 0 : 2}>
          {item.content}
        </Text>

        {isExpanded && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#f39c12' }]}
              onPress={() => handleEdit(item)}
            >
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#e74c3c' }]}
              onPress={() => handleDelete(item.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
              <Text style={styles.actionText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        )}

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
        data={journals}
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
    fontFamily: fontType.judul,
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
  },
  journalTitle: {
    fontSize: 16,
    fontFamily: fontType.judul,
    color: colors.textDark,
  },
  journalAuthor: {
    fontSize: 14,
    fontFamily: fontType.judul2,
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    gap: 10,
    marginBottom: -35,
  },
  actionButton: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionText: {
    marginLeft: 6,
    color: '#fff',
    fontSize: 13,
    fontFamily: fontType.medium,
  },
});
