import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {BottomTabParamList} from '../../App';
import EmptyProfile from '../assets/empty-profile.svg';
import {addDays, format} from 'date-fns';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';

import RightArrow from '../assets/right-arrow.svg';
import Logo from '../assets/logo.svg';
import EditIcon from '../assets/edit-icon.svg';

// 더미 데이터
const categories = ['에세이', '인문학', '철학'];
const historyBooks = [1, 2, 3, 4];
const finishedBooks = [1, 2];

// 오늘 기준 -3일~+3일 날짜 배열 생성
const today = new Date();
const weekDates = Array.from({length: 7}, (_, i) => {
  const date = addDays(today, i - 3);
  return format(date, 'MM/dd');
});
const todayIndex = 3; // 중앙이 오늘
const weekStats = [12, 24, 18, 62, 15, 8, 5]; // 예시 데이터, 오늘(62)이 중앙

const PROFILE_SIZE = 72;
const CAMERA_BADGE_SIZE = 24;

type Props = BottomTabScreenProps<BottomTabParamList, 'MyPage'>;

const MyPageScreen: React.FC<Props> = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [profileImage, setProfileImage] = React.useState<string | null>(null); // null이면 EmptyProfile

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>나의 서재</Text>
      </View>
      <ScrollView style={{flex: 1}}>
        {/* 프로필 영역 */}
        <View style={styles.profileSection}>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ProfileEdit')}
              style={styles.profileImageWrapper}>
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
                  <EditIcon width={16} height={16} />
                </View>
              </View>
            </TouchableOpacity>
            <Text style={styles.nickname}>닉네임</Text>
            <Text style={styles.label}>좋아하는 책</Text>
            <View style={styles.categoryRow}>
              {categories.map(cat => (
                <View key={cat} style={styles.categoryChip}>
                  <Text style={styles.categoryText}>{cat}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={{width: '100%', height: 6, backgroundColor: '#F2F3F5'}} />

        {/* 이번주 기록 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>이번주의 기록</Text>
          <View style={styles.weekRecordBox}>
            <Text style={styles.weekRecordText}>
              일주일동안 총 <Text style={{fontWeight: '600'}}>205 페이지</Text>{' '}
              읽었어요!
            </Text>
            <View style={styles.barChartRow}>
              {weekStats.map((v, i) => (
                <View key={i} style={styles.barItem}>
                  {/* 오늘 막대 위에 말풍선 */}
                  {i === todayIndex && (
                    <View style={styles.balloonContainer}>
                      <View style={styles.totalPagesBox}>
                        <Text style={styles.totalPagesText}>총 68 페이지</Text>
                      </View>
                      <View style={styles.balloonArrowOutline} />
                      <View style={styles.balloonArrow} />
                    </View>
                  )}
                  <View
                    style={[
                      styles.bar,
                      {
                        height: v * 1.2 + 20, // 높이 보정
                        backgroundColor:
                          i === todayIndex ? '#00B1A7' : '#BDBDBD',
                      },
                    ]}
                  />
                  <Text style={styles.barLabel}>{weekDates[i]}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={{width: '100%', height: 6, backgroundColor: '#F2F3F5'}} />

        {/* 히스토리 */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>히스토리</Text>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => navigation.navigate('ChallengeList')}>
              <Text style={styles.seeAll}>전체보기</Text>
              <RightArrow style={{width: 6, height: 11}} />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{marginTop: 10}}>
            {historyBooks.map((b, i) => (
              <View key={i} style={styles.bookCard}>
                <View style={styles.bookImage} />
                <Text style={styles.bookTitle}>날개</Text>
                <Text style={styles.bookAuthor}>이상</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={{width: '100%', height: 6, backgroundColor: '#F2F3F5'}} />

        {/* 완독 리스트 */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>완독 리스트</Text>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => navigation.navigate('CompleteList')}>
              <Text style={styles.seeAll}>전체보기</Text>
              <RightArrow style={{width: 6, height: 11}} />
            </TouchableOpacity>
          </View>
          <View style={styles.finishedRow}>
            {finishedBooks.map((b, i) => (
              <View key={i} style={styles.finishedCard}>
                <View style={styles.finishedBookImage} />
                <Text style={styles.finishedBookTitle}>날개</Text>
                <Text style={styles.finishedBookAuthor}>이상</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 15,
                  }}>
                  <Logo width={26} height={12} />
                  <Text style={styles.finishedDate}>2025.05.10</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyPageScreen;

const styles = StyleSheet.create({
  profileSection: {
    paddingBottom: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  editIcon: {
    position: 'absolute',
    right: -4,
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  nickname: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    color: '#1A1A1A',
    marginVertical: 20,
  },
  label: {
    color: '#757575',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 22,
    marginBottom: 6,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
  },
  categoryChip: {
    height: 34,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    color: '#1A1A1A',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 23,
    color: '#1A1A1A',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAll: {
    color: '#888',
    fontSize: 13,
  },
  weekRecordBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingTop: 12,
    paddingBottom: 20,
    marginTop: 10,
  },
  weekRecordText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 22,
    color: '#444',
    paddingLeft: 15,
  },
  barChartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 80,
    height: 100,
    paddingHorizontal: 30,
    position: 'relative',
  },
  barItem: {
    alignItems: 'center',
    width: 34,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  bar: {
    width: 28,
    backgroundColor: '#2CB1BC',
  },
  barLabel: {
    fontSize: 10,
    color: '#888',
    marginTop: 6,
    fontWeight: '500',
  },
  balloonContainer: {
    position: 'absolute',
    left: -SCREEN_WIDTH / 18,
    bottom: '100%',
    marginBottom: 20, // bar와의 gap
    alignItems: 'center',
    zIndex: 20,
  },
  totalPagesBox: {
    backgroundColor: '#FFF',
    borderRadius: 4,
    minWidth: 75,
    height: 27,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    zIndex: 21,
  },
  totalPagesText: {
    color: '#00B1A7',
    fontWeight: '600',
    fontSize: 11,
    textAlign: 'center',
    zIndex: 22,
  },
  balloonArrowOutline: {
    display: 'none',
  },
  balloonArrow: {
    display: 'none',
  },
  bookCard: {
    width: 100,
    marginRight: 10,
    alignItems: 'flex-start',
  },
  bookImage: {
    width: 100,
    height: 133,
    borderRadius: 10,
    backgroundColor: '#eee',
    marginBottom: 4,
  },
  bookTitle: {
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 22,
    color: '#1A1A1A',
    paddingLeft: 5,
  },
  bookAuthor: {
    color: '#757575',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 22,
    paddingLeft: 5,
  },
  finishedRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  finishedCard: {
    width: 161,
    borderRadius: 7,
    padding: 7,
    borderColor: '#EEEEEE',
    borderWidth: 1,
  },
  finishedBookImage: {
    width: 145,
    height: 139,
    borderRadius: 3,
    backgroundColor: '#eee',
    marginBottom: 7,
  },
  finishedBookTitle: {
    fontFamily: 'esamanru OTF',
    fontSize: 13.5,
    fontWeight: '500',
    lineHeight: 16.5,
    color: '#1A1A1A',
    marginBottom: 3,
  },
  finishedBookAuthor: {
    fontSize: 10.5,
    fontWeight: '500',
    lineHeight: 16.5,
    color: '#757575',
  },
  finishedDate: {
    color: '#BDBDBD',
    fontSize: 9,
    fontWeight: '400',
    lineHeight: 16.5,
  },
  header: {
    padding: 14,
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 23,
    color: '#1A1A1A',
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: PROFILE_SIZE,
    height: PROFILE_SIZE,
    borderRadius: PROFILE_SIZE / 2,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageBg: {
    width: PROFILE_SIZE,
    height: PROFILE_SIZE,
    borderRadius: PROFILE_SIZE / 2,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderRadius: CAMERA_BADGE_SIZE / 2,
    padding: 2,
  },
  cameraBadgeCircle: {
    width: CAMERA_BADGE_SIZE,
    height: CAMERA_BADGE_SIZE,
    borderRadius: CAMERA_BADGE_SIZE / 2,
    backgroundColor: '#BDBDBD',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
