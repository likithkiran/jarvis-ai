"""
edge_assistant_run.py — single entry point for the whole JARVIS edge agent.

    python edge_assistant_run.py            # start backend + open HUD
    python edge_assistant_run.py --auth      # gate startup behind ai_auth_hud face check
    python edge_assistant_run.py --no-window # backend only, open http://127.0.0.1:5000 yourself

This is the "one command, entire workspace loaded" launcher.
"""

import argparse
import threading
import time

from app import app as flask_app


def start_backend():
    thread = threading.Thread(
        target=lambda: flask_app.run(host="0.0.0.0", port=5000, debug=False, use_reloader=False),
        daemon=True,
    )
    thread.start()
    time.sleep(1.0)  # give Flask a moment to bind before the HUD tries to load it


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--auth", action="store_true", help="require face verification before launch")
    parser.add_argument("--no-window", action="store_true", help="run backend only, no native HUD window")
    args = parser.parse_args()

    if args.auth:
        from ai_auth_hud import authenticate
        print("Scanning for authorized user...")
        if not authenticate():
            print("ACCESS DENIED. Shutting down.")
            return
        print("ACCESS GRANTED. Booting J.A.R.V.I.S...")

    start_backend()

    if args.no_window:
        print("Backend running at http://127.0.0.1:5000 — open it in a browser.")
        while True:
            time.sleep(3600)
    else:
        from jarvis_hud import open_hud
        open_hud()


if __name__ == "__main__":
    main()
