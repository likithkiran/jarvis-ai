from flask import (
    Flask,
    render_template,
    request,
    jsonify,
    send_from_directory,
)

import platform

from laptop_agent import LaptopAgent
from gemini_brain import GeminiBrain


# ============================================================
# EDGE AI OS 2077
# JARVIS NEURAL COMMAND SERVER
# ============================================================

app = Flask(__name__)

SERVER_NAME_DISPLAY = (
    "EDGE AI OS 2077 — JARVIS Neural Command Server"
)

SERVER_VERSION = "2077.1"

IS_WINDOWS = (
    platform.system().lower() == "windows"
)


# ============================================================
# CORE ENGINES
# ============================================================

laptop = LaptopAgent()
brain = GeminiBrain()


# ============================================================
# HELPERS
# ============================================================

ACTION_PREFIXES = (

    "open ",
    "launch ",
    "start ",
    "run ",

    "search ",
    "google ",

    "play ",
    "watch ",

    "navigate ",
    "directions ",
    "route ",

    "volume ",
    "increase volume",
    "decrease volume",

    "mute",
    "unmute",

    "show desktop",

    "calculate ",

    "back",
    "recent apps",

    "lock",
)


DIRECT_ACTIONS = {

    "youtube",
    "chrome",
    "spotify",
    "calculator",
    "settings",
    "maps",

    "volume up",
    "volume down",

    "mute",
    "unmute",

    "show desktop",
    "desktop",

    "back",
    "recent apps",

    "lock",
}


def clean_text(text):

    return " ".join(
        str(text or "")
        .strip()
        .split()
    )


def looks_like_action(text):

    command = clean_text(
        text
    ).lower()

    if command.startswith(
        ACTION_PREFIXES
    ):
        return True

    if command in DIRECT_ACTIONS:
        return True

    if command.startswith(
        (
            "http://",
            "https://",
        )
    ):
        return True

    return False


def extract_laptop_response(result):

    if result is None:
        return "Command completed."

    if isinstance(
        result,
        str,
    ):
        return result

    if isinstance(
        result,
        dict,
    ):

        for key in (
            "response",
            "message",
            "result",
            "status",
        ):

            value = result.get(
                key
            )

            if (
                isinstance(
                    value,
                    str,
                )
                and
                value.strip()
            ):

                return value.strip()

    return str(
        result
    )


# ============================================================
# HOME PAGE
# ============================================================

@app.route("/")
def index():

    return render_template(
        "index.html"
    )


# ============================================================
# GOOGLE / SEO FILES
# ============================================================

@app.route(
    "/robots.txt",
    methods=["GET"],
)
def robots_txt():

    return send_from_directory(
        app.static_folder,
        "robots.txt",
        mimetype="text/plain",
    )


@app.route(
    "/sitemap.xml",
    methods=["GET"],
)
def sitemap_xml():

    return send_from_directory(
        app.static_folder,
        "sitemap.xml",
        mimetype="application/xml",
    )


# ============================================================
# DEVICE STATUS
# ============================================================

@app.route(
    "/device_status",
    methods=["GET"],
)
def device_status():

    try:

        return jsonify({

            "ok":
                True,

            "success":
                True,

            "connected":
                IS_WINDOWS,

            "server":
                SERVER_NAME_DISPLAY,

            "version":
                SERVER_VERSION,

            "status":
                "ONLINE",

            "device":
                (
                    "Windows Laptop"
                    if IS_WINDOWS
                    else "Cloud Server"
                ),

            "model":
                (
                    "Windows Laptop"
                    if IS_WINDOWS
                    else "Render Cloud"
                ),

            "platform":
                platform.system(),

            "assistant":
                "J.A.R.V.I.S.",

            "jarvis":
                "ACTIVE",

            "gemini":
                "ONLINE",

            "laptop_agent":
                (
                    "ONLINE"
                    if IS_WINDOWS
                    else "OFFLINE"
                ),

            "windows_agent":
                (
                    "ONLINE"
                    if IS_WINDOWS
                    else "OFFLINE"
                ),

            "spider_vision":
                "READY",

            "jutsu_engine":
                "READY",

            "adb":
                "NOT REQUIRED",

        }), 200

    except Exception as error:

        print(
            "DEVICE STATUS ERROR:",
            repr(error),
        )

        return jsonify({

            "ok":
                False,

            "success":
                False,

            "connected":
                False,

            "server":
                SERVER_NAME_DISPLAY,

            "status":
                "ERROR",

            "error":
                str(error),

        }), 500


