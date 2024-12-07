import React, { useState, useEffect, useRef } from 'react';
import { Animated, Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Font from 'expo-font';

export default function ReverseAnimation() {
    const tabs1 = useState(["Cardio", "Strength", "Flexibility", "Nutrition", "Recovery", "Wellness"])[0];
    const tabs2 = useState(["Yoga", "Pilates", "CrossFit", "Hydration", "Sleep", "Mental Health"])[0];
    const tabs3 = useState(["Workouts", "Supplements", "Routine", "Goals", "Diet", "Rest"])[0];

    const tabPositions1 = useRef(tabs1.map(() => new Animated.Value(0)));
    const tabPositions2 = useRef(tabs2.map(() => new Animated.Value(0)));
    const tabPositions3 = useRef(tabs3.map(() => new Animated.Value(0)));
    const containerWidth = useRef(0);

    const [showText, setShowText] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const fadeAnimText = useRef(new Animated.Value(0)).current;
    const fadeAnimButton = useRef(new Animated.Value(0)).current;

    const triggerHapticFeedback = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    useEffect(() => {
        const totalWidth = containerWidth.current;

        const animateTabs = (tabPositions, duration, direction) => {
            tabPositions.forEach((tabPosition, index) => {
                const moveRight = Animated.timing(tabPosition, {
                    toValue: totalWidth + 200,
                    duration: duration,
                    useNativeDriver: true,
                });

                const moveLeft = Animated.timing(tabPosition, {
                    toValue: -200,
                    duration: duration,
                    useNativeDriver: true,
                });

                const animationSequence = direction === 'right' ?
                    Animated.sequence([moveRight, moveLeft]) :
                    Animated.sequence([moveLeft, moveRight]);

                Animated.loop(animationSequence).start();
            });
        };

        animateTabs(tabPositions1.current, 14000, 'right');
        animateTabs(tabPositions2.current, 12000, 'left');
        animateTabs(tabPositions3.current, 14000, 'right');

        setTimeout(() => {
            setShowText(true);
        }, 3000);

        setTimeout(() => {
            setShowButton(true);
        }, 5000);
    }, [tabs1, tabs2, tabs3]);

    useEffect(() => {
        if (showText) {
            Animated.timing(fadeAnimText, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        }
    }, [showText]);

    useEffect(() => {
        if (showButton) {
            Animated.timing(fadeAnimButton, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        }
    }, [showButton]);

    return (
        <View
            style={styles.container}
            onLayout={(event) => {
                const { width } = event.nativeEvent.layout;
                containerWidth.current = width;
            }}
        >
            <View style={styles.tabContainer}>
                {tabs1.map((tab, index) => (
                    <Animated.View
                        key={index}
                        style={[styles.tab, { transform: [{ translateX: tabPositions1.current[index] }] }]}
                    >
                        <Text style={styles.tabText}>{tab}</Text>
                    </Animated.View>
                ))}
            </View>

            <View style={styles.tabContainer}>
                {tabs2.map((tab, index) => (
                    <Animated.View
                        key={index}
                        style={[styles.tab, { transform: [{ translateX: tabPositions2.current[index] }] }]}
                    >
                        <Text style={styles.tabText}>{tab}</Text>
                    </Animated.View>
                ))}
            </View>

            <View style={styles.tabContainer}>
                {tabs3.map((tab, index) => (
                    <Animated.View
                        key={index}
                        style={[styles.tab, { transform: [{ translateX: tabPositions3.current[index] }] }]}
                    >
                        <Text style={styles.tabText}>{tab}</Text>
                    </Animated.View>
                ))}
            </View>

            <Animated.View style={[styles.fadeInTextContainer, { opacity: fadeAnimText }]}>
                <Text style={styles.fadeInText}>Perfect your diet.</Text>
            </Animated.View>

            <Animated.View style={[styles.buttonContainer, { opacity: fadeAnimButton }]}>
                <TouchableOpacity style={styles.button} onPress={() => console.log("Sign In Pressed")}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/160/160139.png' }}
                        style={styles.buttonImage}
                    />
                    <Text style={styles.text1}>Sign in with apple</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 100,
        width: '100%',
        overflow: 'hidden',
    },
    tabContainer: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 20,
    },
    tab: {
        marginHorizontal: 10,
        padding: 20,
        paddingVertical: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    fadeInTextContainer: {
        position: 'absolute',
        top: '50%',
        left: '35%',
        transform: [{ translateX: -100 }, { translateY: -20 }],
        alignItems: 'center',
    },
    fadeInText: {
        fontFamily: 'Lato',
        color: '#fff',
        fontSize: 80,
        fontWeight: 'bold',
    },
    buttonContainer: {
        position: 'absolute',
        top: '85%',
        alignItems: 'center',
    },
    button: {
        borderRadius: 30,
        paddingVertical: 15,
        paddingHorizontal: 90,
        borderColor: 'white',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    buttonImage: {
        width: 25,
        height: 25,
        marginRight: 10,
        tintColor: 'white',
    },
    text1: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
