import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, ScrollView, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SelectList, SelectItem } from '../../components/SelectList';
import { GoalList, GoalOption } from '../../components/GoalRow';
import { Button3D } from '../../components/Button3D';
import MascotSVG from '../../assets/icons/mascot.svg';

const { width } = Dimensions.get('window');

const REASONS: SelectItem[] = [
    { id: 'pass', emoji: '🎓', label: 'To pass my GCE A/L' },
    { id: 'grades', emoji: '🏆', label: 'To get top grades' },
    { id: 'habit', emoji: '📅', label: 'To build a daily study habit' },
    { id: 'parents', emoji: '👨‍👩‍👧', label: 'My parents want me to' },
    { id: 'uni', emoji: '🏫', label: 'To get into university' },
    { id: 'curious', emoji: '🧠', label: 'Just to learn' },
];

const SOURCES: SelectItem[] = [
    { id: 'friends', emoji: '👥', label: 'Friends / family' },
    { id: 'school', emoji: '🏫', label: 'My school or teacher' },
    { id: 'social', emoji: '📱', label: 'Social media' },
    { id: 'google', emoji: '🔍', label: 'Google Search' },
    { id: 'news', emoji: '📰', label: 'News / blog / article' },
    { id: 'other', emoji: '🎯', label: 'Other' },
];

const GOALS: GoalOption[] = [
    { id: 'casual', label: 'Casual', detail: '5 questions / day' },
    { id: 'regular', label: 'Regular', detail: '10 questions / day' },
    { id: 'serious', label: 'Serious', detail: '20 questions / day' },
    { id: 'intense', label: 'Intense', detail: '30 questions / day' },
];

const FEATURES = [
    { emoji: '🔥', label: 'Streaks', sub: 'Keep your daily practice alive' },
    { emoji: '⚡', label: 'XP & Levels', sub: 'Level up per subject as you improve' },
    { emoji: '🏆', label: 'Leaderboards', sub: 'Compete with friends every week' },
    { emoji: '⚔️', label: 'Friend Duels', sub: 'Challenge anyone to 10 questions' },
];

