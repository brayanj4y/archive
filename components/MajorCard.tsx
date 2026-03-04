import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { useRef } from 'react';
import * as Haptics from 'expo-haptics';

interface MajorCardProps {
    emoji: string;
    label: string;
    description: string;
    selected: boolean;
    onPress: () => void;
    accent: string;
}

const SHADOW_HEIGHT = 6;

export function MajorCard({
    emoji,
    label,
    description,
    selected,
    onPress,
    accent,
}: MajorCardProps) {
    const translateY = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.spring(translateY, {
            toValue: SHADOW_HEIGHT,
            useNativeDriver: true,
            speed: 50,
            bounciness: 4,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            speed: 30,
            bounciness: 8,
        }).start();
        onPress();
    };

    const shadowColor = selected ? accent : '#e5e5e5';

    return (
        <View style={[styles.shadowBase, { backgroundColor: shadowColor }]}>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={{ flex: 1 }}
            >
                <Animated.View
                    style={[
                        styles.card,
                        { transform: [{ translateY }] },
                        selected && { borderColor: accent, backgroundColor: '#f0fff7' },
                    ]}
                >
                    <View style={styles.content}>
                        <Text style={styles.emoji}>{emoji}</Text>
                        <Text style={[styles.label, selected && { color: accent }]}>{label}</Text>
                        <Text style={styles.description}>{description}</Text>
                    </View>
                </Animated.View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    shadowBase: {
        width: '48%',
        aspectRatio: 0.85,
        borderRadius: 24,
        marginBottom: 12,
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#e5e5e5',
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SHADOW_HEIGHT,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    emoji: {
        fontSize: 48,
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: '800',
        color: '#4b4b4b',
        textAlign: 'center',
    },
    description: {
        fontSize: 12,
        color: '#afafaf',
        textAlign: 'center',
        fontWeight: '600',
        lineHeight: 16,
    },
});
