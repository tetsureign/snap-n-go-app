import {List, Map, Search} from 'iconoir-react-native';
import React from 'react';
import {Text, View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import CameraStack from '@/screens/Camera/navigator';
import UserPage from '@/screens/User/UserPage';
import MapPage from '@/screens/Map/MapPage';
import {BaseTheme} from '@/styles/theme';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import tabNavigatorStyles from './TabNavigator.styles';

const Tab = createBottomTabNavigator();

interface TabScreenOptions {
  name: string;
  component: React.ComponentType;
  options: BottomTabNavigationOptions;
}

const RenderTabsLabel = (focused: boolean, color: string, text: string) => {
  return focused && <Text style={{color: color}}>{text}</Text>;
};

const TabsNavigator = () => {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 75;
  const iconSizeMultiplier = 1.5;

  const lightTabBarStyle: ViewStyle[] = [
    tabNavigatorStyles.lightTabBar,
    {height: tabBarHeight + insets.bottom},
  ];

  const darkTabBarStyle: ViewStyle[] = [
    tabNavigatorStyles.darkTabBar,
    {height: tabBarHeight + insets.bottom},
  ];

  const TabScreens: TabScreenOptions[] = [
    {
      name: 'map-screen',
      component: MapPage,
      options: {
        title: 'Bản đồ',
        headerTransparent: true,
        headerBackground: () => <View style={tabNavigatorStyles.lightHeader} />,
        tabBarStyle: lightTabBarStyle,
        tabBarActiveTintColor: BaseTheme.colors.green,
        tabBarIcon: ({color, size}) => (
          <Map
            color={color}
            height={size * iconSizeMultiplier}
            width={size * iconSizeMultiplier}
          />
        ),
        tabBarLabel: ({focused, color}) => {
          return RenderTabsLabel(focused, color, 'Bản đồ');
        },
      },
    },
    {
      name: 'camera-screen',
      component: CameraStack,
      options: {
        title: 'Tìm kiếm',
        headerShown: false,
        tabBarStyle: darkTabBarStyle,
        tabBarActiveTintColor: BaseTheme.colors.blue,
        tabBarIcon: ({color, size}) => (
          <Search
            color={color}
            width={size * iconSizeMultiplier}
            height={size * iconSizeMultiplier}
          />
        ),
        tabBarLabel: ({focused, color}) => {
          return RenderTabsLabel(focused, color, 'Tìm kiếm');
        },
      },
    },
    {
      name: 'user-page',
      component: UserPage,
      options: {
        title: 'Tài khoản',
        tabBarStyle: lightTabBarStyle,
        tabBarActiveTintColor: BaseTheme.colors.orange,
        tabBarIcon: ({color, size}) => (
          <List
            color={color}
            width={size * iconSizeMultiplier}
            height={size * iconSizeMultiplier}
          />
        ),
        tabBarLabel: ({focused, color}) => {
          return RenderTabsLabel(focused, color, 'Tài khoản');
        },
      },
    },
  ];

  return (
    <Tab.Navigator
      initialRouteName="camera-screen"
      screenOptions={() => ({
        headerTitleAlign: 'center',
        tabBarInactiveTintColor: 'rgb(170, 170, 170)',
      })}>
      {TabScreens.map((element, index) => {
        return (
          <Tab.Screen
            name={element.name}
            component={element.component}
            options={element.options}
            key={`${element.name}-${index}`}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export default TabsNavigator;
