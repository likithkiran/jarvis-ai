import os
import time

from google import genai


class GeminiBrain:

    def __init__(self):

        api_key = os.getenv(
            "GEMINI_API_KEY"
        )

        if not api_key:

            raise RuntimeError(
                "GEMINI_API_KEY is not set."
            )

        self.client = genai.Client(
            api_key=api_key
        )

        preferred_model = os.getenv(
            "GEMINI_MODEL",
            "gemini-3.6-flash"
        )

        self.models = []

        for model in [

            preferred_model,

            "gemini-3.6-flash",

            "gemini-3.5-flash-lite",

            "gemini-3.5-flash",

        ]:

            if model not in self.models:

                self.models.append(
                    model
                )

        self.model = self.models[0]


    # ========================================================
    # MODEL FALLBACK ENGINE
    # ========================================================

    def _generate(self, prompt):

        last_error = None

        for model in self.models:

            try:

                print(
                    f"GEMINI: trying {model}",
                    flush=True
                )

                response = (
                    self.client.models.generate_content(
                        model=model,
                        contents=prompt
                    )
                )

                result = (
                    response.text or ""
                ).strip()

                if not result:

                    raise RuntimeError(
                        f"{model} returned empty response."
                    )

                self.model = model

                print(
                    f"GEMINI: response from {model}",
                    flush=True
                )

                return result

            except Exception as error:

                last_error = error

                message = str(
                    error
                ).lower()

                print(
                    f"GEMINI MODEL ERROR [{model}]: "
                    f"{repr(error)}",
                    flush=True
                )

                recoverable = any(

                    marker in message

                    for marker in [

                        "429",

                        "resource_exhausted",

                        "quota",

                        "503",

                        "unavailable",

                        "high demand",

                        "temporarily",

                        "timeout",

                        "timed out",

                        "500",

                        "502",

                        "504",

                    ]

                )

                if recoverable:

                    print(
                        f"GEMINI: switching from {model}",
                        flush=True
                    )

                    time.sleep(
                        1
                    )

                    continue

                raise

        raise RuntimeError(
            "All Gemini models failed. "
            + repr(last_error)
        )


    # ========================================================
    # WINDOWS COMMAND INTERPRETER
    # ========================================================

    def understand(
        self,
        user_command
    ):

        prompt = f"""
You are the command-routing intelligence for EDGE AI OS 2077.

Your job is ONLY to convert the user's request into ONE concise
Windows command that the existing EdgeAgent can execute.

Examples:

User:
Could you open Spotify for me?

Output:
open spotify

User:
play believer

Output:
play believer on youtube

User:
take me to YouTube

Output:
open youtube

User:
search for artificial intelligence

Output:
search artificial intelligence

User:
increase the sound

Output:
volume up

User:
show my desktop

Output:
show desktop

Rules:

1. Return ONLY the executable command.
2. Never explain.
3. Never use markdown.
4. Preserve app names and search queries.
5. Remove wake words like Jarvis or Hey Jarvis.
6. Do not answer general questions here.
7. Do not translate here.
8. Do not hold conversations here.

User request:
{user_command}
"""

        return self._generate(
            prompt
        )


    # ========================================================
    # NATURAL JARVIS CONVERSATION
    # ========================================================

    def chat(
        self,
        user_message
    ):

        prompt = f"""
You are JARVIS, the conversational intelligence inside
EDGE AI OS 2077.

Personality:
- intelligent
- calm
- concise
- slightly futuristic
- natural, not robotic
- helpful
- capable of casual conversation

You may:
- answer questions
- translate text
- explain concepts
- chat naturally
- give ideas
- respond to greetings
- help with programming
- answer educational questions

Do NOT pretend an action happened unless the Windows Agent
actually performs it.

Keep ordinary voice responses reasonably concise unless
the user clearly asks for detail.

User:
{user_message}

JARVIS:
"""

        return self._generate(
            prompt
        )