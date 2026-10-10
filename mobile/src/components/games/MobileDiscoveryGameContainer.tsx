import React from 'react';
import { View } from 'react-native';
import { GamePayload } from '../../types';
import { MobileFoodTinderWidget } from './MobileFoodTinderWidget';
import { MobileMealBattleWidget } from './MobileMealBattleWidget';
import { MobileThisOrThatWidget } from './MobileThisOrThatWidget';
import { MobileMealRouletteWidget } from './MobileMealRouletteWidget';
import { MobileMysteryMealWidget } from './MobileMysteryMealWidget';
import { MobileFoodPassportWidget } from './MobileFoodPassportWidget';
import { MobileGuessDishWidget } from './MobileGuessDishWidget';
import { MobileBuildMealWidget } from './MobileBuildMealWidget';
import { MobileFoodIQWidget } from './MobileFoodIQWidget';

interface MobileDiscoveryGameContainerProps {
  payload: GamePayload;
  onAddToCart: (mealId: string) => void;
  onSendMessage?: (prompt: string) => void;
  onClose?: () => void;
  onPreferencesDiscovered?: (signals: {
    likedCuisines: string[];
    spicyLoved: boolean;
    proteinPref: string;
  }) => void;
}

export const MobileDiscoveryGameContainer: React.FC<MobileDiscoveryGameContainerProps> = ({
  payload,
  onAddToCart,
  onSendMessage,
  onClose,
  onPreferencesDiscovered,
}) => {
  switch (payload.gameType) {
    case 'food_tinder':
      return (
        <MobileFoodTinderWidget
          onAddToCart={onAddToCart}
          onClose={onClose}
          onPreferencesDiscovered={onPreferencesDiscovered}
        />
      );

    case 'meal_battle':
      return <MobileMealBattleWidget onAddToCart={onAddToCart} />;

    case 'this_or_that':
      return <MobileThisOrThatWidget onAddToCart={onAddToCart} />;

    case 'meal_roulette':
      return <MobileMealRouletteWidget onAddToCart={onAddToCart} />;

    case 'mystery_meal':
      return <MobileMysteryMealWidget onAddToCart={onAddToCart} />;

    case 'food_passport':
      return <MobileFoodPassportWidget onAddToCart={onAddToCart} />;

    case 'guess_dish':
      return <MobileGuessDishWidget onAddToCart={onAddToCart} />;

    case 'build_meal':
      return (
        <MobileBuildMealWidget
          onAddToCart={onAddToCart}
          onPreferencesDiscovered={onPreferencesDiscovered}
        />
      );

    case 'food_iq':
      return <MobileFoodIQWidget onAddToCart={onAddToCart} />;

    default:
      return null;
  }
};
