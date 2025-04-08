import React, {useState, useRef, useEffect} from 'react';
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
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import EmptyBookmark from '../assets/empty-bookmark.svg';
import FullBookmark from '../assets/full-bookmark.svg';

type DiscoveryNavProp = StackNavigationProp<
  RootStackParamList,
  'DiscoveryDetail'
>;

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const TOP_HEADER_HEIGHT = 80;
const BOTTOM_TAB_HEIGHT = 105;
const availableHeight = SCREEN_HEIGHT - (TOP_HEADER_HEIGHT + BOTTOM_TAB_HEIGHT);

const ITEM_SPACING = 25;

// 카드 크기
const CARD_WIDTH = 312;
const CARD_HEIGHT = 500;

// 예시 데이터
const recommendedBooks = [
  {
    id: '1',
    firstLine: `오늘 엄마가 죽었다 아니, 어쩌면 어제인지도`,
    firstParagraph: ``,
    title: `이방인`,
    author: '알베르 카뮈',
    cover: 'https://example.com/mom-cover.png',
  },
  {
    id: '2',
    firstLine: `'박제가 되어 버린 천재'를 아시오?`,
    firstParagraph: `나는 유쾌하오. 이런 때 연애까지가 유쾌하오.\n\n 육신이 흐느적흐느적하도록 피로했을 때만 정신이 은화처럼 맑소. 니코틴이 내 횟배 앓는 뱃속으로 스미면 머릿속에 으레 백지가 준비되는 법이오. 그 위에다 나는 위트와 파라독스를 바둑 포석처럼 늘어놓소. 가증할 상식의 병이오.\n\n 나는 또 여인과 생활을 설계하오. 연애기법에마저 서먹서먹해진 지성의 극치를 흘깃 좀 들여다 본 일이 있는, 말하자면 일종의 정신분일자말이오. 이런 여인의 반-그것은 온갖 것의 반이오. - 만을 영수하는 생활을 설계한다는 말이오. 그런 생활 속에 한 발만 들여놓고 흡사 두 개의 태양처럼 마주 쳐다보면서 낄낄거리는 것이오. 나는 아마 어지간히 인생의 제행이 싱거워서 견딜 수가 없게끔 되고 그만둔 모양이오. 굿바이.\n\n 굿바이. 그대는 이따금 그대가 제일 싫어하는 음식을 탐식하는 아이로니를 실천해 보는 것도 놓을 것 같소. 위트와 파라독스와…….\n\n 그대 자신을 위조하는 것도 할 만한 일이오. 그대의 작품은 한번도 본 일이 없는 기성품에 의하여 차라리 경편하고 고매하리다.\n\n 19세기는 될 수 있거든 봉쇄하여 버리오. 도스토예프스키 정신이란 자칫하면 낭비일 것 같소. 위고를 불란서의 빵 한 조각이라고는 누가 그랬는지 지언인 듯싶소. 그러나 인생 혹은 그 모형에 있어서 '디테일' 때문에 속는다거나 해서야 되겠소?\n\n 화를 보지 마오. 부디 그대께 고하는 것이니……\n\n "테이프가 끊어지면 피가 나오. 상채기도 머지 않아 완치될 줄 믿소. 굿바이." 감정은 어떤 '포우즈'. (그 '포우즈'의 원소만을 지적하는 것이 아닌지 나도 모르겠소.) 그 포우즈가 부동자세에까지 고도화할 때 감정은 딱 공급을 정지합네다.\n\n 나는 내 비범한 발육을 회고하여 세상을 보는 안목을 규정하였소.`,
    title: `날개`,
    author: '이상',
    cover: 'https://example.com/nalgae-cover.png',
  },
  {
    id: '3',
    firstLine: `여름 장마란 애시당초에 글러서...`,
    firstParagraph: ``,
    title: `메밀꽃 필 무렵`,
    author: '이효석',
    cover: 'https://example.com/memil-cover.png',
  },
];

