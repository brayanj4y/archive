import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button3D } from '../components/Button3D';
import HeroSVG from '../assets/icons/boy.svg';

const { width } = Dimensions.get('window');

export default function Index() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar style="dark" />

            <View style={styles.contentContainer}>
                {/* Mascot */}
                <View style={styles.mascotContainer}>
                    <HeroSVG
                        width={width * 0.6}
                        height={width * 0.6}
                    />
                </View>

                {/* Branding */}
                <View style={styles.branding}>
                    <Text style={styles.brandTitle}>passit</Text>
                    <Text style={styles.brandTagline}>
                        Master the GCE like playing{'\n'}a game. Daily.
                    </Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <Button3D
                    label="Get Started"
                    onPress={() => router.push('/(onboarding)')}
                    color="#58CC02"
                    shadowColor="#46A302"
                />
                <Button3D
                    label="I already have an account"
                    onPress={() => { }}
                    color="#ffffff"
                    shadowColor="#e5e5e5"
                    textStyle={{ color: '#58CC02' }}
                    style={{ marginTop: 12, borderWidth: 2, borderColor: '#e5e5e5' }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    mascotContainer: {
        marginVertical: 20,
        alignItems: 'center',
    },
    heroImage: {
        width: width * 0.6,
        height: width * 0.6,
    },
    branding: {
        alignItems: 'center',
    },
    brandTitle: {
        fontSize: 48,
        fontWeight: '800',
        color: '#58CC02',
        letterSpacing: -1,
    },
    brandTagline: {
        fontSize: 19,
        fontWeight: '500',
        color: '#777777',
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 26,
    },
    buttonContainer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 20,
    },
});
