import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import SearchIcon from '../assets/search-tab.svg';
import ClearButton from '../assets/clear-button.svg';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';

// 예시 데이터
const RECENT_KEYWORDS = ['윤동주', '별이 빛나는 밤', '별 헤는 밤', '이광수'];
const POPULAR_BOOKS = Array.from({length: 10}).map((_, i) => ({
  id: i + 1,
  title: '날개',
  author: '이상',
  cover: null,
}));

// 연관 검색어 mock 데이터 (이미지 속 예시)
const SUGGESTIONS = [
  '날개',
  '날개 : 이상 소설전집',
  '날로 먹는 분자세포생물학',
  '날씨의 아이',
  '날로 먹는 한자',
  '가장 젊은 날의 철학',
  '살아갈 날들을 위한 괴테의 시',
];

const SearchScreen = () => {
  const [search, setSearch] = useState('');
  const [recent, setRecent] = useState(RECENT_KEYWORDS);
  const inputRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isResultMode, setIsResultMode] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'DiscoveryDetail'>>();

  const handleClear = () => setSearch('');
  const handleRemoveRecent = (keyword: string) =>
    setRecent(recent.filter(k => k !== keyword));
  const handleClearAllRecent = () => setRecent([]);
  const handleRecentPress = (keyword: string) => setSearch(keyword);

  const handleChangeText = (text: string) => {
    setSearch(text);
    setShowSuggestions(!!text);
    setIsResultMode(false);
  };

  const handleSuggestionPress = (keyword: string) => {
    setSearch(keyword);
    setShowSuggestions(false);
    handleSearch(keyword);
  };

  const handleSearch = (keyword: string) => {
    setIsResultMode(true);
    setShowSuggestions(false);
    // 검색 결과 mock 데이터 (책 6권)
    setSearchResults([
      {
        id: 1,
        title: '날개 : 이상 소설전집',
        author: '이상이상이상이상이상이상이상이상이상',
        cover: null,
      },
      {
        id: 2,
        title: '거북 배를 만든 신 이충무공 이야기 아 거북 아 거북 아 거북',
        author: '이상',
        cover: null,
      },
      {id: 3, title: '날개', author: '이상', cover: null},
      {id: 4, title: '날개', author: '이상', cover: null},
      {id: 5, title: '날개', author: '이상', cover: null},
      {id: 6, title: '날개', author: '이상', cover: null},
    ]);
  };

  // 인기 Top 10 책 렌더
  const renderBook = ({item}: {item: (typeof POPULAR_BOOKS)[0]}) => (
    <TouchableOpacity
      style={styles.bookItem}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('DiscoveryDetail', {
          id: String(item.id),
          title: item.title,
          author: item.author,
          cover:
            item.cover ||
            'https://dummyimage.com/200x280/cccccc/222222.jpg&text=No+Image',
          firstLine: '이곳에 첫 문장이 들어갑니다.',
          description: '이곳에 책 설명이 들어갑니다.',
        })
      }>
      <View style={styles.bookCover} />
      <Text style={styles.bookTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.bookAuthor} numberOfLines={1}>
        {item.author}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setShowSuggestions(false);
        }}
        accessible={false}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {/* 검색창 */}
          <View style={styles.searchBarWrapper}>
            <SearchIcon />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="검색어를 입력해주세요"
              placeholderTextColor="#BDBDBD"
              value={search}
              onChangeText={handleChangeText}
              returnKeyType="search"
              clearButtonMode="never"
              onSubmitEditing={() => handleSearch(search)}
              onFocus={() => setShowSuggestions(!!search)}
            />
            {!!search && (
              <TouchableOpacity
                onPress={handleClear}
                style={styles.clearButton}>
                <ClearButton />
              </TouchableOpacity>
            )}
          </View>

          {/* 연관 검색어 자동완성 (덮는 형태, isResultMode 아닐 때만) */}
          {showSuggestions && !isResultMode && (
            <View style={styles.suggestionWrapperAbsolute}>
              {SUGGESTIONS.filter(s => s.includes(search)).map((s, idx) => (
                <TouchableOpacity
                  key={s + idx}
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionPress(s)}>
                  <View style={styles.suggestionIcon}>
                    <SearchIcon />
                  </View>
                  <Text style={styles.suggestionText}>
                    {s.split(search).reduce(
                      (prev, curr, i, arr) =>
                        i < arr.length - 1
                          ? [
                              ...prev,
                              curr,
                              <Text key={i} style={{color: '#00B1A7'}}>
                                {search}
                              </Text>,
                            ]
                          : [...prev, curr],
                      [] as (string | JSX.Element)[],
                    )}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* 최근 검색어/인기 Top10: 검색 결과 모드 아닐 때만 */}
          {!isResultMode && (
            <>
              {/* 최근 검색어 */}
              <View style={styles.recentWrapper}>
                <Text style={styles.recentLabel}>최근 검색어</Text>
                {recent.length > 0 && (
                  <TouchableOpacity onPress={handleClearAllRecent}>
                    <Text style={styles.clearAllText}>전체 삭제</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.recentChipsWrapper}>
                {recent.length === 0 ? (
                  <Text style={styles.noRecentText}>
                    최근 검색어가 없습니다.
                  </Text>
                ) : (
                  recent.map(keyword => (
                    <TouchableOpacity
                      key={keyword}
                      style={styles.chip}
                      onPress={() => handleRecentPress(keyword)}>
                      <Text style={styles.chipText}>{keyword}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>

              {/* 인기 Top 10 */}
              <Text style={styles.popularLabel}>인기 Top 10</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.popularList}>
                {POPULAR_BOOKS.map(item => (
                  <React.Fragment key={item.id}>
                    {renderBook({item})}
                  </React.Fragment>
                ))}
              </ScrollView>
            </>
          )}

          {/* 검색 결과 화면 */}
          {isResultMode && (
            <View style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultCount}>
                  검색 결과{' '}
                  <Text style={{color: '#00B1A7', fontWeight: '600'}}>
                    {searchResults.length}
                  </Text>
                </Text>
              </View>
              <View style={styles.resultGrid}>
                {searchResults.map((item, idx) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.resultBookItem}
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate('DiscoveryDetail', {
                        id: String(item.id),
                        title: item.title,
                        author: item.author,
                        cover:
                          item.cover ||
                          'https://dummyimage.com/200x280/cccccc/222222.jpg&text=No+Image',
                        firstLine: '이곳에 첫 문장이 들어갑니다.',
                        description: '이곳에 책 설명이 들어갑니다.',
                      })
                    }>
                    <View style={styles.bookCover} />
                    <Text style={styles.resultBookTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={styles.resultBookAuthor} numberOfLines={1}>
                      {item.author}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    paddingVertical: 0,
    paddingLeft: 4,
  },
  clearButton: {
    marginLeft: 4,
  },
  recentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginHorizontal: 16,
    justifyContent: 'space-between',
  },
  recentLabel: {
    fontSize: 14,
    color: '#888',
  },
  clearAllText: {
    fontSize: 13,
    color: '#888',
  },
  recentChipsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 16,
    marginTop: 10,
    minHeight: 36,
  },
  chip: {
    backgroundColor: '#fff',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 7,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 14,
    color: '#444',
  },
  noRecentText: {
    fontSize: 14,
    color: '#BDBDBD',
  },
  popularLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    marginTop: 28,
    marginBottom: 10,
    marginHorizontal: 16,
  },
  popularList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  bookItem: {
    width: 104,
    marginRight: 12,
    alignItems: 'flex-start',
  },
  bookCover: {
    width: 104,
    height: 140,
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    marginBottom: 4,
  },
  bookTitle: {
    fontSize: 12,
    color: '#1A1A1A',
    fontWeight: '500',
    lineHeight: 18,
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 12,
    color: '#757575',
    lineHeight: 22,
  },
  suggestionWrapperAbsolute: {
    position: 'absolute',
    top: 63,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 8,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  suggestionIcon: {
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 16,
    color: '#222',
  },
  resultContainer: {
    flex: 1,
    marginTop: 16,
    marginHorizontal: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultCount: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 22,
  },
  resultSort: {
    fontSize: 13,
    color: '#888',
  },
  resultGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    // paddingHorizontal: 14,
  },
  resultBookItem: {
    width: 104,
    height: 201,
    marginRight: 10,
    marginBottom: 18,
    alignItems: 'flex-start',
  },
  resultBookTitle: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
    marginBottom: 2,
  },
  resultBookAuthor: {
    fontSize: 13,
    color: '#888',
  },
});
