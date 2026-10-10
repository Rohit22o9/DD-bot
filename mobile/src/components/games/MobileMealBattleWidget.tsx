import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Meal } from '../../types';
import { REAL_DAILY_DROP_MEALS } from '../../realDailyDropMeals';
import { MobileMealImage } from '../MobileMealImage';
import { MobileCelebrationModal } from '../MobileCelebrationModal';

interface MobileMealBattleWidgetProps {
  onAddToCart: (mealId: string) => void;
  onPlayAgain?: () => void;
}

export const MobileMealBattleWidget: React.FC<MobileMealBattleWidgetProps> = ({
  onAddToCart,
  onPlayAgain,
}) => {
  // Pull real mains from catalog
  const realMains = REAL_DAILY_DROP_MEALS.filter((m) => m.category === 'main');

  // Generate 5 random contenders for 4 rounds
  const [battleDeck, setBattleDeck] = useState<Meal[]>(() => {
    return [...realMains].sort(() => Math.random() - 0.5).slice(0, 8);
  });

  const [currentRound, setCurrentRound] = useState(1);
  const totalRounds = 4;

  const [currentLeader, setCurrentLeader] = useState<Meal>(() => battleDeck[0] || realMains[0]);
  const [currentChallenger, setCurrentChallenger] = useState<Meal>(() => battleDeck[1] || realMains[1]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<Meal | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Tap animation & feedback state
  const [selectedContender, setSelectedContender] = useState<'leader' | 'challenger' | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const leaderScale = React.useRef(new Animated.Value(1)).current;
  const challengerScale = React.useRef(new Animated.Value(1)).current;
  const leaderOpacity = React.useRef(new Animated.Value(1)).current;
  const challengerOpacity = React.useRef(new Animated.Value(1)).current;

  const handlePickContender = (which: 'leader' | 'challenger', picked: Meal) => {
    if (isVoting) return;
    setIsVoting(true);
    setSelectedContender(which);

    const winnerScale = which === 'leader' ? leaderScale : challengerScale;
    const loserScale = which === 'leader' ? challengerScale : leaderScale;
    const loserOpacity = which === 'leader' ? challengerOpacity : leaderOpacity;

    // Pulse animation on the tapped meal: punch up and settle
    Animated.parallel([
      Animated.sequence([
        Animated.timing(winnerScale, {
          toValue: 1.05,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.spring(winnerScale, {
          toValue: 1.02,
          friction: 4,
          tension: 70,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(loserScale, {
        toValue: 0.94,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(loserOpacity, {
        toValue: 0.45,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Brief pause so user sees the selected winner clearly before transitioning
      setTimeout(() => {
        leaderScale.setValue(1);
        challengerScale.setValue(1);
        leaderOpacity.setValue(1);
        challengerOpacity.setValue(1);
        setSelectedContender(null);
        setIsVoting(false);

        if (currentRound >= totalRounds) {
          // Winner crowned!
          setWinner(picked);
          setIsGameOver(true);
          setShowCelebration(true);
        } else {
          const nextRound = currentRound + 1;
          setCurrentRound(nextRound);
          setCurrentLeader(picked);
          // Next challenger from randomized deck
          const nextChallenger = battleDeck[nextRound] || realMains[(nextRound + 2) % realMains.length];
          setCurrentChallenger(nextChallenger);
        }
      }, 340);
    });
  };

  const handleRestart = () => {
    const newDeck = [...realMains].sort(() => Math.random() - 0.5).slice(0, 8);
    leaderScale.setValue(1);
    challengerScale.setValue(1);
    leaderOpacity.setValue(1);
    challengerOpacity.setValue(1);
    setSelectedContender(null);
    setIsVoting(false);
    setBattleDeck(newDeck);
    setCurrentRound(1);
    setCurrentLeader(newDeck[0]);
    setCurrentChallenger(newDeck[1]);
    setIsGameOver(false);
    setWinner(null);
    onPlayAgain?.();
  };

  if (isGameOver && winner) {
    return (
      <View style={styles.winnerContainer}>
        <View style={styles.winnerHeader}>
          <Text style={styles.trophy}>🏆</Text>
          <Text style={styles.winnerTitle}>YOUR WINNER!</Text>
        </View>

        <Text style={styles.winnerSubtitle}>
          Undefeated champion after 4 epic food battles ⚔️
        </Text>

        {/* Crowned Meal Card */}
        <View style={styles.winnerCard}>
          <MobileMealImage
            uri={winner.imageUrl}
            style={styles.winnerImage}
            dishName={winner.name}
          />
          <View style={styles.winnerCardBody}>
            <View style={styles.winnerRow}>
              <Text style={styles.winnerName}>{winner.name}</Text>
              <Text style={styles.winnerPrice}>${winner.price.toFixed(2)}</Text>
            </View>
            <Text style={styles.winnerRest}>
              {winner.restaurantName} · {winner.cuisine}
            </Text>
            <Text style={styles.winnerDesc} numberOfLines={2}>
              {winner.description}
            </Text>

            <TouchableOpacity
              style={styles.orderWinnerBtn}
              activeOpacity={0.8}
              onPress={() => onAddToCart(winner.id)}
            >
              <Text style={styles.orderWinnerText}>
                🛒 Order the winner — ${winner.price.toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.newBattleBtn} onPress={handleRestart}>
          <Text style={styles.newBattleText}>⚔️ Start a New Battle</Text>
        </TouchableOpacity>

        {/* Celebratory Pop-up with Falling Confetti Bars */}
        <MobileCelebrationModal
          visible={showCelebration}
          meal={winner}
          onClose={() => setShowCelebration(false)}
          onAddToCart={(mealId) => {
            setShowCelebration(false);
            onAddToCart(mealId);
          }}
          title="CHAMPION CROWNED! ⚔️"
          subtitle="Undefeated champion after 4 epic battles!"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title & Round Badge */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.swords}>⚔️</Text>
          <Text style={styles.title}>Meal Battle</Text>
        </View>
        <View style={styles.roundBadge}>
          <Text style={styles.roundText}>
            Round {currentRound} of {totalRounds}
          </Text>
        </View>
      </View>

      <Text style={styles.subtext}>
        Which one wins? Tap either meal to vote and crown tonight's champion.
      </Text>

      {/* Contender 1 */}
      <Animated.View
        style={{
          transform: [{ scale: leaderScale }],
          opacity: leaderOpacity,
        }}
      >
        <TouchableOpacity
          style={[
            styles.fighterCard,
            selectedContender === 'leader' && styles.fighterCardSelected,
          ]}
          activeOpacity={0.85}
          disabled={isVoting}
          onPress={() => handlePickContender('leader', currentLeader)}
        >
          <MobileMealImage
            uri={currentLeader.imageUrl}
            style={styles.fighterImage}
            dishName={currentLeader.name}
          />
          <View style={styles.fighterInfo}>
            <View style={styles.fighterTop}>
              <Text style={styles.fighterName} numberOfLines={1}>
                {currentLeader.name}
              </Text>
              <Text style={styles.fighterPrice}>${currentLeader.price.toFixed(2)}</Text>
            </View>
            <Text style={styles.fighterSub}>
              {currentLeader.restaurantName} · {currentLeader.cuisine}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* VS Ribbon */}
      <View style={styles.vsContainer}>
        <View style={styles.vsLine} />
        <View style={styles.vsBadge}>
          <Text style={styles.vsText}>VS</Text>
        </View>
        <View style={styles.vsLine} />
      </View>

      {/* Contender 2 */}
      <Animated.View
        style={{
          transform: [{ scale: challengerScale }],
          opacity: challengerOpacity,
        }}
      >
        <TouchableOpacity
          style={[
            styles.fighterCard,
            selectedContender === 'challenger' && styles.fighterCardSelected,
          ]}
          activeOpacity={0.85}
          disabled={isVoting}
          onPress={() => handlePickContender('challenger', currentChallenger)}
        >
          <MobileMealImage
            uri={currentChallenger.imageUrl}
            style={styles.fighterImage}
            dishName={currentChallenger.name}
          />
          <View style={styles.fighterInfo}>
            <View style={styles.fighterTop}>
              <Text style={styles.fighterName} numberOfLines={1}>
                {currentChallenger.name}
              </Text>
              <Text style={styles.fighterPrice}>${currentChallenger.price.toFixed(2)}</Text>
            </View>
            <Text style={styles.fighterSub}>
              {currentChallenger.restaurantName} · {currentChallenger.cuisine}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
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
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  swords: {
    fontSize: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  roundBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  roundText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  subtext: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  fighterCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  fighterImage: {
    width: '100%',
    height: 105,
  },
  fighterInfo: {
    padding: 10,
  },
  fighterTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  fighterName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
  },
  fighterPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0D7844',
    marginLeft: 6,
  },
  fighterSub: {
    fontSize: 11,
    color: '#6B7280',
  },
  fighterCardSelected: {
    borderColor: '#0D7844',
    borderWidth: 2,
    backgroundColor: '#F0FDF4',
    shadowColor: '#0D7844',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  voteTapBadge: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 5,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  voteTapBadgeSelected: {
    backgroundColor: '#0D7844',
    borderTopColor: '#0D7844',
  },
  voteTapText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D7844',
    letterSpacing: 0.5,
  },
  voteTapTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  vsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  vsLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  vsBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  vsText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    fontStyle: 'italic',
  },

  // Winner screen
  winnerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  winnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 4,
  },
  trophy: {
    fontSize: 24,
  },
  winnerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#B45309',
    letterSpacing: 0.5,
  },
  winnerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  winnerCard: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 12,
  },
  winnerImage: {
    width: '100%',
    height: 150,
  },
  winnerCardBody: {
    padding: 12,
  },
  winnerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  winnerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
  },
  winnerPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D7844',
    marginLeft: 8,
  },
  winnerRest: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  winnerDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
    marginBottom: 10,
  },
  orderWinnerBtn: {
    backgroundColor: '#0D7844',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#0D7844',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  orderWinnerText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  newBattleBtn: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  newBattleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
});
