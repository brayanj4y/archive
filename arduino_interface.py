import serial
import time
import threading

class ArduinoController:
    """Interface for Arduino (Keypad + Servo)."""
    
    def __init__(self, port='COM3', baudrate=9600, timeout=1):
        self.port = port
        self.baudrate = baudrate
        self.ser = None
        self.lock = threading.Lock()
        self.connect()
        
    def connect(self):
        """Attempt to connect to Arduino."""
        try:
            self.ser = serial.Serial(self.port, self.baudrate, timeout=1)
            time.sleep(2)  # Wait for Arduino reset
            print(f"Connected to Arduino on {self.port}")
        except serial.SerialException as e:
            print(f"WARNING: Could not connect to Arduino on {self.port}: {e}")
            self.ser = None

    def _send_command(self, command):
        """Send command to Arduino."""
        if self.ser:
            with self.lock:
                try:
                    self.ser.write(f"{command}\n".encode())
                except serial.SerialException:
                    print("Error sending to Arduino. Reconnecting...")
                    self.close()
                    self.connect()

    def unlock_door(self):
        """Rotate servo to unlock position."""
        self._send_command("UNLOCK")
        print("Arduino: Door Unlocked")
    
    def lock_door(self):
        """Rotate servo to lock position."""
        self._send_command("LOCK")
        print("Arduino: Door Locked")

    def check_keypad(self):
        """
        Check if any key was pressed.
        Returns the key character or None.
        """
        if self.ser and self.ser.in_waiting > 0:
            with self.lock:
                try:
                    # Read all available bytes
                    lines = self.ser.read_all().decode('utf-8', errors='ignore').split('\n')
                    for line in lines:
                        line = line.strip()
                        if line.startswith("KEY:"):
                            return line.split(":")[1]
                except Exception as e:
                    print(f"Error reading from Arduino: {e}")
        return None
    
    def close(self):
        if self.ser:
            self.ser.close()

def create_arduino(port=None) -> ArduinoController:
    # Auto-detect logic could be added here
    if port is None:
        port = "COM3" # Default, user might need to change
    return ArduinoController(port)
