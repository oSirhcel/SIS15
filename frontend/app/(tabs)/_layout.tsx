import { Tabs } from 'expo-router';
import { HomeIcon, CameraIcon, Clock4Icon } from '@/lib/icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{}}>
      <Tabs.Screen
        name='index'
        options={{
          headerShown: false,
          title: 'History',
          tabBarIcon: ({ color }) => <Clock4Icon size={28} color={color} />,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name='scan'
        options={{
          headerShown: false,
          title: 'Scan',
          tabBarIcon: ({ color }) => <CameraIcon size={28} color={color} />,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}
