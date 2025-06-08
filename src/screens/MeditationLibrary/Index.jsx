import React, { useRef, useCallback, useState } from 'react';
import {View,Text,ScrollView,TouchableOpacity,StyleSheet,Image,Animated,} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; 
import { colors, fontType } from '../../theme';
import meditationList from '../../components/MeditationList'; 
import * as Animatable from 'react-native-animatable';

const MeditationLibrary = () => {
  const navigation = useNavigation();
  const [animationKey, setAnimationKey] = useState(0); 

  // Animasi untuk keseluruhan layar
  const screenScaleAnim = useRef(new Animated.Value(0.95)).current;
  const screenOpacityAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      setAnimationKey(prevKey => prevKey + 1);
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
      <View style={styles.container}>
        <Animatable.Text
          key={`title-${animationKey}`}
          animation="fadeInDown"
          duration={700}
          delay={baseComponentDelay}
          style={styles.title}
        >
          Meditation Library
        </Animatable.Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {meditationList.map((item, index) => (
            <Animatable.View
              key={`card-${item.title}-${animationKey}`} 
              animation="fadeInUp" 
              duration={700}
              delay={baseComponentDelay + 150 + index * 100}
              useNativeDriver={true}
              iterationCount={1}
            >
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('MeditationDetail', {
                  // Mengirim seluruh item untuk fleksibilitas di MeditationDetail
                      title: item.title,
                      content: item.content,
                      image: item.image,
                })}
              >
                <Image source={item.image} style={styles.image} />
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            </Animatable.View>
          ))}
          <View style={{height: 20}} />{/* Spacer di akhir scroll */}
        </ScrollView>
      </View>
    </Animated.View>
  );
};

export default MeditationLibrary;

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    backgroundColor: colors.background || '#F5F5F5', 
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 15, 
  },
  scrollContent: {
    paddingBottom: 20, 
  },
  title: {
    fontSize: 28, 
    fontFamily: fontType.judul, 
    color: colors.textDark,
    marginBottom: 20, 
    textAlign: 'center', 
  },
  card: {
    backgroundColor: colors.cardBackground || '#FFFFFF', 
    borderRadius: 15, 
    marginBottom: 20, 
    overflow: 'hidden', 
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  image: {
    width: '100%',
    height: 180, 
    resizeMode: 'cover',
  },
  cardTextContainer: { 
    padding: 15, 
  },
  cardTitle: {
    fontSize: 18, 
    fontFamily: fontType.bold,
    color: colors.textDark,
    marginBottom: 5, 
  },
  // cardDuration: {
  //   fontSize: 14,
  //   fontFamily: fontType.regular,
  //   color: colors.textSecondary,
  // },
});
