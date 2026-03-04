import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { GoalList, GoalOption } from '../../components/GoalRow';
import { Button3D } from '../../components/Button3D';

const GOALS: GoalOption[] = [
    { id: 'casual', label: 'Casual', detail: '5 questions / day' },
    { id: 'regular', label: 'Regular', detail: '10 questions / day' },
    { id: 'serious', label: 'Serious', detail: '20 questions / day' },
    { id: 'intense', label: 'Intense', detail: '30 questions / day' },
];

export default function Step3() {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <OnboardingLayout
            step={3}
            total={5}
            title={'Great. Now choose\na daily goal.'}
            subtitle="You can always change this later."
            footer={
                <Button3D
                    label="Continue"
                    onPress={() => router.push('/(onboarding)/step4')}
                    disabled={!selected}
                />
            }
        >
            <View>
                <GoalList
                    options={GOALS}
                    selected={selected}
                    onSelect={setSelected}
                />
            </View>
        </OnboardingLayout>
    );
}
