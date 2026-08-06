"""
ULTRON Face Detection Module
Face detection using OpenCV Haar Cascade (CPU-friendly).
"""

import cv2
import numpy as np
from pathlib import Path


class FaceDetector:
    """Face detection using Haar Cascade classifier."""
    
    def __init__(self):
        """Initialize the face detector with Haar Cascade."""
        # Use OpenCV's built-in Haar Cascade for face detection
        cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        self.face_cascade = cv2.CascadeClassifier(cascade_path)
        
        if self.face_cascade.empty():
            raise RuntimeError("Failed to load Haar Cascade classifier")
    
    def detect_faces(self, frame: np.ndarray) -> list:
        """
        Detect faces in a frame.
        
        Args:
            frame: BGR image as numpy array
            
        Returns:
            List of bounding boxes as (x, y, w, h) tuples
        """
        # Convert to grayscale for detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        faces = self.face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(80, 80)
        )
        
        # Convert to list of tuples
        return [tuple(face) for face in faces]
    
    def extract_face(self, frame: np.ndarray, bbox: tuple, margin: float = 0.2) -> np.ndarray:
        """
        Extract and crop a face region from the frame.
        
        Args:
            frame: BGR image as numpy array
            bbox: Bounding box as (x, y, w, h)
            margin: Extra margin around face (as fraction of face size)
            
        Returns:
            Cropped face image
        """
        x, y, w, h = bbox
        img_h, img_w = frame.shape[:2]
        
        # Add margin
        margin_x = int(w * margin)
        margin_y = int(h * margin)
        
        x1 = max(0, x - margin_x)
        y1 = max(0, y - margin_y)
        x2 = min(img_w, x + w + margin_x)
        y2 = min(img_h, y + h + margin_y)
        
        return frame[y1:y2, x1:x2].copy()
    
    def get_largest_face(self, frame: np.ndarray) -> tuple:
        """
        Get the largest face detected in the frame.
        
        Args:
            frame: BGR image as numpy array
            
        Returns:
            Bounding box of largest face, or None if no face detected
        """
        faces = self.detect_faces(frame)
        
        if not faces:
            return None
        
        # Return the largest face by area
        largest = max(faces, key=lambda f: f[2] * f[3])
        return largest


def draw_face_box(frame: np.ndarray, bbox: tuple, color: tuple = (0, 255, 0), 
                  label: str = None, thickness: int = 2) -> np.ndarray:
    """
    Draw a bounding box around a face.
    
    Args:
        frame: BGR image as numpy array
        bbox: Bounding box as (x, y, w, h)
        color: Box color as (B, G, R)
        label: Optional label text
        thickness: Line thickness
        
    Returns:
        Frame with drawn box
    """
    x, y, w, h = bbox
    cv2.rectangle(frame, (x, y), (x + w, y + h), color, thickness)
    
    if label:
        cv2.putText(frame, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 
                    0.7, color, 2)
    
    return frame
