import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,StyleSheet,TouchableOpacity,Alert,ActivityIndicator,ScrollView} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, fontType } from '../../theme';
import {addDoc,updateDoc,doc,getFirestore,serverTimestamp, collection} from '@react-native-firebase/firestore';

const JournalForm = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isEdit = !!route.params?.journal;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [entry, setEntry] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const { title, author, content } = route.params.journal;
      setTitle(title);
      setAuthor(author);
      setEntry(content);
    }
  }, [isEdit]);

  const handleSubmit = async () => {
    if (!title || !author || !entry) {
      Alert.alert('Peringatan', 'Semua kolom harus diisi!');
      return;
    }

    setLoading(true);
    const db = getFirestore();

    try {
      if (isEdit) {
        const ref = doc(db, 'journal', route.params.journal.id);
        await updateDoc(ref, {
          title,
          author,
          content: entry,
          updatedAt: serverTimestamp(),
        });
        Alert.alert('Berhasil', 'Jurnal berhasil diperbarui!');
      } else {
        const journalRef = collection(db, 'journal');
        await addDoc(journalRef, {
          title,
          author,
          content: entry,
          createdAt: serverTimestamp(),
        });
        Alert.alert('Berhasil', 'Jurnal berhasil ditambahkan!');
      }

      setLoading(false);
      navigation.goBack();
    } catch (err) {
      console.error(err);
      setLoading(false);
      Alert.alert('Error', 'Gagal menyimpan jurnal.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <Text style={styles.Judul}>
          {isEdit ? 'Edit Jurnal' : 'Tambah Jurnal'}
        </Text>

        <Text style={styles.title}>Judul Jurnal</Text>
        <TextInput
          style={styles.input}
          placeholder="Judul Jurnal"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.title}>Author</Text>
        <TextInput
          style={styles.input}
          placeholder="Nama Penulis"
          value={author}
          onChangeText={setAuthor}
        />

        <Text style={styles.title}>Content</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          placeholder="Tuliskan perasaan dan pikiranmu hari ini..."
          value={entry}
          onChangeText={setEntry}
        />

        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>
            {isEdit ? 'Perbarui Jurnal' : 'Simpan Jurnal'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </View>
  );
};

export default JournalForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  Judul :{
    fontSize: 24,
    fontFamily: fontType.judul,
    marginBottom: 15,
  },
  title: {
    fontSize: 12,
    fontFamily: fontType.judul,
    color: colors.textDark,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontFamily: fontType.regular,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
  },
  textArea: {
    height: 160,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 10,
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: fontType.judul,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
