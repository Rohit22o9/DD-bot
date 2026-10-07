import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  Animated,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ImageStyle,
  ViewStyle,
} from 'react-native';

interface MobileMealImageProps {
  uri?: string;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  fallbackUri?: string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  dishName?: string;
}

const DEFAULT_FALLBACK =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

export const MobileMealImage: React.FC<MobileMealImageProps> = ({
  uri,
  style,
  containerStyle,
  fallbackUri = DEFAULT_FALLBACK,
  resizeMode = 'cover',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Shimmer pulse animation for skeleton
  const shimmerAnim = useRef(new Animated.Value(0.4)).current;
  // Fade-in animation for loaded image
  const imageFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 0.9,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0.4,
          duration: 650,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();

    return () => {
      isMounted = false;
      loop.stop();
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    Animated.timing(imageFadeAnim, {
      toValue: 1,
      duration: 280,
      useNativeDriver: true,
    }).start();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
    Animated.timing(imageFadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const finalUri = hasError || !uri ? fallbackUri : uri;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Shimmering Skeleton overlay while loading */}
      {!isLoaded && (
        <Animated.View style={[styles.skeleton, { opacity: shimmerAnim }]}>
          <ActivityIndicator size="small" color="#0D7844" />
        </Animated.View>
      )}

      {/* Actual Food Image with smooth fade-in */}
      <Animated.Image
        source={{ uri: finalUri }}
        style={[style, { opacity: imageFadeAnim }]}
        resizeMode={resizeMode}
        onLoad={handleLoad}
        onError={handleError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E5E7EB',
  },
  skeleton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
});
