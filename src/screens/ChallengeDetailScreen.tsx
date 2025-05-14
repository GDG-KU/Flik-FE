// src/screens/ChallengeDetailScreen.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../App'
// ← Bare RN 이면 이 줄로 교체:
import Ionicons from 'react-native-vector-icons/Ionicons'
// ← Expo 라면 이 줄:
// import { Ionicons } from '@expo/vector-icons'

type Props = StackScreenProps<RootStackParamList, 'ChallengeDetail'>

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const COVER_SIZE = 120

export default function ChallengeDetailScreen({ route, navigation }: Props) {
  const {
    title,
    author,
    startDate,
    done,
    total,
    currentPage,
    totalPages,
    likedPages,
  } = route.params

  const [expanded, setExpanded] = useState(false)
  const cells = Array.from({ length: total }, (_, i) => i + 1)

  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>상세보기</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* 북 정보 */}
        <View style={styles.bookSection}>
          <View style={styles.coverPlaceholder} />
          <Text style={styles.bookTitle}>{title}</Text>
          <Text style={styles.bookAuthor}>{author} | 총 {totalPages}페이지</Text>

          <View style={styles.progressRow}>
            <Text style={styles.progressDate}>{startDate}</Text>
            <Text style={styles.progressText}>
              {currentPage} / {totalPages} 페이지
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(currentPage/totalPages)*100}%` },
              ]}
            />
          </View>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() =>
              navigation.navigate('Reading', {
                title, author, thumbnail: '',
              })
            }
          >
            <Text style={styles.continueText}>▶ 이어서 읽기</Text>
          </TouchableOpacity>
        </View>

        {/* 챌린지 */}
        <View style={styles.challengeSection}>
          <Text style={styles.sectionTitle}>챌린지 ({Math.ceil(total/7)}주)</Text>
          <View style={styles.challengeHeaderRow}>
            <Ionicons name="flame" size={16} color="#FF6B6B" />
            <Text style={styles.challengeSub}>
              {done < total ? `D-${total-done} 7일 안에 완독하기` : '종료'}
            </Text>
            <Text style={styles.challengeProgressSub}>
              {done} / {total} 회 독서 완료
            </Text>
          </View>
          <View style={styles.grid}>
            {(expanded ? cells : cells.slice(0,7)).map(n => {
              const isDone = n <= done
              const isCurrent = n === done+1 && done < total
              return (
                <View
                  key={n}
                  style={[
                    styles.circle,
                    isDone && styles.circleDone,
                    isCurrent && styles.circleCurrent,
                  ]}
                >
                  {isDone 
                    ? <Ionicons name="checkmark" size={12} color="#FFF" />
                    : <Text
                        style={[
                          styles.circleText,
                          isCurrent && styles.circleTextCurrent,
                        ]}
                      >
                        {n}
                      </Text>
                  }
                </View>
              )
            })}
          </View>
          <TouchableOpacity
            style={styles.expandBtn}
            onPress={() => setExpanded(v => !v)}
          >
            <Text style={styles.expandText}>
              {expanded ? '접기 ∧' : '전체보기 ∨'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 좋아한 페이지 */}
        <View style={styles.likeSection}>
          <Text style={styles.sectionTitle}>좋아한 페이지</Text>
          {likedPages.length === 0
            ? (
              <View style={styles.likeEmpty}>
                <Ionicons name="heart-outline" size={24} color="#CCC" />
                <Text style={styles.likeEmptyText}>
                  마음에 든 페이지에 좋아요를 눌러주세요
                </Text>
              </View>
            )
            : likedPages.map(lp => (
              <View key={lp.page} style={styles.likeCard}>
                <Text style={styles.likePageNum}>{lp.page}페이지</Text>
                <Text
                  style={styles.likeText}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {lp.text}
                </Text>
                <Ionicons name="heart" size={20} color="#FF6B6B" />
              </View>
            ))
          }
        </View>

        {/* 포기하기 버튼 */}
        <TouchableOpacity style={styles.giveupBtn}>
          <Text style={styles.giveupText}>챌린지 포기하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  flex: { flex:1, backgroundColor:'#FFF' },
  header: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    padding:16,
    borderBottomColor:'#EEE',
    borderBottomWidth:1,
  },
  headerTitle: { fontSize:16, fontWeight:'600', color:'#333' },
  content: { padding:16, paddingBottom:40 },

  bookSection:{ alignItems:'center', marginBottom:24 },
  coverPlaceholder:{
    width:COVER_SIZE, height:COVER_SIZE,
    backgroundColor:'#E0E0E0', borderRadius:8,
    marginBottom:12,
  },
  bookTitle:{ fontSize:18, fontWeight:'600', color:'#333' },
  bookAuthor:{ fontSize:12, color:'#888', marginBottom:16 },
  progressRow:{
    flexDirection:'row',
    justifyContent:'space-between',
    width:SCREEN_WIDTH-64,
    marginBottom:4,
  },
  progressDate:{fontSize:12, color:'#666'},
  progressText:{fontSize:12, color:'#666'},
  progressBarBg:{
    width:SCREEN_WIDTH-64,
    height:6,
    backgroundColor:'#F0F0F0',
    borderRadius:3,
    marginBottom:16,
  },
  progressBarFill:{ height:'100%', backgroundColor:'#00A58D' },
  continueButton:{
    backgroundColor:'#00A58D',
    borderRadius:8,
    paddingVertical:10,
    paddingHorizontal:24,
  },
  continueText:{ color:'#FFF', fontSize:14, fontWeight:'600' },

  challengeSection:{ marginBottom:24 },
  sectionTitle:{ fontSize:16, fontWeight:'600', color:'#333', marginBottom:8 },
  challengeHeaderRow:{ flexDirection:'row', alignItems:'center', marginBottom:12 },
  challengeSub:{ marginLeft:4, fontSize:12, color:'#666' },
  challengeProgressSub:{ marginLeft:16, fontSize:12, color:'#666' },
  grid:{ flexDirection:'row', flexWrap:'wrap', paddingVertical:8 },
  circle:{
    width:28, height:28, borderRadius:14,
    borderWidth:1, borderColor:'#E0E0E0',
    alignItems:'center', justifyContent:'center',
    margin:4,
  },
  circleDone:{ backgroundColor:'#00A58D', borderColor:'#00A58D' },
  circleCurrent:{ borderColor:'#FF6B6B' },
  circleText:{ fontSize:12, color:'#666' },
  circleTextCurrent:{ color:'#FF6B6B', fontWeight:'600' },
  expandBtn:{ alignSelf:'center', marginTop:4 },
  expandText:{ fontSize:12, color:'#888' },

  likeSection:{ marginBottom:24 },
  likeEmpty:{
    alignItems:'center',
    padding:32,
    borderWidth:1, borderColor:'#EEE',
    borderRadius:8,
  },
  likeEmptyText:{ marginTop:8, fontSize:12, color:'#CCC' },
  likeCard:{
    flexDirection:'row',
    alignItems:'center',
    padding:12,
    borderWidth:1, borderColor:'#EEE',
    borderRadius:8,
    marginBottom:12,
  },
  likePageNum:{ fontSize:12, color:'#888', width:50 },
  likeText:{ flex:1, fontSize:12, color:'#333', marginRight:8 },

  giveupBtn:{
    borderWidth:1, borderColor:'#FF6B6B',
    borderRadius:8, paddingVertical:12,
    alignItems:'center',
  },
  giveupText:{ color:'#FF6B6B', fontSize:14, fontWeight:'600' },
})
