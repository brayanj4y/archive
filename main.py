"""
ULTRON v2 desktop entrypoint.
"""

from gui import UltronApp


def main() -> None:
    app = UltronApp()
    app.mainloop()


if __name__ == "__main__":
    main()
