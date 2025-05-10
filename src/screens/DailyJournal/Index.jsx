import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors, fontType } from '../../theme';

const DailyJournal = () => {
  const [entry, setEntry] = useState('');

  const handleSubmit = () => {
    Alert.alert('Tersimpan', 'Catatan harian kamu telah disimpan!');
    setEntry('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jurnal Harian</Text>
      <TextInput
        style={styles.input}
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
  title: { fontSize: 24, fontFamily: fontType.bold, marginBottom: 15, color: colors.textDark },
  input: {
    height: 200,
    borderColor:'#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontFamily: fontType.regular,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
  },
  buttonText: { textAlign: 'center', color: '#fff', fontFamily: fontType.bold },
});