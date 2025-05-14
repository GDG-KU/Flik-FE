import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import BackButton from '../assets/back-button.svg';
import MoreButton from '../assets/more-button.svg';
import LikedButton from '../assets/liked-button.svg';
import FireIcon from '../assets/fire-icon.svg';
import EmptyLikeButton from '../assets/empty-like-button.svg';

const mockBook = {
  cover: 'https://image.yes24.com/goods/12345678/XL', // 임시 이미지
  title: '날개',
  author: '이상',
  totalPages: 200,
  currentPage: 123,
  date: '2025.04.21',
};

const mockChallenge = {
  dDay: 23,
  goal: '4주 안에 완독하기',
  totalReads: 28,
  currentReads: 5,
};

const mockLikedPages = [
  {page: 8, text: '박제가 되어버린 천재를 아시오?'},
  {
    page: 16,
    text: '나는 내 자신에게 한없는 애정을 느끼면서, 한없이 나를 학대하였다. 나는 내 자신에게 한없는 애정을 느끼면서, 한없이 나를 학...',
  },
  {page: 10, text: '우하하하'},
];

type Props = StackScreenProps<RootStackParamList, 'BookDetail'>;

export default function BookDetailScreen({route, navigation}: Props) {
  const {title, author, cover} = route.params;
  // 임시 데이터(페이지, 날짜 등은 mockBook에서 유지)
  const mockBook = {
    cover: cover || 'https://image.yes24.com/goods/12345678/XL',
    title: title,
    author: author,
    totalPages: 200,
    currentPage: 123,
    date: '2025.04.21',
  };
  const [progress] = useState(`${mockBook.currentPage}/${mockBook.totalPages}`);
  const ratio = mockBook.currentPage / mockBook.totalPages;
  const [showAll, setShowAll] = useState(false);
  const totalRounds = mockChallenge.totalReads;
  const currentRound = mockChallenge.currentReads;
  const rounds = Array.from({length: totalRounds}, (_, i) => i + 1);
  const roundsToShow = showAll ? rounds : rounds.slice(0, 7);

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackButton />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>상세보기</Text>
        <TouchableOpacity>
          <MoreButton />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 표지 */}
        <View style={styles.coverWrapper}>
          <Image source={{uri: mockBook.cover}} style={styles.bookCoverImg} />
        </View>
        {/* 제목 */}
        <Text style={styles.bookTitle}>{mockBook.title}</Text>
        {/* 저자, 총 페이지 */}
        <Text style={styles.bookAuthor}>
          {mockBook.author} | 총 {mockBook.totalPages} 페이지
        </Text>
        {/* 날짜, 진행 바 */}
        <View
          style={{
            width: 332,
            height: 62,
            marginTop: 12,
            borderRadius: 10,
            alignSelf: 'center',
            backgroundColor: '#F8F9FB',
            justifyContent: 'center',
            marginBottom: 12,
          }}>
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBarFill, {width: `${ratio * 100}%`}]}
            />
          </View>
          <View style={styles.progressRow}>
            <Text style={styles.progressDate}>{mockBook.date}</Text>
            <Text style={styles.progressPage}>
              {mockBook.currentPage} / {mockBook.totalPages} 페이지
            </Text>
          </View>
        </View>
        {/* 이어서 읽기 버튼 */}
        <TouchableOpacity
          style={styles.readButton}
          onPress={() =>
            navigation.navigate('Reading', {
              title: mockBook.title,
              author: mockBook.author,
              thumbnail: mockBook.cover,
            })
          }>
          <Text style={styles.readButtonText}>▶ 이어서 읽기</Text>
        </TouchableOpacity>
        <View style={{backgroundColor: '#F8F9FB'}}>
          <View style={styles.challengeCardCustom}>
            <Text style={styles.challengeTitleCustom}>챌린지</Text>
            <View style={styles.challengeRowCustom}>
              <FireIcon width={18} height={18} />
              <Text style={styles.challengeDDayCustom}>
                D-{mockChallenge.dDay}
              </Text>
              <Text style={styles.challengeGoalCustom}>
                {mockChallenge.goal}
              </Text>
            </View>
            <Text style={styles.challengeProgressCustom}>
              <Text style={styles.challengeProgressNumCustom}>
                {currentRound}
              </Text>{' '}
              / {totalRounds} 회 독서 완료
            </Text>
            <View style={styles.challengeCirclesGridCustom}>
              {Array.from({length: showAll ? 4 : 1}).map((_, rowIdx) => (
                <View key={rowIdx} style={styles.challengeCirclesRowCustom}>
                  {rounds.slice(rowIdx * 7, rowIdx * 7 + 7).map(n => {
                    if (n < currentRound) {
                      return (
                        <View key={n} style={styles.challengeCircleDoneCustom}>
                          <Text style={styles.challengeCheckCustom}>✓</Text>
                        </View>
                      );
                    } else if (n === currentRound) {
                      return (
                        <View
                          key={n}
                          style={styles.challengeCircleCurrentCustom}>
                          <Text style={styles.challengeCurrentNumCustom}>
                            {n}
                          </Text>
                        </View>
                      );
                    } else {
                      return (
                        <View
                          key={n}
                          style={styles.challengeCircleFutureCustom}>
                          <Text style={styles.challengeFutureNumCustom}>
                            {n}
                          </Text>
                        </View>
                      );
                    }
                  })}
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={styles.challengeShowAllBtnCustom}
              onPress={() => setShowAll(v => !v)}>
              <Text style={styles.challengeShowAllTextCustom}>
                {showAll ? '접기 ∧' : '전체보기 ∨'}
              </Text>
            </TouchableOpacity>
          </View>
          {/* 좋아요한 페이지 */}
          <View style={styles.likedPagesRow}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <EmptyLikeButton />
              <Text style={styles.likedPagesTitle}>좋아요한 페이지</Text>
            </View>
            <Text style={styles.likedPagesCount}>
              총 {mockLikedPages.length} 페이지
            </Text>
          </View>
          <View style={styles.likedPagesCardsGrid}>
            {mockLikedPages.map((item, idx) => (
              <View key={idx} style={styles.likedPageCardGrid}>
                <View style={styles.likedPageCardHeader}>
                  <Text style={styles.likedPageCardPage}>
                    {item.page} 페이지
                  </Text>
                  <LikedButton />
                </View>
                <Text style={styles.likedPageCardText}>{item.text}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.challengeGiveupBtn}>
            <Text style={styles.challengeGiveupBtnText}>챌린지 포기하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    borderBottomWidth: 0,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  coverWrapper: {
    marginTop: 10,
    alignItems: 'center',
  },
  bookCoverImg: {
    width: 144,
    height: 192,
    borderRadius: 10,
    marginBottom: 20,
  },
  bookTitle: {
    height: 56,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    color: '#000',
    textAlign: 'center',
  },
  bookAuthor: {
    fontSize: 14,
    lineHeight: 22,
    color: '#757575',
    textAlign: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginHorizontal: 15,
  },
  progressDate: {
    fontSize: 12,
    color: '#757575',
    opacity: 0.8,
    lineHeight: 22,
  },
  progressPage: {
    fontSize: 12,
    color: '#1A1A1A',
    opacity: 0.8,
    lineHeight: 22,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E6E6E6',
    borderRadius: 4,
    marginHorizontal: 32,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00B1A7',
    borderRadius: 4,
  },
  readButton: {
    height: 44,
    width: 332,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#00B1A7',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  readButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
    lineHeight: 22,
  },
  challengeCardCustom: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F0F1F3',
  },
  challengeTitleCustom: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    lineHeight: 22,
    marginBottom: 4,
  },
  challengeRowCustom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  challengeDDayCustom: {
    color: '#00B1A7',
    fontWeight: '500',
    marginLeft: 4,
    marginRight: 8,
    fontSize: 12,
    opacity: 0.8,
  },
  challengeGoalCustom: {
    color: '#757575',
    fontSize: 12,
    opacity: 0.8,
    lineHeight: 22,
  },
  challengeProgressCustom: {
    fontSize: 12,
    color: '#2B4453',
    opacity: 0.8,
    lineHeight: 22,
  },
  challengeProgressNumCustom: {
    color: '#00B1A7',
  },
  challengeCirclesGridCustom: {
    marginTop: 10,
    marginBottom: 10,
    gap: 5,
  },
  challengeCirclesRowCustom: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    marginBottom: 10,
  },
  challengeCircleDoneCustom: {
    width: 27,
    height: 27,
    borderRadius: 160,
    backgroundColor: '#9E9E9E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeCheckCustom: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  challengeCircleCurrentCustom: {
    width: 27,
    height: 27,
    borderRadius: 160,
    backgroundColor: '#00B1A7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeCurrentNumCustom: {
    color: '#F5F6F8',
    fontWeight: '600',
    fontSize: 16,
  },
  challengeCircleFutureCustom: {
    width: 27,
    height: 27,
    borderRadius: 160,
    backgroundColor: '#DBDFE4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeFutureNumCustom: {
    color: '#F5F6F8',
    fontWeight: '600',
    fontSize: 16,
  },
  challengeShowAllBtnCustom: {
    alignSelf: 'center',
    marginTop: 2,
  },
  challengeShowAllTextCustom: {
    color: '#757575',
    opacity: 0.8,
    fontSize: 12,
    marginTop: 2,
  },
  likedPagesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 23,
    marginBottom: 7,
    marginTop: 14,
  },
  likedPagesTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1A1A1A',
    opacity: 0.8,
    marginLeft: 4,
  },
  likedPagesCount: {
    fontSize: 12,
    color: '#757575',
    opacity: 0.8,
  },
  likedPagesCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  likedPageCardGrid: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderColor: '#EEEEEE',
    borderWidth: 1,
    padding: 12,
    width: '48%',
    height: 175,
    marginBottom: 12,
  },
  likedPageCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  likedPageCardPage: {
    fontSize: 12,
    fontWeight: '400',
    color: '#757575',
    opacity: 0.8,
    lineHeight: 22,
  },
  likedPageCardText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#000',
  },
  challengeGiveupBtn: {
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 32,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F7F7F7',
  },
  challengeGiveupBtnText: {
    color: '#BDBDBD',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 22,
  },
});
