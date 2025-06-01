import React, { useState, useCallback } from 'react';
import {View,Text,FlatList,StyleSheet,TouchableOpacity,Alert,LayoutAnimation,Platform,UIManager,} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors, fontType } from '../../theme'; 
import {collection,getFirestore,onSnapshot,deleteDoc,doc,query,orderBy,} from '@react-native-firebase/firestore';

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
      }, (error) => {
        console.error("Error fetching journals: ", error);
      });

      return () => unsubscribe();
    }, [])
  );

  const handlePressJournal = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = (id) => {
    Alert.alert('Konfirmasi Hapus', 'Apakah Anda yakin ingin menghapus jurnal ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            const db = getFirestore();
            await deleteDoc(doc(db, 'journal', id));
          } catch (err) {
            console.error("Error deleting journal: ", err);
            Alert.alert('Gagal', 'Gagal menghapus jurnal. Silakan coba lagi.');
          }
        },
      },
    ]);
  };

  const handleEdit = (item) => {
    navigation.navigate('JournalForm', { journal: item });
  };

  const getMoodEmoji = (mood) => {
    switch (mood?.toLowerCase()) { 
      case 'senang':
        return '😊';
      case 'sedih':
        return '😢';
      case 'marah':
        return '😠';
      case 'tenang':
        return '😌';
      case 'bersemangat':
        return '🤩'; 
      case 'biasa saja':
        return '😐';
      default:
        return ''; 
    }
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item.id;
    const moodEmoji = getMoodEmoji(item.mood);

    return (
      <TouchableOpacity
        style={styles.journalCard}
        onPress={() => handlePressJournal(item.id)}
        activeOpacity={0.8} 
      >
        <View style={styles.cardHeader}>
            <Text style={styles.journalTitle}>{item.title || "Tanpa Judul"}</Text>
            {/* Tampilkan Mood dengan Emoji */}
            {item.mood && (
                <Text style={styles.journalMood}>
                {moodEmoji} {item.mood}
                </Text>
            )}
        </View>
        <Text style={styles.journalAuthor}>oleh {item.author || "Anonim"}</Text>
        {/* Tampilkan tanggal jurnal jika ada */}
        {item.date && (
            <Text style={styles.journalDate}>
            {new Date(item.date).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            })}
            </Text>
        )}
        <Text style={styles.journalContent} numberOfLines={isExpanded ? undefined : 2}>
          {item.content || "Tidak ada konten."}
        </Text>

        {isExpanded && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]} 
              onPress={() => handleEdit(item)}
            >
              <Ionicons name="create-outline" size={20} color={colors.textLight || "#fff"} />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]} 
              onPress={() => handleDelete(item.id)}
            >
              <Ionicons name="trash-outline" size={20} color={colors.textLight || "#fff"} />
              <Text style={styles.actionText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.expandText}>
          {isExpanded ? 'Tutup Detail' : 'Baca Selengkapnya...'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {journals.length === 0 ? (
        <View style={styles.emptyContainer}>
            <Ionicons name="sad-outline" size={60} color={colors.textSecondary || "#888"} />
            <Text style={styles.emptyText}>Belum ada jurnal yang kamu tulis.</Text>
            <Text style={styles.emptySubText}>Yuk, mulai tulis jurnal pertamamu!</Text>
        </View>
      ) : (
        <FlatList
          data={journals}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80, paddingTop: 10 }} 
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('JournalForm')} 
      >
        <Ionicons name="add-outline" size={30} color={colors.textLight || "#fff"} />
      </TouchableOpacity>
    </View>
  );
};

export default DailyJournal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#F5F5F5', 
  },
  title: { 
    fontSize: 26,
    fontFamily: fontType.judul, 
    color: colors.textDark || '#212121', 
    marginTop: Platform.OS === 'ios' ? 40 : 20, 
    marginBottom: 15,
    paddingHorizontal: 20, 
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: fontType.medium, 
    color: colors.textSecondary || '#757575', 
    marginTop: 15,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    fontFamily: fontType.regular, 
    color: colors.textSecondary || '#757575',
    marginTop: 8,
    textAlign: 'center',
  },
  journalCard: {
    backgroundColor: colors.cardBackground || '#FFFFFF', 
    borderRadius: 12, 
    padding: 18, 
    marginHorizontal: 15, 
    marginBottom: 15, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4, 
  },
  journalTitle: {
    fontSize: 18, 
    fontFamily: fontType.judul,
    color: colors.textDark || '#333333',
    flex: 1, 
  },
  journalMood: {
    fontSize: 14,
    fontFamily: fontType.medium,
    color: colors.primary || '#1E88E5',
    marginLeft: 8, 
  },
  journalAuthor: {
    fontSize: 13,
    fontFamily: fontType.regular,
    color: colors.textSecondary || '#666666',
    marginBottom: 6, 
  },
  journalDate: {
    fontSize: 12,
    fontFamily: fontType.regular,
    color: colors.textCaption || '#888888', 
    marginBottom: 8, 
  },
  journalContent: {
    fontSize: 14, 
    fontFamily: fontType.regular,
    color: colors.textParagraph || '#424242', 
    lineHeight: 20, 
  },
  expandText: {
    marginTop: 12, 
    fontSize: 13,
    fontFamily: fontType.medium,
    color: colors.primary || '#007AFF', 
    textAlign: 'right', 
  },
  fab: {
    position: 'absolute',
    right: 25, 
    bottom: 25, 
    backgroundColor: colors.accent || colors.primary || '#007AFF', 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end', 
    marginTop: 18, 
    borderTopWidth: 1,
    borderTopColor: colors.border || '#EEEEEE', 
    paddingTop: 12, 
    // marginBottom: -35, 
  },
  actionButton: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 10, 
  },
  editButton: {
    backgroundColor: colors.editButton || '#FFC107', 
  },
  deleteButton: {
    backgroundColor: colors.deleteButton || '#F44336',
  },
  actionText: {
    marginLeft: 8, 
    color: colors.textLight || '#FFFFFF', 
    fontSize: 14,
    fontFamily: fontType.medium,
  },
});