// File: src/features/account/screens/HelpScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { HelpCircle, Phone, MessageCircle, FileText, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import ScreenContainer from '../../../shared/components/ui/ScreenContainer';
import ScreenHeader from '../../../shared/components/ui/ScreenHeader';

export const HelpScreen = () => {
  const { theme, tokens } = useTheme();

  const handleCallSupport = () => {
    Linking.openURL('tel:+212522000000');
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/212612345678?text=Salam%20InHome%20Support');
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Aide & Support" />
      <ScrollView contentContainerStyle={{ padding: tokens.Spacing.lg }}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary, marginBottom: tokens.Spacing.md }]}>
          Besoin d'aide immédiate ?
        </Text>

        <TouchableOpacity
          onPress={handleWhatsApp}
          style={[
            styles.row,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              borderRadius: tokens.Radius.md,
              padding: tokens.Spacing.lg,
              marginBottom: tokens.Spacing.md,
            },
          ]}
        >
          <View style={styles.left}>
            <MessageCircle size={22} color={theme.success} />
            <View>
              <Text style={[styles.title, { color: theme.textPrimary }]}>Support WhatsApp</Text>
              <Text style={[styles.sub, { color: theme.textSecondary }]}>Réponse sous quelques minutes</Text>
            </View>
          </View>
          <ChevronRight size={18} color={theme.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCallSupport}
          style={[
            styles.row,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              borderRadius: tokens.Radius.md,
              padding: tokens.Spacing.lg,
              marginBottom: tokens.Spacing.xl,
            },
          ]}
        >
          <View style={styles.left}>
            <Phone size={22} color={theme.accent} />
            <View>
              <Text style={[styles.title, { color: theme.textPrimary }]}>Service client téléphonique</Text>
              <Text style={[styles.sub, { color: theme.textSecondary }]}>Du lundi au samedi 8h - 20h</Text>
            </View>
          </View>
          <ChevronRight size={18} color={theme.textSecondary} />
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: theme.textSecondary, marginBottom: tokens.Spacing.md }]}>
          Questions fréquentes (FAQ)
        </Text>

        {[
          'Comment proposer mon prix en Dirhams ?',
          'Que faire si aucun artisan n’est disponible ?',
          'Comment sont vérifiés les prestataires ?',
          'Le paiement se fait-il en espèces ou en ligne ?',
        ].map((faq, index) => (
          <View
            key={index}
            style={[
              styles.faqItem,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                borderRadius: tokens.Radius.md,
                padding: tokens.Spacing.md,
                marginBottom: tokens.Spacing.sm,
              },
            ]}
          >
            <Text style={[styles.faqText, { color: theme.textPrimary }]}>{faq}</Text>
          </View>
        ))}
        {/* TODO(INH-support): Chatbot support automatique intégré */}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  sub: {
    fontSize: 12,
    marginTop: 2,
  },
  faqItem: {
    borderWidth: 1,
  },
  faqText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default HelpScreen;
