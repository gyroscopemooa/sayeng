export interface Card {
  id: string;
  imageUrl: string;
  object: string;
  color: string;
  askMode: 'object' | 'color_object';
  prompt_ko: string;
  prompt_en: string;
  answers_en: string[];
}

export interface Attempt {
  id: string;
  createdAt: number;
  cardId: string;
  recognizedText: string;
  isCorrect: boolean;
  userId: string;
  lang: 'ko' | 'en';
}
