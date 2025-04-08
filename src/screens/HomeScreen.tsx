import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {BottomTabParamList, RootStackParamList} from '../../App';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// 카드 폭/높이
const CARD_WIDTH = SCREEN_WIDTH * 0.85;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.55;

// 표지(흰색 영역) 크기
const COVER_WIDTH = 251;
const COVER_HEIGHT = 335;

const books = [
  {
    id: '1',
    title: '재즈의 계절',
    author: '김민주',
    daysLeft: 21,
    cover: 'https://example.com/jazz-cover.png',
  },
  {
    id: '2',
    title: '도널드 노먼의 디자인 심리학',
    author: '도널드 노먼',
    daysLeft: 21,
    cover: 'https://example.com/donaldnorman-cover.png',
  },
  {
    id: '3',
    title: '날개',
    author: '이상',
    daysLeft: 10,
    cover: 'https://example.com/book-cover.png',
  },
  {
    id: '4',
    title: '모순',
    author: '양귀자',
    daysLeft: 10,
    cover: 'https://example.com/book-cover.png',
  },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  const [currentIndex, setCurrentIndex] = useState(0);

  // 각 카드 렌더링 함수
  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof books)[0];
    index: number;
  }) => {
    // 현재 인덱스와 비교해 "가운데, 왼쪽, 오른쪽"을 판단
    let isActive = index === currentIndex;
    let isLeft = index < currentIndex;
    let isRight = index > currentIndex;
    if (index === 0) {
      isLeft = currentIndex !== books.length - 1 && index !== currentIndex;
      isRight = currentIndex === books.length - 1;
    }
    if (index === books.length - 1) {
      isActive = index === currentIndex;
      isLeft = currentIndex === 0;
    }

    // (1) 카드 전체 불투명도 (가운데=1, 양옆=0.6)
    const containerOpacity = useRef(new Animated.Value(isActive ? 1 : 0.6)).current;
    // (2) 텍스트 불투명도 (가운데 카드만 제목/저자 보이도록)
    const textOpacity = useRef(new Animated.Value(isActive ? 1 : 0)).current;
    // (3) 카드 기울기 (가운데=0deg, 왼쪽=-5deg, 오른쪽=+5deg)
    const rotateValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      // 양옆 카드 기울기
      let toRotate = 0;
      if (isLeft) {
        toRotate = -5; // 왼쪽 카드
      } else if (isRight) {
        toRotate = 5;  // 오른쪽 카드
      } else {
        toRotate = 0;  // 가운데(포커스)
      }

      // 카드 전체(이미지 포함) 밝기 애니메이션
      Animated.timing(containerOpacity, {
        toValue: isActive ? 1 : 0.6,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // 텍스트 페이드 인/아웃
      Animated.timing(textOpacity, {
        toValue: isActive ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // 카드 기울기
      Animated.timing(rotateValue, {
        toValue: toRotate, // -5 / 0 / +5
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [isActive, isLeft, isRight]);

    // rotateValue(숫자) → 'deg' 문자열로 변환
    const rotateDeg = rotateValue.interpolate({
      inputRange: [-45, 45],
      outputRange: ['-45deg', '45deg'],
    });

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            opacity: containerOpacity,
            transform: [{ rotateZ: rotateDeg }],
          },
        ]}
      >
        {/* 흰색 표지 영역 */}
        <View style={styles.coverWrapper}>
          <Image source={{ uri: item.cover }} style={styles.coverImage} />
          <View style={styles.daysBadge}>
            <Text style={styles.daysBadgeText}>{item.daysLeft}일</Text>
          </View>
        </View>
        {/* 포커스된 카드일 때만 제목/저자 페이드 인 */}
        <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <Text style={styles.bookAuthor}>{item.author}</Text>
        </Animated.View>
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      colors={['#D9F3F2', '#FEFEFE']}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* 상단 문구 */}
        <Text style={styles.headerText}>읽고있어요</Text>

        {/* 캐러셀: 좌우 패딩을 추가해 중앙 카드가 정확히 화면 중앙에 오도록 */}
        <View style={styles.carouselWrapper}>
          <Carousel
            data={books}
            renderItem={renderItem}
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            style={{
              width: SCREEN_WIDTH,
              paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
            }}
            defaultIndex={0}
            scrollAnimationDuration={100}
            onSnapToItem={(index) => setCurrentIndex(index)}
            pagingEnabled
            mode="parallax"
            modeConfig={{
              parallaxScrollingOffset: 80,
              parallaxScrollingScale: 0.9,
            }}
          />
        </View>

        {/* 이어서 읽기 버튼 (하단) */}
        <TouchableOpacity
          style={styles.readButton}
          onPress={() => {
            navigation.navigate('Reading', {
              title: books[currentIndex].title,
              author: books[currentIndex].author,
              thumbnail: books[currentIndex].cover,
            });
          }}
        >
          <Text style={styles.readButtonText}>이어서 읽기 ▶</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    // 배경색 제거 -> gradientBackground가 배경
    backgroundColor: 'transparent',
  },
  headerText: {
    fontSize: 20,
    color: '#2B4453', // 예시로 어두운 글자
    fontWeight: '700',
    marginLeft: 24,
    marginTop: 40,
    marginBottom: 10,
    opacity: 0.8,
  },
  carouselWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: SCREEN_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 16,
    // 그림자 효과
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  coverWrapper: {
    width: COVER_WIDTH,
    height: COVER_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    position: 'relative',
    marginBottom: 40,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  daysBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  daysBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2B4453', // 예시
    marginBottom: 4,
    height: 36,
  },
  bookAuthor: {
    fontSize: 14,
    fontWeight: '400',
    color: '#2B4453',
    height: 20,
    opacity: 0.7,
  },
  readButton: {
    width: 279,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#00A58D',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  readButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
