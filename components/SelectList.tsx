import {
    View,
    Text,
    Pressable,
    StyleSheet,
    ScrollView,
    Animated,
} from 'react-native';
import { useRef } from 'react';
import * as Haptics from 'expo-haptics';

export interface SelectItem {
    id: string;
    emoji: string;
    label: string;
}

interface SelectListProps {
    items: SelectItem[];
    selected: string | null;
    onSelect: (id: string) => void;
}

const SHADOW_HEIGHT = 4;

export function SelectList({ items, selected, onSelect }: SelectListProps) {
    const handleSelect = (id: string) => {
        Haptics.selectionAsync();
        onSelect(id);
    };

    return (
        <View style={styles.container}>
            {items.map((item) => {
                const isSelected = selected === item.id;
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

                return (
                    <Pressable
                        key={item.id}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        onPress={() => handleSelect(item.id)}
                        style={[
                            styles.shadow,
                            { backgroundColor: isSelected ? '#46A302' : '#e5e5e5' }
                        ]}
                    >
                        <Animated.View
                            style={[
                                styles.row,
                                isSelected ? styles.rowSelected : styles.rowUnselected,
                                { transform: [{ translateY }] }
                            ]}
                        >
                            <View style={styles.leftContent}>
                                <View style={styles.emojiContainer}>
                                    <Text style={styles.emoji}>{item.emoji}</Text>
                                </View>
                                <Text style={styles.label}>
                                    {item.label}
                                </Text>
                            </View>

                            {isSelected && (
                                <View style={styles.checkWrapper}>
                                    <Text style={styles.checkIcon}>✓</Text>
                                </View>
                            )}
                        </Animated.View>
                    </Pressable>
                );
            })}
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
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        borderWidth: 2,
        marginBottom: SHADOW_HEIGHT,
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
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    emojiContainer: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    emoji: {
        fontSize: 24,
    },
    label: {
        fontSize: 17,
        fontWeight: '700',
        color: '#4b4b4b',
        flex: 1,
    },
    checkWrapper: {
        marginLeft: 10,
    },
    checkIcon: {
        fontSize: 18,
        color: '#58CC02',
        fontWeight: 'bold',
    },
});
