// src/screens/HomeScreen.tsx
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';

import Logo from '../assets/logo.svg';
import Alarm from '../assets/alarm-icon.svg';
import FireIcon from '../assets/fire-icon.svg';

type HomeNavProp = StackNavigationProp<RootStackParamList, 'Main'>;

const {width: SCREEN_WIDTH} = Dimensions.get('window');

// 캐러셀
const CARD_WIDTH = SCREEN_WIDTH * 0.9;
const CARD_HEIGHT = 500;
const COVER_WIDTH = 251;
const COVER_HEIGHT = 335;

// 샘플 데이터
const recentBooks = [
  {
    id: '1',
    title: '도널드 노먼의 사용자 중심 디자인',
    author: '도널드 노먼',
    daysLeft: 2,
  },
  {id: '2', title: '날개', author: '이상', daysLeft: 5},
  {id: '3', title: '제로 투 원', author: '피터 틸', daysLeft: 3},
];

const TODAY = new Date();
const CURRENT_DAY = TODAY.getDate();
const CURRENT_MONTH = TODAY.getMonth() + 1;
const CURRENT_YEAR = TODAY.getFullYear();

// 날짜별 독서 활동 예시 (실제 데이터에 맞게 수정)
type ReadingLog = {
  id: string;
  title: string;
  author: string;
  read: string;
  ratio: number;
};
const readingLogs: {[key: number]: ReadingLog[]} = {
  11: [{id: 'a', title: '날개', author: '이상', read: '32/32', ratio: 1}],
  12: [
    {
      id: 'b',
      title: '도널드 노먼의 사용자 중심 디자인',
      author: '도널드 노먼',
      read: '6/9',
      ratio: 6 / 9,
    },
  ],
  13: [],
  14: [
    {id: 'a', title: '날개', author: '이상', read: '32/32', ratio: 1},
    {
      id: 'b',
      title: '도널드 노먼의 사용자 중심 디자인',
      author: '도널드 노먼',
      read: '6/9',
      ratio: 6 / 9,
    },
  ],
};

function getWeekDays(current: number): number[] {
  let start = current - 3;
  if (start < 1) start = 1;
  const days: number[] = [];
  for (let i = start; i < start + 7; i++) {
    days.push(i > 30 ? i - 30 : i);
  }
  return days;
}

const dailyActivities = [
  {id: 'a', title: '날개', author: '이상', read: '32/32', ratio: 1},
  {
    id: 'b',
    title: '도널드 노먼의 사용자 중심 디자인',
    author: '도널드 노먼',
    read: '6/9',
    ratio: 6 / 9,
  },
];

