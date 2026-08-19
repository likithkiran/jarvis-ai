"""
jarvis_hud.py — wraps the Flask HUD (templates/index.html) in a native,
frameless desktop window using pywebview, so it looks like a real app instead
of a browser tab — matching the full-screen HUD look in the demo.

Requires: pywebview  (pip install pywebview)

This module doesn't start the Flask server itself — call open_hud() after the
server is already running (edge_assistant_run.py does both in the right order).
"""

import webview


def open_hud(url: str = "http://127.0.0.1:5000"):
    window = webview.create_window(
        "J.A.R.V.I.S",
        url,
        width=1100,
        height=720,
        min_size=(720, 480),
        background_color="#05070c",
        frameless=False,   # set True once you're ready to drop the OS title bar
        easy_drag=True,
    )
    webview.start()


if __name__ == "__main__":
    open_hud()
