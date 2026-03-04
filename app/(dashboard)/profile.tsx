import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfilePage() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>Coming soon!</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#4b4b4b',
    },
    subtitle: {
        fontSize: 16,
        color: '#afafaf',
        marginTop: 8,
    },
});