# ============================================================
# SYSTEM STATUS
# ============================================================

@app.route(
    "/system_status",
    methods=["GET"],
)
def system_status():

    return jsonify({

        "ok":
            True,

        "server":
            SERVER_NAME_DISPLAY,

        "version":
            SERVER_VERSION,

        "system":
            "EDGE AI OS 2077",

        "assistant":
            "J.A.R.V.I.S.",

        "platform":
            platform.system(),

        "gemini":
            "ONLINE",

        "windows_agent":
            (
                "ONLINE"
                if IS_WINDOWS
                else "OFFLINE"
            ),

        "spider_vision":
            "READY",

        "jutsu_engine":
            "READY",

        "status":
            "ONLINE",

    })


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route(
    "/health",
    methods=["GET"],
)
def health():

    return jsonify({

        "ok":
            True,

        "server":
            SERVER_NAME_DISPLAY,

        "version":
            SERVER_VERSION,

        "status":
            "ONLINE",

    }), 200


# ============================================================
# PROCESS COMMAND
# ============================================================

@app.route(
    "/process_command",
    methods=["POST"],
)
def process_command():

    try:

        data = request.get_json(
            force=True
        ) or {}

        command = clean_text(
            data.get(
                "command",
                "",
            )
        )

        if not command:

            return jsonify({

                "ok":
                    False,

                "response":
                    "No command received.",

            }), 400


        print()

        print(
            "YOU:",
            command,
        )


        # ====================================================
        # 1. WINDOWS LOCAL ACTION
        # ====================================================

        if (
            looks_like_action(
                command
            )
            and
            IS_WINDOWS
        ):

            print(
                "ROUTER: WINDOWS ACTION"
            )

            try:

                result = laptop.execute(
                    command
                )

                response_text = (
                    extract_laptop_response(
                        result
                    )
                )

                print(
                    "EDGE AI:",
                    response_text,
                )

                return jsonify({

                    "ok":
                        True,

                    "server":
                        SERVER_NAME_DISPLAY,

                    "type":
                        "action",

                    "response":
                        response_text,

                })


            except Exception as local_error:

                print(
                    "LOCAL ACTION ERROR:",
                    repr(
                        local_error
                    ),
                )


                # ============================================
                # GEMINI NORMALIZES FAILED LOCAL ACTION
                # ============================================

                try:

                    ai_command = brain.understand(
                        command
                    )

                    print(
                        "AI COMMAND:",
                        ai_command,
                    )


                    result = laptop.execute(
                        ai_command
                    )


                    response_text = (
                        extract_laptop_response(
                            result
                        )
                    )


                    print(
                        "EDGE AI:",
                        response_text,
                    )


                    return jsonify({

                        "ok":
                            True,

                        "server":
                            SERVER_NAME_DISPLAY,

                        "type":
                            "action",

                        "normalized_command":
                            ai_command,

                        "response":
                            response_text,

                    })


                except Exception as ai_action_error:

                    print(
                        "ACTION AI ERROR:",
                        repr(
                            ai_action_error
                        ),
                    )

                    return jsonify({

                        "ok":
                            False,

                        "server":
                            SERVER_NAME_DISPLAY,

                        "response":
                            (
                                "I could not complete "
                                "that Windows action."
                            ),

                    }), 500


        # ====================================================
        # 2. CLOUD ACTION FALLBACK
        # ====================================================

        if (
            looks_like_action(
                command
            )
            and
            not IS_WINDOWS
        ):

            print(
                "ROUTER: PUBLIC WEB / CLOUD"
            )

            return jsonify({

                "ok":
                    True,

                "server":
                    SERVER_NAME_DISPLAY,

                "type":
                    "public",

                "response":
                    (
                        "Windows control is unavailable "
                        "in public web mode. Browser-supported "
                        "commands are handled directly by the "
                        "EDGE AI web interface."
                    ),

            })


        # ====================================================
        # 3. NATURAL AI CONVERSATION
        # ====================================================

        print(
            "ROUTER: AI CONVERSATION"
        )

        try:

            reply = brain.chat(
                command
            )

            if not reply:

                reply = (
                    "I don't have a response "
                    "for that yet."
                )


            print(
                "JARVIS:",
                reply,
            )


            return jsonify({

                "ok":
                    True,

                "server":
                    SERVER_NAME_DISPLAY,

                "type":
                    "conversation",

                "response":
                    reply,

            })


        except Exception as chat_error:

            print(
                "GEMINI CHAT ERROR:",
                repr(
                    chat_error
                ),
            )

            return jsonify({

                "ok":
                    False,

                "server":
                    SERVER_NAME_DISPLAY,

                "response":
                    (
                        "My conversational intelligence "
                        "is temporarily unavailable."
                    ),

            }), 500


    except Exception as error:

        print(
            "PROCESS ERROR:",
            repr(
                error
            ),
        )

        return jsonify({

            "ok":
                False,

            "server":
                SERVER_NAME_DISPLAY,

            "response":
                (
                    "Jarvis encountered "
                    "an internal error."
                ),

        }), 500


