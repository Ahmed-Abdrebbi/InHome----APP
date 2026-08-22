// File: src/components/UI/CustomKeypad.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Delete, Globe } from 'lucide-react-native';
import Colors from '../../theme/colors';

/**
 * Custom numeric keypad matching the Stitch "Proposer votre prix" bottom-sheet design.
 * 3-column grid: 1-9, globe/0/backspace.
 */
const CustomKeypad = ({ onKeyPress, onDelete, onGlobe }) => {
  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['globe', '0', 'delete'],
  ];

  const renderKey = (key, rowIdx, colIdx) => {
    const handlePress = () => {
      if (key === 'delete') {
        onDelete && onDelete();
      } else if (key === 'globe') {
        onGlobe && onGlobe();
      } else {
        onKeyPress && onKeyPress(key);
      }
    };

    return (
      <TouchableOpacity
        key={`${rowIdx}-${colIdx}`}
        style={styles.key}
        onPress={handlePress}
        activeOpacity={0.6}
      >
        {key === 'delete' ? (
          <Delete size={24} color={Colors.onSurface} />
        ) : key === 'globe' ? (
          <Globe size={20} color={Colors.onSurface} />
        ) : (
          <Text style={styles.keyText}>{key}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {keys.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {row.map((key, colIdx) => renderKey(key, rowIdx, colIdx))}
          </View>
        ))}
      </View>
      {/* Safe area spacing */}
      <View style={styles.safeArea} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    paddingTop: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  grid: {
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  key: {
    flex: 1,
    height: 56,
    margin: 2,
    borderRadius: 6,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.onSurface,
    lineHeight: 32,
  },
  safeArea: {
    height: 24,
  },
});

export default CustomKeypad;
