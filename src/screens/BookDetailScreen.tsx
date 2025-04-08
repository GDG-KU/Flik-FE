import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';

const BookDetailScreen = () => {
  // 예시: 전체 책 진행도 "6/9"
  const [progress] = useState('6/9');
  const [readCount, totalCount] = progress.split('/');
  const ratio = parseInt(readCount, 10) / parseInt(totalCount, 10) || 0;

  // 현재 며칠째 읽는 중인지 (기본값 예: 8일)
  const [currentDay, setCurrentDay] = useState(8);

  // Bottom Sheet 표시 여부
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const openBottomSheet = () => setBottomSheetVisible(true);
  const closeBottomSheet = () => setBottomSheetVisible(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>책 이름</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 표지 중앙 배치 */}
        <View style={styles.coverWrapper}>
          <View style={styles.bookCover}>
            {/* 진행도 배지 (표지 우측 하단) */}
            <View style={styles.progressBadge}>
              <Text style={styles.progressBadgeText}>{progress}</Text>
            </View>
            {/* 진행도 막대 (표지 하단) */}
            <View style={styles.progressBarContainer}>
              <View
                style={[styles.progressBarFill, {width: `${ratio * 100}%`}]}
              />
            </View>
          </View>
        </View>

        {/* 제목 & 저자 (가운데 정렬) */}
        <Text style={styles.bookTitle}>도널드 노먼의 사용자 중심 디자인</Text>
        <Text style={styles.bookAuthor}>
          피터 틸, 블레이크 매디스티 | 한국경제신문
        </Text>

        {/* 목표 관리 버튼 (오른쪽 정렬) */}
        <View style={styles.goalManageWrapper}>
          <TouchableOpacity style={styles.goalManageButton}>
            <Text style={styles.goalManageButtonText}>목표 관리</Text>
          </TouchableOpacity>
        </View>

        {/* "8일째 읽고 있어요!" (Pill 모양) + 6일 윈도우 표시 */}
        <View style={styles.weeklyContainer}>
          <TouchableOpacity
            onPress={openBottomSheet}
            style={styles.currentDayPill}>
            <Text style={styles.currentDayPillText}>
              {currentDay}일째 읽고 있어요!
            </Text>
            {/* 한 줄(6개)만 표시, currentDay가 포함된 범위 */}
            <View style={styles.weekCircles}>
              {renderSingleRow(currentDay, setCurrentDay)}
            </View>
          </TouchableOpacity>
        </View>

        {/* 하단 기타 정보 (예시) */}
        <View style={styles.bottomInfoContainer}>
          <Text style={styles.bottomInfoText}>
            해당 도서에서 저장한 페이지가 없습니다
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Sheet (1~29 동그라미 + 'box') */}
      <Modal
        visible={bottomSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={closeBottomSheet}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeBottomSheet}
        />
        <View style={styles.bottomSheet}>
          {/* 왼쪽 정렬 */}
          <Text style={styles.bottomSheetTitle}>
            {currentDay}일째 읽고 있어요!
          </Text>

          <View style={styles.dayCirclesContainer}>
            {renderDayCircles(currentDay, setCurrentDay)}
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeBottomSheet}>
            <Text style={styles.closeButtonText}>완료</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

/**
 * 주 화면: 6개짜리 윈도우를 구해 currentDay를 포함한 범위를 표시
 * 예) currentDay=2 => 1..6, currentDay=10 => 7..12
 * 각 day가 currentDay 이하이면 초록색+체크, 그렇지 않으면 숫자
 */
function renderSingleRow(
  currentDay: number,
  setCurrentDay: (day: number) => void,
) {
  const days = getDaysInWindow(currentDay); // 6일 범위
  return days.map(day => {
    if (day <= currentDay) {
      // 초록색+체크
      return (
        <TouchableOpacity
          key={day}
          style={[styles.dayCircle, styles.dayCircleCompleted]}
          onPress={() => setCurrentDay(day)}>
          <Text style={styles.checkMark}>✓</Text>
        </TouchableOpacity>
      );
    } else {
      // 숫자
      return (
        <TouchableOpacity
          key={day}
          style={styles.dayCircle}
          onPress={() => setCurrentDay(day)}>
          <Text style={styles.dayCircleText}>{day}</Text>
        </TouchableOpacity>
      );
    }
  });
}

