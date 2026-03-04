import { Pressable, Text, StyleSheet, Animated, ViewStyle, TextStyle } from 'react-native';
import { useRef } from 'react';
import * as Haptics from 'expo-haptics';

interface Button3DProps {
    label: string;
    onPress?: () => void;
    color?: string;
    shadowColor?: string;
    textStyle?: TextStyle;
    style?: ViewStyle;
    disabled?: boolean;
}

const SHADOW_HEIGHT = 6;

export function Button3D({
    label,
    onPress,
    color = '#1DB954',
    shadowColor = '#17a349',
    textStyle,
    style,
    disabled = false,
}: Button3DProps) {
    const translateY = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
        if (disabled) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Animated.spring(translateY, {
            toValue: SHADOW_HEIGHT,
            useNativeDriver: true,
            speed: 40,
            bounciness: 6,
        }).start();
    };

    const handlePressOut = () => {
        if (disabled) return;
        Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            speed: 30,
            bounciness: 8,
        }).start();
    };

    const handlePress = () => {
        if (disabled) return;
        onPress?.();
    };

    const resolvedColor = disabled ? '#d0d0d0' : color;
    const resolvedShadow = disabled ? '#b0b0b0' : shadowColor;

    return (
        <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            style={[styles.shadow, { backgroundColor: resolvedShadow }, style]}
            accessibilityState={{ disabled }}
        >
            <Animated.View
                style={[
                    styles.button,
                    { backgroundColor: resolvedColor, transform: [{ translateY }], opacity: disabled ? 0.7 : 1 },
                ]}
            >
                <Text style={[styles.label, textStyle]}>{label}</Text>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    shadow: {
        borderRadius: 100,
    },
    button: {
        borderRadius: 100,
        paddingVertical: 18,
        alignItems: 'center',
        marginBottom: SHADOW_HEIGHT,
    },
    label: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
});
