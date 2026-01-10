# ULTRON - Offline Security System

A fully offline, laptop-based security system with face recognition, surveillance, and voice-controlled admin override.

## Features

- **100% Offline** - No internet required, all processing local
- **Face Registration** - Register authorized users with 20+ face samples
- **Duty Mode** - Continuous surveillance with real-time face matching
- **Threat Detection** - Alerts and logs unrecognized individuals
- **Voice Override** - Speak admin passphrase to authorize new users

## Requirements

- Python 3.8+
- Webcam
- Microphone (for admin voice override)
- Speakers (for TTS alerts)
- ~2GB disk space (for face models)

## Installation

### 1. Install Python Dependencies

```bash
cd ultron
pip install -r requirements.txt
```

### 2. Download Vosk Speech Model

The speech-to-text feature requires a Vosk model. Download one from:
https://alphacephei.com/vosk/models

Recommended: **vosk-model-small-en-us-0.15** (~40MB)

```bash
# Download and extract to the ultron directory
# The folder should be named "vosk-model"
wget https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip
unzip vosk-model-small-en-us-0.15.zip
mv vosk-model-small-en-us-0.15 vosk-model
```

Or manually download and rename the folder to `vosk-model`.

### 3. First Run - InsightFace Model Download

On first run, InsightFace will automatically download the face recognition model (~200MB). This requires internet **only once**.

## Usage

```bash
python main.py
```

### Main Menu

1. **Registration Mode** - Add a new authorized user
2. **Duty Mode** - Start surveillance
3. **View Registered Users** - List all authorized users
4. **Exit** - Shutdown ULTRON

### Registration Mode

1. Select option 1 from menu
2. Enter a user ID (or press Enter for auto-generated)
3. Position face in front of camera
4. System captures 20 face samples automatically
5. Registration completes when samples are collected

### Duty Mode

1. Register at least one user first
2. Select option 2 from menu
3. System continuously scans for faces
4. **Green box** = Authorized user detected
5. **Red box** = Threat detected
6. Press 'q' to exit duty mode

### Admin Override

When a threat is detected:
1. System speaks warning
2. Saves threat face image to `unauthorized_faces/`
3. Listens for admin passphrase (default: "ultron override")
4. If correct, face is added to authorized database
5. If incorrect/no response, person remains flagged as threat

## Configuration

Edit `config.yaml` to customize:

```yaml
face_match_threshold: 0.6    # Similarity threshold (0.0-1.0)
registration_samples: 20     # Face samples per registration
admin_passphrase: "ultron override"  # Voice password
voice_volume: 1.0            # TTS volume
voice_rate: 150              # TTS speed (WPM)
camera_index: 0              # Webcam device index
admin_code_timeout: 10       # Seconds to listen for admin code
```

## Directory Structure

```
ultron/
├── main.py                  # Main application
├── config.yaml              # Configuration
├── database.py              # SQLite operations
├── camera.py                # Webcam capture
├── face_detection.py        # Face detection (Haar)
├── face_recognition.py      # Face embeddings (ArcFace)
├── tts.py                   # Text-to-speech
├── stt.py                   # Speech-to-text
├── requirements.txt         # Dependencies
├── vosk-model/              # Vosk STT model (download)
├── ultron.db                # SQLite database (auto-created)
├── authorized_faces/        # Saved authorized face images
├── unauthorized_faces/      # Saved threat face images
└── logs/                    # Log files
```

## Hardware Performance Notes

### Tested On
- **CPU**: Intel i5-8250U (8th Gen) - 4 cores
- **RAM**: 8GB
- **Performance**: ~5-10 FPS face detection/recognition

### Recommendations

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | Intel i5 6th Gen / AMD Ryzen 3 | Intel i7 8th Gen+ / AMD Ryzen 5+ |
| RAM | 4GB | 8GB+ |
| Camera | 480p | 720p |
| Storage | 2GB free | 5GB free |

### Performance Tips

1. **Lower Resolution**: Edit `camera.py` to use 320x240 for faster processing
2. **Fewer Samples**: Reduce `registration_samples` to 10-15
3. **Higher Threshold**: Increase `face_match_threshold` to 0.7 for fewer false positives
4. **Close Other Apps**: Free up CPU for smoother operation

## Troubleshooting

### "Vosk model not found"
Download the Vosk model and extract it to `vosk-model/` directory.

### Camera not opening
- Check if another application is using the camera
- Try changing `camera_index` in config.yaml (0, 1, 2...)

### Slow performance
- Close other applications
- Reduce camera resolution in `camera.py`
- The system uses CPU-only inference for offline operation

### TTS not working
- Windows: No additional setup needed (uses SAPI5)
- Linux: Install `espeak`: `sudo apt install espeak`
- macOS: Uses built-in speech synthesis

## Security Notes

- All data stored locally in `ultron.db` (SQLite)
- Face images stored in `authorized_faces/` and `unauthorized_faces/`
- No network connections made (100% offline)
- Admin passphrase stored in plaintext in `config.yaml` - secure this file

## License

MIT License - Use at your own risk.
