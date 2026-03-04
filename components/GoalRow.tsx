import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { useRef } from 'react';
import * as Haptics from 'expo-haptics';

export interface GoalOption {
    id: string;
    label: string;
    detail: string;   // e.g. "5 questions / day"
}

interface GoalRowProps {
    option: GoalOption;
    selected: boolean;
    onSelect: (id: string) => void;
    isLast?: boolean;
}

const SHADOW_HEIGHT = 4;

export function GoalRow({ option, selected, onSelect, isLast }: GoalRowProps) {
    const translateY = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
        Animated.spring(translateY, {
            toValue: SHADOW_HEIGHT,
            useNativeDriver: true,
            speed: 40,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            speed: 40,
        }).start();
    };

    const handlePress = () => {
        Haptics.selectionAsync();
        onSelect(option.id);
    };

    return (
        <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            style={[
                styles.shadow,
                { backgroundColor: selected ? '#46A302' : '#e5e5e5' }
            ]}
        >
            <Animated.View
                style={[
                    styles.row,
                    selected ? styles.rowSelected : styles.rowUnselected,
                    { transform: [{ translateY }] }
                ]}
            >
                <View style={styles.rowInner}>
                    <Text style={styles.label}>
                        {option.label}
                    </Text>
                    <Text style={styles.detail}>
                        {option.detail}
                    </Text>
                </View>

                {selected && (
                    <View style={styles.checkWrapper}>
                        <Text style={styles.checkMark}>✓</Text>
                    </View>
                )}
            </Animated.View>
        </Pressable>
    );
}

export function GoalList({
    options,
    selected,
    onSelect,
}: {
    options: GoalOption[];
    selected: string | null;
    onSelect: (id: string) => void;
}) {
    return (
        <View style={styles.container}>
            {options.map((opt, i) => (
                <GoalRow
                    key={opt.id}
                    option={opt}
                    selected={selected === opt.id}
                    onSelect={onSelect}
                    isLast={i === options.length - 1}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 16,
        paddingBottom: 20,
    },
    shadow: {
        borderRadius: 16,
        backgroundColor: '#e5e5e5',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
        minHeight: 80,
        borderRadius: 16,
        borderWidth: 2,
        marginBottom: 4,
    },
    rowUnselected: {
        borderColor: '#e5e5e5',
    },
    rowSelected: {
        borderColor: '#58CC02',
    },
    rowPressed: {
        backgroundColor: '#f5f5f5',
    },
    rowInner: {
        flex: 1,
    },
    label: {
        fontSize: 18,
        fontWeight: '800',
        color: '#4b4b4b',
        marginBottom: 4,
    },
    detail: {
        fontSize: 15,
        fontWeight: '500',
        color: '#777',
    },
    checkWrapper: {
        marginLeft: 10,
    },
    checkMark: {
        color: '#58CC02',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
