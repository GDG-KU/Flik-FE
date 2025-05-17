import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  Animated,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import Logo from '../assets/logo.svg';
import BackButton from '../assets/back-button.svg';
import ViewShot from 'react-native-view-shot';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';

// type
// route: { id, title, author, date, cover }
type Route = RouteProp<RootStackParamList, 'CompleteSave'>;

const CARD_WIDTH = 213;
const CARD_HEIGHT = 303;
const SHOT_WIDTH = 400;
const SHOT_HEIGHT = 500;

export default function CompleteSaveScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const {title, author, date, cover} = route.params;
  const [cardColor, setCardColor] = useState<'white' | 'black'>('white');
  const [showSaved, setShowSaved] = useState(false);
  const [toastOpacity] = useState(new Animated.Value(0));
  const cardRef = useRef<ViewShot>(null);

  // 저장 권한 요청 함수
  async function requestSavePermission() {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: '사진 저장 권한 요청',
            message: '앨범에 이미지를 저장하려면 권한이 필요합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '취소',
            buttonPositive: '허용',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: '사진 저장 권한 요청',
            message: '앨범에 이미지를 저장하려면 권한이 필요합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '취소',
            buttonPositive: '허용',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    // iOS는 Info.plist만 있으면 자동으로 권한 요청됨
    return true;
  }

  // 저장 버튼 클릭 시
  const handleSave = async () => {
    try {
      // 권한 체크
      let hasPermission = false;
      try {
        hasPermission = await requestSavePermission();
      } catch (e) {
        console.error('Permission request failed:', e);
        Alert.alert('오류', '권한 요청 중 문제가 발생했습니다.');
        return;
      }

      if (!hasPermission) {
        Alert.alert(
          '권한 필요',
          '앨범 저장 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
        );
        return;
      }

      // iOS에서 권한이 적용되기를 기다림
      if (Platform.OS === 'ios') {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // ViewShot 캡처
      if (!cardRef.current) {
        Alert.alert('오류', '카드 참조를 찾을 수 없습니다.');
        return;
      }

      let uri;
      try {
        if (!cardRef.current?.capture) {
          throw new Error('Capture method not available');
        }
        uri = await cardRef.current.capture();
      } catch (e) {
        console.error('ViewShot capture failed:', e);
        Alert.alert('오류', '이미지 캡처에 실패했습니다.');
        return;
      }

      if (!uri) {
        Alert.alert('오류', '캡처된 이미지가 없습니다.');
        return;
      }

      // 파일 경로 처리
      let saveUri = uri;
      if (!uri.startsWith('file://')) {
        saveUri = 'file://' + uri;
      }

      // 파일 존재 확인
      let exists = false;
      try {
        if (Platform.OS === 'ios') {
          // iOS는 '사진 추가만' 권한일 때 파일 존재 확인을 건너뜀
          exists = true;
        } else {
          exists = await RNFS.exists(saveUri.replace('file://', ''));
        }
      } catch (e) {
        console.error('File existence check failed:', e);
        Alert.alert('오류', '파일 확인 중 문제가 발생했습니다.');
        return;
      }

      if (!exists) {
        Alert.alert('오류', '캡처된 이미지 파일이 존재하지 않습니다.');
        return;
      }

      // CameraRoll 저장
      try {
        await CameraRoll.save(saveUri, {type: 'photo'});
      } catch (e) {
        console.error('CameraRoll save failed:', e);
        if (Platform.OS === 'ios') {
          Alert.alert(
            '저장 실패',
            '앨범 저장에 실패했습니다. 설정에서 사진 접근 권한을 확인해주세요.',
          );
        } else {
          Alert.alert('오류', '앨범 저장에 실패했습니다.');
        }
        return;
      }

      // 성공 처리
      setShowSaved(true);
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
        setShowSaved(false);
        navigation.goBack();
      }, 1200);
    } catch (e) {
      console.error('Unexpected error in handleSave:', e);
      Alert.alert('오류', '예기치 않은 오류가 발생했습니다.');
    }
  };

  // 카드 렌더
  const Card = ({big}: {big?: boolean}) => {
    const cardStyle = [
      styles.card,
      cardColor === 'black' ? styles.cardBlack : styles.cardWhite,
      big && styles.cardBig,
    ];
    if (big) {
      return (
        <ViewShot
          ref={cardRef}
          options={{
            format: 'jpg',
            quality: 0.8,
            result: 'tmpfile',
            height: CARD_HEIGHT,
            width: CARD_WIDTH,
          }}
          style={cardStyle}>
          <View style={styles.cover} />
          <Text
            style={[styles.title, cardColor === 'black' && {color: '#fff'}]}>
            {title}
          </Text>
          <Text
            style={[
              styles.author,
              cardColor === 'black' && {color: '#BDBDBD'},
            ]}>
            {author}
          </Text>
          <View style={styles.bottomRow}>
            <Logo width={32} height={14} />
            <Text
              style={[
                styles.date,
                cardColor === 'black' && {color: '#BDBDBD'},
              ]}>
              {date}
            </Text>
          </View>
        </ViewShot>
      );
    }
    return (
      <View style={cardStyle}>
        <View style={styles.cover} />
        <Text style={[styles.title, cardColor === 'black' && {color: '#fff'}]}>
          {title}
        </Text>
        <Text
          style={[styles.author, cardColor === 'black' && {color: '#BDBDBD'}]}>
          {author}
        </Text>
        <View style={styles.bottomRow}>
          <Logo width={26} height={12} />
          <Text
            style={[styles.date, cardColor === 'black' && {color: '#BDBDBD'}]}>
            {date}
          </Text>
        </View>
      </View>
    );
  };

  // 카드와 배경을 함께 캡처하는 컴포넌트
  const CardWithBackground = () => (
    <ViewShot
      ref={cardRef}
      options={{
        format: 'jpg',
        quality: 0.8,
        result: 'tmpfile',
        height: SHOT_HEIGHT,
        width: SHOT_WIDTH,
      }}
      style={{
        backgroundColor: '#59C4BF',
        alignItems: 'center',
        justifyContent: 'center',
        width: SHOT_WIDTH,
        height: SHOT_HEIGHT,
        borderRadius: 24,
      }}>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Card big />
      </View>
    </ViewShot>
  );

  // CardWithBackground는 항상 화면 밖에 렌더해서 ref가 연결되도록 함
  // showSaved가 true일 때만 화면 중앙에 크게 보여줌
  const hiddenCard = (
    <View style={{position: 'absolute', left: -9999, top: -9999}}>
      <CardWithBackground />
    </View>
  );
  const savedCardModal = showSaved && (
    <View
      style={{
        flex: 1,
        backgroundColor: '#6AC3C3',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
      }}>
      <CardWithBackground />
      <Animated.View style={[styles.toast, {opacity: toastOpacity}]}>
        <Text style={styles.toastText}>사진이 앨범에 저장되었습니다!</Text>
      </Animated.View>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
      {hiddenCard}
      {savedCardModal}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackButton width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>완독 카드</Text>
        <View style={{width: 24}} />
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 177, 167, 0.60)',
        }}>
        <Card />
        <View style={styles.colorRow}>
          <TouchableOpacity style={styles.profileCircle}>
            {/* 프로필 이미지 자리 (예시) */}
            <View style={styles.profileImg} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.colorCircle,
              {
                backgroundColor: '#fff',
                borderColor: cardColor === 'white' ? '#00B1A7' : '#eee',
              },
            ]}
            onPress={() => setCardColor('white')}
          />
          <TouchableOpacity
            style={[
              styles.colorCircle,
              {
                backgroundColor: '#222',
                borderColor: cardColor === 'black' ? '#00B1A7' : '#eee',
              },
            ]}
            onPress={() => setCardColor('black')}
          />
        </View>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>앨범에 저장</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 23,
    color: '#1A1A1A',
  },
  card: {
    width: CARD_WIDTH,
    minHeight: CARD_HEIGHT,
    borderRadius: 10,
    borderWidth: 0,
    marginBottom: 80,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'flex-start',
    backgroundColor: '#fff',
  },
  cardWhite: {
    backgroundColor: '#fff',
  },
  cardBlack: {
    backgroundColor: '#222',
  },
  cardBig: {
    marginBottom: 0,
  },
  cover: {
    width: 193,
    height: 184,
    borderRadius: 4,
    backgroundColor: '#eee',
    marginBottom: 10,
    alignSelf: 'center',
  },
  title: {
    fontFamily: 'esamanru OTF',
    fontWeight: '500',
    fontSize: 18,
    lineHeight: 22,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
    lineHeight: 22,
    marginBottom: 23,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 10,
  },
  date: {
    color: '#BDBDBD',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 22,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
    gap: 18,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#eee',
    marginHorizontal: 4,
  },
  profileCircle: {
    width: 30,
    height: 30,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#eee',
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileImg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 177, 167, 0.60)',
  },
  saveBtn: {
    width: 260,
    height: 48,
    backgroundColor: '#4EC6B6',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  toast: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: '#fff',
    fontSize: 15,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    overflow: 'hidden',
  },
});
