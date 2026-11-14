// File: src/features/chat/screens/ChatScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Send } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { useBookingChatStore } from '../store/useBookingChatStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import ScreenContainer from '../../../shared/components/ui/ScreenContainer';
import ScreenHeader from '../../../shared/components/ui/ScreenHeader';
import Loader from '../../../shared/components/feedback/Loader';

export const ChatScreen = () => {
  const route = useRoute();
  const { theme, tokens } = useTheme();
  const { user } = useAuthStore();
  const { messages, fetchMessages, sendMessage, loading, sending } = useBookingChatStore();

  const bookingId = route.params?.bookingId || 'bk_demo';
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    fetchMessages(bookingId);
  }, [bookingId, fetchMessages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    await sendMessage(bookingId, text, user?.id || 'usr_client_1');
  };

  const renderMessage = ({ item }) => {
    const isMe = item.senderId === (user?.id || 'usr_client_1');
    return (
      <View
        style={[
          styles.bubbleWrap,
          { justifyContent: isMe ? 'flex-end' : 'flex-start' },
        ]}
      >
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: isMe ? theme.accent : theme.surfaceElevated,
              borderRadius: tokens.Radius.lg,
              borderBottomRightRadius: isMe ? 2 : tokens.Radius.lg,
              borderBottomLeftRadius: !isMe ? 2 : tokens.Radius.lg,
            },
          ]}
        >
          {!isMe && item.senderName ? (
            <Text style={[styles.senderName, { color: theme.textSecondary }]}>
              {item.senderName}
            </Text>
          ) : null}
          <Text style={[styles.bubbleText, { color: isMe ? theme.onAccent : theme.textPrimary }]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Discussion" subtitle="Directe avec votre artisan" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {loading ? (
          <Loader />
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={{ padding: tokens.Spacing.lg }}
          />
        )}

        <View
          style={[
            styles.inputRow,
            {
              backgroundColor: theme.surface,
              borderTopColor: theme.border,
              padding: tokens.Spacing.md,
            },
          ]}
        >
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Écrivez votre message..."
            placeholderTextColor={theme.textDisabled}
            style={[
              styles.input,
              {
                backgroundColor: theme.surfaceElevated,
                borderColor: theme.border,
                color: theme.textPrimary,
                borderRadius: tokens.Radius.full,
              },
            ]}
          />
          <TouchableOpacity
            onPress={handleSend}
            style={[styles.sendBtn, { backgroundColor: theme.accent }]}
          >
            <Send size={18} color={theme.onAccent} />
          </TouchableOpacity>
        </View>
        {/* TODO(INH-chat): Messages vocaux audio et envoi de photos avant/après chantier */}
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  bubbleWrap: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  senderName: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 16,
    borderWidth: 1,
    fontSize: 15,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatScreen;
