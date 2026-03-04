import { View, Text, StyleSheet, ScrollView, Dimensions, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MascotIcon from '../../assets/icons/mascot.svg';
import PointsIcon from '../../assets/icons/points.svg';
import UpgradeMascot from '../../assets/icons/hero.svg';
import { Button3D } from '../../components/Button3D';

const { width } = Dimensions.get('window');

const CHAPTERS = [
    {
        id: 1,
        title: 'Chapter 1',
        subtitle: 'Introduction to Biology',
        color: '#FF9600',
        shadowColor: '#E68A00',
        progress: 0,
        locked: false,
        lessons: [
            { id: 1, title: 'Cell Structure', icon: '🔬', completed: true, active: true },
            { id: 2, title: 'Basics of Genetics', icon: '🧬', completed: false },
            { id: 3, title: 'Introducing Metabolism', icon: '🧪', completed: false },
            { id: 4, title: 'Basic Ecology', icon: '🌱', completed: false },
        ]
    },
    {
        id: 2,
        title: 'Chapter 2',
        subtitle: 'Essential Anatomy',
        color: '#1CB0F6',
        shadowColor: '#1899D6',
        progress: 0,
        locked: true,
        lessons: [
            { id: 5, title: 'Skeletal System', icon: '🦴', completed: false },
            { id: 6, title: 'Muscular System', icon: '💪', completed: false },
            { id: 7, title: 'Nervous System', icon: '🧠', completed: false },
        ]
    },
    {
        id: 3,
        title: 'Chapter 3',
        subtitle: 'Advanced Physiology',
        color: '#CE82FF',
        shadowColor: '#AF66E3',
        progress: 0,
        locked: true,
        lessons: [
            { id: 8, title: 'Circulatory System', icon: '❤️', completed: false },
            { id: 9, title: 'Respiratory System', icon: '🫁', completed: false },
        ]
    }
];

export default function LearnPage() {
    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <StatusBar style="dark" />

            {/* Top Bar */}
            <View style={styles.topBar}>
                <MascotIcon width={28} height={28} />
                <Text style={styles.topBarTitle}>Passit</Text>
                <View style={styles.pointsContainer}>
                    <PointsIcon width={20} height={20} />
                    <Text style={styles.pointsText}>842</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Upgrade Banner */}
                <View style={styles.upgradeBannerShadow}>
                    <View style={styles.upgradeBanner}>
                        <View style={styles.upgradeTextContainer}>
                            <Text style={styles.upgradeTitle}>Unlock All{'\n'}Courses &{'\n'}Premium Contents!</Text>
                            <Pressable style={styles.upgradeButton}>
                                <Text style={styles.upgradeButtonText}>Upgrade</Text>
                            </Pressable>
                        </View>
                        <UpgradeMascot width={width * 0.35} height={width * 0.35} style={styles.upgradeMascot} />
                    </View>
                </View>

                {/* Path Content */}
                {CHAPTERS.map((chapter) => (
                    <View key={chapter.id} style={styles.chapterSection}>
                        {/* Chapter Header */}
                        <View style={[styles.chapterHeaderShadow, { backgroundColor: chapter.shadowColor }]}>
                            <View style={[styles.chapterHeader, { backgroundColor: chapter.color }]}>
                                <View style={styles.chapterHeaderText}>
                                    <Text style={styles.chapterTitle}>{chapter.title}</Text>
                                    <Text style={styles.chapterSubtitle}>{chapter.subtitle}</Text>
                                </View>
                                <View style={styles.progressCircle}>
                                    {chapter.locked ? (
                                        <View style={styles.lockIcon}><Text style={{ fontSize: 24, opacity: 0.2 }}>🔒</Text></View>
                                    ) : (
                                        <View style={styles.progressInner}><Text style={styles.progressText}>{chapter.progress}%</Text></View>
                                    )}
                                </View>
                            </View>
                        </View>

                        {/* Lessons Path */}
                        <View style={styles.pathContainer}>
                            {chapter.lessons.map((lesson, idx) => (
                                <View key={lesson.id} style={styles.lessonRow}>
                                    {/* Path Line */}
                                    {idx < chapter.lessons.length - 1 && (
                                        <View style={styles.pathLine} />
                                    )}

                                    {/* Lesson Marker (The Circle on the left) */}
                                    <View style={styles.markerContainer}>
                                        {lesson.active && <View style={styles.activeRing} />}
                                        <View style={[
                                            styles.lessonIconInner,
                                            { backgroundColor: lesson.completed ? chapter.color : '#ffffff' },
                                            !lesson.completed && { borderColor: '#e5e5e5', borderWidth: 2 }
                                        ]}>
                                            <Text style={styles.lessonEmoji}>{lesson.icon}</Text>
                                        </View>
                                    </View>

                                    {/* Lesson Card */}
                                    <View style={styles.lessonCardShadow}>
                                        <Pressable style={styles.lessonCard}>
                                            <Text style={styles.lessonTitle}>{lesson.title}</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
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
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#ffffff',
    },
    topBarTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#4b4b4b',
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        zIndex: -1,
    },
    pointsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    pointsText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FF9600',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
        paddingTop: 8,
    },
    upgradeBannerShadow: {
        backgroundColor: '#46A302',
        borderRadius: 20,
        marginBottom: 24,
    },
    upgradeBanner: {
        backgroundColor: '#58CC02',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        overflow: 'hidden',
    },
    upgradeTextContainer: {
        flex: 1,
        zIndex: 1,
    },
    upgradeTitle: {
        color: '#ffffff',
        fontSize: 19,
        fontWeight: '900',
        marginBottom: 12,
        lineHeight: 24,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    upgradeButton: {
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 100,
        alignSelf: 'flex-start',
    },
    upgradeButtonText: {
        color: '#58CC02',
        fontWeight: '800',
        fontSize: 14,
    },
    upgradeMascot: {
        position: 'absolute',
        right: -10,
        bottom: -10,
        zIndex: 0,
    },
    chapterSection: {
        marginBottom: 32,
    },
    chapterHeaderShadow: {
        borderRadius: 16,
        marginBottom: 20,
    },
    chapterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 16,
        padding: 16,
        marginBottom: 6,
    },
    chapterHeaderText: {
        flex: 1,
    },
    chapterTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 2,
    },
    chapterSubtitle: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 13,
        fontWeight: '600',
    },
    progressCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    progressInner: {},
    progressText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#4b4b4b',
    },
    lockIcon: {},
    pathContainer: {
        paddingLeft: 6,
    },
    lessonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        position: 'relative',
    },
    pathLine: {
        position: 'absolute',
        left: 31,
        top: 48,
        width: 3,
        height: 28,
        backgroundColor: '#e5e5e5',
        zIndex: -1,
    },
    markerContainer: {
        width: 64,
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    activeRing: {
        position: 'absolute',
        width: 62,
        height: 62,
        borderRadius: 31,
        borderWidth: 3,
        borderColor: '#58CC02',
    },
    lessonIconInner: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    lessonEmoji: {
        fontSize: 24,
    },
    lessonCardShadow: {
        flex: 1,
        backgroundColor: '#e5e5e5',
        borderRadius: 16,
        marginLeft: 12,
    },
    lessonCard: {
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#e5e5e5',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 4,
    },
    lessonTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#4b4b4b',
    },
});
