import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SelectList, SelectItem } from '../../components/SelectList';
import { Button3D } from '../../components/Button3D';

const SOURCES: SelectItem[] = [
    { id: 'friends', emoji: '👥', label: 'Friends / family' },
    { id: 'school', emoji: '🏫', label: 'My school or teacher' },
    { id: 'social', emoji: '📱', label: 'Social media' },
    { id: 'google', emoji: '🔍', label: 'Google Search' },
    { id: 'news', emoji: '📰', label: 'News / blog / article' },
    { id: 'other', emoji: '🎯', label: 'Other' },
];

export default function Step2() {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <OnboardingLayout
            step={2}
            total={5}
            title={'How did you hear\nabout Passit?'}
            footer={
                <Button3D
                    label="Continue"
                    onPress={() => router.push('/(onboarding)/step3')}
                    disabled={!selected}
                />
            }
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                <SelectList
                    items={SOURCES}
                    selected={selected}
                    onSelect={setSelected}
                />
            </ScrollView>
        </OnboardingLayout>
    );
}
