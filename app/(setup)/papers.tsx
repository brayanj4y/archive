import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SubjectCard, SubjectPaper } from '../../components/SubjectCard';
import { Button3D } from '../../components/Button3D';

const PAPERS: SubjectPaper[] = [
    {
        id: 'bio-0800',
        name: 'Biology',
        code: '0810',
        emoji: '🧬',
        progress: 0.12,
        accent: '#58CC02',
    },
    {
        id: 'math-0800',
        name: 'Mathematics',
        code: '0870',
        emoji: '📐',
        progress: 0.75,
        accent: '#1CB0F6',
    },
    {
        id: 'phys-0800',
        name: 'Physics',
        code: '0880',
        emoji: '⚛️',
        progress: 0.45,
        accent: '#CE82FF',
    },
    {
        id: 'chem-0800',
        name: 'Chemistry',
        code: '0815',
        emoji: '🧪',
        progress: 0,
        accent: '#FF4B4B',
    },
];

export default function PapersStep() {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    const handleContinue = () => {
        if (selected) {
            router.replace('/(dashboard)');
        }
    };

    return (
        <OnboardingLayout
            step={3}
            total={3}
            title="Choose a subject to start"
            subtitle="Pick a paper to begin practicing."
            showProgress={false}
            footer={
                <Button3D
                    label="Continue"
                    onPress={handleContinue}
                    disabled={!selected}
                />
            }
        >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
                {PAPERS.map((paper) => (
                    <SubjectCard
                        key={paper.id}
                        paper={paper}
                        selected={selected === paper.id}
                        onPress={() => setSelected(paper.id)}
                    />
                ))}
            </ScrollView>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    list: {
        gap: 16,
        paddingBottom: 20,
    },
});
