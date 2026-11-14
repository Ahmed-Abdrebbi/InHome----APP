// File: src/features/ai/screens/AIChatAssistantScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft, Send, Bot, User, Sparkles } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { useAiChatStore } from '../store/useAiChatStore';

const AIChatAssistantScreen = ({ navigation }) => {
  const { theme, tokens } = useTheme();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  const { messages, isTyping, sendMessage } = useAiChatStore();

  const handleSend = async () => {
    if (!inputText.trim() || isTyping) return;

    const userContent = inputText.trim();
    setInputText('');

    await sendMessage(userContent);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }) => {
    const isUser = item.role === 'user';
    return (
      <View
        style={[
          styles.messageRow,
          isUser ? styles.messageRowRight : styles.messageRowLeft,
        ]}
      >
        {!isUser && (
          <View style={[styles.assistantAvatar, { backgroundColor: theme.surfaceElevated }]}>
            <Bot size={16} color={theme.accent} />
          </View>
        )}
        <View
          style={[
            styles.bubble,
            isUser
              ? [styles.bubbleUser, { backgroundColor: theme.accent }]
              : [styles.bubbleAssistant, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }],
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.messageTextUser : [styles.messageTextAssistant, { color: theme.textPrimary }],
            ]}
          >
            {item.content}
          </Text>
        </View>
        {isUser && (
          <View style={[styles.userAvatar, { backgroundColor: theme.accent }]}>
            <User size={16} color="#FFFFFF" />
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.surfaceElevated,
            borderBottomColor: theme.borderSubtle,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation && navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color={theme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Sparkles size={16} color={theme.accent} />
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Assistant InHome AI</Text>
          </View>
          <Text style={[styles.headerSubtitle, { color: theme.accent }]}>
            Diagnostic Darija/Français & Devis instantané
          </Text>
        </View>
      </View>

      {/* Chat Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          isTyping ? (
            <View style={styles.typingIndicatorRow}>
              <View style={[styles.assistantAvatar, { backgroundColor: theme.surfaceElevated }]}>
                <Bot size={16} color={theme.accent} />
              </View>
              <View
                style={[
                  styles.bubble,
                  styles.bubbleAssistant,
                  styles.typingBubble,
                  { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
                ]}
              >
                <ActivityIndicator size="small" color={theme.accent} />
                <Text style={[styles.typingText, { color: theme.textSecondary }]}>
                  L'assistant réfléchit...
                </Text>
              </View>
            </View>
          ) : null
        }
      />

      {/* Input Area */}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.surfaceElevated,
            borderTopColor: theme.borderSubtle,
          },
        ]}
      >
        <TextInput
          style={[styles.input, { color: theme.textPrimary, backgroundColor: theme.surface }]}
          placeholder="Décrivez votre problème en Darija ou Français..."
          placeholderTextColor={theme.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          multiline={false}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            { backgroundColor: inputText.trim().length > 0 ? theme.accent : theme.surface },
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || isTyping}
          activeOpacity={0.8}
        >
          <Send
            size={18}
            color={inputText.trim().length > 0 ? '#FFFFFF' : theme.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '600',
  },
  chatList: {
    padding: 16,
    paddingBottom: 24,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginVertical: 6,
  },
  messageRowLeft: {
    justifyContent: 'flex-start',
  },
  messageRowRight: {
    justifyContent: 'flex-end',
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  bubbleUser: {
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTextUser: {
    color: '#FFFFFF',
  },
  messageTextAssistant: {},
  typingIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 6,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  typingText: {
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    gap: 10,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AIChatAssistantScreen;
