// src/screens/ChallengeListScreen.tsx
import React, {useState, useRef, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import BackButton from '../assets/back-button.svg';
import MoreButton from '../assets/more-button.svg';
import FireIcon from '../assets/fire-icon.svg';

type Props = StackScreenProps<RootStackParamList, 'ChallengeList'>;

type ChallengeItem = {
  id: string;
  title: string;
  author: string;
  start: string; // 챌린지 시작일
  done: number; // 완료한 회차
  total: number; // 총 회차 (예: 7회)
  status: 'ongoing' | 'completed';
  currentPage: number; // 현재 읽고 있는 페이지
  totalPages: number; // 책의 총 페이지 수
  likedPages: {page: number; text: string}[];
};

const data: ChallengeItem[] = [
  {
    id: 'c1',
    title: '날개',
    author: '이상',
    start: '2025.04.30',
    done: 5,
    total: 7,
    status: 'ongoing',
    currentPage: 20,
    totalPages: 32,
    likedPages: [
      {page: 8, text: '박제가 되어버린 천재를 아시나요?'},
      {page: 16, text: '나는 내 자신에게 한없는 애정을 느끼면서…'},
    ],
  },
  {
    id: 'c2',
    title: '제로 투 원',
    author: '피터 틸',
    start: '2025.04.28',
    done: 4,
    total: 7,
    status: 'completed',
    currentPage: 37,
    totalPages: 37,
    likedPages: [],
  },
  {
    id: 'c3',
    title: '도널드 노먼의 사용자 중심 디자인',
    author: '도널드 노먼',
    start: '2025.04.27',
    done: 7,
    total: 7,
    status: 'completed',
    currentPage: 32,
    totalPages: 32,
    likedPages: [],
  },
];

export default function ChallengeListScreen({navigation}: Props) {
  const [challengeList, setChallengeList] = useState(data);
  const [popoverPos, setPopoverPos] = useState<{x: number; y: number} | null>(
    null,
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const moreBtnRefs = useRef<Record<string, any>>({});

  const handleMore = (id: string) => {
    const ref = moreBtnRefs.current[id];
    if (ref) {
      ref.measureInWindow((x: any, y: any, width: any, height: any) => {
        setPopoverPos({x: x + width - 140, y: y + height + 4}); // 140: 메뉴 너비, 4: 여백
        setSelectedId(id);
      });
    }
  };

  const handleGiveUp = () => {
    setChallengeList(list =>
      list.map(item =>
        item.id === selectedId ? {...item, status: 'completed'} : item,
      ),
    );
    setPopoverPos(null);
  };

  const handleDelete = () => {
    setChallengeList(list => list.filter(item => item.id !== selectedId));
    setPopoverPos(null);
  };

  const grouped = useMemo(() => {
    return challengeList.reduce<Record<string, ChallengeItem[]>>(
      (acc, item) => {
        (acc[item.start] = acc[item.start] || []).push(item);
        return acc;
      },
      {},
    );
  }, [challengeList]);

  return (
    <SafeAreaView style={styles.flex}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackButton />
        </TouchableOpacity>
        <View style={{width: 32}} />
      </View>

      {/* 리스트 */}
      <ScrollView contentContainerStyle={styles.content}>
        {Object.entries(grouped).map(([date, list]) => {
          if (!grouped[date] || grouped[date].length === 0) return null;
          return (
            <View key={date} style={styles.section}>
              <Text style={styles.date}>{date}</Text>
              {grouped[date].map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate('BookDetail', {
                      bookId: item.id,
                      title: item.title,
                      author: item.author,
                      cover: '',
                    })
                  }>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      width: '100%',
                    }}>
                    <View style={styles.cover}>
                      {/* 완독/종료 뱃지 */}
                      {item.status === 'completed' && (
                        <View
                          style={[
                            styles.badgeCorner,
                            item.done === item.total
                              ? styles.badgeDone
                              : styles.badgeEnd,
                          ]}>
                          <Text
                            style={
                              item.done === item.total
                                ? styles.badgeDoneText
                                : styles.badgeEndText
                            }>
                            {item.done === item.total ? '완독 ✓' : '종료'}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.info}>
                      <View style={styles.topRow}>
                        <Text style={styles.infoTitle}>{item.title}</Text>
                        <TouchableOpacity
                          ref={ref => {
                            if (ref) moreBtnRefs.current[item.id] = ref;
                          }}
                          onPress={() => handleMore(item.id)}>
                          <MoreButton />
                        </TouchableOpacity>
                      </View>
                      {/* D-_와 7일 안에 완독하기를 한 줄에 */}
                      <View
                        style={{
                          height: 22,
                          flexDirection: 'row',
                          alignItems: 'flex-end',
                          gap: 8,
                        }}>
                        {item.status === 'ongoing' && (
                          <View style={styles.badgeRow}>
                            <FireIcon />
                            <Text style={styles.badgeDdayText}>
                              D-{item.total - item.done}
                            </Text>
                          </View>
                        )}
                        <Text style={styles.subText2}>7일 안에 완독하기</Text>
                      </View>
                      <Text style={styles.subText3}>
                        {item.status === 'ongoing' ? (
                          <>
                            <Text style={styles.subText3Highlight}>
                              {item.done}
                            </Text>{' '}
                            / {item.total} 회 독서 완료
                          </>
                        ) : (
                          `${item.done} / ${item.total} 회 독서 완료`
                        )}
                      </Text>
                      <View style={styles.progressRow2}>
                        {Array.from({length: item.total}).map((_, i) => {
                          if (i < item.done) {
                            // 완료한 날
                            return (
                              <View key={i} style={styles.dotChecked}>
                                <Text style={styles.dotCheckMark}>✓</Text>
                              </View>
                            );
                          }
                          if (
                            i === item.done &&
                            item.done < item.total &&
                            item.status === 'ongoing'
                          ) {
                            // 오늘 읽어야 하는 날
                            return (
                              <View key={i} style={styles.dotActive}>
                                <Text style={styles.dotActiveText}>
                                  {i + 1}
                                </Text>
                              </View>
                            );
                          }
                          // 미래(아직 읽지 않은 날)
                          return (
                            <View key={i} style={styles.dotInactive}>
                              <Text style={styles.dotInactiveText}>
                                {i + 1}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  </View>
                  {/* 버튼을 카드 하단에 위치 */}
                  {item.done < item.total && item.status === 'completed' && (
                    <TouchableOpacity
                      style={[styles.btn2, styles.btn2Retry, {marginTop: 12}]}>
                      <Text style={[styles.btn2Text, styles.btn2RetryText]}>
                        재도전하기
                      </Text>
                    </TouchableOpacity>
                  )}
                  {item.status === 'ongoing' && (
                    <TouchableOpacity
                      style={[styles.btn2, {marginTop: 12}]}
                      onPress={() =>
                        navigation.navigate('Reading', {
                          title: item.title,
                          author: item.author,
                          thumbnail: '',
                        })
                      }>
                      <Text style={styles.btn2Text}>{`${
                        item.done + 1
                      }회차 읽기`}</Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
      </ScrollView>

      {/* Popover 메뉴 */}
      {popoverPos && selectedId && (
        <>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setPopoverPos(null)}
          />
          <View
            style={{
              position: 'absolute',
              top: popoverPos.y,
              left: popoverPos.x,
              width: 140,
              backgroundColor: '#fff',
              borderRadius: 10,
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 8,
              borderWidth: 1,
              borderColor: '#EEE',
              zIndex: 100,
              paddingVertical: 4,
            }}>
            {(() => {
              const selected = challengeList.find(c => c.id === selectedId);
              return (
                <>
                  {selected && selected.status === 'ongoing' && (
                    <TouchableOpacity
                      onPress={handleGiveUp}
                      style={{paddingVertical: 12, paddingHorizontal: 16}}>
                      <Text style={{fontSize: 15, color: '#222'}}>
                        챌린지 포기하기
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={handleDelete}
                    style={{paddingVertical: 12, paddingHorizontal: 16}}>
                    <Text style={{fontSize: 15, color: '#FF6B6B'}}>삭제</Text>
                  </TouchableOpacity>
                </>
              );
            })()}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1, backgroundColor: '#FFF'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
  },
  back: {fontSize: 24, color: '#333', width: 32},
  title: {fontSize: 18, fontWeight: '600', color: '#333'},

  content: {padding: 16, backgroundColor: '#F8F9FB'},
  section: {marginBottom: 24},
  date: {fontSize: 14, color: '#888', marginBottom: 8},

  card: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6E8EB',
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: undefined,
    shadowOpacity: undefined,
    shadowRadius: undefined,
  },
  cover: {
    width: 74,
    height: 100,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginRight: 16,
    position: 'relative',
  },
  info: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: 100,
    marginLeft: 0,
  },
  topRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 2},
  infoTitle: {fontSize: 16, fontWeight: '700', color: '#222', flex: 1},
  more: {marginLeft: 8},
  badgeCorner: {
    position: 'absolute',
    top: 4,
    left: 4,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 3,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
  },
  badgeDone: {backgroundColor: '#D9F0EF'},
  badgeDoneText: {color: '#009C92', fontWeight: '700', fontSize: 12},
  badgeEnd: {backgroundColor: '#E5E5E5'},
  badgeEndText: {
    color: '#000000',
    opacity: 0.6,
    fontWeight: '700',
    fontSize: 12,
  },
  badgeDday: {flexDirection: 'row', alignItems: 'center', marginRight: 8},
  badgeDdayText: {
    color: '#00A58D',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 2,
  },
  subText2: {fontSize: 13, color: '#757575', lineHeight: 22},
  subText3: {fontSize: 15, color: '#2B4453', fontWeight: '500', marginTop: 2},
  subText3Highlight: {color: '#00A58D', fontWeight: '700'},
  progressRow2: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 12,
    justifyContent: 'flex-start',
  },
  dotChecked: {
    width: 25,
    height: 25,
    borderRadius: 16,
    backgroundColor: '#9E9E9E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  dotCheckMark: {color: '#fff', fontSize: 12, fontWeight: '600'},
  dotActive: {
    width: 25,
    height: 25,
    borderRadius: 16,
    backgroundColor: '#00B1A7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  dotActiveText: {color: '#F5F6F8', fontWeight: '600', fontSize: 12},
  dotInactive: {
    width: 25,
    height: 25,
    borderRadius: 16,
    backgroundColor: '#DBDFE4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  dotInactiveText: {color: '#F5F6F8', fontWeight: '600', fontSize: 12},
  btn2: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderColor: '#00B1A7',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: '#fff',
    alignSelf: 'center',
  },
  btn2Text: {fontSize: 14, color: '#00B1A7', fontWeight: '600'},

  badgeRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 2},

  btn2Retry: {
    borderColor: '#E0E0E0',
  },
  btn2RetryText: {
    color: '#757575',
  },
});
