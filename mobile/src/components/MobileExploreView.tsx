import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';

interface MobileExploreViewProps {
  onStartChat: (prompt: string) => void;
  onAddToCart: (mealId: string) => void;
}

const CATEGORIES = ['All', 'Under $15', 'Spicy 🌶️', 'High-Protein', 'Vegetarian'];

const EXPLORE_ITEMS = [
  {
    id: 'meal_biryani',
    name: 'Chicken Biryani',
    restaurant: 'Spice Lounge',
    price: 12,
    score: 95,
    tag: 'Popular',
    img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
    category: 'Under $15',
  },
  {
    id: 'meal_thai_basil',
    name: 'Thai Basil Chicken',
    restaurant: 'Bangkok Bites',
    price: 13,
    score: 91,
    tag: 'Spicy 🌶️',
    img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=400&q=80',
    category: 'Spicy 🌶️',
  },
  {
    id: 'meal_jollof',
    name: 'Jollof Chicken Bowl',
    restaurant: 'Afro Grills',
    price: 12,
    score: 88,
    tag: 'New for you',
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    category: 'Under $15',
  },
  {
    id: 'meal_caesar',
    name: 'Chicken Caesar Salad',
    restaurant: 'Green Fork',
    price: 11,
    score: 89,
    tag: 'High-Protein',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
    category: 'High-Protein',
  },
  {
    id: 'meal_curry',
    name: 'Vegetable Curry Bowl',
    restaurant: 'Namaste Deli',
    price: 12,
    score: 86,
    tag: 'Vegetarian',
    img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80',
    category: 'Vegetarian',
  },
  {
    id: 'meal_salmon_brown_rice',
    name: 'Teriyaki Salmon Bento',
    restaurant: 'Tokyo Kitchen',
    price: 14,
    score: 94,
    tag: 'Omega-3 Rich',
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    category: 'High-Protein',
  },
];

export const MobileExploreView: React.FC<MobileExploreViewProps> = ({
  onStartChat,
  onAddToCart,
}) => {
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const handleAdd = (id: string) => {
    onAddToCart(id);
    setAddedIds((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [id]: false }));
    }, 1500);
  };

  const filtered = EXPLORE_ITEMS.filter((item) => {
    const matchesCat =
      selectedCat === 'All' ||
      item.category === selectedCat ||
      item.tag.includes(selectedCat.replace(' 🌶️', ''));
    const matchesSearch =
      !search.trim() ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.restaurant.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Explore Daily Drop 🍽️</Text>

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search meals, cuisines, ingredients..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* AI Assistance Prompt Banner */}
      <TouchableOpacity
        style={styles.aiBanner}
        onPress={() => onStartChat('Help me choose something from the explore menu')}
      >
        <Text style={styles.aiBannerSparkle}>✨</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.aiBannerTitle}>Can't decide what to eat?</Text>
          <Text style={styles.aiBannerSub}>Ask Drop AI to recommend the best match</Text>
        </View>
        <Text style={styles.aiBannerArrow}>➔</Text>
      </TouchableOpacity>

      {/* Category Filter Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catsRow}>
        {CATEGORIES.map((cat) => {
          const isActive = selectedCat === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, isActive && styles.catChipActive]}
              onPress={() => setSelectedCat(cat)}
            >
              <Text style={[styles.catChipText, isActive && styles.catChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Meals Grid/List */}
      <View style={styles.mealsList}>
        {filtered.map((item) => {
          const isAdded = addedIds[item.id];
          return (
            <View key={item.id} style={styles.mealCard}>
              <Image source={{ uri: item.img }} style={styles.mealImg} />
              <View style={styles.mealBody}>
                <View style={styles.mealHeaderRow}>
                  <Text style={styles.tagText}>{item.tag}</Text>
                  <Text style={styles.scoreText}>{item.score}% Match</Text>
                </View>
                <Text style={styles.mealTitle}>{item.name}</Text>
                <Text style={styles.restaurantText}>{item.restaurant}</Text>

                <View style={styles.mealFooterRow}>
                  <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
                  <TouchableOpacity
                    style={[styles.addBtn, isAdded && styles.addBtnDone]}
                    onPress={() => handleAdd(item.id)}
                  >
                    <Text style={styles.addBtnText}>
                      {isAdded ? 'Added ✓' : '+ Add to Bag'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  aiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8F0',
    borderWidth: 1,
    borderColor: '#D1EFE2',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    gap: 10,
  },
  aiBannerSparkle: {
    fontSize: 20,
  },
  aiBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0D7844',
  },
  aiBannerSub: {
    fontSize: 11,
    color: '#4B5563',
  },
  aiBannerArrow: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0D7844',
  },
  catsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  catChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  catChipActive: {
    backgroundColor: '#0D7844',
    borderColor: '#0D7844',
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  catChipTextActive: {
    color: '#FFFFFF',
  },
  mealsList: {
    gap: 12,
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  mealImg: {
    width: '100%',
    height: 140,
    backgroundColor: '#F3F4F6',
  },
  mealBody: {
    padding: 14,
  },
  mealHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D7844',
  },
  scoreText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  restaurantText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 10,
  },
  mealFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  addBtn: {
    backgroundColor: '#0D7844',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  addBtnDone: {
    backgroundColor: '#10B981',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
});
