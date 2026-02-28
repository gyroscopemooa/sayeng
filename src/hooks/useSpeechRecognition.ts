import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionProps {
  onResult?: (text: string) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  lang?: 'en-US' | 'ko-KR';
}

export const useSpeechRecognition = ({ 
  onResult, 
  onEnd, 
  onError, 
  lang = 'en-US' 
}: UseSpeechRecognitionProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const isStartedRef = useRef(false);
  
  const onResultRef = useRef(onResult);
  const onEndRef = useRef(onEnd);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onResultRef.current = onResult;
    onEndRef.current = onEnd;
    onErrorRef.current = onError;
  }, [onResult, onEnd, onError]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // We use false and manual restart for better control in quiz
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsListening(true);
        isStartedRef.current = true;
      };
      
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        const currentText = finalTranscript || interimTranscript;
        setTranscript(currentText);

        if (finalTranscript && onResultRef.current) {
            onResultRef.current(finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        isStartedRef.current = false;
        
        if (event.error === 'not-allowed') {
          alert("마이크 권한이 거부되었습니다. 브라우저 설정에서 마이크를 허용해주세요.");
        }
        
        if (onErrorRef.current) onErrorRef.current(event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
        isStartedRef.current = false;
        if (onEndRef.current) onEndRef.current();
      };

      recognitionRef.current = recognition;
    }

    return () => {
        if(recognitionRef.current) {
            try {
                recognitionRef.current.stop(); 
            } catch(e) {/* ignore */}
        }
    }
  }, [lang]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isStartedRef.current) return;

    try {
      setTranscript('');
      recognitionRef.current.start();
    } catch (e) {
      console.error("Start error", e);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      isStartedRef.current = false;
    }
  }, []);

  const supported = !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  return { isListening, transcript, startListening, stopListening, supported, setTranscript };
};
