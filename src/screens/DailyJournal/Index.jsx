import React, { useState, useCallback, useRef }
from 'react';
import {View,Text,FlatList,StyleSheet,TouchableOpacity,Alert,LayoutAnimation,Platform,UIManager,Animated,} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors, fontType } from '../../theme';
import {collection,getFirestore,onSnapshot,deleteDoc,doc,query,orderBy,} from '@react-native-firebase/firestore';
import * as Animatable from 'react-native-animatable';

// Aktifkan animasi layout Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DailyJournal = () => {
  const navigation = useNavigation();
  const [journals, setJournals] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const screenScaleAnim = useRef(new Animated.Value(0.95)).current;
  const screenOpacityAnim = useRef(new Animated.Value(0)).current;

  // Definisikan baseComponentDelay di sini agar bisa diakses di seluruh komponen
  const baseComponentDelay = 300; // Anda bisa sesuaikan nilainya

  useFocusEffect(
    useCallback(() => {
      screenScaleAnim.setValue(0.95);
      screenOpacityAnim.setValue(0);

      Animated.parallel([
        Animated.spring(screenScaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(screenOpacityAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();

      const db = getFirestore();
      const journalRef = collection(db, 'journal');
      const q = query(journalRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(q, snapshot => {
        const journalList = snapshot.docs.map(docData => ({
          id: docData.id,
          ...docData.data(),
        }));
        setJournals(journalList);
      }, (error) => {
        console.error("Error fetching journals: ", error);
      });

      return () => unsubscribe();
    }, [screenScaleAnim, screenOpacityAnim])
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
      case 'senang': return '😊';
      case 'sedih': return '😢';
      case 'marah': return '😠';
      case 'tenang': return '😌';
      case 'bersemangat': return '🤩';
      case 'biasa saja': return '😐';
      default: return '';
    }
  };

  const listBaseDelay = 400; // Delay spesifik untuk item dalam list

  const renderItem = ({ item, index }) => {
    const isExpanded = expandedId === item.id;
    const moodEmoji = getMoodEmoji(item.mood);

    return (
      <Animatable.View
        animation="fadeInUp"
        duration={600}
        delay={listBaseDelay + index * 100} // Menggunakan listBaseDelay
        useNativeDriver={true}
        iterationCount={1}
      >
        <TouchableOpacity
          style={styles.journalCard}
          onPress={() => handlePressJournal(item.id)}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.journalTitle}>{item.title || "Tanpa Judul"}</Text>
            {item.mood && (
              <Text style={styles.journalMood}>
                {moodEmoji} {item.mood}
              </Text>
            )}
          </View>
          <Text style={styles.journalAuthor}>oleh {item.author || "Anonim"}</Text>
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
            <Animatable.View animation="fadeIn" duration={300}>
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
            </Animatable.View>
          )}

          <Text style={styles.expandText}>
            {isExpanded ? 'Tutup Detail' : 'Baca Selengkapnya...'}
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  return (
    <Animated.View style={[
        styles.containerWrapper,
        {
            opacity: screenOpacityAnim,
            transform: [{ scale: screenScaleAnim }]
        }
    ]}>
        <View style={styles.contentContainer}>
            {/* Judul opsional di sini, jika tidak diatur oleh header navigator */}
            {/* <Animatable.Text 
                animation="fadeInDown" 
                duration={700} 
                delay={baseComponentDelay} // Menggunakan baseComponentDelay yang sudah didefinisikan
                style={styles.titleScreen} // Style baru untuk judul screen jika diperlukan
            >
                Jurnal Harian Saya
            </Animatable.Text> */}

            {journals.length === 0 ? (
                <Animatable.View 
                    animation="fadeInUp" 
                    duration={700} 
                    delay={baseComponentDelay + 100} // Menggunakan baseComponentDelay
                    style={styles.emptyContainerFull}
                >
                    <Ionicons name="documents-outline" size={70} color={colors.textSecondary || "#888"} />
                    <Text style={styles.emptyText}>Jurnal Kosong</Text>
                    <Text style={styles.emptySubText}>Mulai petualangan menulismu sekarang!</Text>
                </Animatable.View>
            ) : (
                <FlatList
                data={journals}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.flatListContentContainer}
                showsVerticalScrollIndicator={false}
                />
            )}

            <Animatable.View 
                animation="bounceInUp" 
                duration={800} 
                delay={baseComponentDelay + 300} // Menggunakan baseComponentDelay
                useNativeDriver={true}
            >
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('JournalForm')}
                >
                    <Ionicons name="add-outline" size={30} color={colors.textLight || "#fff"} />
                </TouchableOpacity>
            </Animatable.View>
        </View>
    </Animated.View>
  );
};

export default DailyJournal;

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    backgroundColor: colors.background || '#F5F5F5',
  },
  contentContainer: {
    flex: 1,
  },
  titleScreen: { // Style untuk judul screen jika ditampilkan di dalam komponen
    fontSize: 26,
    fontFamily: fontType.judul,
    color: colors.textDark || '#212121',
    paddingTop: Platform.OS === 'ios' ? 20 : 15,
    paddingBottom: 15,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  emptyContainerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontFamily: fontType.bold,
    color: colors.textDark || '#555555',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 15,
    fontFamily: fontType.regular,
    color: colors.textSecondary || '#757575',
    marginTop: 10,
    textAlign: 'center',
  },
  flatListContentContainer: {
    paddingHorizontal: 15,
    paddingTop: 10, // Jika tidak ada judul screen di atasnya, bisa 20
    paddingBottom: 90,
  },
  journalCard: {
    backgroundColor: colors.cardBackground || '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
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
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: colors.border || '#EEEEEE',
    paddingTop: 12,
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
