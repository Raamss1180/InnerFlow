import React, { useState, useEffect, useRef, useCallback } from 'react';
import {View,Text,StyleSheet,ScrollView,TouchableOpacity,Platform,Animated,} from 'react-native';
import MeditationCard from '../../components/MeditationCard';
import SearchBar from '../../components/SearchBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, fontType } from '../../theme';
import * as Animatable from 'react-native-animatable';
import { useFocusEffect } from '@react-navigation/native';

const recoveryChecklist = [
  'Tidur 7 jam',
  'Minum air 2 liter',
  'Latih pernapasan',
  'Stretching ringan',
  'Makan bergizi',
  'Meditasi singkat',
];

const tips = [
  { id: 1, icon: '🛌', title: 'Istirahat Cukup', content: 'Tidur teratur bantu pemulihan optimal.' },
  { id: 2, icon: '💧', title: 'Hidrasi Optimal', content: 'Minum cukup air menjaga metabolisme tubuh.' },
  { id: 3, icon: '🥗', title: 'Nutrisi Seimbang', content: 'Makanan sehat bantu perbaiki jaringan otot.' },
  { id: 4, icon: '🧘', title: 'Relaksasi Aktif', content: 'Peregangan ringan dan yoga mempercepat pemulihan.'}
];

const RecoveryScreen = () => {
  const [checked, setChecked] = useState([]);
  const screenScaleAnim = useRef(new Animated.Value(0.95)).current;
  const screenOpacityAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      screenScaleAnim.setValue(0.95);
      screenOpacityAnim.setValue(0);
      Animated.parallel([
        Animated.spring(screenScaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(screenOpacityAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    }, [screenScaleAnim, screenOpacityAnim]) 
  );

  const toggleChecklist = (item) => {
    setChecked((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };
  const baseComponentDelay = 300; 

  return (
    <Animated.View
      style={[
        styles.containerWrapper,
        {
          opacity: screenOpacityAnim,
          transform: [{ scale: screenScaleAnim }],
        },
      ]}
    >
      <ScrollView style={styles.containerScroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animatable.View animation="fadeInDown" duration={700} delay={baseComponentDelay} style={styles.header}>
          <Text style={styles.title}>Recovery Hub</Text>
          <Ionicons name="person-circle-outline" size={35} color={colors.textDark} />
        </Animatable.View>

        {/* Search Bar */}
        <Animatable.View animation="fadeInDown" duration={700} delay={baseComponentDelay + 100}>
          <SearchBar placeholder="Cari tips pemulihan..." />
        </Animatable.View>

        {/* Meditation Cards Section */}
        <Animatable.Text animation="fadeInUp" duration={700} delay={baseComponentDelay + 200} style={styles.heading}>
          Meditasi Pemulihan
        </Animatable.Text>
        <Animatable.View animation="fadeInUp" duration={700} delay={baseComponentDelay + 300}>
          <MeditationCard title="Pernapasan Dalam" duration={5} onStart={() => {}} />
        </Animatable.View>
        <Animatable.View animation="fadeInUp" duration={700} delay={baseComponentDelay + 350} style={{marginBottom: 10}}>
          <MeditationCard title="Meditasi Pikiran" duration={10} onStart={() => {}} />
        </Animatable.View>

        {/* Recovery Checklist Section */}
        <Animatable.Text animation="fadeInUp" duration={700} delay={baseComponentDelay + 450} style={styles.heading}>
          Checklist Pemulihan Harian
        </Animatable.Text>
        <View style={styles.checklistWrapper}>
          {recoveryChecklist.map((item, index) => (
            <Animatable.View
              key={index} 
              animation="bounceIn"
              duration={700}
              delay={baseComponentDelay + 550 + index * 80} 
              style={styles.checkItemGrid}
              iterationCount={1}
            >
              <TouchableOpacity
                onPress={() => toggleChecklist(item)}
                style={[styles.checkItem, checked.includes(item) && styles.checked]}
              >
                <Text style={styles.checkText}>
                  {checked.includes(item) ? '✅ ' : '⬜️ '} {item}
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          ))}
        </View>

        {/* Tips Pemulihan Section */}
        <Animatable.Text animation="fadeInUp" duration={700} delay={baseComponentDelay + 750} style={styles.heading}>
          Tips Pemulihan Cepat
        </Animatable.Text>
        {tips.map((tip, index) => (
          <Animatable.View
            key={tip.id}
            animation="fadeInUp"
            duration={700}
            delay={baseComponentDelay + 850 + index * 80}
            iterationCount={1}
          >
            <View style={styles.tipCard}>
              <Text style={styles.tipIcon}>{tip.icon}</Text>
              <View style={styles.tipTextContainer}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipContent}>{tip.content}</Text>
              </View>
            </View>
          </Animatable.View>
        ))}
          <View style={{ height: 30 }} />
      </ScrollView>
    </Animated.View>
  );
};

export default RecoveryScreen;

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    backgroundColor: colors.background || '#FFFFFF',
  },
  containerScroll: { 
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 20 : 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontFamily: fontType.judul,
    color: colors.textDark,
  },
  heading: {
    fontSize: 20,
    fontFamily: fontType.bold,
    color: colors.textPrimary || colors.textDark,
    marginTop: 24,
    marginBottom: 16,
  },
  checklistWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  checkItemGrid: {
    width: '48%',
    marginBottom: 12,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.inputBackground || '#F0F4F8',
    borderWidth: 1,
    borderColor: colors.border || '#E0E0E0',
  },
  checked: {
    backgroundColor: colors.primaryLight || '#D6F5D6',
    borderColor: colors.primary || '#4CAF50',
  },
  checkIcon: {
    marginRight: 10,
  },
  checkText: {
    fontSize: 15,
    fontFamily: fontType.regular,
    color: colors.textDark,
    flex: 1,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground || '#F8FAFC',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tipIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  tipTextContainer: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 17,
    fontFamily: fontType.bold,
    color: colors.textDark,
    marginBottom: 3,
  },
  tipContent: {
    fontSize: 14,
    fontFamily: fontType.regular,
    color: colors.textSecondary || '#555',
    lineHeight: 20,
  },
});
