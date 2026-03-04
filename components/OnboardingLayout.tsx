import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ProgressBar } from './ProgressBar';

interface OnboardingLayoutProps {
    step: number;
    total: number;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    contentStyle?: StyleProp<ViewStyle>;
    showBack?: boolean;
    showProgress?: boolean;
}

export function OnboardingLayout({
    step,
    total,
    title,
    subtitle,
    children,
    footer,
    contentStyle,
    showBack = true,
    showProgress = true,
}: OnboardingLayoutProps) {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar style="dark" />

            {/* Top bar: back + progress */}
            <View style={styles.topBar}>
                {showBack ? (
                    <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
                        <Text style={styles.backIcon}>←</Text>
                    </Pressable>
                ) : (
                    <View style={styles.backBtn} />
                )}
                {showProgress ? (
                    <ProgressBar step={step} total={total} />
                ) : (
                    <View style={{ flex: 1 }} />
                )}
                {/* spacer to balance layout */}
                <View style={styles.backBtn} />
            </View>

            {/* Title */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>

            {/* Scrollable content */}
            <View style={[styles.content, contentStyle]}>{children}</View>

            {/* Footer */}
            {footer ? <View style={styles.footer}>{footer}</View> : null}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 12,
        gap: 12,
    },
    backBtn: {
        width: 36,
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 22,
        color: '#888',
        fontWeight: '600',
    },
    titleContainer: {
        paddingHorizontal: 24,
        paddingBottom: 28,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1a1a1a',
        textAlign: 'center',
        lineHeight: 36,
    },
    subtitle: {
        fontSize: 15,
        color: '#888',
        textAlign: 'center',
        marginTop: 8,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 32,
        paddingTop: 12,
    },
});
