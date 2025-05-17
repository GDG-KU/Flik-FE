import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import BackButton from '../assets/back-button.svg';

const BOOK_CATEGORIES = [
  '소설',
  '시',
  '에세이',
  '인문학',
  '철학',
  '디자인',
  '역사',
  '과학',
  '로맨스',
  '판타지',
];

type Props = StackScreenProps<RootStackParamList, 'PreferSetup'>;

const PreferSetupScreen: React.FC<Props> = ({navigation}) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCategory = (cat: string) => {
    setSelected(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat],
    );
  };

  const handleNext = () => {
    navigation.navigate('SignUpDone');
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackButton />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>회원가입</Text>
          <View style={{width: 24}} />
        </View>
        <Text style={styles.title}>
          좋아하는 책의 종류를 선택해보세요{'\n'}맞춤 도서를 추천해드릴게요
        </Text>
        <Text style={styles.label}>좋아하는 책 종류</Text>
        <View style={styles.chipRow}>
          {BOOK_CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, selected.includes(cat) && styles.chipActive]}
              onPress={() => toggleCategory(cat)}>
              <Text
                style={[
                  styles.chipText,
                  selected.includes(cat) && styles.chipTextActive,
                ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{flex: 1}} />
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}>
            <Text style={styles.cancelBtnText}>이전</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>가입하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginTop: 20,
    marginBottom: 30,
  },
  label: {
    color: '#757575',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 18,
    marginBottom: 8,
  },
  chipRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 24},
  chip: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 100,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  chipActive: {borderColor: '#222', backgroundColor: '#fff'},
  chipText: {color: '#BDBDBD', fontSize: 15, fontWeight: '500'},
  chipTextActive: {color: '#222', fontWeight: '700'},
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 24,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
    height: 50,
  },
  cancelBtnText: {color: '#757575', fontSize: 18, fontWeight: '600'},
  nextBtn: {
    flex: 2,
    backgroundColor: '#4CB6B6',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  nextBtnText: {color: '#fff', fontSize: 18, fontWeight: '600'},
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  backBtnText: {fontSize: 24, color: '#222'},
});

export default PreferSetupScreen;
