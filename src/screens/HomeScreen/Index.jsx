import React, { useRef, useCallback } from 'react';
import {View,Text,ScrollView,TouchableOpacity,StyleSheet,Image,TouchableWithoutFeedback,Animated,Platform,} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import SearchBar from '../../components/SearchBar';
import { colors, fontType } from '../../theme';
import meditationList from '../../components/MeditationList';
import * as Animatable from 'react-native-animatable';

export default function HomeScreen() {
  const navigation = useNavigation();

  // Animasi untuk keseluruhan layar (scale-up dan fade-in)
  const screenScaleAnim = useRef(new Animated.Value(0.95)).current;
  const screenOpacityAnim = useRef(new Animated.Value(0)).current;

  // Animasi untuk banner (fade-in, yang sudah ada di kode Anda)
  const bannerFadeAnim = useRef(new Animated.Value(0)).current;
  // Variabel categoryAnim tidak lagi digunakan jika kita memakai Animatable untuk kategori

  useFocusEffect(
    useCallback(() => {
      // Reset animasi ke kondisi awal setiap kali screen mendapat fokus
      screenScaleAnim.setValue(0.95); // Mulai dari skala sedikit kecil
      screenOpacityAnim.setValue(0);  // Mulai dari transparan
      bannerFadeAnim.setValue(0);     // Reset animasi banner

      // Tampung semua animasi yang menggunakan Animated API dari React Native
      const animations = [];

      // Animasi untuk screen utama (scale-up dan fade-in)
      animations.push(
        Animated.spring(screenScaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(screenOpacityAnim, {
          toValue: 1,
          duration: 350, // Durasi fade-in screen
          useNativeDriver: true,
        })
      );

      // Animasi untuk banner (fade-in)
      // Ini akan berjalan secara paralel setelah screen utama mulai muncul
      animations.push(
        Animated.timing(bannerFadeAnim, {
          toValue: 1,
          duration: 600,
          delay: 200, // Beri sedikit delay agar muncul setelah screen agak stabil
          useNativeDriver: true,
        })
      );

      // Jalankan semua animasi Animated API secara paralel
      Animated.parallel(animations).start();

      // Untuk animasi react-native-animatable, mereka akan berjalan berdasarkan delay
      // yang diset pada komponen masing-masing saat dirender.
      // Jika Anda ingin animasi Animatable juga berjalan setiap fokus, Anda perlu
      // mekanisme pemicu ulang (misalnya, mengubah key komponen Animatable).
      // Untuk saat ini, kita biarkan Animatable berjalan dengan delay setelah render awal di fokus.

    }, [screenScaleAnim, screenOpacityAnim, bannerFadeAnim])
  );

  const categories = [
    { id: '1', icon: 'fitness-outline', title: 'Fokus' }, // Ikon disesuaikan
    { id: '2', icon: 'leaf-outline', title: 'Relaksasi' }, // Ikon disesuaikan
    { id: '3', icon: 'cloud-outline', title: 'Pernapasan' },
    { id: '4', icon: 'journal-outline', title: 'Jurnal' },
  ];

  // Data rekomendasi (ambil dari kode asli Anda)
  const recommendations = [
    { title: "Meditasi Sebelum Bertanding", image: require('../../assets/images/pre_match.jpg') },
    { title: "Mindfulness Recovery", image: require('../../assets/images/recovery.jpg') },
    { title: "Meditasi Pagi", image: require('../../assets/images/morning.jpg') },
    { title: "Pemulihan Cedera", image: require('../../assets/images/injury_recovery.jpg') },
  ];


  return (
    <Animated.View style={[
      styles.container,
      {
        opacity: screenOpacityAnim,
        transform: [{ scale: screenScaleAnim }]
      }
    ]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animatable.View animation="fadeInDown" duration={700} delay={300} style={styles.header}>
          <Text style={styles.title}>InnerFlow</Text>
          <Ionicons name="person-circle-outline" size={35} color={colors.textDark} />
        </Animatable.View>

        {/* Search Bar */}
        <Animatable.View animation="fadeInDown" duration={700} delay={400}>
          <SearchBar />
        </Animatable.View>

        {/* Banner */}
        <Animated.View style={[styles.bannerContainer, { opacity: bannerFadeAnim }]}>
          <Image source={require('../../assets/images/banner.jpg')} style={styles.bannerImage} resizeMode="cover" />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerText}>Fokus. Tenang. Kuat.</Text>
            <Text style={styles.bannerSubText}>Latih mental atletikmu dengan meditasi!</Text>
          </View>
        </Animated.View>

        {/* Kategori */}
        <View style={styles.categoryContainer}>
          {categories.map((category, index) => (
            <CategoryItem
              key={category.id}
              icon={category.icon}
              title={category.title}
              animationType="bounceIn" // Jenis animasi spesifik
              duration={700}
              delay={600 + index * 150} // Staggered delay untuk kategori
            />
          ))}
        </View>

        {/* Rekomendasi Meditasi */}
        <Animatable.Text animation="fadeInUp" duration={700} delay={800} style={styles.sectionTitle}>
          Rekomendasi untuk Anda
        </Animatable.Text>
        <Animatable.View animation="fadeInUp" duration={700} delay={900}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recommendationContainer}>
            {recommendations.map((rec, index) => (
                <RecommendationItem key={index} title={rec.title} image={rec.image} />
            ))}
          </ScrollView>
        </Animatable.View>
      </ScrollView>
    </Animated.View>
  );
}

