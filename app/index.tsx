import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button3D } from '../components/Button3D';

const { width } = Dimensions.get('window');

export default function Index() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar style="dark" />


            <View style={styles.logoContainer}>
                <View style={styles.logoPill}>
                    <Text style={styles.logoText}>passit</Text>
                </View>
            </View>


            <View style={styles.heroContainer}>
                <Image
                    source={require('../assets/hero.png')}
                    style={styles.heroImage}
                    resizeMode="contain"
                />
            </View>


            <View style={styles.taglineContainer}>
                <Text style={styles.tagline}>
                    The smart, simple,{'\n'}and instant way to{'\n'}share your pass.
                </Text>
            </View>


            <View style={styles.buttonContainer}>
                <Button3D
                    label="Get Started"
                    onPress={() => router.push('/(onboarding)/step1')}
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
    logoContainer: {
        alignItems: 'center',
        paddingTop: 24,
        paddingBottom: 8,
    },
    logoPill: {
        backgroundColor: '#1DB954',
        borderRadius: 999,
        paddingHorizontal: 24,
        paddingVertical: 8,
    },
    logoText: {
        color: '#ffffff',
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: 1.5,
        textTransform: 'lowercase',
    },
    heroContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    heroImage: {
        width: width * 0.82,
        height: width * 0.82,
    },
    taglineContainer: {
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingBottom: 40,
    },
    tagline: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1a1a1a',
        textAlign: 'center',
        lineHeight: 34,
    },
    buttonContainer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
});