/**
 * Bottom Sheet: 1~29 + 'box'
 *  - currentDay 이하 => 초록색+체크
 *  - currentDay 초과 => 숫자
 *  - 'box' => 상자 모양
 */
function renderDayCircles(
  currentDay: number,
  setCurrentDay: (day: number) => void,
) {
  const numberArray = Array.from({length: 29}, (_, i) => i + 1);
  const items: (number | string)[] = [...numberArray, 'box'];

  return items.map(item => {
    if (item === 'box') {
      return (
        <View style={styles.dayCircle} key="box">
          <View style={styles.boxShape} />
        </View>
      );
    } else {
      const dayNumber = item as number;
      if (dayNumber <= currentDay) {
        return (
          <TouchableOpacity
            key={dayNumber}
            style={[styles.dayCircle, styles.dayCircleCompleted]}
            onPress={() => setCurrentDay(dayNumber)}>
            <Text style={styles.checkMark}>✓</Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            key={dayNumber}
            style={styles.dayCircle}
            onPress={() => setCurrentDay(dayNumber)}>
            <Text style={styles.dayCircleText}>{dayNumber}</Text>
          </TouchableOpacity>
        );
      }
    }
  });
}

/**
 * getDaysInWindow:
 *  currentDay가 포함된 6일 범위를 계산.
 *  예) currentDay=2 => 1..6, currentDay=10 => 7..12
 *  - start = currentDay - 3
 *  - end = start + 5 (총 6일)
 *  - 범위 밖이면 1..30 범위 내로 조정
 */
function getDaysInWindow(currentDay: number): number[] {
  let start = currentDay - 3;
  if (start < 1) {
    start = 1;
  }
  let end = start + 5; // 6개
  if (end > 30) {
    end = 30;
    start = end - 5; // 다시 6개 범위 보장
  }

  const days = [];
  for (let i = start; i <= end; i++) {
    days.push(i);
  }
  return days;
}

export default BookDetailScreen;

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
    paddingBottom: 40,
  },
  /* 표지 중앙 배치 */
  coverWrapper: {
    marginTop: 16,
    alignItems: 'center',
  },
  bookCover: {
    width: 162,
    height: 216,
    borderRadius: 12,
    backgroundColor: '#00B1A7',
    position: 'relative',
    overflow: 'hidden',
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

  /* 책 제목 & 저자 */
  bookTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  bookAuthor: {
    marginTop: 4,
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },

  /* 목표 관리 버튼 (오른쪽 정렬) */
  goalManageWrapper: {
    marginTop: 12,
    paddingHorizontal: 16,
    alignItems: 'flex-end',
  },
  goalManageButton: {
    backgroundColor: '#00B1A7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  goalManageButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  /* "8일째 읽고 있어요!" + 6개 윈도우 */
  weeklyContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  currentDayPill: {
    backgroundColor: '#E6F7F7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  currentDayPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00B1A7',
  },
  weekCircles: {
    flexDirection: 'row',
  },

  /* 하단 정보 */
  bottomInfoContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  bottomInfoText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },

  /* Bottom Sheet */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  bottomSheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333333',
    alignSelf: 'flex-start', // 왼쪽 정렬
  },
  dayCirclesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  /* 공통 동그라미 스타일 */
  dayCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
  },
  /* 완료된(현재일 이하) 동그라미: 초록색 배경 + 체크 */
  dayCircleCompleted: {
    backgroundColor: '#00B1A7',
    borderColor: '#00B1A7',
  },
  dayCircleText: {
    fontSize: 14,
    color: '#666666',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#00B1A7',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  /* 상자 모양 아이콘 (예시) */
  boxShape: {
    width: 16,
    height: 16,
    backgroundColor: '#00B1A7',
  },
});
