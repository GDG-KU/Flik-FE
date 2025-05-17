import React, {useState} from 'react';
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
  Image,
  Alert,
  Modal,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import BackButton from '../assets/back-button.svg';
import EmptyProfile from '../assets/empty-profile.svg';
import CameraIcon from '../assets/camera-icon.svg';
import CalendarIcon from '../assets/calendar-icon.svg';
import ImageIcon from '../assets/image-icon.svg';
import {
  launchImageLibrary,
  ImageLibraryOptions,
  Asset,
} from 'react-native-image-picker';

const PROFILE_SIZE = 72;
const CAMERA_BADGE_SIZE = 24;

type Props = StackScreenProps<RootStackParamList, 'ProfileSetUp'>;

const ProfileSetUpScreen: React.FC<Props> = ({navigation}) => {
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'남성' | '여성'>('남성');
  const [birth, setBirth] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [nicknameFocused, setNicknameFocused] = useState(false);
  const [birthFocused, setBirthFocused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleNext = () => {
    navigation.navigate('PreferSetup');
  };

  const pickImageFromAlbum = async () => {
    setModalVisible(false);
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert(
          '이미지 선택 오류',
          response.errorMessage || '알 수 없는 오류',
        );
        return;
      }
      const asset: Asset | undefined = response.assets && response.assets[0];
      if (asset?.uri) {
        setProfileImage(asset.uri);
      }
    });
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
            <Text style={styles.title}>나만의 프로필을 만들어보세요</Text>
            <Text style={styles.sectionLabel}>프로필 사진</Text>
            <View style={styles.profileImageRow}>
              <TouchableOpacity
                style={styles.profileImageWrapper}
                onPress={() => setModalVisible(true)}>
                {profileImage ? (
                  <Image
                    source={{uri: profileImage}}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.profileImageBg}>
                    <EmptyProfile width={PROFILE_SIZE} height={PROFILE_SIZE} />
                  </View>
                )}
                <View style={styles.cameraBadge}>
                  <View style={styles.cameraBadgeCircle}>
                    <CameraIcon width={16} height={16} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionLabel}>닉네임</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.input,
                  {borderColor: nicknameFocused ? '#1A1A1A' : '#E0E0E0'},
                ]}
                value={nickname}
                onChangeText={setNickname}
                placeholder="닉네임"
                placeholderTextColor="#BDBDBD"
                onFocus={() => setNicknameFocused(true)}
                onBlur={() => setNicknameFocused(false)}
              />
              {nickname.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setNickname('')}>
                  <Text style={{fontSize: 18, color: '#BDBDBD'}}>×</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.subLabel}>사용할 수 있는 닉네임이에요.</Text>

            <Text style={styles.sectionLabel}>성별</Text>
            <View style={styles.genderRow}>
              <TouchableOpacity
                style={[
                  styles.genderManButton,
                  gender === '남성' && styles.genderButtonActive,
                ]}
                onPress={() => setGender('남성')}>
                <Text
                  style={[
                    styles.genderText,
                    gender === '남성' && styles.genderTextActive,
                  ]}>
                  남성
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderWomanButton,
                  gender === '여성' && styles.genderButtonActive,
                ]}
                onPress={() => setGender('여성')}>
                <Text
                  style={[
                    styles.genderText,
                    gender === '여성' && styles.genderTextActive,
                  ]}>
                  여성
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionLabel}>생년월일</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.input,
                  {borderColor: birthFocused ? '#1A1A1A' : '#E0E0E0'},
                ]}
                value={birth}
                onChangeText={setBirth}
                placeholder="YYYY-04-20"
                placeholderTextColor="#BDBDBD"
                keyboardType="numeric"
                onFocus={() => setBirthFocused(true)}
                onBlur={() => setBirthFocused(false)}
              />
              <TouchableOpacity style={styles.calendarButton}>
                <CalendarIcon width={24} height={24} />
              </TouchableOpacity>
            </View>

            <View style={{flex: 1}} />
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => navigation.goBack()}>
                <Text style={styles.cancelBtnText}>이전</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                <Text style={styles.nextBtnText}>다음</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableOpacity
          style={modalStyles.overlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        />
        <View style={modalStyles.bottomSheet}>
          <TouchableOpacity
            style={modalStyles.sheetButton}
            onPress={pickImageFromAlbum}>
            <ImageIcon width={24} height={24} />
            <Text style={modalStyles.sheetButtonText}>앨범에서 선택</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginTop: 20,
    marginBottom: 30,
  },
  sectionLabel: {
    color: '#757575',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 22,
    marginBottom: 4,
  },
  profileImageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageWrapper: {
    width: PROFILE_SIZE,
    height: PROFILE_SIZE,
    borderRadius: PROFILE_SIZE / 2,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    marginBottom: 8,
    position: 'relative',
  },
  profileImage: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    width: PROFILE_SIZE,
    height: PROFILE_SIZE,
    borderRadius: PROFILE_SIZE / 2,
    resizeMode: 'cover',
  },
  profileImageBg: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    width: PROFILE_SIZE,
    height: PROFILE_SIZE,
    borderRadius: PROFILE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  cameraBadge: {
    position: 'absolute',
    right: -CAMERA_BADGE_SIZE / 2 + 8,
    bottom: -CAMERA_BADGE_SIZE / 2 + 8,
    width: CAMERA_BADGE_SIZE,
    height: CAMERA_BADGE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadgeCircle: {
    width: CAMERA_BADGE_SIZE,
    height: CAMERA_BADGE_SIZE,
    borderRadius: CAMERA_BADGE_SIZE / 2,
    backgroundColor: '#BDBDBD',
    borderWidth: 1,
    borderColor: '#BDBDBD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 0,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#222',
    fontWeight: '500',
  },
  clearButton: {marginLeft: -36, zIndex: 1, padding: 8},
  subLabel: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'left',
    fontWeight: '400',
  },
  genderRow: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 0,
    gap: 0,
  },
  genderManButton: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: '#E8EBED',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8EBED',
    marginRight: 0,
  },
  genderWomanButton: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: '#E8EBED',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8EBED',
    marginRight: 0,
  },
  genderButtonActive: {
    backgroundColor: '#fff',
    borderColor: '#00B1A7',
    zIndex: 2,
  },
  genderText: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
    lineHeight: 22,
  },
  genderTextActive: {
    color: '#00B1A7',
    fontWeight: '600',
  },
  calendarButton: {
    marginLeft: -36,
    zIndex: 1,
    marginRight: 8,
  },
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
  backBtnText: {fontSize: 24, color: '#222'},
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    zIndex: 20,
  },
  sheetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F3F5',
    gap: 10,
  },
  sheetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 22,
    color: '#1A1A1A',
  },
});

export default ProfileSetUpScreen;
