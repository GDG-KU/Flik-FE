// src/screens/ReadingGoalScreen.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import CheckIcon from '../assets/check-circle.svg';
import Confetti from '../assets/confetti.svg';
import FireIcon from '../assets/fire-icon.svg';
import BackButton from '../assets/back-button.svg';

const {width: W} = Dimensions.get('window');

type Props = StackScreenProps<RootStackParamList, 'ReadingGoal'>;

// 예시 데이터 (실제 데이터로 교체)
const totalPages = 37;
const prevPages = 14;
const recentPages = 7;
const currentPages = prevPages + recentPages; // 21
const recentPercent = recentPages / totalPages;
const prevPercent = prevPages / totalPages;
const currentPercent = currentPages / totalPages;

const totalChallenge = 7;
const prevChallenge = 5; // 완료
const recentChallenge = 1; // 방금 읽은 일차

export default function ReadingGoalScreen({route, navigation}: Props) {
  const {title, author} = route.params;
  const recentPages = 7;
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const bubbleWidth = 80;
  const currentPages = prevPages + recentPages;
  const recentPercent = recentPages / totalPages;
  const prevPercent = prevPages / totalPages;
  const currentPercent = currentPages / totalPages;
  const bubbleLeft = progressBarWidth
    ? (prevPercent + recentPercent) * progressBarWidth - bubbleWidth / 2
    : 0;

  return (
    <SafeAreaView style={g.flex}>
      <View style={g.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{marginLeft: 10, marginRight: 8, width: 40, alignItems: 'flex-start'}}>
          <BackButton />
        </TouchableOpacity>
        <View style={{alignItems: 'center', flex: 1, gap: 5}}>
          <Text style={g.bookTitle}>{title}</Text>
          <Text style={g.bookAuthor}>{author}</Text>
        </View>
        <View style={{width: 40, marginLeft: 8}} />
      </View>

      <View style={g.celebrateWrap}>
        <View style={g.confettiWrap}>
          <Confetti />
          <CheckIcon style={g.checkSolid} />
        </View>
      </View>

      <Text style={g.goalTitle}>오늘 목표 달성!</Text>
      <Text style={g.goalSub}>오늘도 한 걸음 전진!</Text>
      <Text style={g.goalSub2}>
        앞으로 <Text style={g.goalSub2Em}>4챕터</Text>만 더 읽으면 완독이에요{' '}
        <Text style={{fontSize: 16}}>📚✨</Text>
      </Text>

      <View style={g.card}>
        <View style={g.cardLabelRow}>
          <Text style={g.cardLabel}>독서 진행량</Text>
        </View>
        <View
          style={g.progressBarBg}
          onLayout={e => setProgressBarWidth(e.nativeEvent.layout.width)}>
          <View style={[g.progressBarFill, {width: `${prevPercent * 100}%`}]} />
          <View
            style={[
              g.progressBarRecent,
              {left: `${prevPercent * 100}%`, width: `${recentPercent * 100}%`},
            ]}
          />
          {recentPages > 0 && progressBarWidth > 0 && (
            <View
              style={[
                g.bubbleWrap,
                {
                  left: bubbleLeft,
                },
              ]}>
              <View style={g.bubbleBox}>
                <Text style={g.bubbleText}>
                  <Text style={g.bubbleNum}>+{recentPages}</Text> 페이지
                </Text>
              </View>
              <View style={g.bubbleTail} />
            </View>
          )}
        </View>
        <View style={g.progressBarInfoRow}>
          <Text style={g.cardDate}>2025.04.21</Text>
          <Text style={g.cardPage}>
            {currentPages} / {totalPages} 페이지
          </Text>
        </View>
      </View>

      <View style={g.card}>
        <Text style={g.cardLabel}>챌린지</Text>
        <View
          style={{
            marginTop: 4,
            flexDirection: 'row',
            gap: 4,
            alignItems: 'center',
          }}>
          <FireIcon />
          <Text
            style={{
              marginRight: 4,
              fontSize: 12,
              lineHeight: 22,
              color: '#00B1A7',
              opacity: 0.8,
            }}>
            D-2
          </Text>
          <Text style={g.challengeSub}>7일 안에 완독하기</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 22,
              color: '#00B1A7',
              opacity: 0.8,
              marginRight: 3,
            }}>
            {prevChallenge + recentChallenge}회차
          </Text>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 22,
              color: '#2B4453',
              opacity: 0.8,
            }}>
            완료!
          </Text>
        </View>
        <View style={g.progressRow}>
          {Array.from({length: totalChallenge}).map((_, i) => {
            if (i < prevChallenge) {
              return (
                <View key={i} style={[g.dot, g.dotPrevDone]}>
                  <Text style={g.dotCheck}>✓</Text>
                </View>
              );
            } else if (i === prevChallenge) {
              return (
                <View key={i} style={[g.dot, g.dotRecentDone]}>
                  <Text style={g.dotCheck}>✓</Text>
                </View>
              );
            } else {
              return (
                <View key={i} style={[g.dot, g.dotEmpty]}>
                  <Text style={g.dotNum}>{i + 1}</Text>
                </View>
              );
            }
          })}
        </View>
      </View>

      <View style={g.btnRow}>
        <TouchableOpacity
          style={[g.btn, g.btnGray]}
          onPress={() => navigation.goBack()}>
          <Text style={g.btnGrayText}>닫기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={g.btn}
          onPress={() => {
            navigation.replace('Reading', {
              title,
              author: route.params.author,
              thumbnail: '',
            });
          }}>
          <Text style={g.btnText}>다음 챕터 읽기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const g = StyleSheet.create({
  flex: {flex: 1, backgroundColor: '#FFF', alignItems: 'center'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 30,
    paddingHorizontal: 0,
    justifyContent: 'flex-start',
  },
  bookTitle: {fontSize: 15, fontWeight: '600', color: '#222'},
  bookAuthor: {fontSize: 12, color: '#BDBDBD', marginTop: 2},

  celebrateWrap: {
    marginTop: 10,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confettiWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    alignSelf: 'center',
  },
  checkSolid: {
    position: 'absolute',
    left: W / 4,
    top: '25%',
    // transform: [{translateX: -85}, {translateY: -35}], // 48/2
  },
  goalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 32,
  },
  goalSub: {fontSize: 14, color: '#000', textAlign: 'center', marginTop: 10},
  goalSub2: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    marginBottom: 42,
  },
  goalSub2Em: {color: '#00B1A7'},

  card: {
    width: W - 28,
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 18,
    borderColor: '#EEEEEE',
    borderWidth: 1,
  },
  cardLabel: {fontSize: 14, fontWeight: '600', lineHeight: 22, color: '#000'},
  cardLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#FFF',
    borderRadius: 4,
    overflow: 'visible',
    marginBottom: 10,
    marginTop: 20,
  },
  progressBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#00B1A799',
    borderRadius: 4,
    height: 6,
    zIndex: 1,
  },
  progressBarRecent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: '#7359F2',
    borderRadius: 4,
    height: 6,
    zIndex: 2,
  },
  progressBarInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  cardDate: {fontSize: 12, color: '#757575', opacity: 0.8, lineHeight: 22},
  cardPage: {fontSize: 12, color: '#757575', opacity: 0.8, lineHeight: 22},

  challengeSub: {fontSize: 12, color: '#757575', opacity: 0.8, lineHeight: 22},
  progressRow: {flexDirection: 'row', marginTop: 12, justifyContent: 'space-around', width: '100%'},
  dot: {
    width: 30,
    height: 30,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotPrevDone: {backgroundColor: '#9E9E9E'},
  dotRecentDone: {backgroundColor: '#00B1A7'},
  dotEmpty: {backgroundColor: '#DBDFE4'},
  dotCheck: {color: '#FFF', fontSize: 16, fontWeight: '600'},
  dotNum: {color: '#F5F6F8', fontSize: 16, fontWeight: '600'},

  btnRow: {flexDirection: 'row', marginTop: 75, justifyContent: 'center'},
  btn: {
    height: 50,
    width: 232,
    backgroundColor: '#00B1A7',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  btnGray: {
    width: 90,
    backgroundColor: '#FFF',
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  btnText: {color: '#FFF', fontSize: 16, fontWeight: '600'},
  btnGrayText: {color: '#757575', fontSize: 16, fontWeight: '600'},

  bubbleWrap: {
    position: 'absolute',
    top: -38,
    width: 80,
    alignItems: 'center',
    zIndex: 10,
  },
  bubbleBox: {
    width: 60,
    height: 30,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 7,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleText: {
    fontSize: 11,
    color: '#1E1E2A',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 16,
  },
  bubbleNum: {
    color: '#7359F2',
    fontWeight: '700',
    lineHeight: 16,
  },
  bubbleTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFF',
    alignSelf: 'center',
    marginTop: -3,
  },
});
