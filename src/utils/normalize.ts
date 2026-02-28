export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") // Remove punctuation
    .replace(/\s{2,}/g, " ") // Remove extra spaces
    .trim();
};

export const checkAnswer = (spoken: string, answers: string[]): boolean => {
  const normalizedSpoken = normalizeText(spoken);
  // Check exact match after normalization
  // We can also check if the normalized spoken text is included in any answer or vice versa, 
  // but requirements say "partial match false", so we stick to strict equality of normalized strings.
  // However, "a red apple" vs "red apple" might be tricky.
  // Requirement: "answers_en: string[] (e.g. ['apple'] or ['red apple', 'a red apple'])"
  // So we just check if normalizedSpoken is in the normalized answers list.
  
  return answers.some(ans => normalizeText(ans) === normalizedSpoken);
};
