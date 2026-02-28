import { useState, useEffect, useCallback } from 'react';
import { Card } from '../types';
import { checkAnswer } from '../utils/normalize';
import { speak } from '../utils/speech';
import { db, auth } from '../lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

export const useGameLogic = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);

  // Load cards
  useEffect(() => {
    const loadCards = async () => {
      setLoading(true);
      
      const isFirebaseConfigured = 
        import.meta.env.VITE_FIREBASE_API_KEY && 
        import.meta.env.VITE_FIREBASE_API_KEY !== 'YOUR_API_KEY';

      try {
        if (isFirebaseConfigured) {
          await signInAnonymously(auth);
          
          const querySnapshot = await getDocs(collection(db, "cards"));
          const fetchedCards: Card[] = [];
          querySnapshot.forEach((doc) => {
            fetchedCards.push({ id: doc.id, ...doc.data() } as Card);
          });

          if (fetchedCards.length > 0) {
              const shuffled = fetchedCards.sort(() => 0.5 - Math.random()).slice(0, 30);
              setCards(shuffled);
              return; // Successfully loaded from Firebase
          }
        }
        
        // Fallback dummy data (If Firebase not configured OR no cards in DB)
        setCards([
          { 
              id: '1', imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6', 
              object: 'apple', color: 'red', askMode: 'object', 
              prompt_ko: '이것은 무엇입니까?', prompt_en: 'What is this?', 
              answers_en: ['apple', 'an apple'] 
          },
          { 
              id: '2', imageUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba', 
              object: 'banana', color: 'yellow', askMode: 'color_object', 
              prompt_ko: '이것의 색깔과 이름은 무엇입니까?', prompt_en: 'What is the color and name of this?', 
              answers_en: ['yellow banana', 'a yellow banana'] 
          }
        ]);
      } catch (e) {
        console.error("Firebase Error or Loading Error:", e);
        // Fallback even on error
        setCards([
          { 
              id: '1', imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6', 
              object: 'apple', color: 'red', askMode: 'object', 
              prompt_ko: '이것은 무엇입니까?', prompt_en: 'What is this?', 
              answers_en: ['apple', 'an apple'] 
          },
          { 
              id: '2', imageUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba', 
              object: 'banana', color: 'yellow', askMode: 'color_object', 
              prompt_ko: '이것의 색깔과 이름은 무엇입니까?', prompt_en: 'What is the color and name of this?', 
              answers_en: ['yellow banana', 'a yellow banana'] 
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadCards();
  }, []);

  const currentCard = cards[currentIndex];

  const handleAnswer = async (text: string) => {
    if (!currentCard || result) return;

    const isCorrect = checkAnswer(text, currentCard.answers_en);
    
    setResult(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
        setScore(prev => prev + 1);
        speak("Correct! " + currentCard.answers_en[0]);
    } else {
        speak("Incorrect. The answer is " + currentCard.answers_en[0]);
    }

    // Log attempt only if Firebase is configured
    if (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== 'YOUR_API_KEY') {
      try {
          const user = auth.currentUser;
          if (user) {
              await addDoc(collection(db, 'attempts'), {
                  createdAt: serverTimestamp(),
                  cardId: currentCard.id,
                  recognizedText: text,
                  isCorrect,
                  userId: user.uid,
                  lang
              });
          }
      } catch(e) {
          console.error("Log error", e);
      }
    }
  };

  const nextCard = useCallback(() => {
    setResult(null);
    if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
    } else {
        // Game Over or Restart logic
        // For now loop back
        setCurrentIndex(0);
        setScore(0);
    }
  }, [currentIndex, cards.length]);

  return {
    cards,
    currentCard,
    currentIndex,
    total: cards.length,
    score,
    lang,
    setLang,
    loading,
    result,
    handleAnswer,
    nextCard
  };
};
