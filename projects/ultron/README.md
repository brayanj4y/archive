# ultron school desktop

offline desktop app for school gate recognition, bursar fee control, student self-service, and arduino gate simulation.

## 0. features
offline. no internet required for core use.
desktop gui. no terminal menu flow.
gate monitor is default staff mode after login.
student registration with pin + face capture.
student record view with stored photo.
live gate recognition with granted / denied / low-confidence / unknown outcomes.
bursar notifications for fee issues at the gate.
student portal with pin login.
receipts, invoices, payments, and student requests.
arduino servo gate simulation.
offline tts feedback.

## 1. requirements
python 3.8+
webcam
speakers
sqlite

**hardware**
arduino uno or compatible
servo motor

## 2. setup

### software
```powershell
python -m pip install -r requirements.txt
```

### hardware
upload the sketch from `ultron arduino/ultron_arduino/ultron_arduino.ino`.

set the correct serial port in `config.yaml`.

```yaml
arduino_port: "COM3"
```

## 3. usage

start app:
```powershell
python main.py
```

staff login opens first.
after staff login, gate monitor starts automatically.

### [staff flow]
1. sign in as bursar or admin.
2. gate monitor becomes active.
3. bursar can register students, manage fees, create invoices, record payments.
4. admin can override access and reset pins.

### [student flow]
1. student is created with a pin.
2. bursar captures student face samples.
3. student can sign into student portal with the registration pin.
4. student can view receipts, see profile info, and send requests to bursar.

### [gate flow]
recognized + allowed -> servo opens, tts says access granted.
recognized + denied -> servo stays closed, tts says access denied, bursar notified.
low-confidence -> gate stays closed unless fallback verification succeeds.
unknown face -> gate stays closed, tts says face not recognized.

## 4. camera model
single camera. serialized access.

gate monitor owns the camera by default.
if bursar starts face registration, gate monitor pauses.
registration captures samples.
camera is released.
gate monitor resumes.

this is the intended laptop setup for one webcam.

## 5. student registration
go to `directory`.
create the student profile with:
- code
- full name
- pin
- optional contact details

then select the student in the bursar list and use `capture student face`.

registration stores:
- student profile
- pin
- face embedding
- student photo used in the record view and student portal

## 6. student portal
student record access is pin-protected.
student must sign in with the registration pin.

students can:
- view profile and photo
- view receipts
- view fee state and balance
- notify bursar they will pay
- explain delay / reason for not paying
- request profile changes

## 7. configuration
edit `config.yaml`.

```yaml
camera_index: 0
face_match_threshold: 0.48
registration_samples: 20
voice_volume: 1.0
voice_rate: 150
gate_open_seconds: 3
gate_scan_interval_ms: 900
gate_event_cooldown_seconds: 6
fail_secure: true
default_grace_period_days: 3
arduino_port: "COM3"
admin_contact_email: "admin@ultron-school.local"
admin_contact_phone: "+1234567890"
bootstrap_admin_code: "admin"
bootstrap_admin_password: ""
bootstrap_bursar_code: "bursar"
bootstrap_bursar_password: ""
```

## 8. bootstrap accounts
the app bootstraps an admin and a bursar account on startup.

if bootstrap passwords are blank:
- secure random passwords are generated
- passwords are written to stderr at startup
- accounts are marked for password change in the database

for fixed credentials, set:
- `bootstrap_admin_password`
- `bootstrap_bursar_password`

or use env vars:
- `ULTRON_BOOTSTRAP_ADMIN_PASSWORD`
- `ULTRON_BOOTSTRAP_BURSAR_PASSWORD`

## 9. runtime folders
these folders are created automatically at startup if missing:
- `logs`
- `authorized_faces`
- `unauthorized_faces`

## 10. packaging
see [PACKAGING.md](PACKAGING.md).

quick build:
```powershell
python -m pip install -r requirements.txt
.\build.ps1
```

output:
```text
dist\UltronSchoolDesktop
```

## 11. status
camera busy -> gate monitor or registration already owns the camera.
arduino missing -> check usb connection + `arduino_port`.
no voice -> check local audio + pyttsx3 runtime.
face recognition issue -> verify insightface / onnxruntime install.

## 12. limits
no embedded rich live preview inside the tkinter gate tab yet.
current recognition backend uses the repo's insightface module.
real servo behavior still depends on actual board + wiring.

license: mit. use at own risk.
