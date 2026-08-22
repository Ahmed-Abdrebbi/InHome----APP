// File: src/screens/main/SearchServiceScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Keyboard,
} from 'react-native';
import {
  ArrowLeft,
  Search,
  MapPin,
  Clock,
  X,
} from 'lucide-react-native';
import Colors from '../../theme/colors';

/**
 * Search / Address input screen matching the Stitch "Recherche d'adresse" design.
 * Full-screen search overlay with:
 *  - Back arrow + search input
 *  - Recent search suggestions
 *  - Address results
 */
const SearchServiceScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const suggestions = [
    {
      id: '1',
      type: 'recent',
      title: 'Plomberie',
      subtitle: 'Service le plus recherché',
    },
    {
      id: '2',
      type: 'recent',
      title: 'Électricité',
      subtitle: 'Installation et réparation',
    },
    {
      id: '3',
      type: 'recent',
      title: 'Peinture intérieure',
      subtitle: 'Murs et plafonds',
    },
    {
      id: '4',
      type: 'address',
      title: 'Av. Marrakech',
      subtitle: 'Adresse enregistrée',
    },
    {
      id: '5',
      type: 'address',
      title: 'Rue Ibn Batouta',
      subtitle: 'Adresse récente',
    },
  ];

  const filteredSuggestions = query
    ? suggestions.filter((s) =>
        s.title.toLowerCase().includes(query.toLowerCase())
      )
    : suggestions;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionRow}
      activeOpacity={0.7}
      onPress={() => {
        Keyboard.dismiss();
        if (navigation) {
          navigation.navigate('ProviderDetails', { service: item.title });
        }
      }}
    >
      <View style={styles.suggestionIcon}>
        {item.type === 'recent' ? (
          <Clock size={18} color={Colors.onSurfaceVariant} />
        ) : (
          <MapPin size={18} color={Colors.onSurfaceVariant} />
        )}
      </View>
      <View style={styles.suggestionContent}>
        <Text style={styles.suggestionTitle}>{item.title}</Text>
        <Text style={styles.suggestionSubtitle}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Search Header */}
      <View style={styles.searchHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation && navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={Colors.onSurface} />
        </TouchableOpacity>

        <View style={styles.searchInputContainer}>
          <Search size={18} color={Colors.onSurfaceVariant} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Rechercher un service..."
            placeholderTextColor={Colors.onSurfaceVariant}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X size={18} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      <FlatList
        data={filteredSuggestions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun résultat trouvé</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: Colors.surfaceContainer,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: Colors.onSurface,
    lineHeight: 24,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.outlineVariant}30`,
  },
  suggestionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionContent: {
    flex: 1,
    gap: 2,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.onBackground,
    lineHeight: 24,
  },
  suggestionSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 48,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.onSurfaceVariant,
  },
});

export default SearchServiceScreen;
