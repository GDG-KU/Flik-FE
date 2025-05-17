import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Animated,
  Pressable,
  ScrollView,
  Modal,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import FireIcon from '../assets/fire-icon.svg';
import InfoIcon from '../assets/info-icon.svg';
import EmptyBookmark from '../assets/empty-bookmark.svg';
import FullBookmark from '../assets/full-bookmark.svg';
import RankOneIcon from '../assets/rank-one-icon.svg';
import RankTwoIcon from '../assets/rank-two-icon.svg';
import RankThreeIcon from '../assets/rank-three-icon.svg';

type DiscoveryNavProp = StackNavigationProp<
  RootStackParamList,
  'DiscoveryDetail'
>;

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const TOP_HEADER_HEIGHT = 48;
const BOTTOM_TAB_HEIGHT = 105;
const availableHeight = SCREEN_HEIGHT - (TOP_HEADER_HEIGHT + BOTTOM_TAB_HEIGHT);

const ITEM_SPACING = 16;

// 카드 크기 (이미지 기준)
const CARD_WIDTH = 332;
const CARD_HEIGHT = 516;

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

// 랭킹 mock 데이터
const rankingBooks = [
  {
    id: '1',
    title: '도널드 노먼의 사용자 중심 디자인',
    author: '도널드 노먼',
    cover: 'https://example.com/rank1.png',
    views: 600,
  },
  {
    id: '2',
    title: '도널드 노먼의 사용자 중심 디자인',
    author: '도널드 노먼',
    cover: 'https://example.com/rank2.png',
    views: 500,
  },
  {
    id: '3',
    title: '도널드 노먼의 사용자 중심 디자인',
    author: '도널드 노먼',
    cover: 'https://example.com/rank3.png',
    views: 300,
  },
  {
    id: '4',
    title: '도널드 노먼의 사용자 중심 디자인',
    author: '도널드 노먼',
    cover: 'https://example.com/rank4.png',
    views: 100,
  },
  {
    id: '5',
    title: '도널드 노먼의 사용자 중심 디자인',
    author: '도널드 노먼',
    cover: 'https://example.com/rank5.png',
    views: 100,
  },
];

// 북마크 mock 데이터 (사진 속 디자인과 동일하게 6개)
const bookmarkBooks = [
  {
    id: '1',
    title: '날개',
    author: '이상',
    cover:
      'https://user-images.githubusercontent.com/14071105/273264728-2e599b2e-2cce-4e7e-8e2e-2e7e8e2e7e8e.png',
  },
  {
    id: '2',
    title: '날개',
    author: '이상',
    cover:
      'https://user-images.githubusercontent.com/14071105/273264728-2e599b2e-2cce-4e7e-8e2e-2e7e8e2e7e8e.png',
  },
  {
    id: '3',
    title: '날개',
    author: '이상',
    cover:
      'https://user-images.githubusercontent.com/14071105/273264728-2e599b2e-2cce-4e7e-8e2e-2e7e8e2e7e8e.png',
  },
  {
    id: '4',
    title: '날개',
    author: '이상',
    cover:
      'https://user-images.githubusercontent.com/14071105/273264728-2e599b2e-2cce-4e7e-8e2e-2e7e8e2e7e8e.png',
  },
  {
    id: '5',
    title: '날개',
    author: '이상',
    cover:
      'https://user-images.githubusercontent.com/14071105/273264728-2e599b2e-2cce-4e7e-8e2e-2e7e8e2e7e8e.png',
  },
  {
    id: '6',
    title: '날개',
    author: '이상',
    cover:
      'https://user-images.githubusercontent.com/14071105/273264728-2e599b2e-2cce-4e7e-8e2e-2e7e8e2e7e8e.png',
  },
  {
    id: '7',
    title: '날개',
    author: '이상',
    cover:
      'https://user-images.githubusercontent.com/14071105/273264728-2e599b2e-2cce-4e7e-8e2e-2e7e8e2e7e8e.png',
  },
  {
    id: '8',
    title: '날개',
    author: '이상',
    cover:
      'https://user-images.githubusercontent.com/14071105/273264728-2e599b2e-2cce-4e7e-8e2e-2e7e8e2e7e8e.png',
  },
  {
    id: '9',
    title: '날개',
    author: '이상',
    cover:
      'https://user-images.githubusercontent.com/14071105/273264728-2e599b2e-2cce-4e7e-8e2e-2e7e8e2e7e8e.png',
  },
  {
    id: '10',
    title: '날개',
    author: '이상',
    cover:
      'https://user-images.githubusercontent.com/14071105/273264728-2e599b2e-2cce-4e7e-8e2e-2e7e8e2e7e8e.png',
  },
  {
    id: '11',
    title: '날개',
    author: '이상',
    cover:
      'https://user-images.githubusercontent.com/14071105/273264728-2e599b2e-2cce-4e7e-8e2e-2e7e8e2e7e8e.png',
  },
];

