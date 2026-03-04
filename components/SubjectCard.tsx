import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { useRef } from 'react';
import * as Haptics from 'expo-haptics';

export interface SubjectPaper {
    id: string;
    name: string;
    code: string;       // e.g. "0800"
    emoji: string;
    progress: number;   // 0 – 1
    accent: string;
}

interface SubjectCardProps {
    paper: SubjectPaper;
    selected?: boolean;
    onPress: () => void;
}

const SHADOW_HEIGHT = 4;

export function SubjectCard({ paper, selected = false, onPress }: SubjectCardProps) {
    const translateY = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.spring(translateY, { toValue: SHADOW_HEIGHT, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
    };
    const handlePressOut = () => {
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, speed: 30, bounciness: 8 }).start();
        onPress();
    };

    const pct = Math.round(paper.progress * 100);

    return (
        <View style={[styles.shadowBase, { backgroundColor: selected ? paper.accent : '#e5e5e5' }]}>
            <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={{ flex: 1 }}>
                <Animated.View
                    style={[
                        styles.card,
                        { transform: [{ translateY }] },
                        selected && { borderColor: paper.accent, backgroundColor: '#f0fff7' }
                    ]}
                >
                    {/* Header row */}
                    <View style={styles.header}>
                        <View style={[styles.badge, { backgroundColor: paper.accent + '22' }]}>
                            <Text style={styles.emoji}>{paper.emoji}</Text>
                        </View>
                        <View style={styles.headerText}>
                            <Text style={styles.name}>{paper.name}</Text>
                            <Text style={styles.code}>Paper 1 · {paper.code}</Text>
                        </View>
                        <View style={styles.pctBadge}>
                            <Text style={[styles.pctText, { color: paper.accent }]}>{pct}%</Text>
                        </View>
                    </View>

                    {/* Progress bar */}
                    <View style={styles.trackContainer}>
                        <View style={styles.track}>
                            <View
                                style={[
                                    styles.fill,
                                    { width: `${pct}%` as any, backgroundColor: paper.accent },
                                ]}
                            />
                        </View>
                    </View>

                    {/* Footer stats - simplified as requested */}
                    <View style={styles.footer}>
                        <Text style={styles.stat}>
                            {Math.round(paper.progress * 500)} <Text style={styles.statLabel}>/ 500 Qs done</Text>
                        </Text>
                    </View>
                </Animated.View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    shadowBase: {
        borderRadius: 20,
        backgroundColor: '#e5e5e5',
        marginBottom: 8,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#ebebeb',
        padding: 18,
        gap: 14,
        marginBottom: SHADOW_HEIGHT,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    badge: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emoji: {
        fontSize: 24,
    },
    headerText: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1a1a1a',
        marginBottom: 2,
    },
    code: {
        fontSize: 12,
        color: '#aaa',
        fontWeight: '500',
    },
    pctBadge: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    pctText: {
        fontSize: 14,
        fontWeight: '800',
    },
    trackContainer: {},
    track: {
        height: 10,
        borderRadius: 99,
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: 99,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    stat: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    statLabel: {
        fontWeight: '400',
        color: '#aaa',
    },
});
