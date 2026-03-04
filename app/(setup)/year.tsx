import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View, ScrollView } from 'react-native';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { YearCard } from '../../components/YearCard';
import { Button3D } from '../../components/Button3D';

const YEARS = [
    { year: '2024', sub: 'Past Papers' },
    { year: '2023', sub: 'Past Papers' },
    { year: '2022', sub: 'Past Papers' },
    { year: '2021', sub: 'Past Papers' },
    { year: '2020', sub: 'Past Papers' },
    { year: '2019', sub: 'Past Papers' },
];

export default function YearStep() {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <OnboardingLayout
            step={2}
            total={3}
            title="Which year do you want to practice?"
            subtitle="Choose a year to see available papers."
            showProgress={false}
            footer={
                <Button3D
                    label="Continue"
                    onPress={() => router.push('/(setup)/papers')}
                    disabled={!selected}
                />
            }
        >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
                {YEARS.map((item) => (
                    <YearCard
                        key={item.year}
                        year={item.year}
                        subtitle={item.sub}
                        selected={selected === item.year}
                        onPress={() => setSelected(item.year)}
                    />
                ))}
            </ScrollView>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        paddingBottom: 20,
    },
});
