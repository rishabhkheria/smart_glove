import useVoice from "../hooks/useVoice";

function VoiceControlPanel({ currentGesture }) {
  const { isMuted, setIsMuted, volume, setVolume, rate, setRate, repeatWord } = useVoice(currentGesture);

  return (
    <div className="voicePanelCard">
      <div className="voicePanelHeader">
        <h3>🎙️ Voice Settings</h3>
        <button 
          className={`voiceBtn ${isMuted ? 'muted' : 'active'}`}
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? '🔇 Unmute' : '🔊 Mute'}
        </button>
      </div>

      <div className="voiceControlsGrid">
        <div className="sliderGroup">
          <label>Volume: {Math.round(volume * 100)}%</label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={volume} 
            onChange={(e) => setVolume(parseFloat(e.target.value))} 
            className="modernSlider"
          />
        </div>
        
        <div className="sliderGroup">
          <label>Speed: {rate.toFixed(1)}x</label>
          <input 
            type="range" 
            min="0.5" 
            max="2" 
            step="0.1" 
            value={rate} 
            onChange={(e) => setRate(parseFloat(e.target.value))} 
            className="modernSlider"
          />
        </div>

        <div className="sliderGroup" style={{ justifyContent: 'flex-end', display: 'flex', alignItems: 'flex-end' }}>
          <button 
            className="voiceBtn repeatBtn" 
            onClick={repeatWord} 
            disabled={!currentGesture || currentGesture === "OFFLINE" || currentGesture === "IDLE"}
          >
            🔄 Repeat Word
          </button>
        </div>
      </div>
    </div>
  );
}

export default VoiceControlPanel;
