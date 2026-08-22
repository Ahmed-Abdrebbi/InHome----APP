// File: src/screens/ai/AIChatAssistantScreen.js
import React, { useState } from 'react';
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
} from 'react-native';
import { ArrowLeft, Send, Bot, User } from 'lucide-react-native';
import Colors from '../../theme/colors';

const AIChatAssistantScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: 'Bonjour ! Je suis votre assistant InHome. Décrivez votre besoin ou vos travaux et je vous aiderai à estimer le prix et trouver le bon artisan.',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const botReply = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `Merci pour ces détails. Pour ce type d'intervention, nous estimons une fourchette de 200 à 450 DH selon l'ampleur. Souhaitez-vous demander une intervention à domicile ou un devis à distance ?`,
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1000);
  };

  const renderMessage = ({ item }) => {
    const isBot = item.sender === 'bot';
    return (
      <View
        style={[
          styles.messageRow,
          isBot ? styles.messageRowLeft : styles.messageRowRight,
        ]}
      >
        {isBot && (
          <View style={styles.botAvatar}>
            <Bot size={16} color={Colors.accent} />
          </View>
        )}
        <View
          style={[
            styles.bubble,
            isBot ? styles.bubbleBot : styles.bubbleUser,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isBot ? styles.messageTextBot : styles.messageTextUser,
            ]}
          >
            {item.text}
          </Text>
        </View>
        {!isBot && (
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
          <Text style={styles.headerSubtitle}>En ligne • Diagnostic & Devis</Text>
        </View>
      </View>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatList}
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Décrivez votre problème..."
          placeholderTextColor={Colors.onSurfaceVariant}
          value={inputText}
          onChangeText={setInputText}
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
                ? Colors.background
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
    borderBottomColor: Colors.outlineVariant,
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
    color: Colors.accent,
  },
  chatList: {
    padding: 16,
    gap: 16,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginVertical: 4,
  },
  messageRowLeft: {
    justifyContent: 'flex-start',
  },
  messageRowRight: {
    justifyContent: 'flex-end',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '75%',
    padding: 14,
    borderRadius: 16,
  },
  bubbleBot: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: Colors.secondaryContainer,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  messageTextBot: {
    color: Colors.onSurface,
  },
  messageTextUser: {
    color: Colors.onBackground,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.surfaceContainer,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
    gap: 12,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 24,
    paddingHorizontal: 18,
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
    backgroundColor: Colors.accent,
  },
});

export default AIChatAssistantScreen;
