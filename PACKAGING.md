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
- `authorized_faces` and `unauthorized_faces` are included as data folders.
- `logs` is not bundled; the application creates the `logs` directory at runtime if it is missing.
- Arduino access still depends on the correct `arduino_port` value in `config.yaml`.
- Face recognition still depends on the local InsightFace/ONNX runtime environment.
- If you package on a machine without the required models or drivers installed, the executable will build but the affected runtime features will fail.
- If bootstrap passwords are left blank in `config.yaml`, ULTRON generates secure random passwords at startup. For reproducible packaged deployments, set bootstrap passwords explicitly in `config.yaml` or provide:
  - `ULTRON_BOOTSTRAP_ADMIN_PASSWORD`
  - `ULTRON_BOOTSTRAP_BURSAR_PASSWORD`
