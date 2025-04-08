import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated';

type Props = StackScreenProps<RootStackParamList, 'DiscoveryDetail'>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 바텀 시트 최대(위로 당겼을 때) / 최소(내렸을 때) 위치
const SHEET_MAX_TRANSLATE = SCREEN_HEIGHT * 0.2;
const SHEET_MIN_TRANSLATE = SCREEN_HEIGHT * 0.6;

const DiscoveryDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { title, author, cover, firstLine, description } = route.params;

  const translateY = useSharedValue(SHEET_MIN_TRANSLATE);

  // 제스처 (드래그) 로직
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startY: number }
  >({
    onStart: (_, ctx) => {
      ctx.startY = translateY.value;
    },
    onActive: (evt, ctx) => {
      translateY.value = ctx.startY + evt.translationY;
    },
    onEnd: () => {
      const mid = (SHEET_MAX_TRANSLATE + SHEET_MIN_TRANSLATE) / 2;
      if (translateY.value < mid) {
        translateY.value = withSpring(SHEET_MAX_TRANSLATE, { damping: 15 });
      } else {
        translateY.value = withSpring(SHEET_MIN_TRANSLATE, { damping: 15 });
      }
    },
  });

  // 시트 위치를 [SHEET_MAX_TRANSLATE, SHEET_MIN_TRANSLATE] 사이로 clamp
  const sheetStyle = useAnimatedStyle(() => {
    const clamped = Math.min(
      Math.max(translateY.value, SHEET_MAX_TRANSLATE),
      SHEET_MIN_TRANSLATE
    );
    return {
      transform: [{ translateY: clamped }],
    };
  });

  return (
    <View style={styles.container}>
      {/* 배경: 책 표지 */}
      <ImageBackground source={{ uri: cover }} style={styles.bgImage}>
        <SafeAreaView style={{ flex: 1 }}>
          {/* 닫기 버튼 (왼쪽 상단) */}
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          {/* 바텀 시트 (PanGestureHandler로 감싸서 드래그 가능) */}
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.bottomSheet, sheetStyle]}>
              {/* 핸들 바 (위쪽에 있는 회색 바) */}
              <View style={styles.handleBar} />

              {/* 제목/저자 */}
              <Text style={styles.bookTitle}>{title}</Text>
              <Text style={styles.bookAuthor}>{author}</Text>

              {/* 스크롤 영역(본문) */}
              <ScrollView style={styles.scrollArea}>
                <Text style={styles.firstLineText}>{firstLine}</Text>
                <Text style={styles.descriptionText}>{description}</Text>
                <TouchableOpacity style={styles.readButton}>
                  <Text style={styles.readButtonText}>이 책 읽기</Text>
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>
          </PanGestureHandler>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

export default DiscoveryDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  bgImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
  },
  closeButton: {
    marginLeft: 16,
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 18,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 200,
  },
  handleBar: {
    width: 72,
    height: 4,
    backgroundColor: '#9F9F9F',
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 8,
  },
  bookAuthor: {
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 8,
    opacity: 0.5,
  },
  scrollArea: {
    flex: 1, // 스크롤 영역이 남은 공간을 채우도록
    marginBottom: 12, // 버튼 위쪽 여백
  },
  firstLineText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 15,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  readButton: {
    backgroundColor: '#00A58D',
    width: 328,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  readButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
