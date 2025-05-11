import React from 'react';
import {View,Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions, Animated,} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../../components/SearchBar';
import { colors, fontType } from '../../theme';
import MeditationDetail from '../MeditationDetail/Index';
import meditationList from '../../components/MeditationList';

export default function HomeScreen() {

  // Rekomendasi Meditasi Komponen
const RecommendationItem = ({ content, title, image }) => {
  const navigation = useNavigation();
  const item = meditationList.find((med) => med.title === title);

  return (
    <TouchableOpacity
      style={styles.recommendationItem}
      activeOpacity={0.8}
      onPress={() => {
        if (item) {
          navigation.navigate('MeditationDetail', {
            title: item.title,
            content: item.content,
            image: item.image,
          });
        }
      }}
    >
      <Image source={image} style={styles.recommendationImage} resizeMode="cover" />
      <Text style={styles.recommendationText}>{title}</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.content}>{content}</Text>
            </ScrollView>
    </TouchableOpacity>
  );
};

  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>InnerFlow</Text>
        <Ionicons name="person-circle-outline" size={35} color={colors.textDark} />
      </View>

      {/* Search Bar */}
      <SearchBar />

      {/* Banner */}
      <Animated.View style={[styles.bannerContainer, { opacity: fadeAnim }]}>
        <Image source={require('../../assets/images/banner.jpg')} style={styles.bannerImage} resizeMode="cover" />
        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerText}>Fokus. Tenang. Kuat.</Text>
          <Text style={styles.bannerSubText}>Latih mental atletikmu dengan meditasi!</Text>
        </View>
      </Animated.View>

      {/* Kategori */}
      <View style={styles.categoryContainer}>
        <CategoryItem icon="fitness" title="Fokus" />
        <CategoryItem icon="leaf" title="Relaksasi" />
        <CategoryItem icon="cloud-outline" title="Pernapasan" />
        <CategoryItem icon="journal-outline" title="Jurnal" />
      </View>

      {/* Rekomendasi Meditasi */}
      <Text style={styles.sectionTitle}>Rekomendasi untuk Anda</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recommendationContainer}>
        <RecommendationItem title="Meditasi Sebelum Bertanding" image={require('../../assets/images/pre_match.jpg')} />
        <RecommendationItem title="Mindfulness Recovery" image={require('../../assets/images/recovery.jpg')} />
        <RecommendationItem title="Meditasi Pagi" image={require('../../assets/images/morning.jpg')} />
        <RecommendationItem title="Pemulihan Cedera" image={require('../../assets/images/injury_recovery.jpg')} />
      </ScrollView>
    </View>
  );
}

// Kategori Komponen
const CategoryItem = ({ icon, title }) => (
  <TouchableOpacity style={styles.categoryItem}>
    <Ionicons name={icon} size={24} color={colors.textLight} />
    <Text style={styles.categoryText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 28, fontFamily: fontType.bold, color: colors.textDark },

  // Banner
  bannerContainer: {
    width: '100%',
    height: 150,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 4,
  },
  bannerImage: { width: '100%', height: '100%' },
  bannerTextContainer: {
    position: 'absolute',
    bottom: 10,
    left: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  bannerText: { fontSize: 18, fontFamily: fontType.bold, color: colors.textLight },
  bannerSubText: { fontSize: 14, fontFamily: fontType.regular, color: colors.textLight },

  // Kategori
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 15,
  },
  categoryItem: {
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 15,
    height: 90,
    marginBottom: 10,
  },
  categoryText: { fontSize: 14, fontFamily: fontType.medium, color: colors.textLight, marginTop: 5 },

  // Rekomendasi
  sectionTitle: { fontSize: 18, fontFamily: fontType.bold, color: colors.textDark, marginTop: -10, marginBottom: 5 },
  recommendationContainer: { flexDirection: 'row', paddingBottom: 0 },
  recommendationItem: {
    width: 150,
    height: '95%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 12,
    elevation: 3,
  },
  recommendationImage: {
    width: '100%',
    height: 160,
    resizeMode: 'contain',
    aspectRatio: 1,
  },
  recommendationText: { padding: 10, fontSize: 14, fontFamily: fontType.medium, color: colors.textDark },
});