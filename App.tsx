import React from 'react';
import 'react-native-gesture-handler';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import GoalScreen from './src/screens/GoalScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';
import DiscoveryDetailScreen from './src/screens/DiscoverDetailScreen';
import MyPageScreen from './src/screens/MyPageScreen';
import ReadingScreen from './src/screens/ReadingScreen';


// ----- 네비게이션 ParamList 타입 정의 -----
export type RootStackParamList = {
  Login: undefined; // 로그인 스크린
  Main: undefined; // 탭 네비게이션으로 구성된 메인 화면
  Reading: {
    title: string;
    author: string;
    thumbnail: string;
  };
  Goal: undefined;
  BookDetail: {
    // BookDetailScreen으로 넘길 데이터 구조
    bookId: number;
    title: string;
    author: string;
    cover: string;
  };
  ReadingProgress: undefined;
  Discovery: undefined;
  DiscoveryDetail: {
    id: string;
    title: string;
    author: string;
    cover: string;
    firstLine: string;
    description: string;
  };
};

export type BottomTabParamList = {
  Home: undefined;
  Goal: undefined;
  Discovery: undefined;
  MyPage: undefined;
};

// ----- 스택 & 탭 생성 -----
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

// ----- Bottom Tab Navigator -----
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#00B1A7',
        tabBarInactiveTintColor: '#00B1A780',
        tabBarStyle: {
          height: 105,
          paddingTop: 12,
          paddingBottom: 28,
          backgroundColor: '#00B1A71A',
        },
      }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{title: '홈'}} />
      <Tab.Screen
        name="Goal"
        component={GoalScreen}
        options={{title: '목표'}}
      />
      <Tab.Screen
        name="Discovery"
        component={DiscoverScreen}
        options={{title: '발견'}}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{title: '마이페이지'}}
      />
    </Tab.Navigator>
  );
}

// ----- App -----
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="Reading" component={ReadingScreen} />
        <Stack.Screen name="BookDetail" component={BookDetailScreen} />
        <Stack.Screen name="Discovery" component={DiscoverScreen} />
        <Stack.Screen
          name="DiscoveryDetail"
          component={DiscoveryDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
