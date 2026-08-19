import os
import subprocess
import webbrowser
import urllib.parse
import re


class LaptopAgent:

    def __init__(self):

        # ----------------------------------------------------
        # WINDOWS APPLICATIONS
        # ----------------------------------------------------

        self.apps = {
            "notepad": "notepad.exe",
            "calculator": "calc.exe",
            "calc": "calc.exe",
            "paint": "mspaint.exe",
            "wordpad": "write.exe",
            "file explorer": "explorer.exe",
            "explorer": "explorer.exe",
            "command prompt": "cmd.exe",
            "cmd": "cmd.exe",
            "powershell": "powershell.exe",

            # Common Windows apps
            "chrome": "chrome.exe",
            "google chrome": "chrome.exe",
            "edge": "msedge.exe",
            "microsoft edge": "msedge.exe",
            "firefox": "firefox.exe",
            "vscode": "code",
            "visual studio code": "code",
            "spotify": "spotify",
            "discord": "discord",
            "teams": "ms-teams:",
        }

        # ----------------------------------------------------
        # WEBSITES
        # ----------------------------------------------------

        self.websites = {
            "google": "https://www.google.com",
            "youtube": "https://www.youtube.com",
            "github": "https://github.com",
            "gmail": "https://mail.google.com",
            "chatgpt": "https://chatgpt.com",
            "instagram": "https://www.instagram.com",
            "facebook": "https://www.facebook.com",
            "whatsapp": "https://web.whatsapp.com",
            "whatsapp web": "https://web.whatsapp.com",
            "spotify web": "https://open.spotify.com",
            "discord web": "https://discord.com/app",
            "google maps": "https://www.google.com/maps",
            "maps": "https://www.google.com/maps",
        }


    # ========================================================
    # OPEN WINDOWS APPLICATION
    # ========================================================

    def open_app(self, name):

        name = name.strip().lower()

        if name in self.apps:

            app = self.apps[name]

            try:

                # URI applications
                if app.endswith(":"):

                    os.startfile(app)

                else:

                    subprocess.Popen(
                        app,
                        shell=True
                    )

                return f"Launching {name.title()}."

            except Exception:

                # Windows START fallback
                try:

                    subprocess.Popen(
                        ["cmd", "/c", "start", "", app],
                        shell=False
                    )

                    return f"Launching {name.title()}."

                except Exception as e:

                    return (
                        f"Could not launch {name}: {e}"
                    )


        # ----------------------------------------------------
        # Known browser / Windows app fallback
        # ----------------------------------------------------

        try:

            subprocess.Popen(
                ["cmd", "/c", "start", "", name],
                shell=False
            )

            return f"Launching {name.title()}."

        except Exception:

            return (
                f"I couldn't find the Windows app "
                f"'{name}'."
            )


    # ========================================================
    # OPEN WEBSITE
    # ========================================================

    def open_url(self, url):

        if not url.startswith(
            ("http://", "https://")
        ):

            url = "https://" + url

        try:

            webbrowser.open(url)

            return f"Opening {url}"

        except Exception as e:

            return (
                f"Could not open website: {e}"
            )


    # ========================================================
    # WEBSITE BY NAME
    # ========================================================

    def open_website(self, name):

        name = name.strip().lower()

        if name in self.websites:

            return self.open_url(
                self.websites[name]
            )

        # Domain
        if re.match(
            r"^[a-zA-Z0-9-]+"
            r"(\.[a-zA-Z0-9-]+)+"
            r"(/.*)?$",
            name
        ):

            return self.open_url(name)

        # Google search
        query = urllib.parse.quote_plus(name)

        return self.open_url(
            "https://www.google.com/search?q="
            + query
        )


    # ========================================================
    # WHATSAPP
    # ========================================================

    def open_whatsapp(self):

        # Try WhatsApp Windows protocol first
        try:

            os.startfile(
                "whatsapp:"
            )

            return "Launching WhatsApp."

        except Exception:
            pass

        # Reliable fallback: WhatsApp Web
        return self.open_url(
            "https://web.whatsapp.com"
        )


    # ========================================================
    # SPOTIFY
    # ========================================================

    def open_spotify(self):

        try:

            subprocess.Popen(
                ["cmd", "/c", "start", "", "spotify:"],
                shell=False
            )

            return "Launching Spotify."

        except Exception:

            return self.open_url(
                "https://open.spotify.com"
            )


    # ========================================================
    # YOUTUBE SEARCH
    # ========================================================

    def youtube_search(self, query):

        query = query.strip()

        if not query:

            return (
                "Please provide a YouTube search."
            )

        encoded = urllib.parse.quote_plus(
            query
        )

        url = (
            "https://www.youtube.com/results?"
            "search_query=" + encoded
        )

        self.open_url(url)

        return (
            f"Searching YouTube for {query}."
        )


    # ========================================================
    # GOOGLE SEARCH
    # ========================================================

    def google_search(self, query):

        query = query.strip()

        if not query:

            return "Please provide a search query."

        encoded = urllib.parse.quote_plus(
            query
        )

        url = (
            "https://www.google.com/search?q="
            + encoded
        )

        self.open_url(url)

        return (
            f"Searching Google for {query}."
        )


    # ========================================================
    # CALCULATOR
    # ========================================================

    def calculate(self, expression):

        expression = (
            expression
            .replace("×", "*")
            .replace("Ã—", "*")
            .replace("÷", "/")
            .replace("Ã·", "/")
            .replace("^", "**")
        )

        if not re.match(
            r"^[0-9+\-*/().%\s*]+$",
            expression
        ):

            return (
                "I can only calculate "
                "numeric expressions."
            )

        try:

            result = eval(
                expression,
                {
                    "__builtins__": {}
                }
            )

            return f"{expression} = {result}"

        except Exception:

            return "I couldn't calculate that."


    # ========================================================
    # GOOGLE MAPS
    # ========================================================

    def maps(self, destination=None):

        if not destination:

            return self.open_url(
                "https://www.google.com/maps"
            )

        encoded = urllib.parse.quote_plus(
            destination
        )

        url = (
            "https://www.google.com/maps/search/?api=1"
            "&query=" + encoded
        )

        return self.open_url(url)


    # ========================================================
    # WINDOWS COMMAND
    # ========================================================

    def windows_command(self, command):

        try:

            subprocess.Popen(
                command,
                shell=True
            )

            return (
                f"Windows command started: {command}"
            )

        except Exception as e:

            return f"Command failed: {e}"


    # ========================================================
    # EXECUTE
    # ========================================================

    def execute(self, command):

        command = command.strip()

        if not command:

            return "Please provide a command."

        lower = command.lower()


        # ----------------------------------------------------
        # WHATSAPP
        # ----------------------------------------------------

        if lower in [
            "whatsapp",
            "open whatsapp",
            "launch whatsapp",
            "start whatsapp",
            "run whatsapp"
        ]:

            return self.open_whatsapp()


        # ----------------------------------------------------
        # SPOTIFY
        # ----------------------------------------------------

        if lower in [
            "spotify",
            "open spotify",
            "launch spotify",
            "start spotify"
        ]:

            return self.open_spotify()


        # ----------------------------------------------------
        # YOUTUBE SEARCH
        # ----------------------------------------------------

        match = re.match(
            r"^(search|find)\s+youtube"
            r"(?:\s+for)?\s+(.+)$",
            command,
            re.I
        )

        if match:

            return self.youtube_search(
                match.group(2)
            )


        # ----------------------------------------------------
        # PLAY / WATCH YOUTUBE
        # ----------------------------------------------------

        match = re.match(
            r"^(play|watch)\s+(.+?)"
            r"(?:\s+on\s+youtube)?$",
            command,
            re.I
        )

        if match:

            query = re.sub(
                r"\s+on\s+youtube$",
                "",
                match.group(2),
                flags=re.I
            ).strip()

            return self.youtube_search(query)


        # ----------------------------------------------------
        # GOOGLE SEARCH
        # ----------------------------------------------------

        match = re.match(
            r"^(search|google)\s+(.+)$",
            command,
            re.I
        )

        if match:

            query = match.group(2).strip()

            # If Gemini sends "search youtube..."
            if query.lower().startswith(
                "youtube "
            ):

                return self.youtube_search(
                    query[8:].strip()
                )

            return self.google_search(query)


        # ----------------------------------------------------
        # CALCULATOR
        # ----------------------------------------------------

        match = re.match(
            r"^(calculate|compute|what is)\s+(.+)$",
            command,
            re.I
        )

        if match:

            return self.calculate(
                match.group(2)
            )


        # ----------------------------------------------------
        # OPEN / LAUNCH / START / RUN
        # ----------------------------------------------------

        match = re.match(
            r"^(open|launch|start|run)\s+(.+)$",
            command,
            re.I
        )

        if match:

            target = match.group(2).strip()

            target_lower = target.lower()

            # Special apps
            if target_lower in [
                "whatsapp",
                "whatsapp web"
            ]:

                return self.open_whatsapp()

            if target_lower == "spotify":

                return self.open_spotify()

            # Windows apps
            if target_lower in self.apps:

                return self.open_app(target)

            # Websites
            if target_lower in self.websites:

                return self.open_website(target)

            # Maps
            if target_lower.startswith(
                "maps "
            ):

                return self.maps(
                    target[5:]
                )

            # Try Windows app
            result = self.open_app(target)

            return result


        # ----------------------------------------------------
        # VISIT / BROWSE
        # ----------------------------------------------------

        match = re.match(
            r"^(visit|browse)\s+(.+)$",
            command,
            re.I
        )

        if match:

            return self.open_website(
                match.group(2)
            )


        # ----------------------------------------------------
        # DIRECT URL
        # ----------------------------------------------------

        if lower.startswith(
            ("http://", "https://")
        ):

            return self.open_url(command)


        # ----------------------------------------------------
        # KNOWN WEBSITE
        # ----------------------------------------------------

        if lower in self.websites:

            return self.open_website(command)


        # ----------------------------------------------------
        # FALLBACK
        # ----------------------------------------------------

        return self.open_website(command)


# ============================================================
# TEST MODE
# ============================================================

if __name__ == "__main__":

    agent = LaptopAgent()

    print("=" * 60)
    print("       EDGE AI OS 2077")
    print("       WINDOWS LAPTOP AGENT")
    print("=" * 60)
    print()

    print("Try:")
    print("  open notepad")
    print("  open whatsapp")
    print("  open chrome")
    print("  search youtube for Iron Man 4K")
    print("  search google for Python")
    print("  calculate 245 * 67")
    print()

    while True:

        command = input("COMMAND > ").strip()

        if command.lower() in [
            "exit",
            "quit"
        ]:

            break

        print(
            "JARVIS >",
            agent.execute(command)
        )