// Kategori Komponen - Menggunakan react-native-animatable
const CategoryItem = ({ icon, title, animationType, duration, delay }) => (
  <Animatable.View
    animation={animationType}
    duration={duration}
    delay={delay}
    style={styles.categoryItemAnimatableWrapper}
    useNativeDriver={true}
  >
    <TouchableOpacity style={styles.categoryItem}>
      <Ionicons name={icon} size={28} color={colors.textLight} />
      <Text style={styles.categoryText}>{title}</Text>
    </TouchableOpacity>
  </Animatable.View>
);

// Rekomendasi Meditasi Komponen (animasi tekan tetap seperti di kode Anda)
const RecommendationItem = ({ title, image }) => {
  const navigation = useNavigation();
  const item = meditationList.find((med) => med.title === title);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 7,
      useNativeDriver: true,
    }).start(() => {
      if (item) {
        navigation.navigate('MeditationDetail', {
          // Mengirim seluruh item agar MeditationDetail bisa mengakses semua propertinya
          title: item.title,
          content: item.content,
          image: item.image,
        });
      } else {
        console.warn(`Meditation item with title "${title}" not found in meditationList.`);
        // Mungkin navigasi ke halaman error atau menampilkan pesan
        Alert.alert("Item Tidak Ditemukan", `Detail untuk "${title}" tidak ditemukan.`);
      }
    });
  };

  return (
    <Animated.View style={[styles.recommendationItem, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut}>
        <View>
          <Image source={image} style={styles.recommendationImage} resizeMode="cover" />
          <View style={styles.recommendationTextContainer}>
            <Text style={styles.recommendationText} numberOfLines={2}>{title}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

// Styles (disesuaikan dari kode Anda dan respons sebelumnya)
const styles = StyleSheet.create({
  container: { // Style untuk Animated.View terluar yang dianimasikan scale & opacity
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 10 : 0, // Mengurangi padding atas agar lebih pas
  },
  // Tidak ada padding horizontal di container utama agar ScrollView bisa full-width jika diperlukan
  // Padding horizontal akan diterapkan pada section-section internal jika perlu

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20, // Padding untuk header
    paddingTop: Platform.OS === 'ios' ? 20 : 15, // Padding atas spesifik untuk header
    paddingBottom: 10, // Padding bawah header
  },
  title: {
    fontSize: 28, // Sedikit diperbesar
    fontFamily: fontType.judul, // Menggunakan bold sesuai permintaan sebelumnya
    color: colors.textDark
  },

  bannerContainer: {
    width: '90%',
    alignSelf: 'center',
    height: 160, // Sedikit diperbesar
    borderRadius: 18, // Lebih bulat
    overflow: 'hidden',
    marginTop: 5, // Mengurangi margin atas karena header sudah ada padding bawah
    marginBottom: 25,
    elevation: 5, // Shadow lebih terlihat
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bannerImage: { width: '100%', height: '100%' },
  bannerTextContainer: {
    position: 'absolute',
    bottom: 12, // Penyesuaian posisi
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.4)', // Background sedikit lebih gelap
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  bannerText: { fontSize: 19, fontFamily: fontType.bold, color: colors.textLight },
  bannerSubText: { fontSize: 13, fontFamily: fontType.regular, color: colors.textLight, marginTop: 2 },

  categorySectionTitle: { // Style baru untuk judul seksi kategori
    fontSize: 20,
    fontFamily: fontType.bold,
    color: colors.textDark,
    marginTop: 0, // Sesuaikan jika banner punya margin bawah besar
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around', // Agar item lebih merata jika jumlahnya tidak pas
    paddingHorizontal: 15, // Padding agar item tidak terlalu mepet
    marginBottom: 20,
  },
  categoryItemAnimatableWrapper: {
    width: '47%', // Penyesuaian lebar agar ada sedikit space jika space-around
    marginBottom: 12,
  },
  categoryItem: {
    height: 95, // Sedikit lebih tinggi
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 10, // Padding internal
    borderRadius: 12, // Border radius disesuaikan
    elevation: 3,
  },
  categoryText: { fontSize: 13, fontFamily: fontType.medium, color: colors.textLight, marginTop: 8, textAlign: 'center'},

  sectionTitle: { // Untuk Rekomendasi
    fontSize: 20,
    fontFamily: fontType.bold,
    color: colors.textDark,
    marginTop: 5, // Margin atas disesuaikan
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  recommendationContainer: { paddingLeft: 20, paddingRight: 5, paddingBottom: 20 }, // Padding agar item terakhir tidak terpotong
  recommendationItem: {
    width: 155, // Sedikit disesuaikan
    backgroundColor: colors.cardBackground || '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  recommendationImage: {
    width: '100%',
    height: 125, // Tinggi gambar disesuaikan
  },
  recommendationTextContainer: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    minHeight: 55, // Ketinggian minimum agar teks tidak terpotong
    alignItems: 'center', // Pusatkan teks jika satu baris
    justifyContent: 'center',
  },
  recommendationText: {
    fontSize: 13, // Sedikit disesuaikan
    fontFamily: fontType.medium,
    color: colors.textDark,
    textAlign: 'center',
  },
});