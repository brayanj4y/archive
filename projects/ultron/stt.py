"""
ULTRON Speech-to-Text Module
Offline STT using Vosk for admin code verification.
"""

import os
import json
import queue
import threading
from pathlib import Path

import sounddevice as sd
from vosk import Model, KaldiRecognizer


# Default model path (user needs to download Vosk model)
MODEL_PATH = Path(__file__).parent / "vosk-model"


class SpeechToText:
    """Offline speech-to-text using Vosk."""
    
    def __init__(self, model_path: str = None):
        """
        Initialize STT engine.
        
        Args:
            model_path: Path to Vosk model directory
        """
        model_dir = Path(model_path) if model_path else MODEL_PATH
        
        if not model_dir.exists():
            raise FileNotFoundError(
                f"Vosk model not found at {model_dir}. "
                "Please download a model from https://alphacephei.com/vosk/models "
                "and extract it to the 'vosk-model' directory."
            )
        
        self.model = Model(str(model_dir))
        self.sample_rate = 16000
        self._audio_queue = queue.Queue()
        self._is_listening = False
    
    def _audio_callback(self, indata, frames, time, status):
        """Callback for audio stream."""
        if status:
            print(f"Audio status: {status}")
        self._audio_queue.put(bytes(indata))
    
    def listen_for_phrase(self, timeout: float = 10.0, grammar: list = None) -> str:
        """
        Listen for spoken phrase.
        
        Args:
            timeout: Maximum time to listen in seconds
            grammar: Optional list of allowed words/phrases (improves accuracy)
            
        Returns:
            Recognized text (lowercase), or empty string if nothing recognized
        """
        if grammar:
            # Format grammar as JSON string for Vosk
            # e.g., '["word1", "word2", "[unk]"]'
            grammar_json = json.dumps(grammar + ["[unk]"])
            recognizer = KaldiRecognizer(self.model, self.sample_rate, grammar_json)
        else:
            recognizer = KaldiRecognizer(self.model, self.sample_rate)
        
        # Clear the queue
        while not self._audio_queue.empty():
            try:
                self._audio_queue.get_nowait()
            except queue.Empty:
                break
        
        recognized_text = ""
        self._is_listening = True
        
        try:
            with sd.RawInputStream(
                samplerate=self.sample_rate,
                blocksize=8000,
                dtype='int16',
                channels=1,
                callback=self._audio_callback
            ):
                import time
                start_time = time.time()
                
                while time.time() - start_time < timeout:
                    try:
                        data = self._audio_queue.get(timeout=0.5)
                    except queue.Empty:
                        continue
                    
                    if recognizer.AcceptWaveform(data):
                        result = json.loads(recognizer.Result())
                        text = result.get("text", "").strip()
                        if text:
                            recognized_text = text
                            break
                
                # Get any final results
                if not recognized_text:
                    final = json.loads(recognizer.FinalResult())
                    recognized_text = final.get("text", "").strip()
        
        except Exception as e:
            print(f"STT Error: {e}")
        
        finally:
            self._is_listening = False
        
        return recognized_text.lower()
    
    def check_admin_code(self, spoken_phrase: str, expected_code: str) -> bool:
        """
        Check if spoken phrase matches the admin code.
        
        Args:
            spoken_phrase: The recognized speech
            expected_code: The expected admin passphrase
            
        Returns:
            True if phrase matches (fuzzy match)
        """
        if not spoken_phrase or not expected_code:
            return False
        
        # Normalize both strings
        spoken = spoken_phrase.lower().strip()
        expected = expected_code.lower().strip()
        
        # Exact match
        if spoken == expected:
            return True
        
        # Check if expected code is contained in spoken phrase
        if expected in spoken:
            return True
        
        # Check word overlap for fuzzy matching
        spoken_words = set(spoken.split())
        expected_words = set(expected.split())
        
        if not expected_words:
            return False
        
        # If more than 70% of expected words are in spoken phrase
        overlap = len(spoken_words & expected_words)
        match_ratio = overlap / len(expected_words)
        
        return match_ratio >= 0.7
    
    def is_listening(self) -> bool:
        """Check if currently listening."""
        return self._is_listening


def create_stt(model_path: str = None) -> SpeechToText:
    """
    Create and return an STT instance.
    
    Args:
        model_path: Optional path to Vosk model
        
    Returns:
        SpeechToText instance
    """
    return SpeechToText(model_path=model_path)
