export const speak = (text: string, lang: 'en-US' | 'ko-KR' = 'en-US') => {
  if (!('speechSynthesis' in window)) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  
  // Optional: Select a voice if available
  // const voices = window.speechSynthesis.getVoices();
  // const voice = voices.find(v => v.lang === lang);
  // if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
};
