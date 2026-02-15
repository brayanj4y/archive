import sys
import pyttsx3
import argparse

def speak_text(text, volume=1.0, rate=150, voice_id=None):
    """
    Speak text using pyttsx3 in a separate process.
    """
    try:
        engine = pyttsx3.init()
        engine.setProperty('volume', volume)
        engine.setProperty('rate', rate)
        
        if voice_id:
            try:
                engine.setProperty('voice', voice_id)
            except Exception:
                pass # Fallback to default if voice_id fails
        else:
             # Try to find a male voice as preferred in original code
            voices = engine.getProperty('voices')
            if voices:
                 male_voices = [v for v in voices if 'male' in v.name.lower() or 'david' in v.name.lower()]
                 if male_voices:
                     engine.setProperty('voice', male_voices[0].id)

        engine.say(text)
        engine.runAndWait()
        
    except Exception as e:
        print(f"TTS Error in subprocess: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='TTS Worker')
    parser.add_argument('text', help='Text to speak')
    parser.add_argument('--volume', type=float, default=1.0, help='Volume (0.0-1.0)')
    parser.add_argument('--rate', type=int, default=150, help='Rate (words per minute)')
    parser.add_argument('--voice', type=str, default=None, help='Voice ID')

    args = parser.parse_args()
    
    speak_text(args.text, args.volume, args.rate, args.voice)
