import { useEffect, useRef } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { CardDisplay } from '../components/CardDisplay';
import { Controls } from '../components/Controls';
import { Feedback } from '../components/Feedback';
import { speak } from '../utils/speech';

export const Quiz = () => {
  const {
    currentCard,
    currentIndex,
    total,
    score,
    lang,
    setLang,
    loading,
    result,
    handleAnswer,
    nextCard
  } = useGameLogic();

  const isTtsPlayingRef = useRef(false);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    supported
  } = useSpeechRecognition({
    onResult: (text) => {
        handleAnswer(text);
        stopListening();
    },
    lang: 'en-US'
  });

  // Read prompt on card change and start mic automatically
  useEffect(() => {
    if (currentCard && !result) {
        const textToSpeak = lang === 'ko' ? currentCard.prompt_ko : currentCard.prompt_en;
        const targetLang = lang === 'ko' ? 'ko-KR' : 'en-US';

        // small delay before speaking
        const timer = setTimeout(() => {
             isTtsPlayingRef.current = true;
             
             // Wrap speak in a way we know when it ends
             if ('speechSynthesis' in window) {
               window.speechSynthesis.cancel();
               const utterance = new SpeechSynthesisUtterance(textToSpeak);
               utterance.lang = targetLang;
               utterance.onend = () => {
                 isTtsPlayingRef.current = false;
                 // Automatically start listening after question ends
                 startListening();
               };
               window.speechSynthesis.speak(utterance);
             }
        }, 800);
        return () => {
          clearTimeout(timer);
          window.speechSynthesis.cancel();
        };
    }
  }, [currentCard, lang, result, startListening]);

  // Auto-next after a correct answer (after a brief delay for user to see feedback)
  useEffect(() => {
    if (result === 'correct') {
      const timer = setTimeout(() => {
        nextCard();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [result, nextCard]);

  if (loading) return <div className="container">Loading...</div>;
  if (!currentCard) return <div className="container">No cards available.</div>;

  return (
    <div className="quiz-wrapper max-w-md">
      {/* Header */}
      <div className="quiz-header flex-between">
        <button 
            onClick={() => setLang(l => l === 'en' ? 'ko' : 'en')}
            className="lang-toggle"
        >
            {lang.toUpperCase()}
        </button>
        <div className="progress">
            {currentIndex + 1} / {total}
        </div>
        <div className="score">
            Score: {score}
        </div>
      </div>

      <div className="container" style={{ minHeight: 'auto', flex: 1 }}>
        <CardDisplay card={currentCard} lang={lang} />
        
        <Feedback result={result} />
        
        {result && (
            <div className="correct-answer-box">
                <p className="hint-text">Correct Answer:</p>
                <p className="correct-answer-text">{currentCard.answers_en[0]}</p>
            </div>
        )}

        <Controls 
            isListening={isListening}
            transcript={transcript}
            result={result}
            onStartListening={startListening}
            onStopListening={stopListening}
            onNext={nextCard}
            supported={supported}
        />
      </div>
    </div>
  );
};
