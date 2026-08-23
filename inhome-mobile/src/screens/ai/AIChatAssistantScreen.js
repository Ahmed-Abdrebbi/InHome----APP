// File: src/screens/ai/AIChatAssistantScreen.js
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
import { ArrowLeft, Send, Bot, User } from 'lucide-react-native';
import Colors from '../../theme/colors';
import useChatStore from '../../store/useChatStore';

const AIChatAssistantScreen = ({ navigation }) => {
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  const messages = useChatStore((state) => state.messages);
  const isTyping = useChatStore((state) => state.isTyping);
  const addMessage = useChatStore((state) => state.addMessage);
  const setIsTyping = useChatStore((state) => state.setIsTyping);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userContent = inputText.trim();
    setInputText('');

    // Add user message to global store
    addMessage({
      role: 'user',
      content: userContent,
    });

    // Indicate assistant is typing
    setIsTyping(true);

    // TODO: Implement SSE connection

    setTimeout(() => {
      // Scroll to end when new messages arrive
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
          <View style={styles.assistantAvatar}>
            <Bot size={16} color={Colors.white} />
          </View>
        )}
        <View
          style={[
            styles.bubble,
            isUser ? styles.bubbleUser : styles.bubbleAssistant,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.messageTextUser : styles.messageTextAssistant,
            ]}
          >
            {item.content}
          </Text>
        </View>
        {isUser && (
          <View style={styles.userAvatar}>
            <User size={16} color={Colors.white} />
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.surfaceContainer} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation && navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Assistant InHome AI</Text>
          <Text style={styles.headerSubtitle}>Diagnostic & Devis instantané</Text>
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
              <View style={styles.assistantAvatar}>
                <Bot size={16} color={Colors.white} />
              </View>
              <View style={[styles.bubble, styles.bubbleAssistant, styles.typingBubble]}>
                <ActivityIndicator size="small" color="#FF6B00" />
                <Text style={styles.typingText}>L'assistant écrit...</Text>
              </View>
            </View>
          ) : null
        }
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Décrivez votre besoin..."
          placeholderTextColor={Colors.onSurfaceVariant}
          value={inputText}
          onChangeText={setInputText}
          multiline={false}
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            inputText.trim().length > 0 && styles.sendBtnActive,
          ]}
          onPress={handleSend}
          disabled={!inputText.trim()}
          activeOpacity={0.8}
        >
          <Send
            size={20}
            color={
              inputText.trim().length > 0
                ? Colors.white
                : Colors.onSurfaceVariant
            }
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: Colors.surfaceContainer,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerHigh,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#FF6B00',
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
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  bubbleUser: {
    backgroundColor: '#FF6B00',
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: '#333333',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  messageTextUser: {
    color: Colors.white,
    fontWeight: '500',
  },
  messageTextAssistant: {
    color: Colors.onSurface,
  },
  typingIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 6,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surfaceContainer,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainerHigh,
    gap: 12,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 15,
    color: Colors.onSurface,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnActive: {
    backgroundColor: '#FF6B00',
  },
});

export default AIChatAssistantScreen;
