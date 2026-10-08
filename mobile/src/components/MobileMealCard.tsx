import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Recommendation, Meal } from '../types';
import { MobileMealDetailModal } from './MobileMealDetailModal';

export interface MobileMealCardProps {
  recommendation?: Recommendation;
  meal?: Meal;
  onAddToCart: (mealId: string, quantity?: number) => Promise<void> | void;
  onRemove?: (meal: Meal) => void;
  onPressMeal?: (meal: Meal) => void;
  width?: number;
  index?: number;
}

export const MobileMealCard: React.FC<MobileMealCardProps> = ({
  recommendation,
  meal: directMeal,
  onAddToCart,
  onRemove,
  onPressMeal,
  width = 190,
  index = 0,
}) => {
  const currentMeal = recommendation?.meal || directMeal;
  if (!currentMeal) return null;

  const [showDetail, setShowDetail] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Shimmer pulse for photo loading
  const shimmerAnim = useRef(new Animated.Value(0.35)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 0.85,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0.35,
          duration: 650,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // Staggered Entrance Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;
  const imageFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        delay: (index || 0) * 120,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        delay: (index || 0) * 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  const handleAdd = async () => {
    if (isAdding) return;
    try {
      setIsAdding(true);
      // Give user a smooth 600ms loading transition so they clearly register the action
      await Promise.all([
        Promise.resolve(onAddToCart(currentMeal.id)),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2200);
    } finally {
      setIsAdding(false);
    }
  };

  const fallbackImg =
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';

  const displayBadges =
    currentMeal.displayBadges && currentMeal.displayBadges.length > 0
      ? currentMeal.displayBadges.slice(0, 2)
      : (currentMeal.dietaryTags || ['Healthy']).slice(0, 2);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          width,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Food Photo Container - Tap to view meal details */}
      <TouchableOpacity
        style={styles.imgWrapper}
        activeOpacity={0.9}
        onPress={() => {
          if (onPressMeal) {
            onPressMeal(currentMeal);
          } else {
            setShowDetail(true);
          }
        }}
      >
        {/* Shimmering Skeleton Loader while image downloads */}
        {!isLoaded && !imgError && (
          <Animated.View style={[styles.skeletonBox, { opacity: shimmerAnim }]}>
            <ActivityIndicator size="small" color="#0D7844" />
            <Text style={styles.skeletonText}>Loading photo…</Text>
          </Animated.View>
        )}

        <Animated.Image
          source={{ uri: imgError ? fallbackImg : currentMeal.imageUrl || fallbackImg }}
          style={[styles.img, { opacity: imageFadeAnim }]}
          resizeMode="cover"
          onLoad={() => {
            setIsLoaded(true);
            Animated.timing(imageFadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }).start();
          }}
          onError={() => {
            setImgError(true);
            setIsLoaded(true);
          }}
        />

        {/* Favorite Heart Button */}
        <TouchableOpacity
          style={styles.favoriteBtn}
          activeOpacity={0.7}
          onPress={() => setIsFavorite((prev) => !prev)}
        >
          <Text style={styles.favoriteText}>{isFavorite ? '❤️' : '♡'}</Text>
        </TouchableOpacity>

        {onRemove && (
          <TouchableOpacity
            style={styles.dismissBtn}
            activeOpacity={0.7}
            onPress={() => onRemove(currentMeal)}
          >
            <Text style={styles.dismissText}>✕</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {/* Card Details */}
      <View style={styles.body}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (onPressMeal) {
              onPressMeal(currentMeal);
            } else {
              setShowDetail(true);
            }
          }}
        >
          <Text style={styles.title} numberOfLines={2}>
            {currentMeal.name}
          </Text>
        </TouchableOpacity>

        <Text style={styles.price}>${currentMeal.price.toFixed(2)}</Text>

        {/* Clean Customer-Facing Badges */}
        <View style={styles.tagRow}>
          {displayBadges.map((badge, idx) => (
            <View key={idx} style={styles.tagPill}>
              <Text style={styles.tagText}>{badge}</Text>
            </View>
          ))}
        </View>

        {/* Solid Dark Green Add to Cart Button */}
        <TouchableOpacity
          style={[styles.addBtn, isAdded && styles.addBtnSuccess]}
          activeOpacity={0.8}
          onPress={handleAdd}
          disabled={isAdding}
        >
          {isAdding ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.addBtnText}>{isAdded ? 'Added ✓' : 'Add to cart'}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Full Meal Details Card Modal */}
      <MobileMealDetailModal
        visible={showDetail}
        meal={currentMeal}
        onClose={() => setShowDetail(false)}
        onAddToCart={onAddToCart}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    marginRight: 12,
  },
  imgWrapper: {
    width: '100%',
    height: 120,
    position: 'relative',
    backgroundColor: '#F3F4F6',
  },
  skeletonBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  skeletonText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0D7844',
    marginTop: 6,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  favoriteText: {
    fontSize: 16,
    color: '#DC2626',
  },
  dismissBtn: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  body: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    minHeight: 38,
    lineHeight: 19,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D7844',
    marginTop: 4,
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 10,
    minHeight: 22,
  },
  tagPill: {
    backgroundColor: '#EBF7EE',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(13, 120, 68, 0.2)',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0D7844',
  },
  addBtn: {
    backgroundColor: '#0D7844',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnSuccess: {
    backgroundColor: '#059669',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
