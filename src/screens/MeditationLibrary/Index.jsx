import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, Image,} from 'react-native';
import { colors, fontType } from '../../theme';
import meditationList from '../../components/MeditationList';

const MeditationLibrary = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meditation Library</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {meditationList.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation.navigate('MeditationDetail', {
              image: item.image,
              title: item.title,
              content: item.content,
            })}
          >
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
  container: { flex: 1, backgroundColor: colors.background, padding: 20, },
  title: {
    fontSize: 24,
    fontFamily: fontType.judul,
    color: colors.textDark,
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
  },
  image: { width: '100%', height: 160, resizeMode: 'cover',},
  cardTitle: {
    padding: 10,
    fontSize: 16,
    fontFamily: fontType.medium,
    color: colors.textDark,
  },
});