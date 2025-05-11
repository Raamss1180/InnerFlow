import React, { useState } from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, Alert,} from 'react-native';
import { colors, fontType } from '../../theme';

const DailyJournal = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [entry, setEntry] = useState('');

  const handleSubmit = () => {
    if (!title || !author || !entry) {
      Alert.alert('Peringatan', 'Semua kolom harus diisi!');
      return;
    }

    Alert.alert('Tersimpan', 'Catatan harian kamu telah disimpan!');
    setTitle('');
    setAuthor('');
    setEntry('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jurnal Harian</Text>

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
        <Text style={styles.buttonText}>Simpan Jurnal</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DailyJournal;

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