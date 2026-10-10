import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
} from 'react-native';
import { Meal } from '../../types';
import { REAL_DAILY_DROP_MEALS } from '../../realDailyDropMeals';
import { MobileMealImage } from '../MobileMealImage';
import { MobileCelebrationModal } from '../MobileCelebrationModal';

interface MobileFoodIQWidgetProps {
  onAddToCart: (mealId: string) => void;
  onPlayAgain?: () => void;
}

interface FoodIQQuestion {
  id: string;
  category: string;
  categoryIcon: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  actionMealKeyword: string;
  actionMealTagline: string;
}

const FOOD_IQ_QUESTIONS: FoodIQQuestion[] = [
  {
    id: 'why_there_1',
    category: 'Why Is It There?',
    categoryIcon: '🧑‍🍳',
    question: 'Why do we add yoghurt to authentic chicken marinades?',
    options: [
      'To make the marinade sweeter',
      'Lactic acid tenderises fibres while fat carries aromatics',
      'To turn the crust extra crispy',
      'To make the chicken darker in colour',
    ],
    correctIndex: 1,
    explanation:
      "Yoghurt's gentle lactic acidity breaks down tough surface proteins without turning them mushy. Meanwhile, its dairy fats dissolve fat-soluble spice compounds (like cumin and garam masala), carrying flavour deep into the meat.",
    actionMealKeyword: 'tandoori|chicken|curry',
    actionMealTagline: 'Marinated in live yoghurt, ginger, garlic & fragrant charcoal spices.',
  },
  {
    id: 'spice_school_1',
    category: 'Spice School',
    categoryIcon: '🌶️',
    question: 'What is the culinary secret of adding golden turmeric to curries & dals?',
    options: [
      'It creates extreme fiery chili heat',
      'Adds warm earthy depth, brilliant golden color & antioxidant curcumin',
      'It acts as a rapid sugar substitute',
      'It turns the sauce completely transparent',
    ],
    correctIndex: 1,
    explanation:
      'Turmeric provides subtle, musky, ginger-like warmth and its iconic golden brilliance. Its active compound, curcumin, is fat-soluble and activated when bloomed in hot oil with black pepper.',
    actionMealKeyword: 'dal|palak|turmeric|yellow',
    actionMealTagline: 'Tempered with golden turmeric, cumin seeds, garlic, and slow-simmered lentils.',
  },
  {
    id: 'ingredient_detective_1',
    category: 'Ingredient Detective',
    categoryIcon: '🧂',
    question: 'Which natural ingredient adds deep, savory "umami" depth to broths and sauces?',
    options: [
      'Refined white table sugar',
      'Fermented miso & kombu sea kelp (rich in natural glutamates)',
      'Artificial yellow food coloring',
      'Plain cold water',
    ],
    correctIndex: 1,
    explanation:
      'Natural fermentation releases free glutamate amino acids in miso and sea kelp. This triggers umami taste receptors on your tongue, amplifying savory richness without relying on excess sodium.',
    actionMealKeyword: 'tofu|miso|ramen|noodle',
    actionMealTagline: 'Slow-simmered rich umami dashi broth with organic silky tofu & bok choy.',
  },
  {
    id: 'kitchen_science_1',
    category: 'Kitchen Science',
    categoryIcon: '🍳',
    question: 'Why does high-heat wok searing (the Maillard reaction) make food taste so craveable?',
    options: [
      'It eliminates all moisture completely',
      'Amino acids and reducing sugars rearrange into hundreds of new flavour molecules',
      'It simply chars the food black',
      'It adds table salt from the pan surface',
    ],
    correctIndex: 1,
    explanation:
      'Above 140°C, proteins and sugars recombine in the Maillard reaction to synthesize hundreds of aromatic heterocyclic compounds, producing the irresistible roasted, nutty, and savory flavours of great wok cooking.',
    actionMealKeyword: 'teriyaki|noodle|wok|stir fry',
    actionMealTagline: 'High-heat wok-tossed noodles with caramelised glaze and fresh garden vegetables.',
  },
  {
    id: 'seasonal_1',
    category: 'Eat With the Season',
    categoryIcon: '🌦️',
    question: 'Which fresh produce is harvested at peak crispness & nutrient density during spring?',
    options: [
      'Winter storage turnip',
      'Tender asparagus stalks & vibrant baby spinach',
      'Heavy roasted butternut pumpkin',
      'Cold-climate winter cabbage',
    ],
    correctIndex: 1,
    explanation:
      'Spring sunshine triggers rapid shoot growth in asparagus and tender leafy greens, yielding maximum natural sugars, folate, and crisp texture before summer heat turns them fibrous.',
    actionMealKeyword: 'salad|green|bowl|quinoa',
    actionMealTagline: 'Loaded with crisp seasonal greens, tender asparagus, and light citrus dressing.',
  },
  {
    id: 'world_food_1',
    category: 'Food Around the World',
    categoryIcon: '🌍',
    question: 'Where did the iconic smoky, tomato-braised Jollof rice dish originate?',
    options: [
      'Southern Italy',
      'West Africa (Wolof empire, modern Senegal / Nigeria)',
      'Central Thailand',
      'The Andes Mountains',
    ],
    correctIndex: 1,
    explanation:
      'Jollof rice was created by the Wolof people of West Africa. Today it is one of the continent’s most beloved cultural treasures, celebrated for its slow-reduced plum tomato, red bell pepper, and smoked paprika aromatics.',
    actionMealKeyword: 'rice|biryani|spiced',
    actionMealTagline: 'Long-grain rice simmered slowly in rich tomato, bell pepper and smoked aromatic reduction.',
  },
  {
    id: 'nutrition_challenge_1',
    category: 'Nutrition Challenge',
    categoryIcon: '🥗',
    question: 'Which ingredient duo naturally creates a complete plant protein with all 9 essential amino acids?',
    options: [
      'White bread with salted butter',
      'Legumes (lentils/beans) paired with whole grains (brown rice)',
      'Plain iceberg lettuce alone',
      'Sugar syrup glaze',
    ],
    correctIndex: 1,
    explanation:
      'Legumes are high in lysine but lower in methionine, while grains are rich in methionine and lower in lysine. Eaten together, they form a complete, highly bioavailable protein profile packed with fibre.',
    actionMealKeyword: 'chickpea|dal|lentil|curry',
    actionMealTagline: 'Hearty legumes and nutrient-rich grains delivering 22g clean plant protein.',
  },
  {
    id: 'chef_secrets_1',
    category: 'Chef Secrets',
    categoryIcon: '👨‍🍳',
    question: 'Why do master chefs insist on resting grilled proteins for 5 minutes before slicing?',
    options: [
      'To allow the meat to get cold',
      'Allows tense muscle fibres to relax so moisture redistributes throughout',
      'To dry out the outer surface',
      'To protect the cutting board from heat',
    ],
    correctIndex: 1,
    explanation:
      'Cooking forces moisture toward the centre of the meat as fibres contract. Resting relaxes the proteins, allowing delicious juices to redistribute evenly instead of spilling onto your cutting board.',
    actionMealKeyword: 'chicken|beef|steak|rosemary',
    actionMealTagline: 'Herb-marinated protein rested to succulent perfection with roasted seasonal sides.',
  },
];

