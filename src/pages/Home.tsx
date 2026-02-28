import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    // Request mic permission implicitly by starting context or just nav
    // Actual permission is requested when first using speech recognition
    navigate('/quiz');
  };

  return (
    <div className="container home-container">
      <h1 className="home-title">Speak English Quiz</h1>
      <p className="home-subtitle">
        Look at the picture and say the word in English!
      </p>
      
      <button 
        onClick={handleStart}
        className="btn btn-primary btn-large"
      >
        <Play fill="white" /> Start Quiz
      </button>
    </div>
  );
};
