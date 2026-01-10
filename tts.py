"""
ULTRON Text-to-Speech Module
Offline TTS using pyttsx3.
"""

import pyttsx3
import threading


class TextToSpeech:
    """Offline text-to-speech using pyttsx3."""
    
    def __init__(self, volume: float = 1.0, rate: int = 150):
        """
        Initialize TTS engine.
        
        Args:
            volume: Voice volume (0.0 to 1.0)
            rate: Words per minute
        """
        self.engine = pyttsx3.init()
        
        # Set volume
        self.engine.setProperty('volume', volume)
        
        # Set rate (slower = more authoritative)
        self.engine.setProperty('rate', rate)
        
        # Try to set a deeper voice if available
        voices = self.engine.getProperty('voices')
        if voices:
            # Prefer male voices for deeper tone
            male_voices = [v for v in voices if 'male' in v.name.lower() or 'david' in v.name.lower()]
            if male_voices:
                self.engine.setProperty('voice', male_voices[0].id)
            else:
                # Use the first available voice
                self.engine.setProperty('voice', voices[0].id)
        
        self._lock = threading.Lock()
    
    def speak(self, text: str, block: bool = True):
        """
        Speak the given text.
        
        Args:
            text: Text to speak
            block: If True, wait for speech to complete
        """
        with self._lock:
            self.engine.say(text)
            if block:
                self.engine.runAndWait()
    
    def speak_async(self, text: str):
        """
        Speak text asynchronously (non-blocking).
        
        Args:
            text: Text to speak
        """
        thread = threading.Thread(target=self.speak, args=(text, True))
        thread.daemon = True
        thread.start()
    
    def stop(self):
        """Stop any ongoing speech."""
        with self._lock:
            self.engine.stop()


# Pre-defined voice messages for ULTRON
MESSAGES = {
    "startup": "ULTRON security system initialized.",
    "registration_start": "Registration mode activated. Please position your face in front of the camera.",
    "registration_capture": "Capturing. Hold still.",
    "registration_complete": "Registration complete. User added to authorized database.",
    "duty_start": "Duty mode activated. Surveillance beginning.",
    "authorized": "Identity verified. Access granted.",
    "threat_detected": "Warning. Unrecognized individual detected. Speak admin override code now, or remain still for identification.",
    "listening": "Listening for admin code.",
    "admin_accepted": "Admin code accepted. Adding new user to authorized database.",
    "admin_rejected": "Invalid code. Access denied.",
    "no_faces_registered": "No authorized faces registered. Please register at least one user first.",
    "shutting_down": "ULTRON shutting down. Goodbye.",
}


def create_tts(volume: float = 1.0, rate: int = 150) -> TextToSpeech:
    """
    Create and return a TTS instance.
    
    Args:
        volume: Voice volume (0.0 to 1.0)
        rate: Words per minute
        
    Returns:
        TextToSpeech instance
    """
    return TextToSpeech(volume=volume, rate=rate)
