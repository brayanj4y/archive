import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { useRef } from 'react';
import * as Haptics from 'expo-haptics';

interface YearCardProps {
    year: string;
    subtitle?: string;
    selected: boolean;
    onPress: () => void;
}

const SHADOW_HEIGHT = 4;

export function YearCard({ year, subtitle, selected, onPress }: YearCardProps) {
    const translateY = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.spring(translateY, { toValue: SHADOW_HEIGHT, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
    };

    const handlePressOut = () => {
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, speed: 30, bounciness: 10 }).start();
        onPress();
    };

    const shadowColor = selected ? '#1DB954' : '#d0d0d0';

    return (
        <View style={[styles.shadowBase, { backgroundColor: shadowColor }]}>
            <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={{ flex: 1 }}>
                <Animated.View
                    style={[
                        styles.card,
                        { transform: [{ translateY }] },
                        selected && styles.cardSelected,
                    ]}
                >
                    <Text style={[styles.year, selected && styles.yearSelected]}>{year}</Text>
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </Animated.View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    shadowBase: {
        width: '47%',
        aspectRatio: 0.8,
        borderRadius: 18,
        marginBottom: 8,
    },
    card: {
        flex: 1,
        borderRadius: 18,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#e8e8e8',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        marginBottom: SHADOW_HEIGHT,
    },
    cardSelected: {
        backgroundColor: '#f0fff7',
        borderColor: '#1DB954',
    },
    year: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    yearSelected: {
        color: '#1DB954',
    },
    subtitle: {
        fontSize: 12,
        color: '#888',
        fontWeight: '600',
    },
});
