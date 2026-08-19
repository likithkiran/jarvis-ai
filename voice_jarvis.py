import time
import numpy as np
import sounddevice as sd
import speech_recognition as sr

from jarvis import Jarvis


# ============================================================
# EDGE AI OS 2077
# J.A.R.V.I.S. VOICE ENGINE
# ============================================================

SAMPLE_RATE = 16000
CHANNELS = 1

# Use your Intel laptop microphone.
MIC_DEVICE = 1

# Seconds of audio recorded per listening cycle.
LISTEN_SECONDS = 5


class VoiceJarvis:

    def __init__(self):

        print()
        print("=" * 65)
        print("          EDGE AI OS 2077")
        print("          J.A.R.V.I.S. VOICE")
        print("=" * 65)
        print()

        self.jarvis = Jarvis()
        self.recognizer = sr.Recognizer()

        self.recognizer.energy_threshold = 300
        self.recognizer.dynamic_energy_threshold = True

        print("Microphone : READY")
        print("Device     :", MIC_DEVICE)
        print()
        print("Say something like:")
        print("  Jarvis, open Chrome")
        print("  Jarvis, open Notepad")
        print("  Jarvis, search YouTube for Iron Man")
        print()
        print("Press Ctrl+C to stop.")
        print()


    # ========================================================
    # RECORD MICROPHONE
    # ========================================================

    def record_audio(self):

        print("🎤 Listening...")

        try:

            audio = sd.rec(
                int(
                    LISTEN_SECONDS
                    * SAMPLE_RATE
                ),
                samplerate=SAMPLE_RATE,
                channels=CHANNELS,
                dtype="float32",
                device=MIC_DEVICE
            )

            sd.wait()

            return audio.flatten()

        except Exception as e:

            print(
                "Microphone error:",
                e
            )

            return None


    # ========================================================
    # CONVERT AUDIO → SPEECH
    # ========================================================

    def recognize(self, audio_data):

        if audio_data is None:
            return None

        # Convert float32 microphone data
        # into 16-bit PCM.
        pcm = np.clip(
            audio_data * 32767,
            -32768,
            32767
        ).astype(np.int16)

        audio = sr.AudioData(
            pcm.tobytes(),
            SAMPLE_RATE,
            2
        )

        try:

            print("🧠 Understanding...")

            text = self.recognizer.recognize_google(
                audio,
                language="en-IN"
            )

            return text.strip()

        except sr.UnknownValueError:

            return None

        except sr.RequestError as e:

            print(
                "Speech recognition service error:",
                e
            )

            return None

        except Exception as e:

            print(
                "Recognition error:",
                e
            )

            return None


    # ========================================================
    # MAIN VOICE LOOP
    # ========================================================

    def run(self):

        while True:

            try:

                audio = self.record_audio()

                text = self.recognize(
                    audio
                )

                if not text:

                    print(
                        "Didn't catch that."
                    )
                    print()

                    continue


                print()
                print(
                    "YOU 🎤 :",
                    text
                )


                # ------------------------------------------------
                # WAKE WORD
                # ------------------------------------------------

                lower = text.lower()

                if (
                    "jarvis" not in lower
                    and "jervis" not in lower
                ):

                    print(
                        "Wake word not detected."
                    )
                    print()

                    continue


                # ------------------------------------------------
                # SEND TO GEMINI + LAPTOP AGENT
                # ------------------------------------------------

                self.jarvis.process(
                    text
                )

                print()


            except KeyboardInterrupt:

                print()
                print(
                    "JARVIS > Voice system shutting down."
                )

                break


            except Exception as e:

                print()
                print(
                    "VOICE ERROR >",
                    e
                )

                time.sleep(1)


# ============================================================
# START
# ============================================================

if __name__ == "__main__":

    voice = VoiceJarvis()

    voice.run()