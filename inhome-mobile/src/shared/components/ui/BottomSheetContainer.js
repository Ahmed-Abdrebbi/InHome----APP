// File: src/shared/components/ui/BottomSheetContainer.js
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
import { useTheme } from '../../../core/theme';
import useMapStore from '../../../features/home/store/useMapStore';

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
 *  - Search input with magnifying glass for Moroccan city search or direct service search
 *  - Horizontal category selector pills with active accent highlight
 *  - Recent addresses list with Clock icons
 */
const BottomSheetContainer = ({
  onSearchCity,
  onSelectAddress,
  onSearchPress,
}) => {
  const { theme, tokens } = useTheme();
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
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surfaceElevated || '#212121',
          borderTopColor: theme.border,
        },
      ]}
    >
      {/* Handle */}
      <View style={styles.handleContainer}>
        <View style={[styles.handle, { backgroundColor: theme.borderSubtle || '#3E3E3E' }]} />
      </View>

      {/* Search Input Bar */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onSearchPress && onSearchPress()}
        style={[
          styles.searchBar,
          {
            backgroundColor: theme.surface || '#1A1D24',
            borderColor: theme.border,
          },
        ]}
      >
        <Search size={20} color={theme.textSecondary || '#9E9E9E'} />
        <TextInput
          style={[styles.searchInput, { color: theme.textPrimary }]}
          placeholder="De quoi avez-vous besoin ? (ex: Casablanca)"
          placeholderTextColor={theme.textSecondary || '#9E9E9E'}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearchSubmit}
          onFocus={() => {
            if (onSearchPress) {
              onSearchPress();
            }
          }}
          returnKeyType="search"
          autoCapitalize="words"
        />
        {searchText.trim().length > 0 && (
          <TouchableOpacity
            style={[styles.searchActionBtn, { backgroundColor: theme.accent }]}
            onPress={handleSearchSubmit}
            activeOpacity={0.8}
          >
            <ChevronRight size={18} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

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
                {
                  backgroundColor: isSelected
                    ? (theme.accentMuted || 'rgba(235, 67, 28, 0.15)')
                    : (theme.surface || '#2C3038'),
                  borderColor: isSelected ? theme.accent : theme.border,
                },
              ]}
              onPress={() => handleCategoryPress(cat.id)}
              activeOpacity={0.7}
            >
              <Icon
                size={16}
                color={isSelected ? theme.accent : (theme.textSecondary || '#B0B0B0')}
              />
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: isSelected ? theme.accent : (theme.textPrimary || '#FFFFFF'),
                    fontWeight: isSelected ? '700' : '500',
                  },
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
        <Text style={[styles.recentTitle, { color: theme.textSecondary || '#8A92A6' }]}>
          ADRESSES RÉCENTES
        </Text>
        {RECENT_ADDRESSES.map((addr) => (
          <TouchableOpacity
            key={addr.id}
            style={[styles.addressRow, { borderBottomColor: theme.borderSubtle }]}
            onPress={() => onSelectAddress && onSelectAddress(addr)}
            activeOpacity={0.7}
          >
            <View style={[styles.addressIconWrap, { backgroundColor: theme.surface }]}>
              <Clock size={18} color={theme.textSecondary || '#9E9E9E'} />
            </View>
            <View style={styles.addressContent}>
              <Text style={[styles.addressName, { color: theme.textPrimary }]}>{addr.name}</Text>
              <Text style={[styles.addressSubtitle, { color: theme.textSecondary }]}>
                {addr.subtitle}
              </Text>
            </View>
            <ChevronRight size={18} color={theme.textSecondary || '#9E9E9E'} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
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
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    marginBottom: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  searchActionBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
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
    borderRadius: 24,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 13,
  },
  recentSection: {
    paddingTop: 8,
  },
  recentTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  addressIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressContent: {
    flex: 1,
    gap: 2,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '600',
  },
  addressSubtitle: {
    fontSize: 12,
  },
});

export default BottomSheetContainer;
