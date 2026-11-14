// File: src/features/home/screens/SearchServiceScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  Search,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { ROUTES } from '../../../app/navigation/routes';
import { useBookingStore } from '../../booking/store/useBookingStore';
import { useDebounce } from '../../../core/hooks/useDebounce';
import { aiApi } from '../../ai/api/aiApi';
import { SERVICE_CATEGORIES } from '../../../core/config/categories';

const STATIC_SUGGESTIONS = [
  { id: '1', type: 'category', title: 'Plomberie', subtitle: 'Réparation fuite, robinetterie, chauffe-eau' },
  { id: '2', type: 'category', title: 'Électricité', subtitle: 'Court-circuit, prises, éclairage' },
  { id: '3', type: 'category', title: 'Peinture', subtitle: 'Murs, plafonds, boiserie' },
  { id: '4', type: 'category', title: 'Climatisation', subtitle: 'Recharge gaz, nettoyage, installation' },
  { id: '5', type: 'address', title: 'Av. Marrakech', subtitle: 'Adresse récente' },
  { id: '6', type: 'address', title: 'Rue Ibn Batouta', subtitle: 'Adresse enregistrée' },
];

const SearchServiceScreen = ({ navigation }) => {
  const { theme, tokens } = useTheme();
  const inputRef = useRef(null);
  const { updateDraft } = useBookingStore();

  const [query, setQuery] = useState('');
  const [aiMatch, setAiMatch] = useState(null);
  const [searchingAi, setSearchingAi] = useState(false);

  const debouncedQuery = useDebounce(query, 350);

  // Call AI matcher when user types > 2 chars
  useEffect(() => {
    let isCancelled = false;

    if (debouncedQuery.trim().length >= 3) {
      setSearchingAi(true);
      aiApi
        .matchService(debouncedQuery)
        .then((res) => {
          if (!isCancelled && res?.category) {
            setAiMatch(res);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (!isCancelled) setSearchingAi(false);
        });
    } else {
      setAiMatch(null);
      setSearchingAi(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery]);

  const handleSelectItem = (item) => {
    Keyboard.dismiss();
    if (item.type === 'category' || item.category) {
      const categoryName = item.category?.name || item.title;
      const suggestedPrice = item.suggestedPriceMin || 80;
      updateDraft({
        category: categoryName,
        proposedPrice: suggestedPrice,
      });
      navigation.navigate(ROUTES.PROVIDER_DETAILS, { service: categoryName });
    } else {
      updateDraft({ address: item.title });
      navigation.navigate(ROUTES.PROVIDER_DETAILS, { address: item.title });
    }
  };

  const filteredList = query
    ? STATIC_SUGGESTIONS.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : STATIC_SUGGESTIONS;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.suggestionRow, { borderBottomColor: theme.borderSubtle }]}
      activeOpacity={0.7}
      onPress={() => handleSelectItem(item)}
    >
      <View style={[styles.suggestionIcon, { backgroundColor: theme.surfaceElevated }]}>
        {item.type === 'category' ? (
          <Clock size={18} color={theme.textSecondary} />
        ) : (
          <MapPin size={18} color={theme.textSecondary} />
        )}
      </View>
      <View style={styles.suggestionContent}>
        <Text style={[styles.suggestionTitle, { color: theme.textPrimary }]}>{item.title}</Text>
        <Text style={[styles.suggestionSubtitle, { color: theme.textSecondary }]}>
          {item.subtitle}
        </Text>
      </View>
      <ChevronRight size={18} color={theme.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />

      {/* Header */}
      <View style={[styles.searchHeader, { borderBottomColor: theme.borderSubtle }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation && navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={theme.textPrimary} />
        </TouchableOpacity>

        <View
          style={[
            styles.searchInputContainer,
            {
              backgroundColor: theme.surfaceElevated || '#1E212A',
              borderColor: theme.border,
            },
          ]}
        >
          <Search size={18} color={theme.textSecondary} />
          <TextInput
            ref={inputRef}
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="Décrivez votre besoin (ex: fuite robinet)..."
            placeholderTextColor={theme.textSecondary}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {searchingAi && <ActivityIndicator size="small" color={theme.accent} />}
        </View>
      </View>

      {/* AI Suggestion Card (if smart matched) */}
      {aiMatch && (
        <TouchableOpacity
          style={[
            styles.aiCard,
            {
              backgroundColor: theme.accentMuted || 'rgba(235, 67, 28, 0.12)',
              borderColor: theme.accent,
            },
          ]}
          activeOpacity={0.8}
          onPress={() => handleSelectItem(aiMatch)}
        >
          <View style={styles.aiCardHeader}>
            <Sparkles size={18} color={theme.accent} />
            <Text style={[styles.aiCardTitle, { color: theme.accent }]}>
              Suggestion IA InHome
            </Text>
          </View>
          <Text style={[styles.aiCardDesc, { color: theme.textPrimary }]}>
            {aiMatch.explanation}
          </Text>
          <View style={styles.aiPriceRow}>
            <Text style={[styles.aiPriceText, { color: theme.textSecondary }]}>
              Tarif moyen estimé: {aiMatch.suggestedPriceMin} - {aiMatch.suggestedPriceMax} DH
            </Text>
            <Text style={[styles.aiActionText, { color: theme.accent }]}>Continuer →</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* List */}
      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 52,
    paddingBottom: 14,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  aiCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 8,
  },
  aiCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aiCardDesc: {
    fontSize: 14,
    fontWeight: '500',
  },
  aiPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  aiPriceText: {
    fontSize: 12,
  },
  aiActionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: 0.5,
  },
  suggestionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionContent: {
    flex: 1,
    gap: 2,
  },
  suggestionTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  suggestionSubtitle: {
    fontSize: 12,
  },
});

export default SearchServiceScreen;
