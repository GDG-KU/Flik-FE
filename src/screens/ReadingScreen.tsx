import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollView,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { TapGestureHandler, State as GestureState } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PAGES = [
  "첫 번째 페이지 내용\n\n좌우 스와이프 해보세요.",
  "두 번째 페이지 내용\n\n상/하단 바는 탭으로 숨기거나 표시.",
  "세 번째 페이지 내용\n\n진행 바는 현재 페이지를 반영.",
];

type Props = StackScreenProps<RootStackParamList, 'Reading'>;

const ReadingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { title: BOOK_TITLE, author: BOOK_AUTHOR, thumbnail: BOOK_THUMBNAIL } = route.params;
  const [showBars, setShowBars] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const scrollViewRef = useRef<ScrollView>(null);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentPage(pageIndex);
  };

  // ScrollView 영역에만 탭 제스처 적용 (배경 탭 시 showBars 토글)
  const onTapHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === GestureState.END) {
      setShowBars(prev => !prev);
    }
  };

  // 점선 진행바 계산
  const segmentCount = PAGES.length;
  const segmentSpacing = 4;
  const totalSpacing = segmentSpacing * (segmentCount - 1);
  const segmentWidth = (SCREEN_WIDTH - totalSpacing) / segmentCount;

  return (
    <View style={styles.container}>
      {/* ScrollView 영역을 TapGestureHandler로 감싸서 탭하면 showBars 토글 */}
      <TapGestureHandler onHandlerStateChange={onTapHandlerStateChange}>
        <View style={{ flex: 1 }}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onScrollEnd}
          >
            {PAGES.map((page, index) => (
              <View key={index} style={styles.pageContainer}>
                <Text style={styles.pageText}>{page}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </TapGestureHandler>

      {/* 진행 바 (ScrollView 위에 절대 배치) */}
      <View style={styles.progressContainer}>
        {PAGES.map((_, i) => {
          const active = i <= currentPage;
          return (
            <View
              key={i}
              style={[
                styles.segment,
                {
                  width: segmentWidth,
                  marginRight: i < segmentCount - 1 ? segmentSpacing : 0,
                },
                active
                  ? showBars
                    ? styles.segmentInactive
                    : styles.segmentActive
                  : showBars
                  ? styles.segmentActive
                  : styles.segmentInactive,
              ]}
            />
          );
        })}
      </View>

      {/* 상단 바 */}
      {showBars && (
        <View style={styles.topBar}>
          <View style={styles.topBarRow}>
            <Image source={{ uri: BOOK_THUMBNAIL }} style={styles.thumbnail} />
            <View style={styles.titleArea}>
              <Text style={styles.bookTitle}>{BOOK_TITLE}</Text>
              <Text style={styles.bookAuthor}>{BOOK_AUTHOR}</Text>
            </View>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.navigate('Main')}
            >
              <Text style={styles.menuText}>메뉴</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 하단 바 */}
      {showBars && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.bottomButton}>
            <Text style={styles.bottomButtonText}>하트</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton}>
            <Text style={styles.bottomButtonText}>스크랩</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ReadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  pageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    padding: 24,
    justifyContent: 'center',
  },
  pageText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#333',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: 'black',
    justifyContent: 'center',
    paddingTop: 50,
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  titleArea: {
    flex: 1,
  },
  bookTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bookAuthor: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 2,
  },
  menuButton: {
    padding: 8,
  },
  menuText: {
    color: '#FFF',
    fontSize: 16,
  },
  progressContainer: {
    position: 'absolute',
    top: 135,
    left: 0,
    right: 0,
    height: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  segment: {
    height: '100%',
    borderRadius: 2,
  },
  segmentActive: {
    backgroundColor: '#333',
  },
  segmentInactive: {
    backgroundColor: '#ccc',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: 50,
  },
  bottomButton: {
    padding: 8,
  },
  bottomButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});