const DiscoveryScreen: React.FC = () => {
  const navigation = useNavigation<DiscoveryNavProp>();

  // 상단 탭 상태: 'recommendation' | 'ranking' | 'bookmark'
  const [activeTab, setActiveTab] = useState<
    'recommendation' | 'ranking' | 'bookmark'
  >('recommendation');

  // 캐러셀 현재 페이지 인덱스
  const [currentIndex, setCurrentIndex] = useState(0);

  // DiscoverDetailScreen에서 사용한 모달 옵션 복사
  const CHALLENGE_OPTIONS = [
    {
      key: 'week',
      label: '일주일 동안 읽기',
      challenge: true,
      desc: '하루당 6 페이지',
    },
    {
      key: 'month',
      label: '4주 동안 읽기',
      challenge: true,
      desc: '하루당 2 페이지',
    },
    {key: 'free', label: '시간 제한 없이 읽기', challenge: false, desc: ''},
  ];

  // 카드별 preview 상태 관리
  const [previewStates, setPreviewStates] = useState<{[id: string]: boolean}>(
    {},
  );

  const currentBook = recommendedBooks.slice().reverse()[currentIndex];

  // 책 읽기 모달 상태 (DiscoverDetailScreen과 동일)
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState('');
  const challengeCount = 1; // 예시
  const challengeMax = 5;
  const selectedOption = CHALLENGE_OPTIONS.find(opt => opt.key === selected);

  // 북마크 상태 관리
  const [bookmarkedMap, setBookmarkedMap] = useState<{[id: string]: boolean}>(
    {},
  );

  // 북마크된 책 목록 가져오기
  const getBookmarkedBooks = () =>
    recommendedBooks.filter(b => bookmarkedMap[b.id]);

  // 북마크 토글 함수
  const toggleBookmark = (bookId: string) => {
    setBookmarkedMap(prev => ({
      ...prev,
      [bookId]: !prev[bookId],
    }));
  };

  // 이미지 로드 실패 상태 관리 (랭킹/북마크 공용)
  const [imageErrorMap, setImageErrorMap] = useState<{[id: string]: boolean}>(
    {},
  );

  // 북마크 토글 상태 관리 (id: boolean)
  const [bookmarkToggles, setBookmarkToggles] = useState(() => {
    const initial: {[id: string]: boolean} = {};
    bookmarkBooks.forEach(b => {
      initial[b.id] = true;
    });
    return initial;
  });
  const handleToggle = (id: string) => {
    setBookmarkToggles(prev => ({...prev, [id]: !prev[id]}));
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof recommendedBooks)[0];
    index: number;
  }) => {
    const isActive = index === currentIndex;
    const scale = useRef(new Animated.Value(isActive ? 1 : 0.9)).current;
    const containerOpacity = useRef(
      new Animated.Value(isActive ? 1 : 1),
    ).current;
    useEffect(() => {
      Animated.timing(scale, {
        toValue: isActive ? 1 : 0.96,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(containerOpacity, {
        toValue: isActive ? 1 : 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [isActive]);
    return (
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() =>
          setPreviewStates(prev => ({...prev, [item.id]: !prev[item.id]}))
        }
        style={{borderRadius: 40, overflow: 'hidden'}}>
        <Animated.View style={[styles.cardContainer, {transform: [{scale}]}]}>
          <View style={styles.coverPlaceholder} />
          {/* 카드 하단 오버레이: 텍스트만 */}
          <View style={styles.cardOverlay}>
            <View style={styles.cardOverlayInner}>
              <View style={styles.tagBadge}>
                <Text style={styles.tagBadgeText}>소설</Text>
              </View>
              <Text style={styles.cardTitle}>
                {item.title}{' '}
                <Text style={styles.cardAuthor}>| {item.author}</Text>
              </Text>
              <Text style={styles.cardFirstLine}>{item.firstLine}</Text>
            </View>
          </View>
          {/* 본문 미리보기 오버레이 */}
          {previewStates[item.id] && (
            <View
              style={styles.previewOverlayTouchable}
              pointerEvents="box-none">
              <ScrollView
                style={styles.previewOverlayScroll}
                contentContainerStyle={styles.previewOverlayContent}
                showsVerticalScrollIndicator={false}>
                <Text style={styles.previewOverlayText}>
                  {item.firstParagraph || item.firstLine}
                </Text>
              </ScrollView>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <SafeAreaView style={[styles.safeArea, {flex: 1}]}>
          {/* 상단 탭 (추천 | 랭킹 | 북마크) */}
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
            <View style={styles.tabBarDivider} />
            <TouchableOpacity onPress={() => setActiveTab('ranking')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'ranking' && styles.activeTabText,
                ]}>
                랭킹
              </Text>
            </TouchableOpacity>
            <View style={styles.tabBarDivider} />
            <TouchableOpacity onPress={() => setActiveTab('bookmark')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'bookmark' && styles.activeTabText,
                ]}>
                북마크
              </Text>
            </TouchableOpacity>
          </View>

          {/* 탭별 화면 */}
          {activeTab === 'recommendation' ? (
            // 추천 탭: 카드 + 하단 고정 버튼
            <View style={{backgroundColor: '#FFF', height: availableHeight}}>
              <View style={styles.carouselContainer}>
                <Carousel
                  data={recommendedBooks.slice().reverse()}
                  renderItem={renderItem}
                  width={CARD_WIDTH}
                  height={CARD_HEIGHT}
                  style={{height: CARD_HEIGHT, marginTop: 8, borderRadius: 40}}
                  containerStyle={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  pagingEnabled
                  snapEnabled
                  scrollAnimationDuration={350}
                  onSnapToItem={index => setCurrentIndex(index)}
                  loop={false}
                  mode="horizontal-stack"
                  modeConfig={{
                    snapDirection: 'right',
                    stackInterval: CARD_WIDTH * 2.5,
                    scaleInterval: 90,
                  }}
                />
                {/* 하단 고정 버튼 영역 */}
                <View style={styles.fixedButtonRow}>
                  <TouchableOpacity
                    style={styles.cardIconBtn}
                    onPress={() => {
                      if (currentBook) {
                        toggleBookmark(currentBook.id);
                      }
                    }}
                    activeOpacity={0.7}>
                    {currentBook && bookmarkedMap[currentBook.id] ? (
                      <FullBookmark />
                    ) : (
                      <EmptyBookmark />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cardInfoBtn}
                    activeOpacity={0.7}>
                    <InfoIcon />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cardReadBtn}
                    onPress={() => setModalVisible(true)}>
                    <Text style={styles.cardReadBtnText}>▶ 책 읽기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : activeTab === 'ranking' ? (
            <View style={{height: SCREEN_HEIGHT}}>
              <ScrollView
                style={{flex: 1}}
                contentContainerStyle={{
                  paddingTop: 14,
                  paddingLeft: 14,
                  paddingRight: 14,
                  paddingBottom: 250,
                  backgroundColor: '#FFF',
                }}
                showsVerticalScrollIndicator={true}>
                {rankingBooks.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.rankCard}
                    activeOpacity={0.9}
                    onPress={() => {}}>
                    <View style={styles.rankCoverWrapper}>
                      {!item.cover || imageErrorMap[item.id] ? (
                        <View style={styles.rankCover} />
                      ) : (
                        <Image
                          source={{uri: item.cover}}
                          style={styles.rankCover}
                          onError={() =>
                            setImageErrorMap(prev => ({
                              ...prev,
                              [item.id]: true,
                            }))
                          }
                        />
                      )}
                      {index === 0 && (
                        <View style={styles.rankBadgeAbsolute}>
                          <RankOneIcon width={28} height={28} />
                        </View>
                      )}
                      {index === 1 && (
                        <View style={styles.rankBadgeAbsolute}>
                          <RankTwoIcon width={28} height={28} />
                        </View>
                      )}
                      {index === 2 && (
                        <View style={styles.rankBadgeAbsolute}>
                          <RankThreeIcon width={28} height={28} />
                        </View>
                      )}
                    </View>
                    <View style={styles.rankInfoArea}>
                      <Text style={styles.rankTitle}>{item.title}</Text>
                      <Text style={styles.rankAuthor}>{item.author}</Text>
                      <Text style={styles.rankViews}>조회수 {item.views}+</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : (
            <View style={{height: SCREEN_HEIGHT}}>
              <ScrollView
                style={{flex: 1}}
                contentContainerStyle={{
                  paddingTop: 14,
                  paddingLeft: 14,
                  paddingRight: 14,
                  paddingBottom: 200,
                  backgroundColor: '#FFF',
                }}
                showsVerticalScrollIndicator={false}>
                {bookmarkBooks.length === 0 ? (
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#BDBDBD',
                      marginTop: 40,
                    }}>
                    북마크된 책이 없습니다.
                  </Text>
                ) : (
                  (() => {
                    const rows = [];
                    for (let i = 0; i < bookmarkBooks.length; i += 3) {
                      rows.push(bookmarkBooks.slice(i, i + 3));
                    }
                    return rows.map((row, rowIdx) => (
                      <View
                        key={rowIdx}
                        style={{
                          flexDirection: 'row',
                          gap: 10,
                          marginBottom: 24,
                          paddingHorizontal: 16,
                          justifyContent: 'flex-start',
                        }}>
                        {row.map(item => (
                          <View key={item.id} style={styles.bookmarkGridCard}>
                            <View style={styles.bookmarkGridCoverWrapper}>
                              {!item.cover || imageErrorMap[item.id] ? (
                                <View style={styles.bookmarkGridCover} />
                              ) : (
                                <Image
                                  source={{uri: item.cover}}
                                  style={styles.bookmarkGridCover}
                                  onError={() =>
                                    setImageErrorMap(prev => ({
                                      ...prev,
                                      [item.id]: true,
                                    }))
                                  }
                                />
                              )}
                              <TouchableOpacity
                                style={styles.bookmarkGridIcon}
                                onPress={() => handleToggle(item.id)}
                                activeOpacity={0.7}>
                                {bookmarkToggles[item.id] ? (
                                  <FullBookmark />
                                ) : (
                                  <EmptyBookmark />
                                )}
                              </TouchableOpacity>
                            </View>
                            <Text style={styles.bookmarkGridTitle}>
                              {item.title}
                            </Text>
                            <Text style={styles.bookmarkGridAuthor}>
                              {item.author}
                            </Text>
                          </View>
                        ))}
                        {/* 빈 칸 채우기 */}
                        {row.length < 3 &&
                          Array.from({length: 3 - row.length}).map((_, idx) => (
                            <View key={`empty-${idx}`} style={{flex: 1}} />
                          ))}
                      </View>
                    ));
                  })()
                )}
              </ScrollView>
            </View>
          )}
        </SafeAreaView>
      </View>

      {/* 책 읽기 모달 (DiscoverDetailScreen과 동일) */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.18)',
            justifyContent: 'flex-end',
          }}
          onPress={() => setModalVisible(false)}>
          <View
            style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              paddingHorizontal: 18,
              paddingTop: 12,
              paddingBottom: 32,
              minHeight: 320,
            }}>
            <View
              style={{
                width: 48,
                height: 5,
                borderRadius: 3,
                backgroundColor: '#E0E0E0',
                alignSelf: 'center',
                marginBottom: 18,
              }}
            />
            {CHALLENGE_OPTIONS.map(opt => {
              const isSelected = selected === opt.key;
              const isChallenge = opt.challenge;
              const showDesc = isSelected && !!opt.desc && isChallenge;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    {
                      height: 44,
                      width: '100%',
                      borderWidth: 1,
                      borderColor: '#E0E0E0',
                      borderRadius: 8,
                      marginBottom: 10,
                      backgroundColor: '#fff',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      padding: 0,
                    },
                    isSelected && isChallenge && {height: 88},
                    isSelected && {borderColor: '#1A1A1A'},
                  ]}
                  onPress={() => setSelected(opt.key)}
                  activeOpacity={0.8}>
                  {showDesc ? (
                    <>
                      <View
                        style={{
                          height: 44,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingHorizontal: 16,
                        }}>
                        <Text
                          style={{
                            color: isSelected ? '#1A1A1A' : '#757575',
                            fontSize: 14,
                            lineHeight: 22,
                          }}>
                          {opt.label}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: 8,
                          }}>
                          <FireIcon
                            width={18}
                            height={18}
                            style={{marginRight: 2}}
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              color: '#757575',
                              fontWeight: '600',
                              lineHeight: 22,
                              marginLeft: 2,
                            }}>
                            챌린지
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          width: '95%',
                          height: 1,
                          backgroundColor: '#E0E0E0',
                          alignSelf: 'center',
                        }}
                      />
                      <View
                        style={{
                          height: 44,
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingHorizontal: 16,
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: '#757575',
                            fontWeight: '400',
                            lineHeight: 22,
                            paddingLeft: 2,
                          }}>
                          {opt.desc}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <View
                      style={{
                        height: 44,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 16,
                      }}>
                      <Text
                        style={{
                          color: isSelected ? '#1A1A1A' : '#757575',
                          fontWeight: isSelected ? '700' : '600',
                          fontSize: 16,
                          lineHeight: 22,
                        }}>
                        {opt.label}
                      </Text>
                      {isChallenge && (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: 8,
                          }}>
                          <FireIcon
                            width={18}
                            height={18}
                            style={{marginRight: 2}}
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              color: '#757575',
                              fontWeight: '600',
                              lineHeight: 22,
                              marginLeft: 2,
                            }}>
                            챌린지
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
            {/* 챌린지 횟수 + 읽기 버튼 한 줄 */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 30,
                marginBottom: 18,
              }}>
              <View style={{alignItems: 'flex-start'}}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#757575',
                    fontWeight: '500',
                    lineHeight: 22,
                    marginRight: 8,
                  }}>
                  챌린지 횟수{' '}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#1A1A1A',
                    fontWeight: '600',
                    lineHeight: 23,
                  }}>
                  <Text style={{color: '#00B1A7', fontWeight: '600'}}>
                    {challengeCount}
                  </Text>
                  /{challengeMax}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  height: 50,
                  width: '100%',
                  borderRadius: 10,
                  backgroundColor: selected ? '#00B1A7' : '#BDBDBD',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                }}
                disabled={!selected}
                onPress={() => selected && setModalVisible(false)}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 18,
                    fontWeight:
                      selectedOption && selectedOption.challenge
                        ? '600'
                        : '500',
                    opacity: selected ? 1 : 0.5,
                  }}>
                  {selectedOption && selectedOption.challenge
                    ? '챌린지 읽기 시작'
                    : '읽기 시작'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
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
    backgroundColor: '#FFF',
  },
  // 상단 탭 영역
  tabContainer: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    backgroundColor: '#FFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 23,
    color: '#BDBDBD',
    letterSpacing: -0.3,
  },
  activeTabText: {
    color: '#1A1A1A',
  },
  tabBarDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 10,
  },
  // 보관함 탭 Placeholder
  archiveContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselContainer: {
    height: 520,
    backgroundColor: '#FFF',
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  coverImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverPlaceholder: {
    position: 'absolute',
    width: 332,
    height: 516,
    backgroundColor: '#E0E0E0',
    borderRadius: 40,
  },
  cardOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  cardOverlayInner: {
    // 카드 오버레이 내부 여백 및 정렬
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#fff',
    marginBottom: 12,
    lineHeight: 23,
  },
  cardAuthor: {
    fontSize: 16,
    fontWeight: '400',
    color: '#fff',
    marginBottom: 12,
    lineHeight: 23,
  },
  cardFirstLine: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 0,
    lineHeight: 28,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 8,
  },
  cardIconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardInfoBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 0,
    marginRight: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardInfoIcon: {
    color: '#00B1A7',
    fontSize: 22,
    fontWeight: '700',
  },
  cardReadBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#4EC6B6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginRight: 0,
  },
  cardReadBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tagBadge: {
    width: 33,
    height: 24,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(0, 0, 0, 0.60)',
    lineHeight: 18,
  },
  cardPreviewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.70)',
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  cardPreviewScrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  cardPreviewText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 25,
    fontWeight: '400',
  },
  fixedButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    gap: 10,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#FFF',
    marginTop: 30,
  },
  previewOverlayTouchable: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.70)',
    borderRadius: 28,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    overflow: 'hidden',
  },
  previewOverlayScroll: {
    flex: 1,
    padding: 24,
  },
  previewOverlayContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  previewOverlayText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '400',
  },
  // 랭킹 카드
  rankCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    height: 124,
  },
  rankCoverWrapper: {
    width: 74,
    height: 100,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
    marginRight: 10,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  rankCover: {
    width: 74,
    height: 100,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
  },
  rankBadgeAbsolute: {
    position: 'absolute',
    top: 2,
    left: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  rankInfoArea: {
    flex: 1,
    justifyContent: 'center',
  },
  rankTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 22,
    overflow: 'hidden',
  },
  rankAuthor: {
    fontSize: 12,
    fontWeight: '500',
    color: '#757575',
    opacity: 0.8,
    lineHeight: 22,
  },
  rankViews: {
    fontSize: 12,
    fontWeight: '500',
    color: '#757575',
    opacity: 0.8,
    lineHeight: 22,
  },
  // 북마크 그리드
  bookmarkGridCard: {
    width: 104,
    height: 186,
    backgroundColor: '#fff',
    marginTop: 10,
    alignItems: 'center',
  },
  bookmarkGridCoverWrapper: {
    width: 104,
    height: 138,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    marginBottom: 4,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkGridCover: {
    width: 104,
    height: 138,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
  },
  bookmarkGridIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 2,
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkGridTitle: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 22,
    color: '#1A1A1A',
  },
  bookmarkGridAuthor: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 22,
    color: '#757575',
  },
});
