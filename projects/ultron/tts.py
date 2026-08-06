"""
ULTRON Text-to-Speech Module
Offline TTS using pyttsx3.
"""

import sys
import subprocess
from pathlib import Path
import threading


class TextToSpeech:
    """Offline text-to-speech using subprocess to avoid event loop issues."""
    
    def __init__(self, volume: float = 1.0, rate: int = 150):
        """
        Initialize TTS engine configuration.
        
        Args:
            volume: Voice volume (0.0 to 1.0)
            rate: Words per minute
        """
        self.volume = volume
        self.rate = rate
        self.script_path = Path(__file__).parent / "tts_worker.py"
        self._lock = threading.Lock()
    
    def speak(self, text: str, block: bool = True):
        """
        Speak the given text using a separate process.
        
        Args:
            text: Text to speak
            block: If True, wait for speech to complete
        """
        def _run_worker():
            try:
                subprocess.run(
                    [sys.executable, str(self.script_path), text, 
                     "--volume", str(self.volume), 
                     "--rate", str(self.rate)],
                    check=True,
                    creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
                )
            except Exception as e:
                print(f"Error running TTS worker: {e}")

        if block:
            with self._lock:
                _run_worker()
        else:
            thread = threading.Thread(target=_run_worker)
            thread.daemon = True
            thread.start()
    
    def speak_async(self, text: str):
        """
        Speak text asynchronously (non-blocking).
        
        Args:
            text: Text to speak
        """
        self.speak(text, block=False)
    
    def stop(self):
        """Stop any ongoing speech (not fully supported in subprocess mode)."""
        pass


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
