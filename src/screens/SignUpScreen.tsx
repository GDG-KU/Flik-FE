import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import BackButton from '../assets/back-button.svg';
import DownArrow from '../assets/down-arrow.svg';

const EMAIL_DOMAINS = [
  'naver.com',
  'gmail.com',
  'daum.net',
  'hanmail.net',
  '직접입력',
];

type Props = StackScreenProps<RootStackParamList, 'SignUp'>;

const SignUpScreen: React.FC<Props> = ({navigation}) => {
  const [id, setId] = useState('');
  const [idValid, setIdValid] = useState<null | boolean>(null);
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');
  const [pwValid, setPwValid] = useState<null | boolean>(null);
  const [email, setEmail] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [showDomainList, setShowDomainList] = useState(false);
  const domainSelectRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({x: 0, y: 0, width: 0});

  // Validation logic (simple for demo)
  const validateId = (value: string) => {
    // 영문 소문자, 숫자, 4~12자, 영문으로 시작
    const re = /^[a-z][a-z0-9]{3,11}$/;
    setIdValid(re.test(value));
  };
  const validatePw = (value: string) => {
    // 6~20자, 2종류 이상
    const re =
      /^(?=.*[a-zA-Z])(?=.*\d|.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,20}$/;
    setPwValid(re.test(value) && value === pwCheck);
  };

  const handleNext = () => {
    navigation.navigate('ProfileSetUp');
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <BackButton />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>회원가입</Text>
              <View style={{width: 24}} />
            </View>
            <Text style={styles.title}>
              간단한 정보를 입력하고{'\n'}가입을 완료하세요.
            </Text>
            <View style={{height: 24}} />
            {/* 아이디 */}
            <Text style={styles.label}>아이디</Text>
            <View style={styles.row}>
              <TextInput
                style={[
                  styles.input,
                  idValid === false && styles.inputError,
                  idValid === true && styles.inputValid,
                ]}
                value={id}
                onChangeText={v => {
                  setId(v);
                  validateId(v);
                }}
                placeholder="아이디"
                placeholderTextColor="#BDBDBD"
                autoCapitalize="none"
                returnKeyType="next"
              />
              <TouchableOpacity style={styles.checkBtn}>
                <Text style={styles.checkBtnText}>중복확인</Text>
              </TouchableOpacity>
            </View>
            <Text
              style={[
                styles.subLabel,
                idValid === false && styles.subLabelError,
                idValid === true && styles.subLabelValid,
              ]}>
              {id.length === 0
                ? '영문 소문자와 숫자만 사용하여, 영문 소문자로 시작하는 4~12자의 아이디를 입력해주세요.'
                : idValid === false
                ? '영문 소문자와 숫자, 4~12자, 영문 시작이어야 합니다.'
                : idValid === true
                ? '사용 가능한 아이디예요'
                : ''}
            </Text>
            {/* 비밀번호 */}
            <Text style={styles.label}>비밀번호</Text>
            <View style={styles.row}>
              <TextInput
                style={[
                  styles.input,
                  pwValid === false && styles.inputError,
                  pwValid === true && styles.inputValid,
                ]}
                value={pw}
                onChangeText={v => {
                  setPw(v);
                  validatePw(v);
                }}
                placeholder="비밀번호"
                placeholderTextColor="#BDBDBD"
                secureTextEntry
                autoCapitalize="none"
                returnKeyType="next"
                underlineColorAndroid="transparent"
              />
            </View>
            <View style={styles.row}>
              <TextInput
                style={[
                  styles.input,
                  pwValid === false && styles.inputError,
                  pwValid === true && styles.inputValid,
                ]}
                value={pwCheck}
                onChangeText={v => {
                  setPwCheck(v);
                  validatePw(v);
                }}
                placeholder="비밀번호 확인"
                placeholderTextColor="#BDBDBD"
                secureTextEntry
                autoCapitalize="none"
                returnKeyType="done"
                underlineColorAndroid="transparent"
              />
            </View>
            <Text
              style={[
                styles.subLabel,
                pwValid === false && styles.subLabelError,
                pwValid === true && styles.subLabelValid,
              ]}>
              {pw.length === 0
                ? '영문 대/소문자, 숫자, 특수문자 중 2가지 이상을 조합하여 6~20자로 입력해주세요.'
                : pwValid === false
                ? '비밀번호 조건을 확인해주세요.'
                : pwValid === true
                ? '사용 가능한 비밀번호예요'
                : ''}
            </Text>
            {/* 이메일 */}
            <Text style={styles.label}>이메일</Text>
            <View style={{position: 'relative'}}>
              <View style={styles.row}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="이메일"
                  placeholderTextColor="#BDBDBD"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  underlineColorAndroid="transparent"
                />
                <Text style={{fontSize: 18, marginHorizontal: 6}}>@</Text>
                <TouchableOpacity
                  style={[
                    styles.input,
                    {
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingRight: 8,
                    },
                  ]}
                  onPress={() => setShowDomainList(!showDomainList)}
                  activeOpacity={0.8}>
                  <Text style={{color: emailDomain ? '#222' : '#BDBDBD'}}>
                    {emailDomain || '선택'}
                  </Text>
                  <DownArrow />
                </TouchableOpacity>
              </View>
              {showDomainList && (
                <View
                  style={[
                    styles.domainListDropdown,
                    {
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      width: '100%',
                    },
                  ]}>
                  {EMAIL_DOMAINS.map(domain => (
                    <TouchableOpacity
                      key={domain}
                      style={styles.domainItem}
                      onPress={() => {
                        setEmailDomain(domain === '직접입력' ? '' : domain);
                        setShowDomainList(false);
                      }}>
                      <Text style={{color: '#222'}}>{domain}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <View style={{flex: 1}} />
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => navigation.goBack()}>
                <Text style={styles.cancelBtnText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                <Text style={styles.nextBtnText}>다음</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  backBtnText: {fontSize: 24, color: '#222'},
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginTop: 20,
    marginBottom: 30,
  },
  label: {
    color: '#757575',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 22,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  input: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#222',
    fontWeight: '500',
    marginBottom: 10,
  },
  inputError: {borderColor: '#FA5F5F'},
  inputValid: {borderColor: '#009C92'},
  checkBtn: {
    marginLeft: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: '#F8F8F8',
    marginBottom: 10,
  },
  checkBtnText: {color: '#757575', fontWeight: '600', fontSize: 15},
  subLabel: {fontSize: 12, color: '#BDBDBD', marginBottom: 20, marginTop: 0},
  subLabelError: {color: '#FF4D4F'},
  subLabelValid: {color: '#4CB6B6'},
  domainList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    marginTop: 4,
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 20,
  },
  domainItem: {padding: 12},
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 24,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
    height: 50,
  },
  cancelBtnText: {color: '#757575', fontSize: 18, fontWeight: '600'},
  nextBtn: {
    flex: 2,
    backgroundColor: '#4CB6B6',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  nextBtnText: {color: '#fff', fontSize: 18, fontWeight: '600'},
  domainListDropdown: {
    width: 150,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    marginTop: 2,
    zIndex: 20,
  },
});

export default SignUpScreen;
