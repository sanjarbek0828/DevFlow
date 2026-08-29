import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import Animated, { } from 'react-native-reanimated';

interface FABProps {
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function FAB({ onPress }: FABProps) {
  return (
    <AnimatedPressable 
      style={styles.container}
      onPress={onPress}
      // Simple press animation could be added here
    >
      <Plus color="white" size={28} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});
