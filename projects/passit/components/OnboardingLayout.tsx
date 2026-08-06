import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ProgressBar } from './ProgressBar';
import MascotSVG from '../assets/icons/mascot.svg';

const { width } = Dimensions.get('window');

interface OnboardingLayoutProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    contentStyle?: StyleProp<ViewStyle>;
    showBack?: boolean;
    onBack?: () => void;
    bubbleText?: string;
    showMascot?: boolean;
}

export function OnboardingLayout({
    title,
    subtitle,
    children,
    footer,
    contentStyle,
    showBack = true,
    onBack,
    bubbleText,
    showMascot = false,
}: OnboardingLayoutProps) {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar style="dark" />

            {/* Top bar: back button */}
            <View style={styles.topBar}>
                {showBack ? (
                    <Pressable onPress={handleBack} style={styles.backBtn} hitSlop={12}>
                        <Text style={styles.backIcon}>←</Text>
                    </Pressable>
                ) : (
                    <View style={styles.backBtn} />
                )}
            </View>

            {/* Mascot + Bubble Header */}
            {showMascot && (
                <View style={styles.mascotHeader}>
                    <MascotSVG width={width * 0.25} height={width * 0.25} style={styles.mascotSmall} />
                    {bubbleText && (
                        <View style={styles.bubbleWrapper}>
                            <View style={styles.bubbleShadow}>
                                <View style={styles.bubble}>
                                    <Text style={styles.bubbleText}>{bubbleText}</Text>
                                </View>
                            </View>
                            <View style={styles.bubbleTail} />
                        </View>
                    )}
                </View>
            )}

            {/* Title */}
            {title && (
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{title}</Text>
                    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
                </View>
            )}

            {/* Content */}
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
    mascotHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        gap: 12,
    },
    mascotSmall: {
        marginTop: 10,
    },
    bubbleWrapper: {
        flex: 1,
        position: 'relative',
    },
    bubbleShadow: {
        backgroundColor: '#e5e5e5',
        borderRadius: 16,
    },
    bubble: {
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#e5e5e5',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 4,
    },
    bubbleText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4b4b4b',
    },
    bubbleTail: {
        position: 'absolute',
        top: 20,
        left: -10,
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: 8,
        borderBottomWidth: 8,
        borderRightWidth: 10,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: '#e5e5e5',
    },
    titleContainer: {
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1a1a1a',
        textAlign: 'center',
        lineHeight: 34,
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
