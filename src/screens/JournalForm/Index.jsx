import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, fontType } from '../../theme';
import { addJournal, updateJournal } from '../../services/JournalAPI';

const JournalForm = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isEdit = !!route.params?.journal;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [entry, setEntry] = useState('');

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

    try {
      if (isEdit) {
        await updateJournal(route.params.journal.id, {
          title,
          author,
          content: entry,
        });
        Alert.alert('Berhasil', 'Jurnal berhasil diperbarui!');
      } else {
        await addJournal({ title, author, content: entry });
        Alert.alert('Berhasil', 'Jurnal berhasil ditambahkan!');
      }

      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Gagal menyimpan jurnal.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEdit ? 'Edit Jurnal' : 'Tambah Jurnal'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Judul Jurnal"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Nama Penulis"
        value={author}
        onChangeText={setAuthor}
      />
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
    </View>
  );
};

export default JournalForm;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  title: {
    fontSize: 24,
    fontFamily: fontType.bold,
    marginBottom: 15,
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
    fontFamily: fontType.bold,
  },
});