export const MobileFoodIQWidget: React.FC<MobileFoodIQWidgetProps> = ({
  onAddToCart,
  onPlayAgain,
}) => {
  // Session Gamification State
  const [iqScore, setIqScore] = useState(40);
  const [dailyStreak] = useState(3);
  const [questions] = useState(() => {
    return [...FOOD_IQ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 3);
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isChallengeDone, setIsChallengeDone] = useState(false);
  const [matchedActionMeal, setMatchedActionMeal] = useState<Meal | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Animations
  const answerFadeAnim = useRef(new Animated.Value(0)).current;
  const scoreBadgeAnim = useRef(new Animated.Value(1)).current;

  const currentQ = questions[currentQuestionIndex] || FOOD_IQ_QUESTIONS[0];

  // Resolve matching meal for "See it in action"
  const findActionMeal = (keyword: string): Meal => {
    const rx = new RegExp(keyword, 'i');
    const match = REAL_DAILY_DROP_MEALS.find(
      (m) => rx.test(m.name) || rx.test(m.cuisine) || rx.test(m.description)
    );
    return match || REAL_DAILY_DROP_MEALS[0];
  };

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOptionIndex(idx);
    setHasAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      setIqScore((prev) => prev + 10);
      // Punch bounce on score pill
      Animated.sequence([
        Animated.timing(scoreBadgeAnim, {
          toValue: 1.25,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(scoreBadgeAnim, {
          toValue: 1,
          friction: 4,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Resolve action meal
    const meal = findActionMeal(currentQ.actionMealKeyword);
    setMatchedActionMeal(meal);

    // Fade in explanation & action meal
    Animated.timing(answerFadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setHasAnswered(false);
      setMatchedActionMeal(null);
      answerFadeAnim.setValue(0);
    } else {
      setIsChallengeDone(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setHasAnswered(false);
    setIsChallengeDone(false);
    setMatchedActionMeal(null);
    answerFadeAnim.setValue(0);
    onPlayAgain?.();
  };

  // Determine Level Title
  const getLevelTier = (score: number) => {
    if (score < 30) return { title: 'Food Curious', icon: '🌱' };
    if (score < 60) return { title: 'Food Explorer', icon: '🧭' };
    if (score < 100) return { title: 'Foodie', icon: '🍴' };
    if (score < 150) return { title: 'Food Expert', icon: '🏅' };
    return { title: 'Food Master', icon: '👑' };
  };

  const currentLevel = getLevelTier(iqScore);

  if (isChallengeDone) {
    return (
      <View style={styles.completedContainer}>
        <View style={styles.completedHeader}>
          <Text style={styles.completedTrophy}>🎓</Text>
          <Text style={styles.completedTitle}>Daily Food IQ Complete!</Text>
        </View>

        <Text style={styles.completedSubtitle}>
          You finished today's 3 food science & culinary challenges.
        </Text>

        {/* Stats Summary Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsCol}>
            <Text style={styles.statsNum}>{iqScore}</Text>
            <Text style={styles.statsLabel}>Total Food IQ</Text>
          </View>
          <View style={styles.statsDivider} />
          <View style={styles.statsCol}>
            <Text style={styles.statsNum}>🔥 {dailyStreak}</Text>
            <Text style={styles.statsLabel}>Day Streak</Text>
          </View>
          <View style={styles.statsDivider} />
          <View style={styles.statsCol}>
            <Text style={styles.statsNum}>{currentLevel.icon}</Text>
            <Text style={styles.statsLabel}>{currentLevel.title}</Text>
          </View>
        </View>

        {/* Action Meal Feature */}
        {matchedActionMeal && (
          <View style={styles.finalMealCard}>
            <Text style={styles.finalMealHeader}>Featured Daily Drop Connection:</Text>
            <MobileMealImage
              uri={matchedActionMeal.imageUrl}
              style={styles.finalMealImage}
              dishName={matchedActionMeal.name}
            />
            <View style={styles.finalMealBody}>
              <View style={styles.finalMealTop}>
                <Text style={styles.finalMealName}>{matchedActionMeal.name}</Text>
                <Text style={styles.finalMealPrice}>${matchedActionMeal.price.toFixed(2)}</Text>
              </View>
              <Text style={styles.finalMealRest}>
                {matchedActionMeal.restaurantName} · {matchedActionMeal.cuisine}
              </Text>
              <TouchableOpacity
                style={styles.orderFinalBtn}
                activeOpacity={0.88}
                onPress={() => onAddToCart(matchedActionMeal.id)}
              >
                <Text style={styles.orderFinalBtnText}>
                  🛒 Order This Dish — ${matchedActionMeal.price.toFixed(2)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.playAgainBtn} onPress={handleRestart}>
          <Text style={styles.playAgainBtnText}>🧠 Play Another Food IQ Challenge</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Gamification Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.iqBadge}>
            <Text style={styles.headerEmoji}>🧠</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Food IQ</Text>
            <Text style={styles.headerSubtitle}>Learn • Understand • Taste</Text>
          </View>
        </View>

        {/* Interactive Stats Chips */}
        <View style={styles.statsPillRow}>
          <Animated.View
            style={[
              styles.scorePill,
              { transform: [{ scale: scoreBadgeAnim }] },
            ]}
          >
            <Text style={styles.scorePillText}>✨ {iqScore} IQ</Text>
          </Animated.View>
          <View style={styles.streakPill}>
            <Text style={styles.streakPillText}>🔥 {dailyStreak}d</Text>
          </View>
        </View>
      </View>

      {/* Challenge Progress Bar & Category Pill */}
      <View style={styles.roundMetaRow}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryIcon}>{currentQ.categoryIcon}</Text>
          <Text style={styles.categoryName}>{currentQ.category}</Text>
        </View>
        <Text style={styles.progressCounter}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
      </View>

      {/* Question Card */}
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{currentQ.question}</Text>
      </View>

      {/* Multiple Choice Options (A, B, C, D) */}
      <View style={styles.optionsCol}>
        {currentQ.options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const isSelected = selectedOptionIndex === idx;
          const isCorrect = idx === currentQ.correctIndex;

          let btnStyle: any = styles.optionBtn;
          let badgeStyle: any = styles.optionLetterBadge;
          let textStyle: any = styles.optionText;

          if (hasAnswered) {
            if (isCorrect) {
              btnStyle = [styles.optionBtn, styles.optionBtnCorrect];
              badgeStyle = [styles.optionLetterBadge, styles.optionLetterBadgeCorrect];
              textStyle = [styles.optionText, styles.optionTextCorrect];
            } else if (isSelected && !isCorrect) {
              btnStyle = [styles.optionBtn, styles.optionBtnWrong];
              badgeStyle = [styles.optionLetterBadge, styles.optionLetterBadgeWrong];
              textStyle = [styles.optionText, styles.optionTextWrong];
            }
          }

          return (
            <TouchableOpacity
              key={idx}
              style={btnStyle}
              activeOpacity={0.85}
              disabled={hasAnswered}
              onPress={() => handleSelectOption(idx)}
            >
              <View style={badgeStyle}>
                <Text style={styles.optionLetterText}>
                  {hasAnswered && isCorrect ? '✓' : hasAnswered && isSelected && !isCorrect ? '✕' : letter}
                </Text>
              </View>
              <Text style={textStyle}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Post-Answer Educational Explanation & "See it in action" meal link */}
      {hasAnswered && (
        <Animated.View
          style={[
            styles.answerSection,
            {
              opacity: answerFadeAnim,
              transform: [
                {
                  translateY: answerFadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [14, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Science Insight Box */}
          <View
            style={[
              styles.insightBox,
              selectedOptionIndex === currentQ.correctIndex
                ? styles.insightBoxCorrect
                : styles.insightBoxNeutral,
            ]}
          >
            <View style={styles.insightHeader}>
              <Text style={styles.insightHeaderTitle}>
                {selectedOptionIndex === currentQ.correctIndex
                  ? '🎉 Correct! +10 Food IQ'
                  : "💡 Good try! Here's the science:"}
              </Text>
            </View>
            <Text style={styles.insightText}>{currentQ.explanation}</Text>
          </View>

          {/* "See It in Action" Culinary Connection */}
          {matchedActionMeal && (
            <View style={styles.actionMealCard}>
              <View style={styles.actionMealHeaderRow}>
                <Text style={styles.actionMealHeaderTitle}>🍗 See It In Action on Daily Drop</Text>
              </View>

              <View style={styles.actionMealContent}>
                <MobileMealImage
                  uri={matchedActionMeal.imageUrl}
                  style={styles.actionMealThumb}
                  dishName={matchedActionMeal.name}
                />
                <View style={styles.actionMealDetails}>
                  <Text style={styles.actionMealName} numberOfLines={1}>
                    {matchedActionMeal.name}
                  </Text>
                  <Text style={styles.actionMealRest}>
                    {matchedActionMeal.restaurantName} · ${matchedActionMeal.price.toFixed(2)}
                  </Text>
                  <Text style={styles.actionMealNote} numberOfLines={2}>
                    {currentQ.actionMealTagline}
                  </Text>
                </View>
              </View>

              {/* Action Buttons: View/Order or Continue to Next Question */}
              <View style={styles.actionBtnRow}>
                <TouchableOpacity
                  style={styles.viewMealBtn}
                  activeOpacity={0.85}
                  onPress={() => onAddToCart(matchedActionMeal.id)}
                >
                  <Text style={styles.viewMealBtnText}>
                    🛒 Order — ${matchedActionMeal.price.toFixed(2)}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.nextQBtn}
                  activeOpacity={0.85}
                  onPress={handleNextQuestion}
                >
                  <Text style={styles.nextQBtnText}>
                    {currentQuestionIndex + 1 < questions.length ? 'Next Question ➔' : 'Finish Challenge 🎓'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Animated.View>
      )}

      {/* Shared Celebration Modal */}
      {matchedActionMeal && (
        <MobileCelebrationModal
          visible={showCelebration}
          meal={matchedActionMeal}
          onClose={() => setShowCelebration(false)}
          onAddToCart={(mId) => {
            setShowCelebration(false);
            onAddToCart(mId);
          }}
          title="FOOD IQ UNLOCKED! 🧠"
          subtitle="You decoded the culinary secret behind this chef meal!"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iqBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerEmoji: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1E1B4B',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#6366F1',
    fontWeight: '600',
  },
  statsPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scorePill: {
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  scorePillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#7C3AED',
  },
  streakPill: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  streakPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EA580C',
  },
  roundMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  categoryIcon: {
    fontSize: 13,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  progressCounter: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  questionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  questionText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 22,
  },
  optionsCol: {
    gap: 9,
    marginBottom: 12,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
  },
  optionBtnCorrect: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  optionBtnWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  optionLetterBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  optionLetterBadgeCorrect: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  optionLetterBadgeWrong: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  optionLetterText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    lineHeight: 18,
  },
  optionTextCorrect: {
    color: '#065F46',
    fontWeight: '700',
  },
  optionTextWrong: {
    color: '#991B1B',
  },
  answerSection: {
    marginTop: 4,
    gap: 12,
  },
  insightBox: {
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
  },
  insightBoxCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  insightBoxNeutral: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  insightHeader: {
    marginBottom: 4,
  },
  insightHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
  },
  insightText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  actionMealCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  actionMealHeaderRow: {
    marginBottom: 8,
  },
  actionMealHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
    letterSpacing: 0.3,
  },
  actionMealContent: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  actionMealThumb: {
    width: 68,
    height: 68,
    borderRadius: 10,
  },
  actionMealDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  actionMealName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  actionMealRest: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 3,
  },
  actionMealNote: {
    fontSize: 11,
    color: '#78350F',
    lineHeight: 15,
  },
  actionBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  viewMealBtn: {
    flex: 1,
    backgroundColor: '#0D7844',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewMealBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  nextQBtn: {
    flex: 1,
    backgroundColor: '#4338CA',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  nextQBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Completed State
  completedContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  completedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  completedTrophy: {
    fontSize: 26,
  },
  completedTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E1B4B',
  },
  completedSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 14,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statsCol: {
    alignItems: 'center',
  },
  statsNum: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 2,
  },
  statsLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  statsDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  finalMealCard: {
    width: '100%',
    borderRadius: 14,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    overflow: 'hidden',
    marginBottom: 14,
  },
  finalMealHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
    padding: 10,
    backgroundColor: '#FEF3C7',
  },
  finalMealImage: {
    width: '100%',
    height: 120,
  },
  finalMealBody: {
    padding: 12,
  },
  finalMealTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  finalMealName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  finalMealPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D7844',
  },
  finalMealRest: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 10,
  },
  orderFinalBtn: {
    backgroundColor: '#0D7844',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  orderFinalBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  playAgainBtn: {
    paddingVertical: 8,
  },
  playAgainBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4338CA',
  },
});
