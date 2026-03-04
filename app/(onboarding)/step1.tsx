import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SelectList, SelectItem } from '../../components/SelectList';
import { Button3D } from '../../components/Button3D';

const REASONS: SelectItem[] = [
    { id: 'pass', emoji: '🎓', label: 'To pass my GCE A/L' },
    { id: 'grades', emoji: '🏆', label: 'To get top grades' },
    { id: 'habit', emoji: '📅', label: 'To build a daily study habit' },
    { id: 'parents', emoji: '👨‍👩‍👧', label: 'My parents want me to' },
    { id: 'uni', emoji: '🏫', label: 'To get into university' },
    { id: 'curious', emoji: '🧠', label: 'Just to learn' },
];

export default function Step1() {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <OnboardingLayout
            step={1}
            total={5}
            title={'Why are you studying\nfor GCE?'}
            showBack={false}
            footer={
                <Button3D
                    label="Continue"
                    onPress={() => router.push('/(onboarding)/step2')}
                    disabled={!selected}
                />
            }
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                <SelectList
                    items={REASONS}
                    selected={selected}
                    onSelect={setSelected}
                />
            </ScrollView>
        </OnboardingLayout>
    );
}
