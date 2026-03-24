# Packaging ULTRON

## Build

From the project root:

```powershell
python -m pip install -r requirements.txt
.\build.ps1
```

The executable is produced under:

```text
dist\UltronSchoolDesktop
```

## Notes

- `config.yaml` is bundled with the app.
- `authorized_faces`, `unauthorized_faces`, and `logs` are included as data folders.
- Arduino access still depends on the correct `arduino_port` value in `config.yaml`.
- Face recognition still depends on the local InsightFace/ONNX runtime environment.
- If you package on a machine without the required models or drivers installed, the executable will build but the affected runtime features will fail.
