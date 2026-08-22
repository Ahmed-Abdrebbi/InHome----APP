// File: src/components/UI/BottomSheetContainer.js
import React, { useRef, useEffect } from 'react';
import {
  View,
  Animated,
  PanResponder,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Colors from '../../theme/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Sliding bottom drawer matching the Stitch design language:
 *  - Rounded top corners (32px radius)
 *  - Drag handle pill
 *  - Shadow overlay
 *  - Swipe-to-dismiss
 */
const BottomSheetContainer = ({
  children,
  visible = true,
  snapPoints = [0.4, 0.8], // fraction of screen height
  initialSnap = 0,
  onClose,
  showHandle = true,
  backgroundColor = Colors.surfaceContainerLow,
}) => {
  const translateY = useRef(
    new Animated.Value(SCREEN_HEIGHT * (1 - snapPoints[initialSnap]))
  ).current;

  const currentSnap = useRef(initialSnap);

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT * (1 - snapPoints[initialSnap]),
        useNativeDriver: true,
        damping: 20,
        stiffness: 150,
      }).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 10,
      onPanResponderMove: (_, gestureState) => {
        const baseOffset =
          SCREEN_HEIGHT * (1 - snapPoints[currentSnap.current]);
        const newVal = baseOffset + gestureState.dy;
        if (newVal >= 0) {
          translateY.setValue(newVal);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 && onClose) {
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 300,
            useNativeDriver: true,
          }).start(() => onClose());
        } else if (
          gestureState.dy < -50 &&
          currentSnap.current < snapPoints.length - 1
        ) {
          currentSnap.current += 1;
          Animated.spring(translateY, {
            toValue:
              SCREEN_HEIGHT * (1 - snapPoints[currentSnap.current]),
            useNativeDriver: true,
            damping: 20,
            stiffness: 150,
          }).start();
        } else if (gestureState.dy > 50 && currentSnap.current > 0) {
          currentSnap.current -= 1;
          Animated.spring(translateY, {
            toValue:
              SCREEN_HEIGHT * (1 - snapPoints[currentSnap.current]),
            useNativeDriver: true,
            damping: 20,
            stiffness: 150,
          }).start();
        } else {
          Animated.spring(translateY, {
            toValue:
              SCREEN_HEIGHT * (1 - snapPoints[currentSnap.current]),
            useNativeDriver: true,
            damping: 20,
            stiffness: 150,
          }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Dimmed overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: translateY.interpolate({
                inputRange: [0, SCREEN_HEIGHT],
                outputRange: [0.6, 0],
                extrapolate: 'clamp',
              }),
            },
          ]}
        />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          { backgroundColor, transform: [{ translateY }] },
        ]}
        {...panResponder.panHandlers}
      >
        {showHandle && (
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>
        )}
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.black,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 24,
    overflow: 'hidden',
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.outlineVariant,
  },
});

export default BottomSheetContainer;
