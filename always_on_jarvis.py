# ============================================================
# EDGE AI OS 2077
# ALWAYS-ON JARVIS V6.1 FAST
# ============================================================

import os
import re
import sys
import time
import random
import socket
import subprocess
from pathlib import Path

import numpy as np
import sounddevice as sd
import speech_recognition as sr
import pyttsx3

from agent import EdgeAgent
from gemini_brain import GeminiBrain


# ============================================================
# PROJECT
# ============================================================

PROJECT_DIR = Path(__file__).resolve().parent

STATE_FILE = PROJECT_DIR / "jarvis_state.txt"

OVERLAY_FILE = PROJECT_DIR / "jarvis_wake_overlay.py"


# ============================================================
# AUDIO
# ============================================================

LANGUAGE = "en-IN"

SAMPLE_RATE = 16000

CHANNELS = 1

WAKE_RECORD_SECONDS = 2.8

COMMAND_RECORD_SECONDS = 7.0

FOLLOW_UP_RECORD_SECONDS = 5.5

FOLLOW_UP_WINDOW = 18

MIN_AUDIO_LEVEL = 0.008


# ============================================================
# SINGLE INSTANCE
# ============================================================

INSTANCE_LOCK_HOST = "127.0.0.1"

INSTANCE_LOCK_PORT = 45877


# ============================================================
# WAKE WORDS
# ============================================================

WAKE_PATTERNS = [
    "hey jarvis",
    "hi jarvis",
    "hello jarvis",
    "jarvis",
    "hey jervis",
    "hey jarwis",
    "h jarvis",
    "jervis",
]


# ============================================================
# RESPONSES
# ============================================================

WAKE_RESPONSES = [
    "EDGE core synchronized. I'm listening.",
    "Neural link established. What's on your mind?",
    "At your service. Systems are standing by.",
    "Online and aware. Go ahead.",
    "Core active. Talk to me.",
    "Jarvis online. You have my attention.",
    "Neural systems aligned. I'm here.",
    "EDGE intelligence active. Proceed.",
    "All systems listening. What's the mission?",
    "I'm with you. What do you need?",
]


FOLLOWUP_RESPONSES = [
    "Go ahead.",
    "I'm listening.",
    "Continue.",
    "Yes?",
    "I'm with you.",
]


ERROR_RESPONSES = [
    "I didn't catch that clearly.",
    "Could you repeat that?",
    "Audio signal was unclear.",
    "Say that once more for me.",
]


# ============================================================
# GLOBALS
# ============================================================

recognizer = sr.Recognizer()

tts = None

brain = None

running = True

conversation_until = 0.0

instance_socket = None

overlay_process = None


# ============================================================
# WINDOWS AGENT
# ============================================================

local_agent = EdgeAgent()


# ============================================================
# TEXT HELPERS
# ============================================================

def clean_text(text):

    text = str(text or "").strip()

    return re.sub(
        r"\s+",
        " ",
        text
    )


def normalize(text):

    return clean_text(text).lower()


# ============================================================
# LOGGING
# ============================================================

def log(message):

    timestamp = time.strftime("%H:%M:%S")

    print(
        f"[{timestamp}] {message}",
        flush=True
    )


# ============================================================
# LIVE HUD STATE
# ============================================================

def set_jarvis_state(state):

    try:

        STATE_FILE.write_text(
            str(state).strip().upper(),
            encoding="utf-8"
        )

    except Exception as error:

        log(
            "STATE UPDATE ERROR: "
            + repr(error)
        )


# ============================================================
# SINGLE INSTANCE
# ============================================================

def acquire_instance_lock():

    global instance_socket

    try:

        instance_socket = socket.socket(
            socket.AF_INET,
            socket.SOCK_STREAM
        )

        instance_socket.setsockopt(
            socket.SOL_SOCKET,
            socket.SO_REUSEADDR,
            1
        )

        instance_socket.bind(
            (
                INSTANCE_LOCK_HOST,
                INSTANCE_LOCK_PORT
            )
        )

        instance_socket.listen(1)

        return True

    except OSError:

        return False


