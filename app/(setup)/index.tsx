import { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { MajorCard } from '../../components/MajorCard';
import { YearCard } from '../../components/YearCard';
import { SubjectCard, SubjectPaper } from '../../components/SubjectCard';
import { Button3D } from '../../components/Button3D';

const { width } = Dimensions.get('window');

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

const YEARS = [
    { year: '2024', sub: 'Past Papers' },
    { year: '2023', sub: 'Past Papers' },
    { year: '2022', sub: 'Past Papers' },
    { year: '2021', sub: 'Past Papers' },
    { year: '2020', sub: 'Past Papers' },
    { year: '2019', sub: 'Past Papers' },
];

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

export default function SetupMain() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const totalSteps = 3;

    // State for choices
    const [selectedMajor, setSelectedMajor] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedPaper, setSelectedPaper] = useState<string | null>(null);

    // Animation state
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    const transitionTo = (nextStep: number) => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: nextStep > step ? -20 : 20,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start(() => {
            setStep(nextStep);
            slideAnim.setValue(nextStep > step ? 20 : -20);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();
        });
    };

    const handleNext = () => {
        if (step < totalSteps - 1) {
            transitionTo(step + 1);
        } else {
            router.replace('/(dashboard)');
        }
    };

    const handleBack = () => {
        if (step > 0) {
            transitionTo(step - 1);
        } else {
            router.back();
        }
    };

    const renderContent = () => {
        switch (step) {
            case 0:
                return (
                    <View style={styles.grid}>
                        {MAJORS.map((major) => (
                            <MajorCard
                                key={major.id}
                                {...major}
                                selected={selectedMajor === major.id}
                                onPress={() => setSelectedMajor(major.id)}
                            />
                        ))}
                    </View>
                );
            case 1:
                return (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.yearGrid}>
                        {YEARS.map((item) => (
                            <YearCard
                                key={item.year}
                                year={item.year}
                                subtitle={item.sub}
                                selected={selectedYear === item.year}
                                onPress={() => setSelectedYear(item.year)}
                            />
                        ))}
                    </ScrollView>
                );
            case 2:
                return (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.paperList}>
                        {PAPERS.map((paper) => (
                            <SubjectCard
                                key={paper.id}
                                paper={paper}
                                selected={selectedPaper === paper.id}
                                onPress={() => setSelectedPaper(paper.id)}
                            />
                        ))}
                    </ScrollView>
                );
            default:
                return null;
        }
    };

    const getHeaderProps = () => {
        switch (step) {
            case 0:
                return {
                    title: "Choose your path",
                    subtitle: "Pick a study major to get started.",
                    showBack: false,
                    showProgress: true
                };
            case 1:
                return {
                    title: "Practice Year",
                    subtitle: "Choose a year to see available papers.",
                    showBack: true,
                    showProgress: true
                };
            case 2:
                return {
                    title: "Choose a subject",
                    subtitle: "Pick a paper to begin practicing.",
                    showBack: true,
                    showProgress: true
                };
            default:
                return {};
        }
    };

    const isNextDisabled =
        (step === 0 && !selectedMajor) ||
        (step === 1 && !selectedYear) ||
        (step === 2 && !selectedPaper);

    return (
        <OnboardingLayout
            onBack={handleBack}
            footer={
                <Button3D
                    label="Continue"
                    onPress={handleNext}
                    disabled={isNextDisabled}
                    color="#58CC02"
                    shadowColor="#46A302"
                />
            }
            {...getHeaderProps()}
        >
            <Animated.View style={{
                flex: 1,
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }]
            }}>
                {renderContent()}
            </Animated.View>
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
    yearGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        paddingBottom: 20,
    },
    paperList: {
        gap: 16,
        paddingBottom: 20,
    },
});
