"""
ULTRON Camera Module
Webcam capture functionality.
"""

import cv2


class Camera:
    """Webcam capture class."""
    
    def __init__(self, camera_index: int = 0):
        """
        Initialize camera.
        
        Args:
            camera_index: Device index (0 = default camera)
        """
        self.camera_index = camera_index
        self.cap = None
    
    def start(self) -> bool:
        """
        Start the camera capture.
        
        Returns:
            True if camera opened successfully
        """
        self.cap = cv2.VideoCapture(self.camera_index)
        
        if not self.cap.isOpened():
            return False
        
        # Set reasonable resolution for performance
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        
        return True
    
    def capture_frame(self):
        """
        Capture a single frame from the camera.
        
        Returns:
            Frame as numpy array (BGR), or None if capture failed
        """
        if self.cap is None or not self.cap.isOpened():
            return None
        
        ret, frame = self.cap.read()
        
        if not ret:
            return None
        
        return frame
    
    def release(self):
        """Release camera resources."""
        if self.cap is not None:
            self.cap.release()
            self.cap = None
    
    def is_opened(self) -> bool:
        """Check if camera is currently opened."""
        return self.cap is not None and self.cap.isOpened()
