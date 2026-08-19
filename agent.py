import ctypes
import difflib
import json
import os
import platform
import re
import shutil
import subprocess
import urllib.parse
import webbrowser
from pathlib import Path


# ============================================================
# EDGE AI OS 2077
# WINDOWS AGENT V2
# Generic Windows command engine for JARVIS / Flask integration
# ============================================================

class EdgeAgent:

    def __init__(self):

        # Kept for compatibility with older app.py code.
        self.adb = None

        self.system_name = platform.system()
        self.device_name = platform.node() or "Windows Laptop"

        self._start_apps_cache = None
        self._shortcut_cache = None

        # Common website aliases.
        self.websites = {
            "google": "https://www.google.com",
            "youtube": "https://www.youtube.com",
            "facebook": "https://www.facebook.com",
            "instagram": "https://www.instagram.com",
            "github": "https://github.com",
            "gmail": "https://mail.google.com",
            "spotify web": "https://open.spotify.com",
            "spotify website": "https://open.spotify.com",
            "linkedin": "https://www.linkedin.com",
            "chatgpt": "https://chatgpt.com",
            "reddit": "https://www.reddit.com",
            "whatsapp web": "https://web.whatsapp.com",
        }

        # Windows built-ins and common executable aliases.
        self.command_apps = {
            "notepad": ["notepad.exe"],
            "calculator": ["calc.exe"],
            "calc": ["calc.exe"],
            "paint": ["mspaint.exe"],
            "file explorer": ["explorer.exe"],
            "explorer": ["explorer.exe"],
            "command prompt": ["cmd.exe"],
            "cmd": ["cmd.exe"],
            "powershell": ["powershell.exe"],
            "terminal": ["wt.exe", "powershell.exe"],
            "windows terminal": ["wt.exe", "powershell.exe"],
            "task manager": ["taskmgr.exe"],
            "control panel": ["control.exe"],
            "snipping tool": ["snippingtool.exe"],
            "wordpad": ["write.exe"],
            "registry editor": ["regedit.exe"],
            "regedit": ["regedit.exe"],
            "vscode": ["code.cmd", "code.exe"],
            "vs code": ["code.cmd", "code.exe"],
            "visual studio code": ["code.cmd", "code.exe"],
            "chrome": ["chrome.exe"],
            "google chrome": ["chrome.exe"],
            "firefox": ["firefox.exe"],
            "edge": ["msedge.exe"],
            "microsoft edge": ["msedge.exe"],
            "spotify": ["spotify.exe"],
            "discord": ["discord.exe"],
            "steam": ["steam.exe"],
        }

        self.folder_aliases = {
            "desktop": Path.home() / "Desktop",
            "downloads": Path.home() / "Downloads",
            "documents": Path.home() / "Documents",
            "pictures": Path.home() / "Pictures",
            "videos": Path.home() / "Videos",
            "music": Path.home() / "Music",
            "home folder": Path.home(),
            "user folder": Path.home(),
        }

        # OneDrive Desktop/Documents are common on Windows.
        onedrive = Path(os.environ.get("OneDrive", ""))
        if onedrive:
            for name in ("Desktop", "Documents", "Pictures"):
                p = onedrive / name
                if p.exists():
                    self.folder_aliases[name.lower()] = p


    # ========================================================
    # COMPATIBILITY / STATUS
    # ========================================================

    def check_device(self):
        """Compatibility method: the Windows machine is the device."""
        return self.system_name.lower() == "windows"


    def run_adb(self, args, timeout=8):
        """Legacy compatibility stub. Android control is retired in V2."""
        return "", "ADB is not used in Windows Agent V2."


    def get_device_model(self):
        return "Windows Laptop"


    def installed_packages(self):
        return []


    def get_launchable_apps(self):
        return [item["name"] for item in self._get_start_apps()]


    def readable_app_name(self, value):
        return Path(str(value)).stem.replace("_", " ").replace("-", " ").title()


    def package_from_activity(self, activity):
        return str(activity)


    def launch_package(self, package):
        return self._launch_windows_target(str(package))


    # ========================================================
    # NORMALIZATION
    # ========================================================

    def normalize_command(self, command):

        command = str(command or "").strip()

        command = re.sub(
            r"^[\s.,!?;:]+|[\s.,!?;:]+$",
            "",
            command
        )

        command = re.sub(r"\s+", " ", command)

        return command


    # ========================================================
    # LOW-LEVEL WINDOWS HELPERS
    # ========================================================

    def _startfile(self, target):

        try:
            os.startfile(str(target))
            return True
        except Exception:
            return False


    def _run_detached(self, command):

        try:
            flags = 0
            if os.name == "nt":
                flags = subprocess.CREATE_NEW_PROCESS_GROUP | subprocess.DETACHED_PROCESS

            subprocess.Popen(
                command,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                creationflags=flags
            )
            return True

        except Exception:
            return False


    def _press_key(self, vk_code):

        try:
            user32 = ctypes.windll.user32
            KEYEVENTF_KEYUP = 0x0002

            user32.keybd_event(vk_code, 0, 0, 0)
            user32.keybd_event(vk_code, 0, KEYEVENTF_KEYUP, 0)

            return True

        except Exception:
            return False


    def _hotkey(self, *vk_codes):

        try:
            user32 = ctypes.windll.user32
            KEYEVENTF_KEYUP = 0x0002

            for code in vk_codes:
                user32.keybd_event(code, 0, 0, 0)

            for code in reversed(vk_codes):
                user32.keybd_event(code, 0, KEYEVENTF_KEYUP, 0)

            return True

        except Exception:
            return False


    # ========================================================
    # WINDOWS START MENU APP DISCOVERY
    # ========================================================

    def _get_start_apps(self):

        if self._start_apps_cache is not None:
            return self._start_apps_cache

        apps = []

        try:
            ps = (
                "Get-StartApps | "
                "Select-Object Name,AppID | "
                "ConvertTo-Json -Compress"
            )

            result = subprocess.run(
                [
                    "powershell.exe",
                    "-NoProfile",
                    "-ExecutionPolicy",
                    "Bypass",
                    "-Command",
                    ps,
                ],
                capture_output=True,
                text=True,
                timeout=12,
                encoding="utf-8",
                errors="ignore",
            )

            raw = result.stdout.strip()

            if raw:
                data = json.loads(raw)

                if isinstance(data, dict):
                    data = [data]

                for item in data:
                    name = str(item.get("Name", "")).strip()
                    appid = str(item.get("AppID", "")).strip()

                    if name and appid:
                        apps.append({
                            "name": name,
                            "appid": appid,
                        })

        except Exception:
            pass

        self._start_apps_cache = apps
        return apps


    def _get_shortcuts(self):

        if self._shortcut_cache is not None:
            return self._shortcut_cache

        roots = []

        appdata = os.environ.get("APPDATA")
        programdata = os.environ.get("PROGRAMDATA")

        if appdata:
            roots.append(
                Path(appdata) /
                "Microsoft" /
                "Windows" /
                "Start Menu" /
                "Programs"
            )

        if programdata:
            roots.append(
                Path(programdata) /
                "Microsoft" /
                "Windows" /
                "Start Menu" /
                "Programs"
            )

        items = []

        for root in roots:

            if not root.exists():
                continue

            try:
                for path in root.rglob("*.lnk"):
                    items.append({
                        "name": path.stem,
                        "path": path,
                    })
            except Exception:
                pass

        self._shortcut_cache = items
        return items


    def _best_match(self, requested, candidates, key="name", cutoff=0.62):

        requested = requested.lower().strip()

        if not requested:
            return None

        # Exact match.
        for item in candidates:
            if str(item[key]).lower().strip() == requested:
                return item

        # Requested phrase contained in candidate.
        contains = [
            item for item in candidates
            if requested in str(item[key]).lower()
        ]

        if contains:
            contains.sort(key=lambda x: len(str(x[key])))
            return contains[0]

        # Candidate contained in request.
        reverse = [
            item for item in candidates
            if str(item[key]).lower() in requested
        ]

        if reverse:
            reverse.sort(key=lambda x: len(str(x[key])), reverse=True)
            return reverse[0]

        names = [str(item[key]).lower() for item in candidates]

        match = difflib.get_close_matches(
            requested,
            names,
            n=1,
            cutoff=cutoff
        )

        if match:
            for item in candidates:
                if str(item[key]).lower() == match[0]:
                    return item

        return None


    def find_app(self, name):

        requested = self.normalize_command(name).lower()

        if not requested:
            return None

        # Built-in/known executable aliases.
        if requested in self.command_apps:
            return {
                "kind": "command",
                "name": requested,
                "commands": self.command_apps[requested],
            }

        # PATH executables.
        guesses = [
            requested,
            requested.replace(" ", ""),
            requested.replace(" ", "-"),
        ]

        for guess in guesses:

            for suffix in ("", ".exe", ".cmd", ".bat"):

                found = shutil.which(guess + suffix)

                if found:
                    return {
                        "kind": "path",
                        "name": requested,
                        "path": found,
                    }

        # Start Menu app IDs (including Microsoft Store apps).
        start_app = self._best_match(
            requested,
            self._get_start_apps()
        )

        if start_app:
            return {
                "kind": "appid",
                "name": start_app["name"],
                "appid": start_app["appid"],
            }

        # .lnk shortcuts.
        shortcut = self._best_match(
            requested,
            self._get_shortcuts()
        )

        if shortcut:
            return {
                "kind": "shortcut",
                "name": shortcut["name"],
                "path": shortcut["path"],
            }

        return None


    def _launch_windows_target(self, target):

        # Dictionary returned by find_app().
        if isinstance(target, dict):

            kind = target.get("kind")

            if kind == "command":

                for executable in target.get("commands", []):

                    found = shutil.which(executable) or executable

                    if self._run_detached([found]):
                        return True

                return False

            if kind == "path":
                return self._run_detached([target["path"]])

            if kind == "shortcut":
                return self._startfile(target["path"])

            if kind == "appid":

                appid = target["appid"]

                return self._run_detached([
                    "explorer.exe",
                    f"shell:AppsFolder\\{appid}"
                ])

        return self._startfile(target)


    # ========================================================
    # GENERIC APP LAUNCHER
    # ========================================================

    def open_app(self, name):

        clean_name = self.normalize_command(name)

        if not clean_name:
            return "Please tell me which application to open."

        requested = clean_name.lower()

        # Useful URI protocols first.
        protocols = {
            "spotify": "spotify:",
            "settings": "ms-settings:",
            "windows settings": "ms-settings:",
            "microsoft store": "ms-windows-store:",
            "store": "ms-windows-store:",
            "mail": "outlookmail:",
            "calendar": "outlookcal:",
        }

        if requested in protocols:

            if self._startfile(protocols[requested]):
                return f"Launching {clean_name.title()}."

        found = self.find_app(clean_name)

        if found and self._launch_windows_target(found):
            display = found.get("name", clean_name)
            return f"Launching {display}."

        # Chrome/Edge can sometimes exist outside PATH. Try common locations.
        special_paths = []

        local = os.environ.get("LOCALAPPDATA", "")
        program_files = os.environ.get("PROGRAMFILES", "")
        program_files_x86 = os.environ.get("PROGRAMFILES(X86)", "")

        if requested in ("chrome", "google chrome"):
            special_paths += [
                Path(program_files) / "Google/Chrome/Application/chrome.exe",
                Path(program_files_x86) / "Google/Chrome/Application/chrome.exe",
                Path(local) / "Google/Chrome/Application/chrome.exe",
            ]

        if requested in ("edge", "microsoft edge"):
            special_paths += [
                Path(program_files_x86) / "Microsoft/Edge/Application/msedge.exe",
                Path(program_files) / "Microsoft/Edge/Application/msedge.exe",
            ]

        if requested == "spotify":
            special_paths += [
                Path(local) / "Microsoft/WindowsApps/Spotify.exe",
                Path(local) / "Spotify/Spotify.exe",
            ]

        for path in special_paths:
            if path and path.exists() and self._run_detached([str(path)]):
                return f"Launching {clean_name.title()}."

        return (
            f"I couldn't find '{clean_name}' as an installed Windows app. "
            f"I can still search the web for it."
        )


    # ========================================================
    # FOLDERS / FILES
    # ========================================================

    def open_folder(self, name):

        key = self.normalize_command(name).lower()

        path = self.folder_aliases.get(key)

        if path and Path(path).exists():

            if self._startfile(path):
                return f"Opening {key.title()}."

        # Direct path.
        direct = Path(os.path.expandvars(os.path.expanduser(name)))

        if direct.exists():

            if self._startfile(direct):
                return f"Opening {direct}."

        return None


    # ========================================================
    # URL / WEBSITE
    # ========================================================

    def open_url(self, url):

        url = self.normalize_command(url)

        if not url:
            return "Please provide a website."

        if re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", url):
            # Allow known protocols such as spotify:, ms-settings:, etc.
            if self._startfile(url):
                return f"Opening {url}"

        if not url.startswith(("http://", "https://")):
            url = "https://" + url

        try:

            webbrowser.open(url, new=2)

            return f"Opening {url}"

        except Exception as error:

            return f"Could not open {url}: {error}"


    def open_website_name(self, name):

        name = self.normalize_command(name)

        if not name:
            return "Please provide a website."

        key = name.lower()

        if key in self.websites:
            return self.open_url(self.websites[key])

        if re.match(
            r"^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(/.*)?$",
            name
        ):
            return self.open_url(name)

        query = urllib.parse.quote_plus(name)

        return self.open_url(
            "https://www.google.com/search?q=" + query
        )


    # ========================================================
    # YOUTUBE / MAPS / SEARCH
    # ========================================================

    def open_youtube(self):
        return self.open_url("https://www.youtube.com")


    def youtube_search(self, query):

        query = self.normalize_command(query)

        if not query:
            return "Please provide a YouTube search."

        encoded = urllib.parse.quote_plus(query)

        self.open_url(
            "https://www.youtube.com/results?search_query=" + encoded
        )

        return f"Searching YouTube for: {query}"


    def open_maps(self):
        return self.open_url("https://www.google.com/maps")


    def maps_navigation(self, command):

        command = self.normalize_command(command)

        route = re.search(
            r"\bfrom\s+(.+?)\s+to\s+(.+)",
            command,
            re.I
        )

        if route:

            origin = route.group(1).strip()
            destination = route.group(2).strip()

            url = (
                "https://www.google.com/maps/dir/?api=1"
                "&origin=" +
                urllib.parse.quote_plus(origin) +
                "&destination=" +
                urllib.parse.quote_plus(destination)
            )

            self.open_url(url)

            return (
                f"Starting navigation from "
                f"{origin} to {destination}."
            )

        destination = re.sub(
            r"^(navigate|directions|route)\s*(to)?\s*",
            "",
            command,
            flags=re.I
        ).strip()

        if not destination:
            return "Please provide a destination."

        url = (
            "https://www.google.com/maps/search/?api=1"
            "&query=" +
            urllib.parse.quote_plus(destination)
        )

        self.open_url(url)

        return f"Opening directions for {destination}."


    def web_search(self, query):

        query = self.normalize_command(query)

        if not query:
            return "Please provide a search query."

        return self.open_url(
            "https://www.google.com/search?q=" +
            urllib.parse.quote_plus(query)
        )


    # ========================================================
    # CALCULATOR
    # ========================================================

    def calculate(self, expression):

        try:

            expression = (
                expression
                .replace("×", "*")
                .replace("÷", "/")
                .replace("^", "**")
            )

            if not re.match(
                r"^[0-9+\-*/().%\s*]+$",
                expression
            ):
                return None

            return eval(
                expression,
                {"__builtins__": {}}
            )

        except Exception:
            return None


    # ========================================================
    # WINDOWS SYSTEM ACTIONS
    # ========================================================

    def show_desktop(self):

        if self._hotkey(0x5B, 0x44):  # Win + D
            return "Showing Windows desktop."

        return "Could not show the Windows desktop."


    def home(self):
        return self.show_desktop()


    def back(self):

        if self._hotkey(0x12, 0x25):  # Alt + Left
            return "Going back."

        return "Could not send Back."


    def recent_apps(self):

        if self._hotkey(0x5B, 0x09):  # Win + Tab
            return "Opening Task View."

        return "Could not open Task View."


    def volume_up(self):

        if self._press_key(0xAF):
            return "Volume increased."

        return "Could not change volume."


    def volume_down(self):

        if self._press_key(0xAE):
            return "Volume decreased."

        return "Could not change volume."


    def volume_mute(self):

        if self._press_key(0xAD):
            return "Mute toggled."

        return "Could not toggle mute."


    def lock_phone(self):

        try:
            ctypes.windll.user32.LockWorkStation()
            return "Locking Windows."
        except Exception as error:
            return f"Could not lock Windows: {error}"


    def unlock_phone(self):

        return (
            "Windows requires Windows Hello, PIN, password, or another "
            "approved sign-in method to unlock securely."
        )


    def open_settings(self):

        if self._startfile("ms-settings:"):
            return "Opening Windows Settings."

        return "Could not open Windows Settings."


    def take_screenshot(self):

        # Opens Windows screen snipping overlay.
        if self._startfile("ms-screenclip:"):
            return "Opening Windows screenshot tool."

        if self._hotkey(0x5B, 0x10, 0x53):  # Win + Shift + S
            return "Opening Windows screenshot tool."

        return "Could not open the screenshot tool."


    # ========================================================
    # OPEN TARGET
    # ========================================================

    def open_target(self, target):

        target = self.normalize_command(target)

        if not target:
            return "Please tell me what you want to open."

        lower = target.lower()

        # Folders first.
        folder_result = self.open_folder(target)

        if folder_result:
            return folder_result

        # Direct URL.
        if target.startswith(("http://", "https://")):
            return self.open_url(target)

        # Domain.
        if re.match(
            r"^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(/.*)?$",
            target
        ):
            return self.open_url(target)

        # Website aliases.
        if lower in self.websites:
            return self.open_website_name(target)

        # Prefer installed Windows app.
        result = self.open_app(target)

        if not result.startswith("I couldn't find"):
            return result

        # Then search the web.
        return self.open_website_name(target)


    # ========================================================
    # COMMAND ENGINE
    # ========================================================

    def execute_command(self, command):

        original = self.normalize_command(command)

        if not original:
            return "Please enter a command."

        cmd = original.lower()


        # ----------------------------------------------------
        # STATUS / DEVICE
        # ----------------------------------------------------

        if cmd in {
            "ping",
            "status",
            "system status",
            "device status",
            "check device",
            "check system",
            "computer status",
            "pc status",
        }:
            return "Windows system online. EDGE AI control layer ready."

        if cmd in {
            "model",
            "device model",
            "computer model",
            "pc model",
        }:
            return "Connected device: Windows Laptop"


        # ----------------------------------------------------
        # WINDOWS DESKTOP / NAVIGATION
        # ----------------------------------------------------

        if cmd in {
            "home",
            "go home",
            "show desktop",
            "windows desktop",
            "show windows desktop",
            "desktop",
        }:
            return self.show_desktop()

        if cmd in {
            "back",
            "go back",
            "press back",
        }:
            return self.back()

        if cmd in {
            "recent",
            "recents",
            "recent apps",
            "task view",
            "show task view",
        }:
            return self.recent_apps()


        # ----------------------------------------------------
        # VOLUME
        # ----------------------------------------------------

        if cmd in {
            "volume up",
            "increase volume",
            "louder",
        }:
            return self.volume_up()

        if cmd in {
            "volume down",
            "decrease volume",
            "lower volume",
        }:
            return self.volume_down()

        if cmd in {
            "mute",
            "mute volume",
            "unmute",
            "toggle mute",
        }:
            return self.volume_mute()


        # ----------------------------------------------------
        # LOCK / SECURE UNLOCK RESPONSE
        # ----------------------------------------------------

        if cmd in {
            "lock",
            "lock computer",
            "lock pc",
            "lock desktop",
            "lock windows",
        }:
            return self.lock_phone()

        if cmd in {
            "unlock",
            "unlock computer",
            "unlock desktop",
            "unlock windows",
        }:
            return self.unlock_phone()


        # ----------------------------------------------------
        # SCREENSHOT
        # ----------------------------------------------------

        if cmd in {
            "screenshot",
            "take screenshot",
            "take a screenshot",
            "screen shot",
            "snip screen",
        }:
            return self.take_screenshot()


        # ----------------------------------------------------
        # CALCULATOR
        # ----------------------------------------------------

        calculator_match = re.match(
            r"^(calculate|compute|what is)\s+(.+)$",
            original,
            re.I
        )

        if calculator_match:

            expression = calculator_match.group(2)

            result = self.calculate(expression)

            if result is not None:
                return f"{expression} = {result}"

            return "Unable to calculate that."


        # ----------------------------------------------------
        # YOUTUBE SEARCH / PLAY
        # ----------------------------------------------------

        youtube_search_match = re.match(
            r"^(search|find)\s+youtube(?:\s+for)?\s+(.+)$",
            original,
            re.I
        )

        if youtube_search_match:
            return self.youtube_search(
                youtube_search_match.group(2).strip()
            )

        youtube_play_match = re.match(
            r"^(play|watch)\s+(.+?)(?:\s+on\s+youtube)?$",
            original,
            re.I
        )

        if youtube_play_match:

            query = youtube_play_match.group(2).strip()

            query = re.sub(
                r"\s+on\s+youtube$",
                "",
                query,
                flags=re.I
            ).strip()

            if query:
                return self.youtube_search(query)


        # ----------------------------------------------------
        # DIRECT YOUTUBE / CHROME / MAPS / SETTINGS
        # ----------------------------------------------------

        if cmd in {
            "youtube",
            "open youtube",
            "launch youtube",
            "start youtube",
            "run youtube",
        }:
            return self.open_youtube()

        if cmd in {
            "chrome",
            "open chrome",
            "launch chrome",
            "start chrome",
            "google chrome",
            "open google chrome",
        }:
            return self.open_app("chrome")

        if cmd in {
            "maps",
            "open maps",
            "google maps",
            "open google maps",
            "launch maps",
        }:
            return self.open_maps()

        if cmd in {
            "settings",
            "open settings",
            "launch settings",
            "start settings",
            "windows settings",
        }:
            return self.open_settings()


        # ----------------------------------------------------
        # MAP NAVIGATION
        # ----------------------------------------------------

        if re.match(
            r"^(navigate|directions|route)\b",
            original,
            re.I
        ):
            return self.maps_navigation(original)


        # ----------------------------------------------------
        # OPEN / LAUNCH / START / RUN — GENERIC WINDOWS
        # ----------------------------------------------------

        open_match = re.match(
            r"^(open|launch|start|run)\s+(.+)$",
            original,
            re.I
        )

        if open_match:

            target = open_match.group(2).strip()

            return self.open_target(target)


        # ----------------------------------------------------
        # VISIT / BROWSE
        # ----------------------------------------------------

        visit_match = re.match(
            r"^(visit|browse)\s+(.+)$",
            original,
            re.I
        )

        if visit_match:
            return self.open_website_name(
                visit_match.group(2).strip()
            )


        # ----------------------------------------------------
        # SEARCH / GOOGLE
        # ----------------------------------------------------

        search_match = re.match(
            r"^(search|google)\s+(.+)$",
            original,
            re.I
        )

        if search_match:
            return self.web_search(
                search_match.group(2).strip()
            )


        # ----------------------------------------------------
        # DIRECT URL
        # ----------------------------------------------------

        if cmd.startswith(("http://", "https://")):
            return self.open_url(original)


        # ----------------------------------------------------
        # DIRECT FOLDER / APP NAME
        # ----------------------------------------------------

        folder_result = self.open_folder(original)

        if folder_result:
            return folder_result

        app = self.find_app(original)

        if app:
            return self.open_app(original)


        # ----------------------------------------------------
        # SAFE FALLBACK
        # ----------------------------------------------------

        return self.web_search(original)


# ============================================================
# TEST MODE
# ============================================================

if __name__ == "__main__":

    print()
    print("=" * 60)
    print("        EDGE AI OS 2077")
    print("        WINDOWS AGENT V2")
    print("=" * 60)
    print()
    print("SYSTEM:", platform.platform())
    print("STATUS: ONLINE")
    print()
    print("Generic Windows command engine enabled.")
    print("Type 'exit' to quit.")
    print()

    agent = EdgeAgent()

    while True:

        try:

            command = input("EDGE AI > ").strip()

            if command.lower() in {"exit", "quit"}:
                break

            result = agent.execute_command(command)

            print("EDGE AI:", result)
            print()

        except KeyboardInterrupt:
            print()
            break

        except Exception as error:
            print("ERROR:", error)
            print()
