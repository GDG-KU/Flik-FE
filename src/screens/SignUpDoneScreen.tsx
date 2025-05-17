import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import EmptyProfile from '../assets/empty-profile.svg';
import BackButton from '../assets/back-button.svg';

type Props = StackScreenProps<RootStackParamList, 'SignUpDone'>;

const PROFILE_SIZE = 120;
const FAVORITE_BOOKS = ['에세이', '인문학', '철학'];
const USER_NAME = '한혜수';
const PROFILE_IMAGE = null; // 실제 이미지는 null이면 EmptyProfile

const SignUpDoneScreen: React.FC<Props> = ({navigation}) => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackButton width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>회원가입 완료</Text>
        <View style={{width: 24}} />
      </View>
      <View style={styles.content}>
        <Text style={styles.welcome}>
          {USER_NAME} 님, 반가워요 <Text style={{fontSize: 24}}>😊</Text>
          {'\n'}
          나만의 독서 여정을 시작해볼까요?
        </Text>
        <View style={styles.profileImageWrapper}>
          {PROFILE_IMAGE ? (
            <Image source={{uri: PROFILE_IMAGE}} style={styles.profileImage} />
          ) : (
            <EmptyProfile width={PROFILE_SIZE} height={PROFILE_SIZE} />
          )}
        </View>
        <Text style={styles.userName}>{USER_NAME}</Text>
        <Text style={styles.label}>좋아하는 책</Text>
        <View style={styles.chipRow}>
          {FAVORITE_BOOKS.map(cat => (
            <View key={cat} style={styles.chip}>
              <Text style={styles.chipText}>{cat}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.bottomBtnWrapper}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.replace('Main')}>
          <Text style={styles.btnText}>FLIK 시작하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  welcome: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    lineHeight: 28,
    textAlign: 'center',
    marginTop: 125,
    marginBottom: 40,
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
    marginBottom: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: PROFILE_SIZE,
    height: PROFILE_SIZE,
    borderRadius: PROFILE_SIZE / 2,
    resizeMode: 'cover',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    lineHeight: 28,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    color: '#757575',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 24,
    justifyContent: 'center',
  },
  chip: {
    height: 34,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#222',
    borderRadius: 100,
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: '#fff',
    marginHorizontal: 2,
  },
  chipText: {
    color: '#222',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomBtnWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    backgroundColor: '#fff',
  },
  btn: {
    backgroundColor: '#4CB6B6',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  btnText: {color: '#fff', fontSize: 18, fontWeight: '600'},
});

export default SignUpDoneScreen;
