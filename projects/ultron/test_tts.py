import time
from tts import create_tts

def test_tts_loop():
    print("Initializing TTS...")
    tts = create_tts()
    
    print("Speaking startup message...")
    tts.speak("Startup message. System initialized.")
    print("Startup message done.")
    
    # Simulate menu wait
    print("Waiting for user input (simulated)...")
    time.sleep(2)
    
    print("Entering Registration Mode (simulated)...")
    tts.speak("Registration mode activated. Please position your face.")
    print("Registration message done.")

    time.sleep(1)
    
    print("Speaking verification...")
    tts.speak("Registration complete.")
    print("Verification message done.")

if __name__ == "__main__":
    test_tts_loop()
