from arduino_interface import ArduinoController
import threading
import time

# Mock the serial class
import sys
from unittest.mock import MagicMock

def test_arduino_integration():
    print("Testing Arduino integration code (Mocked)...")
    
    # Mocking serial to avoid needing actual hardware
    sys.modules['serial'] = MagicMock()
    sys.modules['serial'].Serial = MagicMock()
    
    # Create controller
    arduino = ArduinoController("COM99")
    
    # Simulate connection
    arduino.ser = MagicMock()
    
    print("Locked door check...")
    arduino.lock_door()
    
    print("Unlocked door check...")
    arduino.unlock_door()
    
    print("Keypad check (Empty)...")
    arduino.ser.in_waiting = 0
    assert arduino.check_keypad() is None
    
    print("Keypad check (Key Press)...")
    arduino.ser.in_waiting = 1
    arduino.ser.read_all.return_value = b"KEY:5\n"
    key = arduino.check_keypad()
    print(f"Detected key: {key}")
    assert key == '5'

    print("Arduino mock test passed.")

if __name__ == "__main__":
    test_arduino_integration()
