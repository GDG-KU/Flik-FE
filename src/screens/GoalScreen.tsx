import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../App';

type GoalScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Goal'>;

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;    // (현재 예시에서는 사용하지 않고, View로 대체)
  progress: string; // 예: '6/9'
}

const BOOKS: Book[] = [
  {
    id: 1,
    title: '제로 투 원 (리커버 에디션)',
    author: '피터 틸 외 1',
    cover: 'https://example.com/donaldnorman-cover.png',
    progress: '6/9',
  },
  {
    id: 2,
    title: '제로 투 원 (리커버 에디션)',
    author: '피터 틸 외 1',
    cover: 'https://example.com/donaldnorman-cover.png',
    progress: '6/9',
  },
  {
    id: 3,
    title: '제로 투 원 (리커버 에디션)',
    author: '피터 틸 외 1',
    cover: 'https://example.com/donaldnorman-cover.png',
    progress: '6/9',
  },
  {
    id: 4,
    title: '제로 투 원 (리커버 에디션)',
    author: '피터 틸 외 1',
    cover: 'https://example.com/donaldnorman-cover.png',
    progress: '6/9',
  },
];

const GoalScreen = () => {
  const navigation = useNavigation<GoalScreenNavigationProp>();

  const handlePressBook = (book: Book) => {
    navigation.navigate('BookDetail', {
      bookId: book.id,
      title: book.title,
      author: book.author,
      cover: book.cover,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 영역 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>목표</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* “진척도 표시 영역” */}
        <View style={styles.progressArea}>
          <Text style={styles.progressAreaText}>진척도 표시 영역</Text>
        </View>

        {/* 2열 책 카드 목록 */}
        <View style={styles.booksWrapper}>
          {BOOKS.map(book => {
            // 예: '6/9' -> ratio = 6 ÷ 9 = 0.666...
            const [readCount, totalCount] = book.progress.split('/');
            const ratio =
              parseInt(readCount, 10) / parseInt(totalCount, 10) || 0;

            return (
              <TouchableOpacity
                key={book.id}
                style={styles.bookCard}
                onPress={() => handlePressBook(book)}
              >
                {/* 표지(View로 대체), 가로 162, 세로 216 */}
                <View style={styles.bookCover}>
                  {/* 진행도 배지: 표지 내부 우측 하단 */}
                  <View style={styles.progressBadge}>
                    <Text style={styles.progressBadgeText}>{book.progress}</Text>
                  </View>

                  {/* 진행도 막대 (표지 하단) */}
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {width: `${ratio * 100}%`},
                      ]}
                    />
                  </View>
                </View>

                {/* 책 제목 / 저자 영역 */}
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle} numberOfLines={1}>
                    {book.title}
                  </Text>
                  <Text style={styles.bookAuthor} numberOfLines={1}>
                    {book.author}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GoalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  /* 상단 헤더 */
  header: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  /* “진척도 표시 영역” 박스 */
  progressArea: {
    marginTop: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressAreaText: {
    fontSize: 16,
    color: '#666666',
  },
  /* 2열 책 카드 래퍼 */
  booksWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // 가로 여백/간격 조정
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  /* 각 책 카드 */
  bookCard: {
    // 고정 폭: 162 + 양옆 간격을 고려
    width: 162,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    // 그림자나 테두리가 필요하면 여기서 추가
  },
  /* 표지(이미지 대신 View) */
  bookCover: {
    width: '100%',
    height: 216,
    backgroundColor: '#00B1A7',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    position: 'relative',
    overflow: 'hidden', // Progress Bar가 둥근 모서리 안에 들어가도록
  },
  /* 진행도 배지 */
  progressBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#00B1A7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBadgeText: {
    color: '#00B1A7',
    fontSize: 12,
    fontWeight: '600',
  },
  /* 진행도 막대 (표지 하단) */
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#D9D9D9',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00B1A7',
  },
  /* 책 정보(제목, 저자) */
  bookInfo: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 12,
    color: '#888888',
  },
});
