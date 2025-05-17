import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Logo from '../assets/logo.svg';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';

const LoginScreen: React.FC<StackScreenProps<RootStackParamList, 'Login'>> = ({
  navigation,
}) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [idFocused, setIdFocused] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);

  const handleLogin = () => {
    // 로그인 검증 로직이 성공했다고 가정
    navigation.replace('Main');
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.logoWrapper}>
            <Logo width={81} height={40} />
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: idFocused ? '#4CB6B6' : '#E0E0E0',
                  marginBottom: 10,
                },
              ]}
              value={id}
              onChangeText={setId}
              placeholder="아이디를 입력해주세요."
              placeholderTextColor="#BDBDBD"
              onFocus={() => setIdFocused(true)}
              onBlur={() => setIdFocused(false)}
              autoCapitalize="none"
              returnKeyType="next"
            />
            <TextInput
              style={[
                styles.input,
                {borderColor: pwFocused ? '#4CB6B6' : '#E0E0E0'},
              ]}
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호를 입력해주세요."
              placeholderTextColor="#BDBDBD"
              onFocus={() => setPwFocused(true)}
              onBlur={() => setPwFocused(false)}
              secureTextEntry
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}>
              <Text style={styles.loginButtonText}>로그인</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomWrapper}>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.bottomText}>
                계정이 없으신가요?{' '}
                <Text style={styles.joinText}>간편가입하기</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  logoWrapper: {
    marginTop: 250,
    marginBottom: 60,
    alignItems: 'center',
  },
  inputWrapper: {
    width: '88%',
    maxWidth: 400,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 42,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#222',
    fontWeight: '500',
    marginBottom: 14,
  },
  loginButton: {
    width: '100%',
    height: 44,
    backgroundColor: '#00B1A7',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  findRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 8,
  },
  findText: {
    color: '#BDBDBD',
    fontSize: 15,
    fontWeight: '400',
    marginHorizontal: 4,
  },
  findDivider: {
    color: '#BDBDBD',
    fontSize: 15,
    marginHorizontal: 4,
  },
  bottomWrapper: {
    position: 'absolute',
    bottom: 75,
    width: '100%',
    alignItems: 'center',
  },
  bottomText: {
    color: '#1A1A1A',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
  },
  joinText: {
    color: '#1A1A1A',
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