const challenges = [
  {
    id: 'c1',
    title: '도널드 노먼의 사용자 중심 디자인',
    done: 5,
    total: 7,
    status: 'ongoing',
  },
  {id: 'c2', title: '제로 투 원', done: 7, total: 7, status: 'completed'},
];

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDay, setSelectedDay] = useState(CURRENT_DAY);

  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof recentBooks)[0];
    index: number;
  }) => {
    const isActive = index === currentIndex;
    const isLeft = index < currentIndex;
    const isRight = index > currentIndex;

    const containerOpacity = useRef(
      new Animated.Value(isActive ? 1 : 0.6),
    ).current;
    const textOpacity = useRef(new Animated.Value(isActive ? 1 : 0)).current;
    const rotateValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      let toRotate = 0;
      if (isLeft) toRotate = -5;
      else if (isRight) toRotate = 5;

      Animated.timing(containerOpacity, {
        toValue: isActive ? 1 : 0.6,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(textOpacity, {
        toValue: isActive ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(rotateValue, {
        toValue: toRotate,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [isActive, isLeft, isRight]);

    const rotateDeg = rotateValue.interpolate({
      inputRange: [-45, 45],
      outputRange: ['-45deg', '45deg'],
    });

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('BookDetail', {
            bookId: item.id,
            title: item.title,
            author: item.author,
            cover: 'none',
          })
        }>
        <Animated.View
          style={[
            styles.cardContainer,
            {opacity: containerOpacity, transform: [{rotateZ: rotateDeg}]},
          ]}>
          <View style={styles.coverWrapper}>
            <View style={styles.coverPlaceholder} />
            <View style={styles.daysBadge}>
              <FireIcon style={{height: 20, width: 17}} />
              <Text style={styles.daysBadgeText}>D-{item.daysLeft}</Text>
            </View>
          </View>
          <Animated.View style={{opacity: textOpacity, alignItems: 'center'}}>
            <View style={styles.pagerDots}>
              {recentBooks.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.pagerDot,
                    i === index
                      ? styles.pagerDotActive
                      : styles.pagerDotInactive,
                  ]}
                />
              ))}
            </View>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookAuthor}>{item.author} | 총 N 페이지</Text>
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#EAF4F2', '#FFF', '#FFF']} style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}} edges={['top', 'left', 'right']}>
        {/* 상단 바 */}
        <View style={styles.topBar}>
          <Logo />
          <Alarm />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 캐러셀 */}
          <View style={styles.carouselWrapper}>
            <Carousel
              data={recentBooks}
              renderItem={renderItem}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              defaultIndex={0}
              onSnapToItem={idx => setCurrentIndex(idx)}
              pagingEnabled
              mode="parallax"
              modeConfig={{
                parallaxScrollingOffset: 80,
                parallaxScrollingScale: 0.9,
              }}
            />
          </View>

          {/* 이어서 읽기 */}
          <View style={styles.readBtnWrapper}>
            <TouchableOpacity
              style={styles.readButton}
              onPress={() =>
                navigation.navigate('Reading', {
                  title: recentBooks[currentIndex].title,
                  author: recentBooks[currentIndex].author,
                  thumbnail: '',
                })
              }>
              <Text style={styles.readButtonText}>▶ 이어서 읽기</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* 주간 캘린더 섹션 */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => navigation.navigate('ReadingProgress')}>
              <Text style={styles.sectionTitle}>
                {TODAY.getFullYear()}년 {TODAY.getMonth() + 1}월
              </Text>
              <Text style={styles.sectionMore}>전체보기 ›</Text>
            </TouchableOpacity>

            <View style={styles.streakRow}>
              <FireIcon />
              <Text style={styles.streakText}>연속 7일째 독서중이에요</Text>
            </View>

            <View style={styles.calendarWrapper}>
              <View style={styles.weekdayLabels}>
                {['일', '월', '화', '수', '목', '금', '토'].map((wd, i) => (
                  <Text key={i} style={styles.weekdayLabel}>
                    {wd}
                  </Text>
                ))}
              </View>

              <View style={styles.weekRow}>
                {getWeekDays(CURRENT_DAY).map(day => (
                  <TouchableOpacity
                    key={day}
                    style={styles.dayCell}
                    onPress={() => setSelectedDay(day)}>
                    {day === selectedDay ? (
                      <View style={styles.todayCircle}>
                        <Text style={styles.todayText}>{day}</Text>
                      </View>
                    ) : (
                      <Text style={styles.dayText}>{day}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.dotRow}>
                {getWeekDays(CURRENT_DAY).map(day => {
                  const logs = readingLogs[day] || [];
                  return (
                    <View key={day} style={styles.dotContainer}>
                      {logs.map((log, idx) => (
                        <View
                          key={idx}
                          style={[
                            styles.dot,
                            log.ratio === 1 ? styles.dotActive : styles.dotGray,
                          ]}
                        />
                      ))}
                    </View>
                  );
                })}
              </View>
            </View>

            {/* 선택한 날짜의 독서 활동 */}
            {(readingLogs[selectedDay] || []).length === 0 ? (
              <Text style={{textAlign: 'center', color: '#888', marginTop: 12}}>
                이 날의 독서 기록이 없습니다.
              </Text>
            ) : (
              (readingLogs[selectedDay] || []).map((act: any) => (
                <View key={act.id} style={styles.activityItem}>
                  <View style={styles.actCover} />
                  <View style={styles.actInfo}>
                    <View style={styles.activityHeader}>
                      <Text
                        style={[
                          styles.actTitle,
                          act.ratio === 1
                            ? {color: '#00A58D'}
                            : {color: '#888'},
                        ]}>
                        {act.title}
                      </Text>
                      {act.ratio === 1 && (
                        <Text style={styles.actDone}>완독 ✓</Text>
                      )}
                    </View>
                    <Text
                      style={
                        styles.actSub
                      }>{`${act.author} | ${act.read} 페이지 읽음`}</Text>
                    <View style={styles.actBarRow}>
                      <View style={styles.actProgressBarBg}>
                        <View
                          style={[
                            styles.actProgressBarFill,
                            {
                              width: `${act.ratio * 100}%`,
                              backgroundColor:
                                act.ratio === 1 ? '#00A58D' : '#E0E0E0',
                            },
                          ]}
                        />
                      </View>
                      <Text
                        style={[
                          styles.actPercent,
                          act.ratio === 1
                            ? {color: '#00A58D'}
                            : {color: '#888'},
                        ]}>{`${Math.round(act.ratio * 100)}%`}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={styles.divider} />

          {/* 챌린지 섹션 */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => navigation.navigate('ChallengeList')}>
              <Text style={styles.sectionTitle}>챌린지</Text>
              <Text style={styles.sectionMore}>전체보기 ›</Text>
            </TouchableOpacity>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.challengeScroll}>
              {challenges.map(ch => (
                <View key={ch.id} style={styles.challengeCard}>
                  {/* 배지 */}
                  <View style={styles.chBadgeRow}>
                    {ch.status === 'ongoing' ? (
                      <View
                        style={{
                          width: 40,
                          height: 24,
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'row',
                        }}>
                        <FireIcon />
                        <Text style={styles.chBadgeTextPoint}>
                          D-{ch.total - ch.done}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.chBadgeGray}>
                        <Text style={styles.chBadgeTextGray}>종료</Text>
                      </View>
                    )}
                    <Text style={styles.chBadgeSub}>7일 안에 완독하기</Text>
                  </View>

                  {/* 제목 */}
                  <Text style={styles.chTitle}>{ch.title}</Text>
                  {/* 서브텍스트: 완료 횟수 중 done 숫자만 강조 */}
                  <Text style={styles.chSub}>
                    {ch.status === 'ongoing' ? (
                      <>
                        <Text style={styles.chSubHighlight}>{ch.done}</Text> /{' '}
                        {ch.total} 회 독서 완료
                      </>
                    ) : (
                      `${ch.done} / ${ch.total} 회 독서 완료`
                    )}
                  </Text>

                  {/* 진행도 도트: space-between */}
                  <View
                    style={[styles.chProgressRow, styles.chProgressJustify]}>
                    {Array.from({length: ch.total}).map((_, i) => {
                      // 지난 회차
                      if (i < ch.done) {
                        return (
                          <View key={i} style={styles.chDotChecked}>
                            <Text style={styles.chCheckMark}>✓</Text>
                          </View>
                        );
                      }
                      // 오늘 읽어야 할 회차 (ongoing)
                      if (ch.status === 'ongoing' && i === ch.done) {
                        return (
                          <View key={i} style={styles.chDotActive}>
                            <Text style={styles.chDotNumber}>{i + 1}</Text>
                          </View>
                        );
                      }
                      // 남은 회차 (or completed 이후)
                      return (
                        <View key={i} style={styles.chDotInactive}>
                          <Text style={styles.chDotNumberInactive}>
                            {i + 1}
                          </Text>
                        </View>
                      );
                    })}
                  </View>

                  {/* 버튼: completed면 회색, ongoing이면 기본 */}
                  <TouchableOpacity
                    style={[
                      styles.chButton,
                      ch.status === 'completed' && styles.chButtonCompleted,
                    ]}
                    onPress={() =>
                      navigation.navigate('Reading', {
                        title: ch.title,
                        author: '',
                        thumbnail: '',
                      })
                    }>
                    <Text
                      style={[
                        styles.chButtonText,
                        ch.status === 'completed' &&
                          styles.chButtonTextCompleted,
                      ]}>
                      {ch.status === 'ongoing'
                        ? `${ch.done + 1}회차 읽기`
                        : '남은 회차 재도전하기'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {flex: 1},
  safeArea: {flex: 1},

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  scrollContent: {paddingBottom: 40},

  carouselWrapper: {
    height: CARD_HEIGHT,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
    paddingTop: 20,
  },

  coverWrapper: {
    width: COVER_WIDTH,
    height: COVER_HEIGHT,
    backgroundColor: '#F2F2F2',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  coverPlaceholder: {flex: 1, backgroundColor: '#E0E0E0'},
  daysBadge: {
    position: 'absolute',
    width: 70,
    height: 30,
    top: 12,
    right: 12,
    backgroundColor: '#FFF',
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  daysBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
    lineHeight: 22,
    marginLeft: 5,
  },

  pagerDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  pagerDot: {width: 8, height: 8, borderRadius: 4, marginHorizontal: 4},
  pagerDotActive: {backgroundColor: '#757575'},
  pagerDotInactive: {backgroundColor: '#E0E0E0'},

  bookTitle: {
    fontSize: 20,
    height: 56,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  bookAuthor: {
    fontSize: 14,
    fontWeight: '500',
    color: '#757575',
    opacity: 0.7,
    textAlign: 'center',
  },

  readBtnWrapper: {alignItems: 'center', marginTop: 10},
  readButton: {
    width: CARD_WIDTH,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#00B1A7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  readButtonText: {color: '#FFF', fontSize: 16, fontWeight: '600'},

  divider: {height: 6, backgroundColor: '#F2F3F5', marginVertical: 20},

  section: {paddingHorizontal: 16},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {fontSize: 16, fontWeight: '600', color: '#000'},
  sectionMore: {fontSize: 12, fontWeight: '600', color: '#757575'},

  streakRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 12},
  streakText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
    color: '#1A1A1A',
    opacity: 0.8,
  },

  calendarWrapper: {
    width: SCREEN_WIDTH * 0.9,
    alignSelf: 'center',
    marginVertical: 20,
  },
  weekdayLabels: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#EEE',
    paddingBottom: 8,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
  },

  weekRow: {flexDirection: 'row', alignItems: 'center', marginVertical: 4},
  dayCell: {flex: 1, alignItems: 'center'},
  dayText: {fontSize: 14, color: '#666'},
  todayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayText: {color: '#FFF', fontSize: 14, fontWeight: '600'},

  dotRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 16},
  dotContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  dot: {width: 6, height: 6, borderRadius: 3},
  dotActive: {backgroundColor: '#00A58D'},
  dotInactive: {backgroundColor: '#DDD'},
  dotGray: {backgroundColor: '#E0E0E0'},

  activityItem: {
    width: 332,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomColor: '#EEE',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  actCover: {
    width: 48,
    height: 68,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  actInfo: {width: 258, flex: 1, marginLeft: 13},
  activityHeader: {
    width: 258,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actTitle: {fontSize: 14, fontWeight: '500', color: '#1A1A1A', opacity: 0.8},
  actDone: {fontSize: 12, color: '#BDBDBD', fontWeight: '600'},
  actSub: {fontSize: 12, color: '#757575', marginTop: 6},
  actBarRow: {
    width: 258,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  actProgressBarBg: {
    width: 200,
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
  },
  actProgressBarFill: {
    height: '100%',
    backgroundColor: '#00B1A7',
    borderRadius: 3,
  },
  actPercent: {marginLeft: 10, fontSize: 12, color: '#333'},

  challengeScroll: {paddingVertical: 12},
  challengeCard: {
    width: 200,
    height: 174,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    padding: 10,
    marginRight: 10,
  },
  chBadgeRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 8},
  chBadgeGray: {
    width: 33,
    height: 24,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chBadgeSub: {marginLeft: 8, fontSize: 10, color: '#757575', opacity: 0.8},

  chTitle: {fontSize: 12, fontWeight: '600', color: '#000', lineHeight: 22},
  chDotCurrent: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#00A58D',
    marginRight: 6,
  },
  chButtonFilled: {backgroundColor: '#00A58D'},
  chButtonTextLight: {color: '#FFF'},
  chProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chProgressJustify: {
    justifyContent: 'space-between',
  },
  chSub: {
    fontSize: 12,
    color: '#2B4453',
    opacity: 0.8,
    marginBottom: 8,
  },
  chSubHighlight: {
    color: '#00A58D',
    fontWeight: '600',
  },
  chButton: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00A58D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chButtonCompleted: {
    backgroundColor: '#EEEEEE',
    borderColor: '#EEEEEE',
  },
  chButtonText: {
    fontSize: 14,
    color: '#00A58D',
    fontWeight: '600',
  },
  chButtonTextCompleted: {
    color: '#757575',
  },
  chBadgeTextPoint: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
    color: '#00A58D',
  },
  chBadgeTextGray: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
    opacity: 0.6,
  },
  // 완료된/지난 회차: 회색 배경 + 체크
  chDotChecked: {
    width: 18,
    height: 18,
    borderRadius: 16,
    backgroundColor: '#9E9E9E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chCheckMark: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },

  // 오늘 읽을 회차: 초록 배경 + 숫자
  chDotActive: {
    width: 18,
    height: 18,
    borderRadius: 16,
    backgroundColor: '#00B1A7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chDotNumber: {
    color: '#F5F6F8',
    fontSize: 10,
    fontWeight: '600',
  },

  // 남은 회차: 연회색 배경 + 숫자
  chDotInactive: {
    width: 18,
    height: 18,
    borderRadius: 16,
    backgroundColor: '#DBDFE4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chDotNumberInactive: {
    color: '#F5F6F8',
    fontSize: 10,
    fontWeight: '600',
  },
});
