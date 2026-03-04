import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { Button3D } from '../../components/Button3D';

export default function Step5() {
    const router = useRouter();

    const handleGoogle = () => {
        // TODO: trigger Google OAuth via convex-auth
        router.replace('/(setup)/major');
    };

    const handleSkip = () => {
        router.replace('/(dashboard)');
    };

    return (
        <OnboardingLayout
            step={5}
            total={5}
            title={'Sign up to keep\nyour streak alive 🔥'}
            subtitle="Your progress is saved to your account."
            footer={
                <View style={styles.footerStack}>
                    <Button3D
                        label="Continue with Google"
                        onPress={handleGoogle}
                        color="#4285F4"
                        shadowColor="#2d6fd4"
                    />
                    <Pressable onPress={handleSkip} style={styles.skipRow}>
                        <Text style={styles.skipText}>Not now</Text>
                    </Pressable>
                </View>
            }
        >
            {/* Feature highlights */}
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
        </OnboardingLayout>
    );
}

const FEATURES = [
    { emoji: '🔥', label: 'Streaks', sub: 'Keep your daily practice alive' },
    { emoji: '⚡', label: 'XP & Levels', sub: 'Level up per subject as you improve' },
    { emoji: '🏆', label: 'Leaderboards', sub: 'Compete with friends every week' },
    { emoji: '⚔️', label: 'Friend Duels', sub: 'Challenge anyone to 10 questions' },
];

const styles = StyleSheet.create({
    features: {
        gap: 16,
        paddingTop: 8,
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
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#e8f9f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureEmoji: {
        fontSize: 24,
    },
    featureText: {
        flex: 1,
    },
    featureLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 2,
    },
    featureSub: {
        fontSize: 13,
        color: '#888',
    },
    footerStack: {
        gap: 10,
    },
    skipRow: {
        alignItems: 'center',
        paddingVertical: 14,
    },
    skipText: {
        fontSize: 15,
        color: '#aaa',
        fontWeight: '600',
    },
});
