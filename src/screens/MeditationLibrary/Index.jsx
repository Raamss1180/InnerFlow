import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import { colors, fontType } from '../../theme';

const meditationList = [
  { title: 'Fokus Saat Bertanding', image: require('../../assets/images/morning.jpg') },
  { title: 'Pernapasan Dalam', image: require('../../assets/images/morning.jpg') },
  { title: 'Relaksasi Otot', image: require('../../assets/images/morning.jpg') },
];

const MeditationLibrary = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meditation Library</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {meditationList.map((item, index) => (
          <TouchableOpacity key={index} style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default MeditationLibrary;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  title: { fontSize: 24, fontFamily: fontType.bold, marginBottom: 15, color: colors.textDark },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
  },
  image: { width: '100%', height: 160 },
  cardTitle: {
    padding: 10,
    fontSize: 16,
    fontFamily: fontType.medium,
    color: colors.textDark,
  },
});