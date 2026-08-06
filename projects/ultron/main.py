"""
ULTRON v2 desktop entrypoint.
"""

from pathlib import Path

from gui import UltronApp


def ensure_runtime_directories() -> None:
    base_dir = Path(__file__).parent
    for name in ("logs", "authorized_faces", "unauthorized_faces"):
        (base_dir / name).mkdir(parents=True, exist_ok=True)


def main() -> None:
    ensure_runtime_directories()
    app = UltronApp()
    app.mainloop()


if __name__ == "__main__":
    main()
