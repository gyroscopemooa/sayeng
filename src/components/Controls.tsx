import { Mic, MicOff, RefreshCw, ArrowRight } from 'lucide-react';

interface ControlsProps {
  isListening: boolean;
  transcript: string;
  result: 'correct' | 'incorrect' | null;
  onStartListening: () => void;
  onStopListening: () => void;
  onNext: () => void;
  supported: boolean;
}

export const Controls = ({ 
  isListening, 
  transcript, 
  result, 
  onStartListening, 
  onStopListening, 
  onNext,
  supported 
}: ControlsProps) => {
  if (!supported) {
      return <div className="feedback incorrect">Browser not supported. Please use Chrome.</div>
  }

  return (
    <div className="container" style={{ minHeight: 'auto' }}>
      
      <div className={`transcript-box ${result}`}>
        <p>
            {transcript || (isListening ? "Listening..." : "Tap mic to speak")}
        </p>
      </div>

      <div className="controls-row">
        {!result && (
            <button
                onClick={isListening ? onStopListening : onStartListening}
                className={`btn btn-icon btn-mic ${isListening ? 'listening' : ''}`}
            >
                {isListening ? <MicOff color="white" size={32} /> : <Mic color="white" size={32} />}
            </button>
        )}

        {result === 'incorrect' && (
            <button
                onClick={onStartListening}
                className="btn btn-try-again btn-md"
            >
                <RefreshCw size={20} /> Try Again
            </button>
        )}

        {result === 'correct' && (
            <button
                onClick={onNext}
                className="btn btn-next btn-md"
            >
                Next <ArrowRight size={20} />
            </button>
        )}
      </div>
    </div>
  );
};
