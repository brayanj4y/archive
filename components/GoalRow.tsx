import { View, Text, Pressable, StyleSheet } from 'react-native';
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

export function GoalRow({ option, selected, onSelect, isLast }: GoalRowProps) {
    const handlePress = () => {
        Haptics.selectionAsync();
        onSelect(option.id);
    };

    return (
        <Pressable
            onPress={handlePress}
            style={({ pressed }) => [
                styles.row,
                !isLast && styles.rowBorder,
                selected && styles.rowSelected,
                pressed && !selected && styles.rowPressed,
            ]}
        >
            {/* Left accent bar when selected */}
            <View style={[styles.accent, selected && styles.accentActive]} />

            <View style={styles.rowInner}>
                <Text style={[styles.label, selected && styles.labelSelected]}>
                    {option.label}
                </Text>
                <Text style={[styles.detail, selected && styles.detailSelected]}>
                    {option.detail}
                </Text>
            </View>

            {/* Checkmark */}
            <View style={[styles.check, selected && styles.checkActive]}>
                {selected && <Text style={styles.checkMark}>✓</Text>}
            </View>
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
        <View style={styles.card}>
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
    card: {
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#e5e5e5',
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        paddingRight: 20,
        backgroundColor: '#ffffff',
        minHeight: 72,
    },
    rowBorder: {
        borderBottomWidth: 1.5,
        borderBottomColor: '#e5e5e5',
    },
    rowSelected: {
        backgroundColor: '#f0fff7',
    },
    rowPressed: {
        backgroundColor: '#f5f5f5',
    },
    // Left colored accent bar
    accent: {
        width: 4,
        alignSelf: 'stretch',
        borderRadius: 4,
        marginRight: 16,
        backgroundColor: 'transparent',
    },
    accentActive: {
        backgroundColor: '#1DB954',
    },
    rowInner: {
        flex: 1,
    },
    label: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 2,
    },
    labelSelected: {
        color: '#1DB954',
    },
    detail: {
        fontSize: 14,
        fontWeight: '500',
        color: '#aaa',
    },
    detailSelected: {
        color: '#1DB954',
    },
    // Circle checkmark on the right
    check: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    checkActive: {
        backgroundColor: '#1DB954',
        borderColor: '#1DB954',
    },
    checkMark: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '800',
    },
});
