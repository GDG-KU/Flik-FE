import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import BackButton from '../assets/back-button.svg';
import FireIcon from '../assets/fire-icon.svg';

type Props = StackScreenProps<RootStackParamList, 'DiscoveryDetail'>;

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// 바텀 시트 최대(위로 당겼을 때) / 최소(내렸을 때) 위치
const SHEET_MAX_TRANSLATE = SCREEN_HEIGHT * 0.2;
const SHEET_MIN_TRANSLATE = SCREEN_HEIGHT * 0.6;

const CHALLENGE_OPTIONS = [
  {
    key: 'week',
    label: '일주일 동안 읽기',
    challenge: true,
    desc: '하루당 6 페이지',
  },
  {
    key: 'month',
    label: '4주 동안 읽기',
    challenge: true,
    desc: '하루당 2 페이지',
  },
  {
    key: 'free',
    label: '시간 제한 없이 읽기',
    challenge: false,
    desc: '',
  },
];

const DiscoveryDetailScreen: React.FC<Props> = ({route, navigation}) => {
  const {title, author, cover, firstLine, description} = route.params;

  // 임시 mock 데이터
  const category = '소설';
  const totalPages = 410;
  const views = 253; // 예시
  // 100단위로 표기
  const viewsDisplay =
    views < 100 ? '100' : `${Math.floor(views / 100) * 100}+`;

  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState('');
  const challengeCount = 1; // 예시
  const challengeMax = 5;
  const selectedOption = CHALLENGE_OPTIONS.find(opt => opt.key === selected);

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackButton style={{marginLeft: 10}} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>상세보기</Text>
        <View style={{width: 34}} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 표지/제목/저자 */}
        <View style={styles.coverWrapper}>
          <View style={styles.bookCoverImg} />
        </View>
        <Text style={styles.bookTitle}>{title}</Text>
        <Text style={styles.bookAuthor}>{author}</Text>

        {/* 카테고리/총페이지/조회수 */}
        <View style={styles.infoRow}>
          <View style={styles.infoCell}>
            <Text style={styles.infoLabel}>카테고리</Text>
            <Text style={styles.infoValue}>소설</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoCell}>
            <Text style={styles.infoLabel}>총 페이지</Text>
            <Text style={styles.infoValue}>{totalPages}p</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoCell}>
            <Text style={styles.infoLabel}>조회수</Text>
            <Text style={styles.infoValue}>{viewsDisplay}</Text>
          </View>
        </View>

        {/* 미리보기 */}
        <Text style={styles.previewLabel}>미리보기</Text>
        <Text style={styles.previewText}>{description}</Text>
        {/* 예시용 긴 미리보기 */}
        <Text style={styles.previewText}>{description}</Text>
        <Text style={styles.previewText}>{description}</Text>
        <Text style={styles.previewText}>{description}</Text>
        <Text style={styles.previewText}>{description}</Text>
        <Text style={styles.previewText}>작품 중</Text>
      </ScrollView>

      {/* 책 읽기 플로팅 액션 버튼 (FAB) */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.fabIcon}>책 읽기</Text>
      </TouchableOpacity>

      {/* 읽기/챌린지 모달 */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            {/* 챌린지 옵션 리스트 */}
            {CHALLENGE_OPTIONS.map(opt => {
              const isSelected = selected === opt.key;
              const isChallenge = opt.challenge;
              const showDesc = isSelected && !!opt.desc && isChallenge;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    styles.challengeOption,
                    isSelected && styles.challengeOptionSelected,
                    isChallenge && styles.challengeOptionHasFire,
                    !isChallenge && styles.challengeOptionFree,
                    isSelected && isChallenge && {height: 88, padding: 0},
                  ]}
                  onPress={() => setSelected(opt.key)}
                  activeOpacity={0.8}>
                  {showDesc ? (
                    <>
                      <View style={styles.challengeRow}>
                        <Text
                          style={[
                            styles.challengeOptionText,
                            {
                              color: isSelected ? '#1A1A1A' : '#757575',
                              fontSize: 14,
                              lineHeight: 22,
                            },
                          ]}>
                          {opt.label}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: 8,
                          }}>
                          <FireIcon
                            width={18}
                            height={18}
                            style={{marginRight: 2}}
                          />
                          <Text style={styles.challengeFireText}>챌린지</Text>
                        </View>
                      </View>
                      <View style={styles.challengeDivider} />
                      <View style={styles.challengeRow}>
                        <Text style={styles.challengeDescInCell}>
                          {opt.desc}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <View style={styles.challengeRow}>
                      <Text
                        style={[
                          styles.challengeOptionText,
                          {
                            color: isSelected ? '#1A1A1A' : '#757575',
                            fontWeight: isSelected ? '700' : '600',
                            fontSize: 16,
                            lineHeight: 22,
                          },
                        ]}>
                        {opt.label}
                      </Text>
                      {isChallenge && (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: 8,
                          }}>
                          <FireIcon
                            width={18}
                            height={18}
                            style={{marginRight: 2}}
                          />
                          <Text style={styles.challengeFireText}>챌린지</Text>
                        </View>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
            {/* 챌린지 횟수 + 읽기 버튼 한 줄 */}
            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 30, marginBottom: 18,}}>
              <View style={styles.challengeCountRowInline}>
                <Text style={styles.challengeCountLabel}>챌린지 횟수 </Text>
                <Text style={styles.challengeCountValue}>
                  <Text style={{color: '#00B1A7', fontWeight: '600'}}>
                    {challengeCount}
                  </Text>
                  /{challengeMax}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.modalStartBtn,
                  !selected && styles.modalStartBtnDisabled,
                  selectedOption &&
                    selectedOption.challenge &&
                    styles.modalStartBtnChallenge,
                ]}
                disabled={!selected}
                onPress={() => selected && setModalVisible(false)}>
                <Text
                  style={[
                    styles.modalStartBtnText,
                    !selected && {color: '#fff', opacity: 0.5},
                    selectedOption &&
                      selectedOption.challenge && {fontWeight: '600'},
                  ]}>
                  {selectedOption && selectedOption.challenge
                    ? '챌린지 읽기 시작'
                    : '읽기 시작'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default DiscoveryDetailScreen;

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
    fontWeight: '500',
    color: '#1A1A1A',
    lineHeight: 23,
  },
  closeButtonText: {
    color: '#222',
    fontSize: 22,
    fontWeight: '400',
  },
  scrollContainer: {
    paddingBottom: 120,
  },
  coverWrapper: {
    marginTop: 20,
    alignItems: 'center',
  },
  bookCoverImg: {
    width: 144,
    height: 192,
    borderRadius: 10,
    backgroundColor: '#D9D9D9',
    marginBottom: 20,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    color: '#000',
    textAlign: 'center',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    lineHeight: 22,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FB',
    borderRadius: 8,
    marginHorizontal: 14,
    marginBottom: 20,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  infoCell: {
    flex: 1,
    height: 55,
    alignItems: 'center',
    gap: 10,
  },
  infoLabel: {
    fontSize: 14,
    lineHeight: 22,
    color: '#757575',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
    lineHeight: 23,
  },
  infoDivider: {
    width: 1,
    height: '60%',
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    paddingLeft: 14,
    paddingBottom: 20,
    lineHeight: 23,
  },
  previewText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    lineHeight: 22,
    marginHorizontal: 14,
    marginBottom: 8,
  },
  fabButton: {
    position: 'absolute',
    right: SCREEN_WIDTH / 13,
    bottom: 50,
    width: 331,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#00B1A7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 23,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 32,
    minHeight: 320,
  },
  modalHandle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: 18,
  },
  challengeOption: {
    height: 44,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 0,
  },
  challengeOptionSelected: {
    borderColor: '#1A1A1A',
  },
  challengeOptionHasFire: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  challengeOptionFree: {
    borderColor: '#E0E0E0',
  },
  challengeOptionText: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '600',
    flex: 1,
    lineHeight: 22,
  },
  challengeFireText: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '600',
    lineHeight: 22,
    marginLeft: 2,
  },
  challengeDescInCell: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '400',
    lineHeight: 22,
    paddingLeft: 2,
  },
  challengeCountRowInline: {
    alignItems: 'flex-start',
  },
  challengeCountLabel: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '500',
    lineHeight: 22,
    marginRight: 8,
  },
  challengeCountValue: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '600',
    lineHeight: 23,
  },
  modalStartBtn: {
    height: 50,
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#00B1A7',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  modalStartBtnDisabled: {
    backgroundColor: '#BDBDBD',
  },
  modalStartBtnChallenge: {
    backgroundColor: '#00B1A7',
  },
  modalStartBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  challengeDivider: {
    width: '95%',
    height: 1,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
  },
  challengeRow: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
});