# ============================================================
# GEMINI - LAZY LOAD
# ============================================================

def initialize_brain():

    global brain

    if brain is not None:

        return True

    try:

        log(
            "Initializing Gemini intelligence..."
        )

        brain = GeminiBrain()

        log(
            "Gemini direct intelligence ONLINE"
        )

        return True

    except Exception as error:

        brain = None

        log(
            "Gemini initialization error: "
            + repr(error)
        )

        return False


# ============================================================
# PYTTSX3
# ============================================================

def initialize_voice():

    global tts

    try:

        tts = pyttsx3.init()

        tts.setProperty(
            "rate",
            178
        )

        tts.setProperty(
            "volume",
            1.0
        )

        voices = tts.getProperty(
            "voices"
        )

        for voice in voices:

            info = (
                str(getattr(voice, "name", ""))
                + " "
                + str(getattr(voice, "id", ""))
            ).lower()

            if (
                "david" in info
                or
                "mark" in info
            ):

                tts.setProperty(
                    "voice",
                    voice.id
                )

                break

        log(
            "pyttsx3 fallback voice ONLINE"
        )

        return True

    except Exception as error:

        tts = None

        log(
            "pyttsx3 initialization error: "
            + repr(error)
        )

        return False


# ============================================================
# WINDOWS SPEECH
# ============================================================
def windows_speak(text):

    if not text:
        return False

    try:

        safe_text = str(text).replace(
            "'",
            "''"
        )

        command = (
            "Add-Type -AssemblyName System.Speech; "
            "$voice = New-Object "
            "System.Speech.Synthesis.SpeechSynthesizer; "
            "$voice.Rate = 0; "
            "$voice.Volume = 100; "
            f"$voice.Speak('{safe_text}'); "
            "$voice.Dispose();"
        )

        # ====================================================
        # HIDE POWERSHELL WINDOW
        # ====================================================

        creation_flags = 0
        startup_info = None

        if os.name == "nt":

            creation_flags = getattr(
                subprocess,
                "CREATE_NO_WINDOW",
                0
            )

            startup_info = subprocess.STARTUPINFO()

            startup_info.dwFlags |= (
                subprocess.STARTF_USESHOWWINDOW
            )

            startup_info.wShowWindow = (
                subprocess.SW_HIDE
            )

        # ====================================================
        # WINDOWS SPEECH
        # ====================================================

        completed = subprocess.run(
            [
                "powershell.exe",
                "-NoLogo",
                "-NoProfile",
                "-NonInteractive",
                "-WindowStyle",
                "Hidden",
                "-ExecutionPolicy",
                "Bypass",
                "-Command",
                command,
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            stdin=subprocess.DEVNULL,
            timeout=60,
            creationflags=creation_flags,
            startupinfo=startup_info,
        )

        return (
            completed.returncode == 0
        )

    except Exception as error:

        log(
            "Windows speech error: "
            + repr(error)
        )

        return False
# ============================================================
# SPEAK
# ============================================================

def speak(text):

    text = clean_text(text)

    if not text:

        return

    set_jarvis_state(
        "SPEAKING"
    )

    log(
        "JARVIS: "
        + text
    )

    spoken = text

    if len(spoken) > 700:

        shortened = spoken[:700]

        ending = max(
            shortened.rfind("."),
            shortened.rfind("!"),
            shortened.rfind("?")
        )

        if ending > 200:

            shortened = shortened[
                :ending + 1
            ]

        spoken = shortened

    # Windows SAPI

    try:

        if windows_speak(
            spoken
        ):

            set_jarvis_state(
                "READY"
            )

            return

    except Exception as error:

        log(
            "Windows voice fallback: "
            + repr(error)
        )

    # pyttsx3 fallback

    try:

        if tts is not None:

            tts.stop()

            tts.say(
                spoken
            )

            tts.runAndWait()

        set_jarvis_state(
            "READY"
        )

    except Exception as error:

        log(
            "pyttsx3 speech error: "
            + repr(error)
        )

        set_jarvis_state(
            "READY"
        )


# ============================================================
# FLOATING HUD
# ============================================================

def show_wake_overlay():

    global overlay_process

    try:

        if not OVERLAY_FILE.exists():

            log(
                "WAKE OVERLAY ERROR: "
                "jarvis_wake_overlay.py not found."
            )

            return False

        if (
            overlay_process is not None
            and
            overlay_process.poll() is None
        ):

            log(
                "JARVIS WAKE OVERLAY already active"
            )

            return True

        creation_flags = 0

        if os.name == "nt":

            creation_flags = getattr(
                subprocess,
                "CREATE_NO_WINDOW",
                0
            )

        overlay_process = subprocess.Popen(
            [
                sys.executable,
                str(OVERLAY_FILE)
            ],
            cwd=str(PROJECT_DIR),
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            creationflags=creation_flags
        )

        log(
            "JARVIS WAKE OVERLAY OPENED"
        )

        return True

    except Exception as error:

        log(
            "WAKE OVERLAY ERROR: "
            + repr(error)
        )

        return False


# ============================================================
# RECORD AUDIO
# ============================================================

def record_audio(seconds):

    try:

        frames = int(
            SAMPLE_RATE * seconds
        )

        audio = sd.rec(
            frames,
            samplerate=SAMPLE_RATE,
            channels=CHANNELS,
            dtype="int16"
        )

        sd.wait()

        return np.asarray(
            audio
        ).reshape(-1)

    except Exception as error:

        log(
            "Microphone error: "
            + repr(error)
        )

        return None


# ============================================================
# AUDIO LEVEL
# ============================================================

def audio_level(audio):

    if audio is None:

        return 0.0

    if len(audio) == 0:

        return 0.0

    signal = (
        audio.astype(np.float32)
        / 32768.0
    )

    return float(
        np.sqrt(
            np.mean(
                signal * signal
            )
        )
    )


# ============================================================
# SPEECH TO TEXT
# ============================================================

def transcribe(audio):

    if audio is None:

        return ""

    if audio_level(audio) < MIN_AUDIO_LEVEL:

        return ""

    try:

        audio_data = sr.AudioData(
            audio.tobytes(),
            SAMPLE_RATE,
            2
        )

        text = recognizer.recognize_google(
            audio_data,
            language=LANGUAGE
        )

        return clean_text(text)

    except sr.UnknownValueError:

        return ""

    except sr.RequestError as error:

        log(
            "Speech recognition network error: "
            + repr(error)
        )

        return ""

    except Exception as error:

        log(
            "Speech recognition error: "
            + repr(error)
        )

        return ""


# ============================================================
# INSTANT LOCAL RESPONSES
# ============================================================

def local_instant_response(text):

    command = normalize(text)

    # ========================================================
    # REAL SYSTEM TIME - NO GEMINI
    # ========================================================

    time_words = (
        "time",
        "current time",
        "real time",
        "time now",
    )

    if any(
        word in command
        for word in time_words
    ):

        current_time = time.strftime(
            "%I:%M %p"
        )

        return (
            "The current time is "
            + current_time
            + "."
        )

    # ========================================================
    # REAL SYSTEM DATE - NO GEMINI
    # ========================================================

    date_words = (
        "date",
        "today's date",
        "todays date",
        "current date",
        "what day is it",
    )

    if any(
        word in command
        for word in date_words
    ):

        current_date = time.strftime(
            "%A, %d %B %Y"
        )

        return (
            "Today is "
            + current_date
            + "."
        )

    # ========================================================
    # JARVIS STATUS
    # ========================================================

    if (
        "system status" in command
        or "jarvis status" in command
        or "are you online" in command
        or "are you ready" in command
    ):

        return (
            "All primary EDGE systems are online. "
            "Jarvis is active and ready."
        )

    return ""
# ============================================================
# CONVERSATION DETECTOR
# ============================================================

def looks_like_conversation(text):

    command = normalize(text)

    prefixes = (
        "what ",
        "what is ",
        "what are ",
        "who ",
        "who is ",
        "why ",
        "when ",
        "where ",
        "how ",
        "how does ",
        "how do ",
        "how can ",
        "explain ",
        "describe ",
        "tell me ",
        "tell me about ",
        "define ",
        "translate ",
        "meaning of ",
        "summarize ",
        "write ",
        "give me information ",
        "give me an explanation ",
        "can you explain ",
        "could you explain ",
        "can you tell me ",
        "could you tell me ",
        "difference between ",
        "differentiate ",
        "what do you think ",
        "do you know ",
        "help me understand ",
    )

    return command.startswith(
        prefixes
    )


# ============================================================
# ACTION DETECTOR
# ============================================================

def looks_like_action(text):

    command = normalize(text)

    if looks_like_conversation(
        command
    ):

        return False

    action_prefixes = (
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
        "calculate ",
    )

    if command.startswith(
        action_prefixes
    ):

        return True

    direct_actions = {
        "youtube",
        "spotify",
        "chrome",
        "calculator",
        "settings",
        "desktop",
        "downloads",
        "documents",
        "pictures",
        "videos",
        "music",
        "volume up",
        "volume down",
        "mute",
        "unmute",
        "show desktop",
        "back",
        "home",
    }

    if command in direct_actions:

        return True

    if command.startswith(
        (
            "http://",
            "https://",
        )
    ):

        return True

    return False


# ============================================================
# EXECUTE WINDOWS ACTION
# ============================================================

def execute_local_action(text):

    try:

        if hasattr(
            local_agent,
            "execute_command"
        ):

            result = local_agent.execute_command(
                text
            )

        elif hasattr(
            local_agent,
            "execute"
        ):

            result = local_agent.execute(
                text
            )

        else:

            log(
                "EdgeAgent has no compatible execute method."
            )

            return ""

        if result:

            return clean_text(
                result
            )

    except Exception as error:

        log(
            "Local Windows Agent error: "
            + repr(error)
        )

    return ""


# ============================================================
# PERSONALITY
# ============================================================

def local_personality_response(text):

    casual = normalize(text)

    if casual in {
        "hello",
        "hi",
        "hey",
    }:

        return random.choice(
            [
                "Hello. EDGE core is online.",
                "Hey. I'm here.",
                "Jarvis online. What's up?",
                "All systems online. How can I help?",
            ]
        )

    if casual in {
        "who are you",
        "who are you jarvis",
        "what are you",
    }:

        return (
            "I am Jarvis, the intelligence layer "
            "of EDGE AI OS 2077. "
            "I combine Windows control, conversational "
            "intelligence, voice interaction, and Spider Vision."
        )

    if casual in {
        "how are you",
        "how are you jarvis",
    }:

        return random.choice(
            [
                "All systems nominal.",
                "Operating beautifully.",
                "Neural core stable and fully online.",
            ]
        )

    if casual in {
        "thank you",
        "thanks",
        "thanks jarvis",
        "thank you jarvis",
    }:

        return random.choice(
            [
                "Anytime.",
                "Always at your service.",
                "That's what I'm here for.",
                "Consider it done.",
            ]
        )

    return ""


# ============================================================
# DIRECT GEMINI
# ============================================================

def direct_gemini_chat(text):

    global brain

    set_jarvis_state(
        "THINKING"
    )

    if not initialize_brain():

        set_jarvis_state(
            "READY"
        )

        return (
            "My online intelligence core could not initialize, "
            "but local Windows control is still available."
        )

    try:

        log(
            "ROUTER: DIRECT GEMINI"
        )

        answer = brain.chat(
            text
        )

        answer = clean_text(
            answer
        )

        if not answer:

            set_jarvis_state(
                "READY"
            )

            return (
                "The intelligence core returned an empty response."
            )

        return answer

    except Exception as error:

        log(
            "DIRECT GEMINI ERROR: "
            + repr(error)
        )

        brain = None

        set_jarvis_state(
            "READY"
        )

        return (
            "My online intelligence link is temporarily unavailable, "
            "but I can still control this computer."
        )


# ============================================================
# MASTER ROUTER
# ============================================================

def ask_edge_brain(text):

    text = clean_text(text)

    if not text:

        return ""

    # 1. Instant local

    instant = local_instant_response(
        text
    )

    if instant:

        log(
            "ROUTER: LOCAL INSTANT"
        )

        return instant

    # 2. Conversation

    if looks_like_conversation(
        text
    ):

        return direct_gemini_chat(
            text
        )

    # 3. Windows action

    if looks_like_action(
        text
    ):

        log(
            "ROUTER: WINDOWS AGENT"
        )

        set_jarvis_state(
            "EXECUTING"
        )

        result = execute_local_action(
            text
        )

        if result:

            return result

    # 4. Local personality

    personality = local_personality_response(
        text
    )

    if personality:

        log(
            "ROUTER: LOCAL PERSONALITY"
        )

        return personality

    # 5. Gemini

    return direct_gemini_chat(
        text
    )


# ============================================================
# WAKE DETECTION
# ============================================================

def wake_detected(text):

    spoken = normalize(text)

    return any(
        wake in spoken
        for wake in WAKE_PATTERNS
    )


# ============================================================
# REMOVE WAKE PHRASE
# ============================================================

def remove_wake_phrase(text):

    result = clean_text(text)

    for wake in sorted(
        WAKE_PATTERNS,
        key=len,
        reverse=True
    ):

        result = re.sub(
            re.escape(wake),
            "",
            result,
            flags=re.I
        )

    result = re.sub(
        r"^[\s,;:.\-]+",
        "",
        result
    )

    return clean_text(result)


# ============================================================
# SLEEP COMMAND
# ============================================================

def is_sleep_command(text):

    command = normalize(text)

    return command in {
        "go to sleep",
        "sleep jarvis",
        "stop listening",
        "standby",
        "stand by",
        "that's all",
        "thats all",
        "return to standby",
    }


# ============================================================
# PROCESS REQUEST
# ============================================================

def process_request(text):

    global conversation_until

    text = clean_text(
        text
    )

    if not text:

        return

    # IMPORTANT:
    # normalized is created OUTSIDE the "if not text" block.
    # This fixes the UnboundLocalError.

    normalized = normalize(
        text
    )

    # ========================================================
    # BARE JARVIS / RE-WAKE
    # ========================================================

    if normalized in {
        "jarvis",
        "hey jarvis",
        "hi jarvis",
        "hello jarvis",
        "jervis",
    }:

        set_jarvis_state(
            "LISTENING"
        )

        show_wake_overlay()

        speak(
            random.choice(
                FOLLOWUP_RESPONSES
            )
        )

        conversation_until = (
            time.time()
            + FOLLOW_UP_WINDOW
        )

        return

    # ========================================================
    # REMOVE WAKE WORD IF INCLUDED WITH COMMAND
    # ========================================================

    if wake_detected(
        text
    ):

        cleaned = remove_wake_phrase(
            text
        )

        if cleaned:

            text = cleaned

    log(
        "YOU: "
        + text
    )

    # ========================================================
    # STANDBY COMMAND
    # ========================================================

    if is_sleep_command(
        text
    ):

        conversation_until = 0

        speak(
            "Understood. Returning to standby."
        )

        return

    # ========================================================
    # ROUTE REQUEST
    # ========================================================

    response = ask_edge_brain(
        text
    )

    if response:

        speak(
            response
        )

    conversation_until = (
        time.time()
        + FOLLOW_UP_WINDOW
    )


# ============================================================
# LISTEN FOR COMMAND
# ============================================================

def listen_for_command():

    global conversation_until

    set_jarvis_state(
        "LISTENING"
    )

    log(
        "Listening for command..."
    )

    audio = record_audio(
        COMMAND_RECORD_SECONDS
    )

    text = transcribe(
        audio
    )

    if not text:

        speak(
            random.choice(
                ERROR_RESPONSES
            )
        )

        conversation_until = 0

        return

    process_request(
        text
    )


# ============================================================
# STARTUP GREETING
# ============================================================

def startup_greeting():

    hour = time.localtime().tm_hour

    if 5 <= hour < 12:

        greeting = "Good morning."

    elif 12 <= hour < 18:

        greeting = "Good afternoon."

    else:

        greeting = "Good evening."

    speak(
        greeting
        + " EDGE AI OS is active. "
        + "Jarvis is standing by."
    )


# ============================================================
# MAIN
# ============================================================

def run():

    global running
    global conversation_until

    # Single instance

    if not acquire_instance_lock():

        print(
            "Another Jarvis instance is already running."
        )

        return

    print()

    print("=" * 68)

    print(
        "                   EDGE AI OS 2077"
    )

    print(
        "           ALWAYS-ON JARVIS V6.1 FAST"
    )

    print("=" * 68)

    print()

    print(
        "Wake word : Jarvis / Hey Jarvis"
    )

    print(
        "Platform  : Windows Laptop"
    )

    print(
        "Startup   : FAST / Gemini lazy-load"
    )

    print(
        "Router    : Local -> Windows -> Gemini"
    )

    print(
        "Wake HUD  : Floating Live HUD"
    )

    print(
        "Flask AI  : NOT REQUIRED"
    )

    print()

    # ========================================================
    # FAST START
    # ========================================================

    set_jarvis_state(
        "READY"
    )

    initialize_voice()

    # Gemini is intentionally NOT initialized here.
    # It loads only when an AI question is asked.

    startup_greeting()

    log(
        "Wake-word engine ONLINE"
    )

    # ========================================================
    # LOOP
    # ========================================================

    while running:

        try:

            # =================================================
            # FOLLOW-UP MODE
            # =================================================

            if (
                time.time()
                <
                conversation_until
            ):

                log(
                    "Follow-up window active..."
                )

                audio = record_audio(
                    FOLLOW_UP_RECORD_SECONDS
                )

                text = transcribe(
                    audio
                )

                if text:

                    if wake_detected(
                        text
                    ):

                        set_jarvis_state(
                            "LISTENING"
                        )

                        show_wake_overlay()

                        command = remove_wake_phrase(
                            text
                        )

                        if command:

                            process_request(
                                command
                            )

                        else:

                            speak(
                                random.choice(
                                    FOLLOWUP_RESPONSES
                                )
                            )

                            listen_for_command()

                    else:

                        process_request(
                            text
                        )

                continue

            # =================================================
            # STANDBY
            # =================================================

            audio = record_audio(
                WAKE_RECORD_SECONDS
            )

            text = transcribe(
                audio
            )

            if not text:

                continue

            log(
                "HEARD: "
                + text
            )

            if not wake_detected(
                text
            ):

                continue

            # =================================================
            # WAKE
            # =================================================

            log(
                "WAKE WORD DETECTED"
            )

            set_jarvis_state(
                "LISTENING"
            )

            show_wake_overlay()

            direct_command = remove_wake_phrase(
                text
            )

            speak(
                random.choice(
                    WAKE_RESPONSES
                )
            )

            if direct_command:

                process_request(
                    direct_command
                )

            else:

                listen_for_command()

        except KeyboardInterrupt:

            running = False

        except Exception as error:

            log(
                "Always-on loop error: "
                + repr(error)
            )

            set_jarvis_state(
                "READY"
            )

            time.sleep(1)

    speak(
        "Jarvis going offline."
    )


# ============================================================
# ENTRY
# ============================================================

if __name__ == "__main__":

    run()