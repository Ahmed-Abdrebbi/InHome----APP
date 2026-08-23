// File: src/components/UI/BottomSheetContainer.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  Search,
  Wrench,
  Zap,
  Paintbrush,
  Clock,
  ChevronRight,
} from 'lucide-react-native';
import Colors from '../../theme/colors';
import useMapStore from '../../store/useMapStore';

const CATEGORIES = [
  { id: 'Plomberie', label: 'Plomberie', Icon: Wrench },
  { id: 'Électricité', label: 'Électricité', Icon: Zap },
  { id: 'Peinture', label: 'Peinture', Icon: Paintbrush },
];

const RECENT_ADDRESSES = [
  { id: '1', name: 'Av. Marrakech', subtitle: 'Appartement 12, 3ème étage' },
  { id: '2', name: 'Rue Ibn Batouta', subtitle: 'Villa 45' },
];

/**
 * BottomSheetContainer matching the Stitch design:
 *  - Top drag handle
 *  - Search input with magnifying glass for Moroccan city search
 *  - Horizontal category selector pills with active orange highlight (#FF6B00)
 *  - Recent addresses list with Clock icons
 */
const BottomSheetContainer = ({
  onSearchCity,
  onSelectAddress,
}) => {
  const [searchText, setSearchText] = useState('');
  const selectedCategory = useMapStore((state) => state.selectedCategory);
  const setSelectedCategory = useMapStore((state) => state.setSelectedCategory);

  const handleCategoryPress = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory('All');
    } else {
      setSelectedCategory(categoryId);
    }
  };

  const handleSearchSubmit = () => {
    if (searchText.trim() && onSearchCity) {
      onSearchCity(searchText.trim());
    }
  };

  return (
    <View style={styles.container}>
      {/* Handle */}
      <View style={styles.handleContainer}>
        <View style={styles.handle} />
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Search size={20} color="#9E9E9E" />
        <TextInput
          style={styles.searchInput}
          placeholder="De quoi avez-vous besoin ? (ex: Casablanca)"
          placeholderTextColor="#9E9E9E"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
          autoCapitalize="words"
        />
        {searchText.trim().length > 0 && (
          <TouchableOpacity
            style={styles.searchActionBtn}
            onPress={handleSearchSubmit}
            activeOpacity={0.8}
          >
            <ChevronRight size={18} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const { Icon } = cat;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryPill,
                isSelected && styles.categoryPillActive,
              ]}
              onPress={() => handleCategoryPress(cat.id)}
              activeOpacity={0.7}
            >
              <Icon
                size={16}
                color={isSelected ? '#FF6B00' : '#E0E0E0'}
              />
              <Text
                style={[
                  styles.categoryText,
                  isSelected && styles.categoryTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Recent Addresses Section */}
      <View style={styles.recentSection}>
        <Text style={styles.recentTitle}>ADRESSES RÉCENTES</Text>
        {RECENT_ADDRESSES.map((addr) => (
          <TouchableOpacity
            key={addr.id}
            style={styles.addressRow}
            onPress={() => onSelectAddress && onSelectAddress(addr)}
            activeOpacity={0.7}
          >
            <View style={styles.addressIconWrap}>
              <Clock size={18} color="#9E9E9E" />
            </View>
            <View style={styles.addressContent}>
              <Text style={styles.addressName}>{addr.name}</Text>
              <Text style={styles.addressSubtitle}>{addr.subtitle}</Text>
            </View>
            <ChevronRight size={18} color="#9E9E9E" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#212121',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#2E2E2E',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#424242',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181818',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2E2E2E',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    paddingVertical: 0,
  },
  searchActionBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF6B00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesScroll: {
    gap: 10,
    paddingBottom: 16,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#333333',
  },
  categoryPillActive: {
    borderColor: '#FF6B00',
    backgroundColor: 'rgba(255, 107, 0, 0.15)',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E0E0E0',
  },
  categoryTextActive: {
    color: '#FF6B00',
  },
  recentSection: {
    marginTop: 4,
  },
  recentTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#757575',
    letterSpacing: 1,
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
    gap: 12,
  },
  addressIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#181818',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressContent: {
    flex: 1,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  addressSubtitle: {
    fontSize: 13,
    color: '#9E9E9E',
  },
});

export default BottomSheetContainer;
