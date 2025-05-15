import React from 'react';
import 'react-native-gesture-handler';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeTabIcon from './src/assets/home-tab.svg';
import SearchTabIcon from './src/assets/search-tab.svg';
import ExploreTabIcon from './src/assets/explore-tab.svg';
import MyPageTabIcon from './src/assets/my-page-tab.svg';
import HomeTabActiveIcon from './src/assets/home-tab-active.svg';
import SearchTabActiveIcon from './src/assets/search-tab-active.svg';
import ExploreTabActiveIcon from './src/assets/explore-tab-active.svg';
import MyPageTabActiveIcon from './src/assets/my-page-tab-active.svg';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';
import DiscoveryDetailScreen from './src/screens/DiscoverDetailScreen';
import MyPageScreen from './src/screens/MyPageScreen';
import ReadingScreen from './src/screens/ReadingScreen';
import ReadingProgressScreen from './src/screens/ReadingProgressScreen';
import ChallengeListScreen from './src/screens/ChallengeListScreen';
import ChallengeDetailScreen from './src/screens/ChallengeDetailScreen';
import ReadingGoalScreen from './src/screens/ReadingGoalScreen';

// ----- 네비게이션 ParamList 타입 정의 -----
export type RootStackParamList = {
  Login: undefined; // 로그인 스크린
  Main: undefined; // 탭 네비게이션으로 구성된 메인 화면
  Reading: {
    title: string;
    author: string;
    thumbnail: string;
  };
  ReadingGoal: {
    title: string;
    author: string;
  };
  Search: undefined;
  BookDetail: {
    // BookDetailScreen으로 넘길 데이터 구조
    bookId: string;
    title: string;
    author: string;
    cover: string;
  };
  ReadingProgress: undefined;
  ChallengeList: undefined;
  ChallengeDetail: {
    title: string;
    author: string;
    cover: string;
    startDate: string;
    done: number;
    total: number;
    currentPage: number;
    totalPages: number;
    likedPages: {page: number; text: string}[];
  };
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
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarStyle: {
          height: 105,
          paddingTop: 12,
          paddingBottom: 28,
          backgroundColor: '#FFF',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '홈',
          tabBarIcon: ({focused}) =>
            focused ? <HomeTabActiveIcon /> : <HomeTabIcon />,
        }}
      />
      <Tab.Screen
        name="Goal"
        component={SearchScreen}
        options={{
          title: '검색',
          tabBarIcon: ({focused}) =>
            focused ? <SearchTabActiveIcon /> : <SearchTabIcon />,
        }}
      />
      <Tab.Screen
        name="Discovery"
        component={DiscoverScreen}
        options={{
          title: '추천',
          tabBarIcon: ({focused}) =>
            focused ? <ExploreTabActiveIcon /> : <ExploreTabIcon />,
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          title: '나의 서재',
          tabBarIcon: ({focused}) =>
            focused ? <MyPageTabActiveIcon /> : <MyPageTabIcon />,
        }}
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
        <Stack.Screen name="ReadingGoal" component={ReadingGoalScreen} />
        <Stack.Screen
          name="ReadingProgress"
          component={ReadingProgressScreen}
        />
        <Stack.Screen name="BookDetail" component={BookDetailScreen} />
        <Stack.Screen name="Discovery" component={DiscoverScreen} />
        <Stack.Screen
          name="DiscoveryDetail"
          component={DiscoveryDetailScreen}
        />
        <Stack.Screen name="ChallengeList" component={ChallengeListScreen} />
        <Stack.Screen
          name="ChallengeDetail"
          component={ChallengeDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
