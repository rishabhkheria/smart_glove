import { useState, useEffect, useRef, useCallback } from "react";

export default function useVoice(currentGesture) {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const prevGestureRef = useRef(null);

  const speak = useCallback((text) => {
    // Agar muted hai, ya gesture invalid hai toh nahi bolna
    if (isMuted || !text || text === "OFFLINE" || text === "IDLE") return;
    
    // Purani aawaz rok do (agar koi sentence lamba hai)
    window.speechSynthesis.cancel(); 
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = volume;
    utterance.rate = rate;
    
    window.speechSynthesis.speak(utterance);
  }, [isMuted, volume, rate]);

  const repeatWord = useCallback(() => {
    if (currentGesture) {
      speak(currentGesture);
    }
  }, [currentGesture, speak]);

  useEffect(() => {
    // Sirf tab bolo jab naya gesture pichle wale se alag ho
    if (currentGesture && currentGesture !== prevGestureRef.current) {
      speak(currentGesture);
      prevGestureRef.current = currentGesture;
    }
  }, [currentGesture, speak]);

  return {
    isMuted, setIsMuted,
    volume, setVolume,
    rate, setRate,
    repeatWord
  };
}
