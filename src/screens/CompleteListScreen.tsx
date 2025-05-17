import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Logo from '../assets/logo.svg';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import BackButton from '../assets/back-button.svg';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';

const books = [
  {id: '1', title: '날개', author: '이상', date: '2025.05.10', cover: ''},
  {id: '2', title: '날개', author: '이상', date: '2025.05.10', cover: ''},
  {id: '3', title: '날개', author: '이상', date: '2025.05.10', cover: ''},
  {id: '4', title: '날개', author: '이상', date: '2025.05.10', cover: ''},
];

type Navigation = StackNavigationProp<RootStackParamList, 'CompleteList'>;

export default function CompleteListScreen() {
  const navigation = useNavigation<Navigation>();

  // 2개씩 끊어서 행(row) 단위로 렌더링
  const rows = [];
  for (let i = 0; i < books.length; i += 2) {
    rows.push(books.slice(i, i + 2));
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackButton width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>완독 리스트</Text>
        <View style={{width: 24}} />
      </View>
      <View style={{flex: 1, backgroundColor: '#F8F9FB'}}>
        <View style={styles.listContent}>
          {rows.map((row, rowIdx) => (
            <View
              key={rowIdx}
              style={{
                flexDirection: 'row',
                width: SCREEN_WIDTH - 48,
                justifyContent: 'space-between',
                marginBottom: 18,
              }}>
              {row.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate('CompleteSave', item)}>
                  <View style={styles.cover} />
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.author}>{item.author}</Text>
                  <View style={styles.bottomRow}>
                    <Logo width={26} height={12} />
                    <Text style={styles.date}>{item.date}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              {/* 홀수개일 때 오른쪽 공간 확보 */}
              {row.length === 1 && <View style={[styles.card, {opacity: 0}]} />}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 23,
    color: '#1A1A1A',
  },
  listContent: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 30,
    backgroundColor: '#F8F9FB',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    width: 161,
    minHeight: 230,
    marginBottom: 10,
    paddingTop: 12,
    paddingLeft: 12,
    paddingRight: 12,
    alignItems: 'flex-start',
  },
  cover: {
    width: 145,
    height: 139,
    borderRadius: 3,
    backgroundColor: '#eee',
    marginBottom: 7.5,
    alignSelf: 'center',
  },
  title: {
    fontFamily: 'esamanru OTF',
    fontWeight: '500',
    fontSize: 13.5,
    lineHeight: 16.5,
    color: '#1A1A1A',
    marginBottom: 3,
  },
  author: {
    fontSize: 10.5,
    color: '#757575',
    lineHeight: 16.5,
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 16.5,
    marginBottom: 7.5,
  },
  date: {
    color: '#BDBDBD',
    fontSize: 9,
    fontWeight: '400',
    lineHeight: 16.5,
  },
});
