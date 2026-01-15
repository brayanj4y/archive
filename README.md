# ultron offline security

offline laptop security system. face recognition. surveillance. voice override.

## features

offline. no internet. local processing.
registration. captures 20 face samples.
duty mode. continuous surveillance.
threat detection. logs unrecognized people.
voice override. speak code to authorize.

## requirements

python 3.8+
webcam
mic
speakers
2gb disk space

## installation

1 install python dependencies
```bash
pip install -r requirements.txt
```

2 download vosk speech model
speech text needs a model. get it from vosk website.
download `vosk-model-small-en-us-0.15`.
extract to ultron folder.
rename folder to `vosk-model`.

3 first run
insightface downloads model on first start. needs internet once.

## usage

run the system
```bash
python main.py
```

### main menu

1 registration mode
2 duty mode
3 view registered users
4 exit

### registration mode

select option 1.
enter user id.
face camera.
system captures samples.
done.

### duty mode

register user first.
select option 2.
scanning starts.
green box authorized.
red box threat.
press `q` to exit.

### admin override

threat detected.
system speaks warning.
face saved to `unauthorized_faces/`.
system listens for code.
say `ultron override`.
incorrect code keeps threat status.
correct code adds face to database.

## configuration

edit `config.yaml`.

```yaml
face_match_threshold: 0.6
registration_samples: 20
admin_passphrase: "ultron override"
voice_volume: 1.0
camera_index: 0
admin_code_timeout: 10
```

## directory structure

`main.py`
`config.yaml`
`database.py`
`camera.py`
`face_detection.py`
`face_recognition.py`
`tts.py`
`stt.py`
`requirements.txt`
`vosk-model/`
`ultron.db`
`authorized_faces/`
`unauthorized_faces/`
`logs/`

## performance

tested on i5 8th gen. 8gb ram.
gets 5 to 10 fps.
lower resolution for speed.
reduce samples for speed.
increase threshold for strictness.

## troubleshooting

vosk model not found
check folder name is `vosk-model`.

camera not opening
check other apps.

slow
close apps.

no tts
check system volume.

## security

data is local.
sqlite database.
raw images stored.
no network.
keep `config.yaml` safe.

## license

mit. use at own risk.
