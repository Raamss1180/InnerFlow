import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { fonts, colors, fontType } from '../../theme';
import { getFirestore, doc, setDoc, updateDoc, serverTimestamp } from '@react-native-firebase/firestore';
import * as Animatable from 'react-native-animatable';

const tampilkanNotifikasiJurnalBerhasil = async (judulJurnal) => {
  try {
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({
      id: 'innerflow_journal_channel_firestore',
      name: 'InnerFlow Journal Firestore Notifications',
      importance: AndroidImportance.HIGH,
    });
    await notifee.displayNotification({
      title: 'Jurnal Tersimpan! 📝',
      body: `Jurnalmu "${judulJurnal || 'Tanpa Judul'}" berhasil di upload!`,
      android: {
        channelId: channelId,
        smallIcon: 'ic_launcher',
        pressAction: { id: 'default' },
      },
    });
    console.log('Notifikasi penyimpanan jurnal (Firestore) berhasil ditampilkan!');
  } catch (error) {
    console.error('Gagal menampilkan notifikasi penyimpanan jurnal (Firestore):', error);
  }
};

const JournalForm = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const existingJournalData = route.params?.journal;

  const initialDate = useMemo(() => {
    return existingJournalData?.date || route.params?.date || new Date().toISOString();
  }, [route.params?.date, existingJournalData?.date]);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(''); // Akan menyimpan string mood dengan emoji
  const [isEditing, setIsEditing] = useState(false);
  const [journalId, setJournalId] = useState(null);
  const [currentDate, setCurrentDate] = useState(initialDate);

  const placeholderColor = '#888888';

  const screenScaleAnim = useRef(new Animated.Value(0.95)).current;
  const screenOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
  }, [screenScaleAnim, screenOpacityAnim]);

  useEffect(() => {
    if (existingJournalData) {
      setTitle(existingJournalData.title || '');
      setAuthor(existingJournalData.author || '');
      setContent(existingJournalData.content || '');
      // Jika existingJournalData.mood disimpan tanpa emoji, Anda mungkin perlu mencocokkannya
      // dengan array moods untuk mendapatkan string dengan emoji.
      // Untuk saat ini, kita asumsikan existingJournalData.mood disimpan dengan format yang sama.
      // Jika formatnya berbeda (misal, hanya "Senang" tanpa emoji), Anda perlu logika tambahan di sini
      // untuk menemukan string yang cocok dari array `moods`.
      // Contoh:
      // const fullMood = moods.find(m => m.includes(existingJournalData.mood || '')) || '';
      // setMood(fullMood);
      setMood(existingJournalData.mood || ''); // Langsung set, pastikan formatnya konsisten
      setCurrentDate(existingJournalData.date || initialDate);
      setIsEditing(true);
      setJournalId(existingJournalData.id);
    } else {
      setTitle('');
      setAuthor('');
      setContent('');
      setMood('');
      setCurrentDate(initialDate);
      setIsEditing(false);
      setJournalId(null);
    }
  }, [existingJournalData, initialDate]);

  const handleSaveJournal = async () => {
    if (!title.trim() || !author.trim() || !content.trim() || !mood.trim()) { // mood.trim() karena mood sekarang bisa ada emoji
      Alert.alert('Kesalahan Input', 'Judul, Penulis, Isi Jurnal, dan Mood tidak boleh kosong.');
      return;
    }
    const db = getFirestore();
    // Saat menyimpan, kita simpan string mood dengan emoji
    const journalPayload = {
      title: title.trim(),
      author: author.trim(),
      content: content.trim(),
      date: currentDate,
      mood: mood, // Simpan mood dengan emoji
    };
    try {
      if (isEditing && journalId) {
        const journalRef = doc(db, 'journal', journalId);
        await updateDoc(journalRef, { ...journalPayload, updatedAt: serverTimestamp() });
        Alert.alert('Sukses', 'Jurnal berhasil diperbarui di cloud!');
      } else {
        const newJournalId = Date.now().toString();
        const journalRef = doc(db, 'journal', newJournalId);
        await setDoc(journalRef, { ...journalPayload, id: newJournalId, createdAt: serverTimestamp() });
        Alert.alert('Sukses', 'Jurnal berhasil disimpan di cloud!');
      }
      await tampilkanNotifikasiJurnalBerhasil(title);
      navigation.goBack();
    } catch (error) {
      console.error('Error saat menyimpan jurnal ke Firestore:', error);
      Alert.alert('Gagal Menyimpan', `Terjadi kesalahan: ${error.message}`);
    }
  };

  const handleMoodSelection = (selectedMoodValue) => {
    // Langsung set mood dengan string yang dipilih (yang sudah ada emoji)
    setMood(selectedMoodValue);
  };

  // Pastikan emoji "Marah" benar. Di kode Anda sebelumnya ada 'Marah', saya ganti jadi 'Marah🤬'
  const moods = ['Senang😊', 'Sedih😢', 'Marah🤬', 'Tenang😌', 'Bersemangat🤩', 'Biasa Saja😐'];
  const baseComponentDelay = 300;

  return (
    <Animated.View style={[
        styles.containerWrapper,
        {
            opacity: screenOpacityAnim,
            transform: [{ scale: screenScaleAnim }]
        }
    ]}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Animatable.Text animation="fadeInDown" duration={700} delay={baseComponentDelay} style={styles.header}>
            {isEditing ? 'Edit Jurnal' : 'Form Jurnal Baru'}
        </Animatable.Text>
        <Animatable.Text animation="fadeInDown" duration={700} delay={baseComponentDelay + 50} style={styles.dateText}>
          Tanggal Jurnal: {new Date(currentDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Animatable.Text>

        <Animatable.View animation="fadeInUp" duration={700} delay={baseComponentDelay + 100}>
          <Text style={styles.label}>Judul Jurnal</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan judul jurnal Anda..."
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={placeholderColor}
          />
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={700} delay={baseComponentDelay + 200}>
          <Text style={styles.label}>Penulis</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan nama penulis..."
            value={author}
            onChangeText={setAuthor}
            placeholderTextColor={placeholderColor}
          />
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={700} delay={baseComponentDelay + 300}>
          <Text style={styles.label}>Isi Jurnal</Text>
          <TextInput
            style={[styles.input, styles.contentInput]}
            placeholder="Apa yang kamu rasakan dan pikirkan hari ini?..."
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            placeholderTextColor={placeholderColor}
          />
        </Animatable.View>

        <Animatable.Text animation="fadeInUp" duration={700} delay={baseComponentDelay + 400} style={styles.moodHeader}>
            Bagaimana Mood Kamu Hari Ini?
        </Animatable.Text>
        <View style={styles.moodContainer}>
          {moods.map((m, index) => {
            // const moodTextOnly = m.replace(/.../gu, '').trim(); // Dihapus
            return (
                <Animatable.View
                    key={`mood-${m}`}
                    animation="bounceIn"
                    duration={700}
                    delay={baseComponentDelay + 500 + index * 80}
                    style={styles.moodButtonWrapper}
                    iterationCount={1}
                >
                    <TouchableOpacity
                    // Perbandingan langsung dengan 'm' dari array moods
                    style={[styles.moodButton, mood === m && styles.selectedMoodButton]}
                    onPress={() => handleMoodSelection(m)}>
                    {/* Perbandingan langsung dengan 'm' dari array moods */}
                    <Text style={[styles.moodText, mood === m && styles.selectedMoodText]}>{m}</Text>
                    </TouchableOpacity>
                </Animatable.View>
            );
        })}
        </View>

        <Animatable.View animation="bounceInUp" duration={800} delay={baseComponentDelay + 700} useNativeDriver={true}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveJournal}>
                <Text style={styles.saveButtonText}>{isEditing ? 'Simpan Perubahan' : 'Upload Jurnal'}</Text>
            </TouchableOpacity>
        </Animatable.View>
      </ScrollView>
    </Animated.View>
  );
};

