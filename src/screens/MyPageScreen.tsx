import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '../../App';

type Props = BottomTabScreenProps<BottomTabParamList, 'MyPage'>;

const MyPageScreen: React.FC<Props> = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>마이페이지</Text>
      {/* 프로필, 설정, 로그아웃 버튼 등 구현 가능 */}
    </View>
  );
};

export default MyPageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
  },
});
