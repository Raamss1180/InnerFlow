import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { colors, fontType } from '../../theme';

const MeditationDetail = ({ route }) => {
  const {image, title, content } = route.params;

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="cover" />
      <Text style={styles.title}>{title}</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.content}>{content}</Text>
      </ScrollView>
    </View>
  );
};

export default MeditationDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: fontType.judul,
    marginBottom: 15,
    color: colors.textDark,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    fontFamily: fontType.regular,
    color: colors.textDark,
    lineHeight: 24,
  },
});