import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { MajorCard } from '../../components/MajorCard';
import { Button3D } from '../../components/Button3D';

const MAJORS = [
    {
        id: 'science',
        emoji: '🔬',
        label: 'Science',
        description: 'Physics, Chemistry, Biology & Maths.',
        accent: '#58CC02',
    },
    {
        id: 'commercial',
        emoji: '📊',
        label: 'Commercial',
        description: 'Economics, Accounting & Business.',
        accent: '#1CB0F6',
    },
    {
        id: 'arts',
        emoji: '🎨',
        label: 'Arts',
        description: 'History, Literature & Geography.',
        accent: '#FF9600',
    },
    {
        id: 'request',
        emoji: '➕',
        label: 'Request',
        description: 'Don\'t see yours? Suggest a major.',
        accent: '#CE82FF',
    },
];

export default function MajorStep() {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <OnboardingLayout
            step={1}
            total={3}
            title="Choose your path"
            subtitle="Pick a study major to get started."
            showBack={false}
            showProgress={false}
            footer={
                <Button3D
                    label="Continue"
                    onPress={() => router.push('/(setup)/year')}
                    disabled={!selected}
                />
            }
        >
            <View style={styles.grid}>
                {MAJORS.map((major) => (
                    <MajorCard
                        key={major.id}
                        {...major}
                        selected={selected === major.id}
                        onPress={() => setSelected(major.id)}
                    />
                ))}
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
        paddingTop: 10,
    },
});
