import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
    unsavedChangesWarning: false,
});

export default function RootLayout() {
    return (
        <ConvexProvider client={convex}>
            <SafeAreaProvider>
                <Stack>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="(onboarding)" options={{ headerShown: false, animation: 'slide_from_right' }} />
                    <Stack.Screen name="(setup)" options={{ headerShown: false, animation: 'slide_from_right' }} />
                </Stack>
            </SafeAreaProvider>
        </ConvexProvider>
    );
}
