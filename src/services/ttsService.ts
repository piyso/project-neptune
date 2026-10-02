/**
 * Vernacular Text-to-Speech (TTS) Narration Engine
 * Complies with Project Neptune Specs 15, 20, 21, 22:
 * Universal accessibility & informed citizen consent for illiterate & semi-literate citizens.
 */

import { IndicLanguage } from '../store/useNeptuneStore.js';

const LANGUAGE_CODE_MAP: Record<IndicLanguage, string> = {
  HINDI: 'hi-IN',
  ENGLISH: 'en-IN',
  BHOJPURI: 'hi-IN', // Falls back to Hindi voice for Bhojpuri phonetics
  TAMIL: 'ta-IN',
  BENGALI: 'bn-IN',
  MARATHI: 'mr-IN',
};

class VernacularTtsService {
  private isSpeaking = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  public speak(text: string, lang: IndicLanguage, onEnd?: () => void, onError?: (err: any) => void): boolean {
    if (!('speechSynthesis' in window)) {
      console.warn('[VernacularTTS] Web Speech API not supported in this browser.');
      return false;
    }

    // Cancel any active speech
    this.stop();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = LANGUAGE_CODE_MAP[lang] || 'hi-IN';
      utterance.rate = 0.92; // Slightly slower for clear rural comprehension
      utterance.pitch = 1.0;

      // Find best regional voice if available
      const voices = window.speechSynthesis.getVoices();
      const targetLang = utterance.lang.toLowerCase();
      const matchedVoice = voices.find(v => v.lang.toLowerCase() === targetLang || v.lang.toLowerCase().startsWith(targetLang.split('-')[0]));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        if (onError) onError(e);
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (e) {
      console.error('[VernacularTTS] Speech error:', e);
      return false;
    }
  }

  public stop(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}

export const ttsEngine = new VernacularTtsService();
