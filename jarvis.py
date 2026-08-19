import speech_recognition as sr
import sounddevice as sd
import scipy.io.wavfile as wav
import tempfile
import os
import re
import subprocess
import time

from gemini_brain import GeminiBrain
from laptop_agent import LaptopAgent


class Jarvis:

    def __init__(self):

        print()
        print("=" * 70)
        print("                 EDGE AI OS 2077")
        print("                 J.A.R.V.I.S.")
        print("=" * 70)
        print()

        # ----------------------------------------------------
        # AI
        # ----------------------------------------------------

        self.brain = GeminiBrain()
        self.laptop = LaptopAgent()

        # ----------------------------------------------------
        # SPEECH RECOGNITION
        # ----------------------------------------------------

        self.recognizer = sr.Recognizer()

        self.sample_rate = 16000
        self.record_seconds = 5

        # ----------------------------------------------------
        # VOICE SETTINGS
        # ----------------------------------------------------

        self.wake_word = "jarvis"

        print("Gemini Brain : ONLINE")
        print("Laptop Agent : ONLINE")
        print("Microphone   : ONLINE")
        print("Speaker      : ONLINE")
        print("ADB          : NOT REQUIRED")
        print()
        print("JARVIS is ready.")
        print()

        self.speak("JARVIS online.")

    # ========================================================
    # TEXT TO SPEECH
    # ========================================================

    def speak(self, text):

        if not text:
            return

        try:

            # Remove things that sound bad when spoken
            speech = str(text)

            speech = speech.replace(
                "https://",
                ""
            )

            speech = speech.replace(
                "http://",
                ""
            )

            # Windows built-in Speech API
            ps_script = (
                "Add-Type -AssemblyName System.Speech; "
                "$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer; "
                "$speak.Rate = 1; "
                "$speak.Volume = 100; "
                "$speak.Speak("
                + repr(speech)
                + ")"
            )

            subprocess.run(
                [
                    "powershell",
                    "-NoProfile",
                    "-ExecutionPolicy",
                    "Bypass",
                    "-Command",
                    ps_script
                ],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                timeout=20
            )

        except Exception as e:

            print(
                "TTS ERROR >",
                e
            )

    # ========================================================
    # CLEAN COMMAND
    # ========================================================

    def clean_command(self, text):

        if not text:
            return ""

        text = text.strip()

        # Remove common punctuation
        text = re.sub(
            r"^[\s,!.?;:]+|[\s,!.?;:]+$",
            "",
            text
        )

        # Normalize spaces
        text = re.sub(
            r"\s+",
            " ",
            text
        )

        return text.strip()

    # ========================================================
    # REMOVE JARVIS WAKE WORD
    # ========================================================

    def remove_wake_word(self, text):

        text = self.clean_command(text)

        if not text:
            return ""

        # Examples:
        #
        # Jarvis open YouTube
        # hey Jarvis open YouTube
        # okay Jarvis open Chrome

        text = re.sub(
            r"^(hey\s+|okay\s+|ok\s+)?jarvis\b[\s,:-]*",
            "",
            text,
            flags=re.I
        )

        return self.clean_command(text)

    # ========================================================
    # MICROPHONE
    # ========================================================

    def listen(self):

        print()
        print("🎤 Listening...")

        filename = None

        try:

            # ------------------------------------------------
            # Record microphone
            # ------------------------------------------------

            audio_data = sd.rec(
                int(
                    self.record_seconds
                    * self.sample_rate
                ),
                samplerate=self.sample_rate,
                channels=1,
                dtype="int16"
            )

            sd.wait()

            # ------------------------------------------------
            # Temporary WAV
            # ------------------------------------------------

            with tempfile.NamedTemporaryFile(
                suffix=".wav",
                delete=False
            ) as temp:

                filename = temp.name

            wav.write(
                filename,
                self.sample_rate,
                audio_data
            )

            print("🧠 Understanding...")

            # ------------------------------------------------
            # Speech recognition
            # ------------------------------------------------

            with sr.AudioFile(filename) as source:

                audio = self.recognizer.record(
                    source
                )

            try:

                text = self.recognizer.recognize_google(
                    audio
                )

            except sr.UnknownValueError:

                text = ""

            except sr.RequestError as e:

                print(
                    "SPEECH ERROR >",
                    e
                )

                return ""

            return self.clean_command(text)

        except Exception as e:

            print()
            print(
                "MIC ERROR >",
                e
            )

            return ""

        finally:

            if filename:

                try:

                    os.remove(filename)

                except Exception:

                    pass

    # ========================================================
    # LOCAL COMMAND DETECTION
    # ========================================================

    def local_command(self, command):

        if not command:

            return None

        cmd = command.lower().strip()

        # ----------------------------------------------------
        # OPEN / LAUNCH / START
        # ----------------------------------------------------

        if re.match(
            r"^(open|launch|start|run)\s+",
            cmd
        ):

            return command

        # ----------------------------------------------------
        # YOUTUBE SEARCH
        # ----------------------------------------------------

        if re.match(
            r"^(search|find)\s+youtube\b",
            cmd
        ):

            return command

        # ----------------------------------------------------
        # PLAY YOUTUBE
        # ----------------------------------------------------

        if re.match(
            r"^(play|watch)\s+",
            cmd
        ):

            return command

        # ----------------------------------------------------
        # GOOGLE SEARCH
        # ----------------------------------------------------

        if re.match(
            r"^(search|google)\s+",
            cmd
        ):

            return command

        # ----------------------------------------------------
        # CALCULATOR
        # ----------------------------------------------------

        if re.match(
            r"^(calculate|compute|what is)\s+",
            cmd
        ):

            return command

        # ----------------------------------------------------
        # DIRECT WEBSITE
        # ----------------------------------------------------

        if re.match(
            r"^(https?://)",
            cmd
        ):

            return command

        # ----------------------------------------------------
        # COMMON APPS
        # ----------------------------------------------------

        common_apps = [

            "youtube",
            "chrome",
            "google chrome",
            "whatsapp",
            "instagram",
            "facebook",
            "gmail",
            "github",
            "chatgpt",
            "notepad",
            "calculator",
            "calc",
            "paint",
            "wordpad",
            "explorer",
            "file explorer",
            "powershell",
            "command prompt",
            "cmd"
        ]

        if cmd in common_apps:

            return "open " + command

        # ----------------------------------------------------
        # SYSTEM COMMANDS
        # ----------------------------------------------------

        if cmd in [
            "home",
            "go home",
            "volume up",
            "volume down",
            "mute",
            "lock",
            "unlock"
        ]:

            return command

        return None

    # ========================================================
    # GEMINI FALLBACK
    # ========================================================

    def gemini_command(self, command):

        print()
        print("🧠 Using Gemini for this request...")

        try:

            result = self.brain.understand(
                command
            )

            return result

        except Exception as e:

            print()
            print(
                "GEMINI ERROR >",
                e
            )

            # ------------------------------------------------
            # Friendly quota handling
            # ------------------------------------------------

            error_text = str(e).lower()

            if (
                "429" in error_text
                or
                "quota" in error_text
                or
                "resource_exhausted" in error_text
            ):

                print()
                print(
                    "JARVIS > Gemini quota reached."
                )

                return ""

            return ""

    # ========================================================
    # PROCESS COMMAND
    # ========================================================

    def process(self, user_command):

        user_command = self.clean_command(
            user_command
        )

        if not user_command:

            return ""

        print()
        print(
            "YOU  :",
            user_command
        )

        # ----------------------------------------------------
        # Remove wake word
        # ----------------------------------------------------

        command = self.remove_wake_word(
            user_command
        )

        # ----------------------------------------------------
        # If user only says "Jarvis"
        # ----------------------------------------------------

        if not command:

            response = "Yes?"

            print(
                "JARVIS:",
                response
            )

            self.speak(response)

            return response

        # ----------------------------------------------------
        # IMPORTANT:
        # Shutdown is handled LOCALLY.
        # Gemini NEVER decides shutdown.
        # ----------------------------------------------------

        clean = command.lower().strip()

        if clean in [
            "exit",
            "quit",
            "shutdown",
            "shut down",
            "goodbye"
        ]:

            response = (
                "Systems standing by. Goodbye."
            )

            print(
                "JARVIS:",
                response
            )

            self.speak(response)

            return "__EXIT__"

        # ----------------------------------------------------
        # LOCAL COMMAND FIRST
        # ----------------------------------------------------

        local = self.local_command(
            command
        )

        if local:

            print(
                "LOCAL:",
                local
            )

            try:

                result = self.laptop.execute(
                    local
                )

            except Exception as e:

                result = (
                    "Laptop command failed: "
                    + str(e)
                )

            print(
                "JARVIS:",
                result
            )

            self.speak(result)

            return result

        # ----------------------------------------------------
        # GEMINI ONLY WHEN NEEDED
        # ----------------------------------------------------

        ai_command = self.gemini_command(
            command
        )

        if not ai_command:

            response = (
                "I couldn't understand that command."
            )

            print(
                "JARVIS:",
                response
            )

            self.speak(response)

            return response

        print(
            "AI   :",
            ai_command
        )

        # ----------------------------------------------------
        # SAFETY:
        # Gemini cannot shut down JARVIS.
        # ----------------------------------------------------

        if ai_command.lower().strip() in [
            "exit",
            "quit",
            "shutdown",
            "shut down"
        ]:

            response = (
                "I won't shut down from an AI-generated command."
            )

            print(
                "JARVIS:",
                response
            )

            self.speak(response)

            return response

        # ----------------------------------------------------
        # Execute Gemini command
        # ----------------------------------------------------

        try:

            result = self.laptop.execute(
                ai_command
            )

        except Exception as e:

            result = (
                "Laptop command failed: "
                + str(e)
            )

        print(
            "JARVIS:",
            result
        )

        self.speak(result)

        return result

    # ========================================================
    # VOICE LOOP
    # ========================================================

    def voice_loop(self):

        print()
        print("=" * 70)
        print("                  🎤 VOICE MODE")
        print("=" * 70)
        print()

        print("Try:")
        print()
        print("  Jarvis open YouTube")
        print("  Jarvis search YouTube for Samsung")
        print("  Jarvis open WhatsApp")
        print("  Jarvis open Instagram")
        print("  Jarvis open Notepad")
        print("  Jarvis open Chrome")
        print("  Jarvis calculate 245 * 67")
        print("  Jarvis search what is artificial intelligence")
        print()
        print("Say 'Jarvis' to test the assistant.")
        print("Say 'Jarvis shutdown' to stop.")
        print("Press Ctrl+C to force stop.")
        print()

        while True:

            try:

                user_command = self.listen()

                if not user_command:

                    continue

                result = self.process(
                    user_command
                )

                if result == "__EXIT__":

                    break

            except KeyboardInterrupt:

                print()
                print()
                print(
                    "JARVIS > Shutdown requested."
                )

                break

            except Exception as e:

                print()
                print(
                    "JARVIS ERROR >",
                    e
                )

                time.sleep(1)


# ============================================================
# MAIN
# ============================================================

def main():

    try:

        jarvis = Jarvis()

        jarvis.voice_loop()

    except KeyboardInterrupt:

        print()
        print(
            "JARVIS > Shutdown requested."
        )

    except Exception as e:

        print()
        print(
            "STARTUP ERROR >",
            e
        )


if __name__ == "__main__":

    main()