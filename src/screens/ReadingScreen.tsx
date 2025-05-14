// src/screens/ReadingScreen.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import BackButton from '../assets/back-button.svg';
import EmptyHeart from '../assets/empty-like-button-white.svg';
import FullHeart from '../assets/liked-button.svg';
import LeftArrow from '../assets/left-arrow.svg';
import RightArrow from '../assets/right-arrow.svg';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const HEADER_HEIGHT = 150;
const FOOTER_HEIGHT = 100;

// 더미값
const totalPages = 10;
const initialPage = 0;

type Props = StackScreenProps<RootStackParamList, 'Reading'>;

export default function ReadingScreen({route, navigation}: Props) {
  const {title, author} = route.params;
  const [page, setPage] = useState(initialPage);
  const [showUI, setShowUI] = useState(false);
  const [likedPages, setLikedPages] = useState<number[]>([]);
  const [sliderWidth, setSliderWidth] = useState(0); // 슬라이더 트랙 width
  const thumbDiameter = 20;
  const movableWidth = sliderWidth - thumbDiameter;

  const goPrev = () => page > 0 && setPage(p => p - 1);
  const goNext = () => {
    if (page < totalPages - 1) setPage(p => p + 1);
    else navigation.replace('ReadingGoal', {title, author});
  };
  const toggleLike = () =>
    setLikedPages(arr =>
      arr.includes(page) ? arr.filter(x => x !== page) : [...arr, page],
    );

  // thumb 위치 계산
  const fillWidth = ((page + 1) / totalPages) * sliderWidth;
  const thumbLeft = fillWidth - thumbDiameter / 2;

  return (
    <SafeAreaView style={styles.flex}>
      {/* 1) 상단 도트 바 */}
      {!showUI && (
        <View style={styles.dotBar}>
          {Array.from({length: totalPages}).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dotSegment,
                i <= page ? styles.dotPast : styles.dotFuture,
              ]}
            />
          ))}
        </View>
      )}

      {/* 2) 헤더 */}
      {showUI && (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackButton  />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{title}</Text>
            <Text style={styles.headerSub}>{author}</Text>
          </View>
          <View />
        </View>
      )}

      {/* 3) 본문 */}
      <View style={styles.body}>
        <Text style={styles.bodyText}>
          {`(Page ${page + 1})\n\n여기에 본문 텍스트가 들어갑니다.`}
        </Text>
      </View>

      {/* 4) 하단 고정 바 (사진과 동일하게, showUI 토글) */}
      {showUI && (
        <View style={styles.bottomBarFixed}>
          <View style={styles.bottomBarRow}>
            <View style={styles.sliderMainWrap}>
              <View style={styles.sliderTopRow}>
                <Text style={styles.bottomDate}>2025.04.21</Text>
                <Text style={styles.bottomPage}>
                  {page + 1} / {totalPages} 페이지
                </Text>
              </View>
              <View style={styles.sliderTrackWrap}>
                <View
                  style={styles.sliderTrack}
                  onLayout={e => setSliderWidth(e.nativeEvent.layout.width)}>
                  <View style={[styles.sliderFill, {width: fillWidth}]} />
                  {/* 슬라이더 thumb */}
                  <View style={[styles.sliderThumb, {left: thumbLeft}]} />
                </View>
              </View>
              {/* 슬라이더와 동일한 width의 버튼 Row */}
              <View style={[styles.sliderButtonRow, {width: sliderWidth}]}>
                <TouchableOpacity style={styles.sliderBtn} onPress={goPrev}>
                  <LeftArrow width={18} height={18} />
                  <Text style={styles.sliderBtnText}>이전 챕터</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sliderBtn} onPress={goNext}>
                  <Text style={styles.sliderBtnText}>다음 챕터</Text>
                  <RightArrow width={18} height={18} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 좋아요 플로팅 버튼 (showUI 토글) */}
      {showUI && (
        <View style={styles.floatingLikeWrap}>
          <TouchableOpacity style={styles.heartBtn} onPress={toggleLike}>
            {likedPages.includes(page) ? <FullHeart /> : <EmptyHeart />}
            <Text style={styles.heartCount}>132</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 6) 3분할 터치 오버레이 (항상 렌더) */}
      <View
        style={[
          styles.touchOverlay,
          showUI
            ? {top: HEADER_HEIGHT, bottom: FOOTER_HEIGHT}
            : {top: 0, bottom: 0},
        ]}>
        {/* 이전 */}
        <TouchableOpacity style={styles.touchArea} onPress={goPrev} />
        {/* UI 토글 */}
        <TouchableOpacity
          style={styles.touchArea}
          onPress={() => setShowUI(v => !v)}
        />
        {/* 다음 */}
        <TouchableOpacity style={styles.touchArea} onPress={goNext} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1, backgroundColor: '#FFF'},

  dotBar: {
    flexDirection: 'row',
    height: 2,
    marginHorizontal: 8,
    marginTop: 8,
  },
  dotSegment: {flex: 1, marginHorizontal: 1},
  dotPast: {backgroundColor: '#666'},
  dotFuture: {backgroundColor: '#DDD'},

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
    zIndex: 300,
  },
  headerCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 22,
  },
  headerSub: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '500',
    lineHeight: 22,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingTop: 0,
  },
  bodyText: {fontSize: 18, lineHeight: 26, color: '#000', fontWeight: '400'},

  bottomBarFixed: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#E8EBED',
    paddingTop: 10,
    paddingBottom: 25,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  bottomBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bottomDate: {
    fontSize: 12,
    color: '#757575',
    opacity: 0.8,
    lineHeight: 22,
  },
  sliderMainWrap: {
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  sliderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 4,
  },
  sliderTrackWrap: {
    width: '100%',
    height: 24,
    justifyContent: 'center',
  },
  sliderTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#00B1A7',
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: 8,
  },
  sliderThumb: {
    position: 'absolute',
    top: -5.5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  bottomPage: {
    fontSize: 12,
    color: '#1A1A1A',
    opacity: 0.8,
    lineHeight: 22,
  },
  heartWrap: {
    alignItems: 'center',
    marginLeft: 12,
  },
  heartBtn: {
    width: 56,
    height: 56,
    borderRadius: 100,
    backgroundColor: '#00B1A7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  heartCount: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: '600',
    lineHeight: 16,
  },
  bottomNavRow: {
    flexDirection: 'row',
    width: 360,
    justifyContent: 'space-between',
  },
  bottomNavText: {
    fontSize: 12,
    color: '#1A1A1A',
    opacity: 0.8,
    fontWeight: '500',
    lineHeight: 22,
  },
  touchOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
  },
  touchArea: {flex: 1},

  floatingLikeWrap: {
    position: 'absolute',
    right: 23,
    bottom: 145,
    alignItems: 'center',
    zIndex: 20,
  },
  sliderButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    alignSelf: 'center',
  },
  sliderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderBtnText: {
    fontSize: 12,
    color: '#757575',
    marginHorizontal: 4,
    fontWeight: '500',
  },
});
