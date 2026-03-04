import {
    View,
    Text,
    Pressable,
    StyleSheet,
    ScrollView,
} from 'react-native';
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

export function SelectList({ items, selected, onSelect }: SelectListProps) {
    const handleSelect = (id: string) => {
        Haptics.selectionAsync();
        onSelect(id);
    };

    return (
        <View style={styles.card}>
            {items.map((item, index) => {
                const isSelected = selected === item.id;
                const isLast = index === items.length - 1;
                return (
                    <Pressable
                        key={item.id}
                        onPress={() => handleSelect(item.id)}
                        style={({ pressed }) => [
                            styles.row,
                            !isLast && styles.rowBorder,
                            isSelected && styles.rowSelected,
                            pressed && styles.rowPressed,
                        ]}
                    >
                        <View style={styles.emojiContainer}>
                            <Text style={styles.emoji}>{item.emoji}</Text>
                        </View>
                        <Text style={[styles.label, isSelected && styles.labelSelected]}>
                            {item.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#e5e5e5',
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
    },
    rowBorder: {
        borderBottomWidth: 1.5,
        borderBottomColor: '#e5e5e5',
    },
    rowSelected: {
        backgroundColor: '#f0fff6',
    },
    rowPressed: {
        backgroundColor: '#f5f5f5',
    },
    emojiContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    emoji: {
        fontSize: 22,
    },
    label: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1a1a1a',
        flex: 1,
    },
    labelSelected: {
        color: '#1DB954',
    },
});
