import React, { useState, useEffect, useMemo } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,ScrollView,Platform,} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { fonts, colors, fontType } from '../../theme'; 
import {getFirestore,doc,setDoc,updateDoc,serverTimestamp} from '@react-native-firebase/firestore';


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
  const [mood, setMood] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [journalId, setJournalId] = useState(null);
  const [currentDate, setCurrentDate] = useState(initialDate);

  const placeholderColor = '#888888'; 

  useEffect(() => {
    if (existingJournalData) {
      setTitle(existingJournalData.title || '');
      setAuthor(existingJournalData.author || '');
      setContent(existingJournalData.content || '');
      setMood(existingJournalData.mood || '');
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
    if (!title.trim() || !author.trim() || !content.trim() || !mood.trim()) {
      Alert.alert('Kesalahan Input', 'Judul, Penulis, Isi Jurnal, dan Mood tidak boleh kosong.');
      return;
    }

    const db = getFirestore();
    const journalPayload = {
      title: title.trim(),
      author: author.trim(),
      content: content.trim(),
      date: currentDate,
      mood: mood,
    };

    try {
      if (isEditing && journalId) {
        const journalRef = doc(db, 'journal', journalId);
        await updateDoc(journalRef, {
          ...journalPayload,
          updatedAt: serverTimestamp(),
        });
        Alert.alert('Sukses', 'Jurnal berhasil diperbarui di cloud!');
      } else {
        const newJournalId = Date.now().toString();
        const journalRef = doc(db, 'journal', newJournalId);
        await setDoc(journalRef, {
          ...journalPayload,
          id: newJournalId,
          createdAt: serverTimestamp(), 
        });
        Alert.alert('Sukses', 'Jurnal berhasil disimpan di cloud!');
      }

      await tampilkanNotifikasiJurnalBerhasil(title); 
      navigation.goBack(); 

    } catch (error) {
      console.error('Error saat menyimpan jurnal ke Firestore:', error);
      Alert.alert(
        'Gagal Menyimpan',
        `Terjadi kesalahan saat menyimpan jurnal ke cloud. Error: ${error.message}`
      );
    }
  };

  const handleMoodSelection = (selectedMood) => {
    setMood(selectedMood);
  };

  const moods = ['Senang😊', 'Sedih😢', 'Marah🤬', 'Tenang😌', 'Bersemangat🤩', 'Biasa Saja😐'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>{isEditing ? 'Edit Jurnal' : 'Form Jurnal Baru'}</Text>
      <Text style={styles.dateText}>
        Tanggal Jurnal: {new Date(currentDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </Text>

      <Text style={styles.label}>Judul Jurnal</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan judul jurnal Anda..."
        value={title}
        onChangeText={setTitle}
        placeholderTextColor={placeholderColor}
      />

      <Text style={styles.label}>Penulis</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan nama penulis..."
        value={author}
        onChangeText={setAuthor}
        placeholderTextColor={placeholderColor}
      />

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

      <Text style={styles.moodHeader}>Bagaimana Mood Kamu Hari Ini?</Text>
      <View style={styles.moodContainer}>
        {moods.map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.moodButton, mood === m && styles.selectedMoodButton]}
            onPress={() => handleMoodSelection(m)}>
            <Text style={[styles.moodText, mood === m && styles.selectedMoodText]}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveJournal}>
        <Text style={styles.saveButtonText}>{isEditing ? 'Simpan Perubahan' : 'Upload Jurnal'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#F5F5F5', 
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 26, 
    fontFamily: fontType.judul, 
    color: colors.primary || '#1E88E5',
    marginBottom: 15,
    textAlign: 'center',
  },
  dateText: {
    fontSize: 15,
    fontFamily: fontType.medium, 
    color: colors.textSecondary || '#555555',
    marginBottom: 20,
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
    marginBottom: 18, 
    borderWidth: 1,
    borderColor: colors.border || '#CCCCCC', 
  },
  contentInput: {
    height: 180, 
    textAlignVertical: 'top',
  },
  moodHeader: {
    fontSize: 17, 
    fontFamily: fontType.medium,
    color: colors.textDark || '#333333',
    marginTop: 5, 
    marginBottom: 12,
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 25,
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
  },
  selectedMoodText: {
    color: colors.textLight || '#FFFFFF', 
    fontFamily: fontType.medium,
  },
  saveButton: {
    backgroundColor: colors.accent || colors.primary || '#1976D2', 
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 25, 
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 17, 
    fontFamily: fontType.bold, 
    color: colors.textLight || '#FFFFFF', 
  },
});

export default JournalForm;