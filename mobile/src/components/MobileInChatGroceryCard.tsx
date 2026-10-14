import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { GroceryOrderList, GroceryItem } from '../types';

interface MobileInChatGroceryCardProps {
  groceryList: GroceryOrderList;
  onAddToCart: (item: GroceryItem) => void;
  onAddAllToCart: (items: GroceryItem[]) => void;
}

interface GroceryItemCardProps {
  item: GroceryItem;
  index: number;
  isChecked: boolean;
  isItemAdded: boolean;
  onToggleCheck: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onAddSingle: (item: GroceryItem) => void;
}

const GroceryItemCard: React.FC<GroceryItemCardProps> = ({
  item,
  index,
  isChecked,
  isItemAdded,
  onToggleCheck,
  onUpdateQuantity,
  onAddSingle,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Shimmer pulse animation for image loading skeleton
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

  // Staggered Entrance Animation matching main bot screen
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const imageFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        delay: Math.min(index * 90, 450),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        delay: Math.min(index * 90, 450),
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  const fallbackImg =
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';

  return (
    <Animated.View
      style={[
        styles.itemCard,
        !isChecked && styles.itemCardUnchecked,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Photo with Shimmering Skeleton Loader */}
      <View style={styles.imgWrapper}>
        {!isLoaded && !imgError && (
          <Animated.View style={[styles.skeletonBox, { opacity: shimmerAnim }]}>
            <ActivityIndicator size="small" color="#059669" />
            <Text style={styles.skeletonText}>Loading photo…</Text>
          </Animated.View>
        )}

        <Animated.Image
          source={{ uri: imgError ? fallbackImg : item.imageUrl || fallbackImg }}
          style={[styles.itemImg, { opacity: imageFadeAnim }]}
          resizeMode="cover"
          onLoad={() => {
            setIsLoaded(true);
            Animated.timing(imageFadeAnim, {
              toValue: 1,
              duration: 280,
              useNativeDriver: true,
            }).start();
          }}
          onError={() => {
            setImgError(true);
            setIsLoaded(true);
          }}
        />

        {/* Select Checkbox Badge */}
        <TouchableOpacity
          style={[styles.checkBadge, isChecked && styles.checkBadgeActive]}
          onPress={() => onToggleCheck(item.id)}
          activeOpacity={0.8}
        >
          {isChecked ? <Text style={styles.checkBadgeText}>✓</Text> : null}
        </TouchableOpacity>

        {/* Unit Pill */}
        <View style={styles.unitPill}>
          <Text style={styles.unitPillText} numberOfLines={1}>
            {item.unit}
          </Text>
        </View>
      </View>

      {/* Card Info */}
      <View style={styles.cardInfo}>
        <Text
          style={[styles.itemName, !isChecked && styles.itemNameMuted]}
          numberOfLines={2}
        >
          {item.name}
        </Text>

        {item.brand ? (
          <Text style={styles.itemBrand} numberOfLines={1}>
            {item.brand}
          </Text>
        ) : null}

        <View style={styles.priceRow}>
          <Text style={styles.itemPrice}>
            ${(item.price * item.quantity).toFixed(2)}
          </Text>
          {item.quantity > 1 ? (
            <Text style={styles.itemUnitPrice}>
              (${item.price.toFixed(2)} ea)
            </Text>
          ) : null}
        </View>

        {/* Quantity Stepper & Single Add Button */}
        <View style={styles.actionRow}>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => onUpdateQuantity(item.id, -1)}
              disabled={!isChecked || item.quantity <= 1}
            >
              <Text style={styles.stepperBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.stepperNum}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => onUpdateQuantity(item.id, 1)}
              disabled={!isChecked || item.quantity >= 10}
            >
              <Text style={styles.stepperBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.addSingleBtn,
              isItemAdded && styles.addSingleBtnAdded,
              !isChecked && styles.addSingleBtnDisabled,
            ]}
            onPress={() => onAddSingle(item)}
            disabled={!isChecked}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.addSingleText,
                isItemAdded && styles.addSingleTextAdded,
              ]}
            >
              {isItemAdded ? '✓ Added' : '+ Add'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export const MobileInChatGroceryCard: React.FC<MobileInChatGroceryCardProps> = ({
  groceryList,
  onAddToCart,
  onAddAllToCart,
}) => {
  const [items, setItems] = useState<GroceryItem[]>(groceryList.items);
  const [addedAll, setAddedAll] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<{ [id: string]: boolean }>({});

  const toggleCheck = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it))
    );
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const newQty = Math.max(1, Math.min(10, it.quantity + delta));
          return { ...it, quantity: newQty };
        }
        return it;
      })
    );
  };

  const checkedItems = items.filter((i) => i.checked !== false);
  const total = Math.round(checkedItems.reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100;

  const handleAddSingle = (item: GroceryItem) => {
    onAddToCart(item);
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1800);
  };

  const handleAddAll = () => {
    setAddedAll(true);
    onAddAllToCart(checkedItems);
    setTimeout(() => setAddedAll(false), 2000);
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBadge}>
            <Text style={styles.iconEmoji}>🛒</Text>
          </View>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.title} numberOfLines={1}>
              {groceryList.title || 'Voice Grocery Order'}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {checkedItems.length} items • Est. delivery 45 mins
            </Text>
          </View>
        </View>
      </View>

      {/* Voice Transcript Tag */}
      {groceryList.transcript ? (
        <View style={styles.transcriptBox}>
          <Text style={styles.transcriptIcon}>🎙️</Text>
          <Text style={styles.transcriptText} numberOfLines={2}>
            "{groceryList.transcript}"
          </Text>
        </View>
      ) : null}

      {/* Horizontal Carousel of Grocery Cards with Stagger & Image Shimmer */}
      <View style={styles.carouselContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {items.map((item, index) => {
            const isChecked = item.checked !== false;
            const isItemAdded = !!addedItemIds[item.id];
            return (
              <GroceryItemCard
                key={item.id}
                item={item}
                index={index}
                isChecked={isChecked}
                isItemAdded={isItemAdded}
                onToggleCheck={toggleCheck}
                onUpdateQuantity={updateQuantity}
                onAddSingle={handleAddSingle}
              />
            );
          })}
        </ScrollView>
      </View>

      {/* Footer Total & Add All Action */}
      <View style={styles.footer}>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Estimated Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.addAllBtn, (checkedItems.length === 0 || addedAll) && styles.addAllBtnDone]}
          onPress={handleAddAll}
          disabled={checkedItems.length === 0 || addedAll}
          activeOpacity={0.8}
        >
          <Text style={styles.addAllText}>
            {addedAll ? '✓ Added to Cart!' : `🛒 Add ${checkedItems.length} Items to Cart`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  headerTitleWrap: {
    flex: 1,
    minWidth: 0,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    flexShrink: 0,
  },
  iconEmoji: {
    fontSize: 18,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  transcriptBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
    gap: 6,
  },
  transcriptIcon: {
    fontSize: 14,
  },
  transcriptText: {
    fontSize: 12,
    color: '#4B5563',
    fontStyle: 'italic',
    flex: 1,
  },
  carouselContainer: {
    marginVertical: 4,
  },
  horizontalScrollContent: {
    paddingVertical: 4,
    gap: 10,
  },
  itemCard: {
    width: 165,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemCardUnchecked: {
    opacity: 0.5,
  },
  imgWrapper: {
    width: '100%',
    height: 96,
    backgroundColor: '#F3F4F6',
    position: 'relative',
    overflow: 'hidden',
  },
  skeletonBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  skeletonText: {
    fontSize: 9,
    color: '#065F46',
    fontWeight: '600',
    marginTop: 2,
  },
  itemImg: {
    width: '100%',
    height: '100%',
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
    zIndex: 2,
  },
  checkBadgeActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  checkBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  unitPill: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(17, 24, 39, 0.72)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 2,
  },
  unitPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  cardInfo: {
    padding: 10,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    minHeight: 34,
    lineHeight: 17,
  },
  itemNameMuted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  itemBrand: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
    marginTop: 1,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 4,
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#059669',
  },
  itemUnitPrice: {
    fontSize: 10,
    color: '#6B7280',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 7,
    paddingHorizontal: 3,
    paddingVertical: 2,
    gap: 2,
  },
  stepperBtn: {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  stepperNum: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    minWidth: 14,
    textAlign: 'center',
  },
  addSingleBtn: {
    flex: 1,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingVertical: 4,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSingleBtnAdded: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  addSingleBtnDisabled: {
    opacity: 0.4,
  },
  addSingleText: {
    color: '#065F46',
    fontSize: 11,
    fontWeight: '700',
  },
  addSingleTextAdded: {
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalBox: {
    justifyContent: 'center',
  },
  totalLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  addAllBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addAllBtnDone: {
    backgroundColor: '#10B981',
  },
  addAllText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