// Stylesheet tidak diubah dari versi sebelumnya di Canvas
const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    backgroundColor: colors.background || '#F5F5F5',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 20 : 15,
    paddingBottom: 40,
  },
  header: {
    fontSize: 26,
    fontFamily: fontType.judul,
    color: colors.primary || '#1E88E5',
    marginBottom: 10,
    textAlign: 'center',
  },
  dateText: {
    fontSize: 15,
    fontFamily: fontType.medium,
    color: colors.textSecondary || '#555555',
    marginBottom: 25,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontFamily: fontType.medium,
    color: colors.textDark || '#333333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.inputBackground || '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 15,
    fontFamily: fontType.regular,
    color: colors.textDark || '#212121',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border || '#CCCCCC',
  },
  contentInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  moodHeader: {
    fontSize: 17,
    fontFamily: fontType.medium,
    color: colors.textDark || '#333333',
    marginTop: 0,
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Agar ada space jika tidak pas
    marginBottom: 30, // Menambah margin bawah
  },
  moodButton: {
    backgroundColor: colors.inputBackground || '#E0E0E0', 
    paddingVertical: 10,
    paddingHorizontal: 12, 
    borderRadius: 18, 
    borderWidth: 1,
    borderColor: colors.border || '#BDBDBD', 
    marginVertical: 5,
    marginHorizontal: 3, 
    alignItems: 'center',
    minWidth: '30%', 
  },
  selectedMoodButton: {
    backgroundColor: colors.primary || '#1E88E5',
    borderColor: colors.primaryDark || colors.primary || '#1565C0',
  },
  moodText: {
    fontSize: 13,
    fontFamily: fontType.regular,
    color: colors.textDark || '#333333',
    textAlign: 'center',
  },
  selectedMoodText: {
    color: colors.textLight || '#FFFFFF',
    fontFamily: fontType.medium,
  },
  saveButton: {
    backgroundColor: colors.accent || colors.primary || '#1976D2',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 17,
    fontFamily: fontType.bold,
    color: colors.textLight || '#FFFFFF',
  },
});

export default JournalForm;
