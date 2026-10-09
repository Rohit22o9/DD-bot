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

const DISH_FALLBACKS: Array<{ keywords: string[]; url: string }> = [
  {
    keywords: ['burger', 'smash', 'cheeseburger', 'patty'],
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['ramen', 'noodles', 'udon', 'soba', 'pho'],
    url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['pizza', 'margherita', 'pepperoni', 'slice'],
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['pasta', 'spaghetti', 'carbonara', 'bolognese', 'penne', 'lasagna', 'fettuccine'],
    url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['sushi', 'sashimi', 'roll', 'nigiri', 'maki'],
    url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['taco', 'burrito', 'quesadilla', 'enchilada', 'mexican', 'fajita'],
    url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['biryani', 'curry', 'tikka', 'masala', 'paneer', 'naan', 'korma'],
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['chicken', 'wings', 'tender', 'roast', 'parmesan', 'poultry'],
    url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['steak', 'beef', 'ribeye', 'sirloin', 'brisket'],
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['bibimbap', 'korean', 'bulgogi', 'kimchi'],
    url: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['salmon', 'fish', 'seafood', 'shrimp', 'tuna', 'poke'],
    url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['sandwich', 'wrap', 'panini', 'sub', 'club'],
    url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['soup', 'chowder', 'stew', 'bisque', 'broth'],
    url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['bowl', 'quinoa', 'grain', 'mediterranean'],
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['salad', 'greens', 'caesar', 'kale'],
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  },
];

export const getAuthenticDishImage = (dishName?: string, defaultFallback: string = DEFAULT_FALLBACK): string => {
  if (!dishName) return defaultFallback;
  const lower = dishName.toLowerCase();
  for (const item of DISH_FALLBACKS) {
    if (item.keywords.some((k) => lower.includes(k))) {
      return item.url;
    }
  }
  return defaultFallback;
};

export const MobileMealImage: React.FC<MobileMealImageProps> = ({
  uri,
  style,
  containerStyle,
  fallbackUri,
  resizeMode = 'cover',
  dishName,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Shimmer pulse animation for skeleton
  const shimmerAnim = useRef(new Animated.Value(0.4)).current;
  // Fade-in animation for loaded image
  const imageFadeAnim = useRef(new Animated.Value(0)).current;

  // Crucial: Reset error & loaded status when uri changes (e.g. Card Swiping)
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    imageFadeAnim.setValue(0);
  }, [uri]);

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

  const effectiveFallback = fallbackUri || getAuthenticDishImage(dishName, DEFAULT_FALLBACK);
  const finalUri = hasError || !uri ? effectiveFallback : uri;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Shimmering Skeleton overlay while loading */}
      {!isLoaded && (
        <Animated.View style={[styles.skeleton, { opacity: shimmerAnim }]}>
          <ActivityIndicator size="small" color="#0D7844" />
        </Animated.View>
      )}

      {/* Actual Food Image with smooth fade-in and browser User-Agent header */}
      <Animated.Image
        source={{
          uri: finalUri,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
          },
        }}
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