export default function OnboardingMain() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const totalSteps = 6;

    // State for choices
    const [reason, setReason] = useState<string | null>(null);
    const [source, setSource] = useState<string | null>(null);
    const [goal, setGoal] = useState<string | null>(null);

    // Animation state
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    const transitionTo = (nextStep: number) => {
        // Fade out
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
            router.replace('/(setup)');
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
                    <View style={styles.centerContent}>
                        <View style={styles.largeBubbleWrapper}>
                            <View style={styles.largeBubbleShadow}>
                                <View style={styles.largeBubble}>
                                    <Text style={styles.largeBubbleText}>
                                        Before the lesson, let's start with some questions to personalize your learning experience!
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.largeBubbleTail} />
                        </View>
                        <View style={styles.largeMascotContainer}>
                            <MascotSVG width={width * 0.5} height={width * 0.5} />
                        </View>
                    </View>
                );
            case 1:
                return (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <SelectList
                            items={REASONS}
                            selected={reason}
                            onSelect={setReason}
                        />
                    </ScrollView>
                );
            case 2:
                return (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <SelectList
                            items={SOURCES}
                            selected={source}
                            onSelect={setSource}
                        />
                    </ScrollView>
                );
            case 3:
                return (
                    <GoalList
                        options={GOALS}
                        selected={goal}
                        onSelect={setGoal}
                    />
                );
            case 4:
                return (
                    <View style={styles.illustrationBox}>
                        <View style={styles.notifCard}>
                            <View style={styles.notifIcon}>
                                <Text style={styles.notifEmoji}>🔔</Text>
                            </View>
                            <View style={styles.notifBody}>
                                <Text style={styles.notifTitle}>Daily practice time!</Text>
                                <Text style={styles.notifSub}>
                                    Keep your streak alive — answer a question now.
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.notifArrow}>↑</Text>
                        <Text style={styles.caption}>We'll remind you once a day</Text>
                    </View>
                );
            case 5:
                return (
                    <View style={styles.features}>
                        {FEATURES.map((f) => (
                            <View key={f.label} style={styles.featureRow}>
                                <View style={styles.featureIcon}>
                                    <Text style={styles.featureEmoji}>{f.emoji}</Text>
                                </View>
                                <View style={styles.featureText}>
                                    <Text style={styles.featureLabel}>{f.label}</Text>
                                    <Text style={styles.featureSub}>{f.sub}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                );
            default:
                return null;
        }
    };

    const getHeaderProps = () => {
        switch (step) {
            case 0:
                return { showMascot: false, title: "" };
            case 1:
                return { showMascot: true, bubbleText: "What's your main goal?", title: "" };
            case 2:
                return { showMascot: true, bubbleText: "How'd you find us?", title: "" };
            case 3:
                return { title: "Great. Now choose a daily goal.", subtitle: "You can always change this later." };
            case 4:
                return { title: "Get a daily reminder to meet your goal", subtitle: "Just in case you forget!" };
            case 5:
                return { title: "Sign up to keep your streak alive 🔥", subtitle: "Your progress is saved to your account." };
            default:
                return {};
        }
    };

    const getFooter = () => {
        if (step === 4) {
            return (
                <View style={styles.buttonStack}>
                    <Button3D label="Allow notifications" onPress={handleNext} />
                    <Button3D
                        label="Maybe later"
                        onPress={handleNext}
                        color="#f0f0f0"
                        shadowColor="#d0d0d0"
                        textStyle={{ color: '#888' }}
                    />
                </View>
            );
        }
        if (step === 5) {
            return (
                <View style={styles.buttonStack}>
                    <Button3D
                        label="Continue with Google"
                        onPress={() => router.replace('/(setup)')}
                        color="#4285F4"
                        shadowColor="#2d6fd4"
                    />
                    <Pressable onPress={() => router.replace('/(setup)')} style={styles.skipRow}>
                        <Text style={styles.skipText}>Not now</Text>
                    </Pressable>
                </View>
            );
        }

        const isNextDisabled = (step === 1 && !reason) || (step === 2 && !source) || (step === 3 && !goal);

        return (
            <Button3D
                label="Continue"
                onPress={handleNext}
                disabled={isNextDisabled}
                color="#58CC02"
                shadowColor="#46A302"
            />
        );
    };

    return (
        <OnboardingLayout
            onBack={handleBack}
            footer={getFooter()}
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
    centerContent: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 40,
    },
    largeBubbleWrapper: {
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
    },
    largeBubbleShadow: {
        backgroundColor: '#e5e5e5',
        borderRadius: 20,
    },
    largeBubble: {
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#e5e5e5',
        borderRadius: 20,
        paddingHorizontal: 24,
        paddingVertical: 20,
        marginBottom: 6,
    },
    largeBubbleText: {
        fontSize: 19,
        fontWeight: '700',
        color: '#4b4b4b',
        textAlign: 'center',
        lineHeight: 26,
    },
    largeBubbleTail: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#e5e5e5',
        transform: [{ rotate: '180deg' }],
        marginTop: -2,
    },
    largeMascotContainer: {
        marginTop: 40,
    },
    illustrationBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    notifCard: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        gap: 14,
        width: '100%',
    },
    notifIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#e8f9f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    notifEmoji: {
        fontSize: 24,
    },
    notifBody: {
        flex: 1,
    },
    notifTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    notifSub: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    notifArrow: {
        fontSize: 28,
        color: '#58CC02',
        fontWeight: '700',
    },
    caption: {
        fontSize: 14,
        color: '#888',
    },
    features: {
        gap: 12,
        paddingTop: 10,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1.5,
        borderColor: '#eee',
    },
    featureIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#e8f9f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureEmoji: {
        fontSize: 20,
    },
    featureText: {
        flex: 1,
    },
    featureLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    featureSub: {
        fontSize: 13,
        color: '#888',
    },
    buttonStack: {
        gap: 12,
    },
    skipRow: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    skipText: {
        fontSize: 15,
        color: '#aaa',
        fontWeight: '600',
    },
});
