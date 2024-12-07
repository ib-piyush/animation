import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Animated } from 'react-native';
import * as Font from 'expo-font';
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import ReverseAnimation from './ReverseAnimation';

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [animatedSentence, setAnimatedSentence] = useState('');
  const [letterOpacity] = useState(new Animated.Value(1));
  const [showText, setShowText] = useState(true);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [sentencesAnimated, setSentencesAnimated] = useState(false);
  const [sentenceReversed, setReverseSentence] = useState(false);
  const [showReverseAnimation, setShowReverseAnimation] = useState(false);

  const sentence = "  Over half of the population suffers from the diet related diseases...  ";
  const sentences = [
    "Get rid of acne",
    "Reduce body fat",
    "Think clearly",
    "Sleep better",
    "Boost energy",
    "Clear Skin",
    "Get Stronger"
  ];

  const sentenceColors = useRef(sentences.map(() => new Animated.Value(0)));
  const sentenceOpacities = useRef(sentences.map(() => new Animated.Value(1)));

  const triggerHapticFeedback = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  useLayoutEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        'tilted-font': require('./assets/fonts/EBGaramond-BoldItalic.ttf'),
      });
      setFontLoaded(true);
    };

    loadFont();
  }, []);

  useEffect(() => {
    if (fontLoaded) {
      setAnimatedSentence('');
      let currentIndex = 0;
      const intervalId = setInterval(() => {
        if (currentIndex < sentence.length) {
          setAnimatedSentence((prev) => prev + sentence[currentIndex]);

          if (currentIndex % 5 === 0) {
            triggerHapticFeedback();
          }

          currentIndex++;
        } else {
          clearInterval(intervalId);

          Animated.timing(letterOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start();

          setTimeout(() => {
            setSentencesAnimated(true);
          }, 1000);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(intervalId);
        setShowText(false);
      }, 9000);
    }
  }, [fontLoaded]);

  useEffect(() => {
    if (sentencesAnimated) {
      let sentenceIndex = 0;
      const interval = setInterval(() => {
        if (sentenceIndex < sentences.length) {
          if (sentenceIndex > 0) {
            Animated.timing(sentenceColors.current[sentenceIndex - 1], {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }).start();
          }

          Animated.timing(sentenceColors.current[sentenceIndex], {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }).start();
          triggerHapticFeedback();
          setHighlightedIndex(sentenceIndex);
          sentenceIndex++;
        } else {
          clearInterval(interval);
          setSentencesAnimated(false);
          setReverseSentence(true);

          setTimeout(() => {
            setReverseSentence(false);
          }, 1000);
        }
      }, 300);
    }
  }, [sentencesAnimated]);

  useEffect(() => {
    if (sentenceReversed) {
      let sentenceIndex = sentences.length - 1;
      const interval = setInterval(() => {
        if (sentenceIndex >= 0) {
          Animated.timing(sentenceOpacities.current[sentenceIndex], {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }).start();

          sentenceIndex--;
          triggerHapticFeedback();
        } else {
          clearInterval(interval);
          setShowReverseAnimation(true);
        }
      }, 100);
    }
  }, [sentenceReversed]);

  if (!fontLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#001400', '#001400', '#001400', '#001400']}
        style={styles.container}
      >
        {showText && (
          <View style={styles.textContainer}>
            <Animated.Text
              style={[styles.text, { fontFamily: 'tilted-font', opacity: letterOpacity, textAlign: 'center' }]}
            >
              {animatedSentence}
            </Animated.Text>
          </View>
        )}

        {sentencesAnimated && !sentenceReversed && (
          <View style={styles.sentencesContainer}>
            {sentences.map((item, index) => {
              return (
                <Animated.View key={index}>
                  <Animated.Text
                    style={[
                      styles.sentencesText,
                      {
                        color: sentenceColors.current[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: ['grey', 'white'],
                        }),
                      },
                    ]}
                  >
                    {item}
                  </Animated.Text>
                </Animated.View>
              );
            })}
          </View>
        )}

        {sentenceReversed && (
          <View style={styles.sentencesContainer}>
            {sentences.slice().reverse().map((item, index) => {
              return (
                <Animated.View key={index}>
                  <Animated.Text
                    style={[
                      styles.sentencesText,
                      {
                        opacity: sentenceOpacities.current[index],
                      },
                    ]}
                  >
                    {item}
                  </Animated.Text>
                </Animated.View>
              );
            })}
          </View>
        )}
        {showReverseAnimation && <ReverseAnimation fontFamily="tilted-font" />}
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  text: {
    fontSize: 40,
    color: '#fff',
  },
  sentencesContainer: {
    marginTop: 20,
    alignItems: 'start',
    justifyContent: '',
  },
  sentencesText: {
    fontSize: 52,
    color: 'grey',
    marginBottom: 5,
    textAlign: 'left',
    fontFamily: 'tilted-font',
  },
});
