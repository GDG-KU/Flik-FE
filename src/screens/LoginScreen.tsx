import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const handleLogin = () => {
    // 로그인 검증 로직이 성공했다고 가정
    navigation.replace('Main'); // MainTabNavigator로 이동
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인 페이지</Text>
      <Button title="로그인" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    marginBottom: 16
  }
});
