// File: src/screens/main/MapHomeScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Menu,
  Search,
  Wrench,
  Paintbrush,
  Zap,
  Droplets,
  ChevronRight,
  Clock,
} from 'lucide-react-native';
import Colors from '../../theme/colors';
import ServiceCategoryItem from '../../components/Cards/ServiceCategoryItem';

/**
 * Main Map Home screen matching the Stitch "InHome Client Home Screen" / "Accueil Client" design.
 * Features:
 *  - Full-screen dark map background
 *  - Floating menu button (top-left)
 *  - Service category pills
 *  - Bottom sheet with search bar and recent addresses
 */
const MapHomeScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: 'plumbing', label: 'Plomberie', icon: <Droplets size={16} color={Colors.onSurface} /> },
    { id: 'electrical', label: 'Électricité', icon: <Zap size={16} color={Colors.onSurface} /> },
    { id: 'painting', label: 'Peinture', icon: <Paintbrush size={16} color={Colors.onSurface} /> },
    { id: 'renovation', label: 'Rénovation', icon: <Wrench size={16} color={Colors.onSurface} /> },
  ];

  const recentAddresses = [
    { id: '1', name: 'Av. Marrakech', subtitle: 'Appartement 12, 3ème étage' },
    { id: '2', name: 'Rue Ibn Batouta', subtitle: 'Villa 45' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Map Background */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          {/* Grid pattern to simulate dark map */}
          <View style={styles.mapGrid}>
            {Array.from({ length: 20 }).map((_, i) => (
              <View key={`h-${i}`} style={[styles.gridLineH, { top: i * 40 }]} />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <View key={`v-${i}`} style={[styles.gridLineV, { left: i * 36 }]} />
            ))}
          </View>

          {/* Center pin */}
          <View style={styles.centerPin}>
            <View style={styles.pinOuter}>
              <View style={styles.pinInner} />
            </View>
          </View>
        </View>
      </View>

      {/* Floating Menu Button */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation && navigation.navigate('MenuDrawer')}
        activeOpacity={0.8}
      >
        <Menu size={24} color={Colors.onSurface} />
      </TouchableOpacity>

      {/* Bottom Sheet - Always visible */}
      <View style={styles.bottomSheet}>
        {/* Handle */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation && navigation.navigate('SearchService')}
          activeOpacity={0.8}
        >
          <Search size={20} color={Colors.onSurfaceVariant} />
          <Text style={styles.searchPlaceholder}>
            De quoi avez-vous besoin ?
          </Text>
        </TouchableOpacity>

        {/* Service Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((cat) => (
            <ServiceCategoryItem
              key={cat.id}
              icon={cat.icon}
              label={cat.label}
              isSelected={selectedCategory === cat.id}
              onPress={() =>
                setSelectedCategory(
                  selectedCategory === cat.id ? null : cat.id
                )
              }
            />
          ))}
        </ScrollView>

        {/* Recent Addresses */}
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>Adresses Récentes</Text>
          {recentAddresses.map((addr) => (
            <TouchableOpacity
              key={addr.id}
              style={styles.addressRow}
              activeOpacity={0.7}
              onPress={() =>
                navigation &&
                navigation.navigate('ProviderDetails', {
                  address: addr.name,
                })
              }
            >
              <View style={styles.addressIcon}>
                <Clock size={18} color={Colors.onSurfaceVariant} />
              </View>
              <View style={styles.addressContent}>
                <Text style={styles.addressName}>{addr.name}</Text>
                <Text style={styles.addressSubtitle}>{addr.subtitle}</Text>
              </View>
              <ChevronRight size={18} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: Colors.mapNavy,
  },
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.white,
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: Colors.white,
  },
  centerPin: {
    position: 'absolute',
    top: '38%',
    left: '50%',
    marginLeft: -12,
    alignItems: 'center',
  },
  pinOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${Colors.onBackground}1A`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.onBackground,
  },
  menuButton: {
    position: 'absolute',
    top: 52,
    left: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 50,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surfaceContainerHighest,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingBottom: 40,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainerHigh,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 20,
  },
  handle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.outlineVariant,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
  },
  searchPlaceholder: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.onSurfaceVariant,
    flex: 1,
  },
  categoriesContainer: {
    gap: 8,
    paddingBottom: 20,
  },
  recentSection: {
    gap: 4,
  },
  recentTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.outlineVariant}40`,
  },
  addressIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressContent: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.onBackground,
    lineHeight: 24,
  },
  addressSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },
});

export default MapHomeScreen;
