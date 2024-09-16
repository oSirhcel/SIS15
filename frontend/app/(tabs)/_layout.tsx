import { Tabs } from 'expo-router';
import { CameraIcon, HomeIcon, Clock4Icon } from '@/lib/icons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name='index'
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color }) => <HomeIcon size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name='scan'
        options={{
          headerShown: false,
          title: 'Scan',
          tabBarIcon: ({ color }) => <CameraIcon size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name='history'
        options={{
          headerShown: false,
          title: 'History',
          tabBarIcon: ({ color }) => <Clock4Icon size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
