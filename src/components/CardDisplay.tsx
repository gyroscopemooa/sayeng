import { Card } from '../types';

interface CardDisplayProps {
  card: Card;
  lang: 'ko' | 'en';
}

export const CardDisplay = ({ card, lang }: CardDisplayProps) => {
  return (
    <div className="card-container">
      <div className="card-image-wrapper">
        <img 
          src={card.imageUrl} 
          alt="Quiz" 
          className="card-image"
        />
      </div>
      <h2 className="prompt-text">
        {lang === 'ko' ? card.prompt_ko : card.prompt_en}
      </h2>
      {lang === 'ko' && (
         <p className="hint-text">Answer in English</p>
      )}
    </div>
  );
};
