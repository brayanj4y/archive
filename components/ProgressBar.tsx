import { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

interface ProgressBarProps {
    step: number;      // 1-based current step
    total: number;     // total steps
}

export function ProgressBar({ step, total }: ProgressBarProps) {
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(progress, {
            toValue: step / total,
            duration: 400,
            useNativeDriver: false,
        }).start();
    }, [step, total]);

    const widthInterpolated = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.track}>
            <Animated.View style={[styles.fill, { width: widthInterpolated }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    track: {
        height: 8,
        borderRadius: 99,
        backgroundColor: '#e5e5e5',
        overflow: 'hidden',
        flex: 1,
    },
    fill: {
        height: '100%',
        borderRadius: 99,
        backgroundColor: '#1DB954',
    },
});
