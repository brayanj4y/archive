import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import LearnIcon from '../../assets/icons/learn.svg';
import QuestsIcon from '../../assets/icons/quests.svg';
import ShopIcon from '../../assets/icons/shop.svg';
import LeaderboardIcon from '../../assets/icons/leaderboard.svg';
import ProfileIcon from '../../assets/icons/woman.svg';

export default function DashboardLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#58CC02',
                tabBarInactiveTintColor: '#afafaf',
                tabBarLabelStyle: styles.tabLabel,
                tabBarIconStyle: styles.tabIcon,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <LearnIcon width={30} height={30} fill={color} style={{ opacity: focused ? 1 : 0.6 }} />
                    ),
                }}
            />
            <Tabs.Screen
                name="quests"
                options={{
                    title: 'Quests',
                    tabBarIcon: ({ color, focused }) => (
                        <QuestsIcon width={30} height={30} fill={color} style={{ opacity: focused ? 1 : 0.6 }} />
                    ),
                }}
            />
            <Tabs.Screen
                name="leaderboard"
                options={{
                    title: 'Leaderboard',
                    tabBarIcon: ({ color, focused }) => (
                        <LeaderboardIcon width={30} height={30} fill={color} style={{ opacity: focused ? 1 : 0.6 }} />
                    ),
                }}
            />
            <Tabs.Screen
                name="shop"
                options={{
                    title: 'Shop',
                    tabBarIcon: ({ color, focused }) => (
                        <ShopIcon width={30} height={30} fill={color} style={{ opacity: focused ? 1 : 0.6 }} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <ProfileIcon width={30} height={30} fill={color} style={{ opacity: focused ? 1 : 0.6 }} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#ffffff',
        elevation: 0,
        borderTopWidth: 0,
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: Platform.OS === 'ios' ? 0 : 10,
    },
    tabIcon: {
        marginTop: 8,
    },
});