# ============================================================
# SERVER INFO
# ============================================================

@app.route(
    "/server",
    methods=["GET"],
)
def server_info():

    return jsonify({

        "server":
            SERVER_NAME_DISPLAY,

        "version":
            SERVER_VERSION,

        "system":
            "EDGE AI OS 2077",

        "assistant":
            "J.A.R.V.I.S.",

        "mode":
            (
                "WINDOWS + AI"
                if IS_WINDOWS
                else "PUBLIC WEB + AI"
            ),

        "platform":
            platform.system(),

        "status":
            "ONLINE",

    })


# ============================================================
# FAVICON
# ============================================================

@app.route(
    "/favicon.ico"
)
def favicon():

    return "", 204


# ============================================================
# START SERVER
# ============================================================

if __name__ == "__main__":

    print()
    print(
        "=" * 70
    )

    print(
        "EDGE AI OS 2077"
    )

    print(
        "JARVIS NEURAL COMMAND SERVER"
    )

    print(
        "=" * 70
    )

    print()

    print(
        "Server Name  : "
        + SERVER_NAME_DISPLAY
    )

    print(
        "Version      : "
        + SERVER_VERSION
    )

    print()

    print(
        "Server       : ONLINE"
    )

    print(
        "Gemini Brain : ONLINE"
    )

    print(
        "Laptop Agent : "
        + (
            "ONLINE"
            if IS_WINDOWS
            else "OFFLINE"
        )
    )

    print(
        "Spider Vision: READY"
    )

    print(
        "Jutsu Engine : READY"
    )

    print(
        "Mode         : "
        + (
            "WINDOWS + AI"
            if IS_WINDOWS
            else "PUBLIC WEB + AI"
        )
    )

    print(
        "ADB          : NOT REQUIRED"
    )

    print()

    print(
        "JARVIS Home Interface:"
    )

    print(
        "http://127.0.0.1:5000"
    )

    print()

    print(
        "Device Status:"
    )

    print(
        "http://127.0.0.1:5000/device_status"
    )

    print()

    print(
        "=" * 70
    )


    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True,
        use_reloader=False,
    )