const DiscoveryScreen: React.FC = () => {
  const navigation = useNavigation<DiscoveryNavProp>();

  // 상단 탭 상태: 'recommendation' | 'archive'
  const [activeTab, setActiveTab] = useState<'recommendation' | 'archive'>(
    'recommendation',
  );

  // 캐러셀 현재 페이지 인덱스
  const [currentIndex, setCurrentIndex] = useState(0);

  // 캐러셀에 그려질 카드 아이템
  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof recommendedBooks)[0];
    index: number;
  }) => {
    const isActive = index === currentIndex;
    const containerOpacity = useRef(
      new Animated.Value(isActive ? 1 : 0.6),
    ).current;

    // 포커스된 카드만 불투명도 1, 나머지는 0.6
    useEffect(() => {
      Animated.timing(containerOpacity, {
        toValue: isActive ? 1 : 0.6,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [isActive]);

    // 북마크 토글 상태
    const [bookmarked, setBookmarked] = useState(false);

    const onPressCard = () => {
      navigation.navigate('DiscoveryDetail', {
        id: item.id,
        title: item.title,
        author: item.author,
        cover: item.cover,
        firstLine: item.firstLine,
        description: item.firstParagraph,
      });
    };

    const onPressBookmark = () => {
      setBookmarked(!bookmarked);
    };

    return (
      // 카드와 다음 카드 사이에 25px 간격을 주기 위해 View로 감싸기
      <View style={{marginBottom: ITEM_SPACING}}>
        <TouchableOpacity activeOpacity={0.9} onPress={onPressCard}>
          <Animated.View
            style={[styles.cardContainer, {opacity: containerOpacity}]}>
            <Image source={{uri: item.cover}} style={styles.coverImage} />
            <TouchableOpacity
              style={styles.bookmarkButton}
              onPress={onPressBookmark}
              activeOpacity={0.7}>
              {bookmarked ? <FullBookmark /> : <EmptyBookmark />}
            </TouchableOpacity>

            {/* 오버레이 영역 */}
            <View style={styles.overlay}>
              {/* 카테고리 태그 예시 */}
              <View style={styles.tagBadge}>
                <Text style={styles.tagBadgeText}>문학</Text>
              </View>
              <Text style={styles.titleText}>{item.title}</Text>
              <Text style={styles.authorText}>{item.author}</Text>
              <Text style={styles.firstLineText}>{item.firstLine}</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <LinearGradient
        colors={['#001B1A', '#004743', '#00B1A7']}
        locations={[0, 0.5, 1]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.gradientBackground}>
        <SafeAreaView style={styles.safeArea}>
          {/* 상단 탭 (추천 | 보관함) */}
          <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => setActiveTab('recommendation')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'recommendation' && styles.activeTabText,
                ]}>
                추천
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('archive')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'archive' && styles.activeTabText,
                ]}>
                보관함
              </Text>
            </TouchableOpacity>
          </View>

          {/* 탭별 화면 */}
          {activeTab === 'recommendation' ? (
            // 추천 탭: 캐러셀
            <View style={styles.carouselContainer}>
              <Carousel
                data={recommendedBooks}
                renderItem={renderItem}
                // 각 페이지의 높이를 카드 높이 + 간격으로 설정
                width={CARD_WIDTH}
                height={CARD_HEIGHT + ITEM_SPACING}
                vertical
                style={{height: availableHeight}}
                containerStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                pagingEnabled
                snapEnabled
                scrollAnimationDuration={300}
                onSnapToItem={index => setCurrentIndex(index)}
              />
            </View>
          ) : (
            // 보관함 탭: 추후 개발용 (Placeholder)
            <View style={styles.archiveContainer}>
              <Text style={{color: '#fff', fontSize: 16}}>
                보관함 화면은 추후 개발 예정!
              </Text>
            </View>
          )}

          {/* 하단 탭바 공간 대체 */}
          <View style={{height: BOTTOM_TAB_HEIGHT}} />
        </SafeAreaView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
};

export default DiscoveryScreen;

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  // 상단 탭 영역
  tabContainer: {
    height: TOP_HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  tabText: {
    fontSize: 18,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.5)',
    marginRight: 24,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  // 보관함 탭 Placeholder
  archiveContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselContainer: {
    height: availableHeight,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#333',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  coverImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  overlay: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-end',
  },
  tagBadge: {
    width: 45,
    height: 24,
    backgroundColor: '#FFF',
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  tagBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFF',
    marginBottom: 3,
    lineHeight: 20,
  },
  authorText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#FFF',
    opacity: 0.7,
    marginBottom: 10,
    lineHeight: 20,
  },
  firstLineText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 10,
    lineHeight: 30,
  },
});
