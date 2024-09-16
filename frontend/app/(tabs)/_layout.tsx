import { Tabs } from 'expo-router';
import { HomeIcon } from '@/lib/icons/HomeIcon';
import { CameraIcon } from '@/lib/icons/CameraIcon';
import { Clock4Icon } from 'lucide-react-native';

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