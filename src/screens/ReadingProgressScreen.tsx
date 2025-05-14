import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import BackButton from '../assets/back-button.svg';
// @ts-ignore: 타입 선언이 없을 수 있음
import {Calendar, LocaleConfig} from 'react-native-calendars';
// @ts-ignore: 타입 선언이 없을 수 있음
import {Picker} from '@react-native-picker/picker';

// Locale 설정 (한국어)
LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

const books = [
  {
    id: '1',
    title: '날개',
    author: '이상',
    cover: '', // 이미지 준비중
    read: 32,
    total: 32,
    logs: ['2025-05-01', '2025-05-08', '2025-05-12', '2025-05-14'],
  },
  {
    id: '2',
    title: '도널드 노먼의 사용자 중심 디자인',
    author: '도널드 노먼',
    cover: 'https://image.yes24.com/goods/23456789/XL',
    read: 6,
    total: 9,
    logs: [
      '2025-05-02',
      '2025-05-05',
      '2025-05-08',
      '2025-05-15',
      '2025-05-20',
    ],
  },
];

const today = new Date();
const todayStr = `${today.getFullYear()}-${String(
  today.getMonth() + 1,
).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

type Props = StackScreenProps<RootStackParamList, 'ReadingProgress'>;

export default function ReadingProgressScreen({route, navigation}: Props) {
  const [selected, setSelected] = useState(todayStr);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [showPicker, setShowPicker] = useState(false);
  const [tempYear, setTempYear] = useState(year);
  const [tempMonth, setTempMonth] = useState(month);

  const openPicker = () => {
    setTempYear(year);
    setTempMonth(month);
    setShowPicker(true);
  };

  // markedDates 타입 명시
  const markedDates: {[date: string]: any} = {};
  for (let b of books) {
    for (let d of b.logs) {
      if (!markedDates[d]) markedDates[d] = {dots: []};
      markedDates[d].dots.push({
        color: b.read === b.total ? '#00A58D' : '#E0E0E0',
      });
    }
  }
  // 모든 날짜의 selected 마킹 제거
  Object.keys(markedDates).forEach(date => {
    delete markedDates[date].selected;
    delete markedDates[date].selectedColor;
    delete markedDates[date].selectedTextColor;
  });
  // 오직 selected에만 마킹
  markedDates[selected] = {
    ...(markedDates[selected] || {}),
    selected: true,
    selectedColor: '#111',
    selectedTextColor: '#fff',
    dots: markedDates[selected]?.dots || [],
  };

  // 년/월 선택용 데이터
  const years = [year - 2, year - 1, year, year + 1];

  // 선택한 날짜의 독서 활동
  const booksForSelectedDay = books.filter(b => b.logs.includes(selected));

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackButton />
        </TouchableOpacity>
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity onPress={openPicker}>
            <Text style={styles.title}>
              {year}년 {month}월 ▾
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{width: 32}} />
      </View>
      {/* 년/월 선택 Picker */}
      <Modal visible={showPicker} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowPicker(false)}
        />
        <View style={styles.pickerModal}>
          <View style={styles.pickerRow}>
            <Picker
              selectedValue={tempYear}
              onValueChange={(v: number) => setTempYear(v)}
              style={{flex: 1}}>
              {years.map(y => (
                <Picker.Item key={y} label={`${y}년`} value={y} />
              ))}
            </Picker>
            <Picker
              selectedValue={tempMonth}
              onValueChange={(v: number) => setTempMonth(v)}
              style={{flex: 1}}>
              {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                <Picker.Item key={m} label={`${m}월`} value={m} />
              ))}
            </Picker>
          </View>
          <TouchableOpacity
            style={styles.pickerDoneBtn}
            onPress={() => {
              setShowPicker(false);
              setYear(tempYear);
              setMonth(tempMonth);
              setSelected(
                `${tempYear}-${String(tempMonth).padStart(2, '0')}-01`,
              );
            }}>
            <Text style={styles.pickerDoneText}>확인</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <ScrollView contentContainerStyle={styles.content}>
        {/* 달력 */}
        <Calendar
          key={`${year}-${month}`}
          current={`${year}-${String(month).padStart(2, '0')}-01`}
          markedDates={markedDates}
          markingType={'multi-dot'}
          onDayPress={(day: {dateString: string}) =>
            setSelected(day.dateString)
          }
          theme={{
            backgroundColor: '#FFF',
            calendarBackground: '#FFF',
            textSectionTitleColor: '#B0B0B0',
            textDayFontSize: 16,
            textDayHeaderFontSize: 16,
            textDayHeaderFontWeight: '500',
            textDayFontWeight: '400',
            textMonthFontSize: 0,
            arrowColor: '#222',
            monthTextColor: '#222',
            textDisabledColor: '#E0E0E0',
            dotColor: '#00A58D',
            selectedDotColor: '#fff',
            'stylesheet.calendar.header': {
              week: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 0,
                marginTop: 6,
              },
            },
          }}
          hideExtraDays
          renderArrow={(direction: 'left' | 'right') => null}
          onMonthChange={(d: {year: number; month: number}) => {
            setYear(d.year);
            setMonth(d.month);
          }}
          firstDay={0}
          enableSwipeMonths
        />
        {/* 독서 활동 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>독서 활동</Text>
          {(booksForSelectedDay.length > 0 ? booksForSelectedDay : books).map(
            book => {
              const ratio = book.read / book.total;
              const isDone = ratio === 1;
              const percent = Math.round(ratio * 100);
              return (
                <View key={book.id} style={styles.activity}>
                  {book.cover ? (
                    <Image source={{uri: book.cover}} style={styles.actCover} />
                  ) : (
                    <View
                      style={[
                        styles.actCover,
                        {
                          backgroundColor: '#F5F5F5',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                      ]}>
                      <Text style={{color: '#CCC', fontSize: 12}}>
                        이미지{`\n`}준비중
                      </Text>
                    </View>
                  )}
                  <View style={styles.actInfo}>
                    <View style={styles.actTitleRow}>
                      <Text style={styles.actTitle}>{book.title}</Text>
                      {isDone && <Text style={styles.actDone}>완독✓</Text>}
                    </View>
                    <Text style={styles.actSub}>
                      {book.author} | {book.read}/{book.total} 페이지 읽음
                    </Text>
                    <View style={styles.progressRowCustom}>
                      <View style={styles.actBarBgCustom}>
                        <View
                          style={[
                            styles.actBarFillCustom,
                            {
                              width: `${percent}%`,
                              backgroundColor: isDone ? '#00A58D' : '#E0E0E0',
                            },
                          ]}
                        />
                      </View>
                      <Text style={[styles.percentText]}>{percent}%</Text>
                    </View>
                  </View>
                </View>
              );
            },
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 10,
    backgroundColor: '#FFF',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
    textAlign: 'center',
  },
  content: {paddingHorizontal: 18, paddingBottom: 24},
  pickerModal: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    zIndex: 20,
  },
  pickerDoneBtn: {
    backgroundColor: '#00A58D',
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 4,
    alignItems: 'center',
  },
  pickerDoneText: {color: '#fff', fontWeight: '600', fontSize: 16},
  modalOverlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.4)'},
  section: {marginTop: 18},
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    lineHeight: 23,
    marginBottom: 10,
  },
  activity: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 70,
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  actCover: {
    width: 48,
    height: 68,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: 12,
  },
  actInfo: {flex: 1},
  actTitle: {fontSize: 14, fontWeight: '500', color: '#1A1A1A', opacity: 0.8},
  actSub: {fontSize: 12, color: '#757575', marginTop: 4},
  actBarBgCustom: {
    flex: 1,
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    marginRight: 8,
  },
  actBarFillCustom: {
    height: '100%',
    backgroundColor: '#00A58D',
    borderRadius: 3,
  },
  actDone: {fontSize: 12, color: '#BDBDBD', fontWeight: '600', marginLeft: 8},
  actTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressRowCustom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  percentText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 8,
    minWidth: 36,
    lineHeight: 22,
    textAlign: 'right',
  },
});
