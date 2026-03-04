import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { Button3D } from '../../components/Button3D';

export default function Step4() {
    const router = useRouter();

    const handleAllow = () => {
        // TODO: call expo-notifications requestPermissionsAsync() here
        router.push('/(onboarding)/step5');
    };

    const handleSkip = () => {
        router.push('/(onboarding)/step5');
    };

    return (
        <OnboardingLayout
            step={4}
            total={5}
            title={'Get a daily reminder\nto meet your goal'}
            subtitle="Just in case you forget!"
            footer={
                <View style={styles.footerStack}>
                    <Button3D label="Allow notifications" onPress={handleAllow} />
                    <Button3D
                        label="Maybe later"
                        onPress={handleSkip}
                        color="#f0f0f0"
                        shadowColor="#d0d0d0"
                        textStyle={styles.skipText}
                    />
                </View>
            }
        >
            {/* Reminder illustration */}
            <View style={styles.illustrationBox}>
                {/* Notification card mock */}
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
                <Text style={styles.arrow}>↑</Text>
                <Text style={styles.caption}>We'll remind you once a day</Text>
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    illustrationBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    notifCard: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        gap: 14,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
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
        marginBottom: 4,
    },
    notifSub: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    arrow: {
        fontSize: 28,
        color: '#1DB954',
        fontWeight: '700',
    },
    caption: {
        fontSize: 14,
        color: '#888',
    },
    footerStack: {
        gap: 10,
    },
    skipText: {
        color: '#888',
    },
});
