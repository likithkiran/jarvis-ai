// ============================================================
// EDGE AI OS 2077
// MAIN APP CONTROLLER + LIVE NEURAL STATE INTEGRATION
// HYBRID PUBLIC / WINDOWS MODE
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    const chatWindow =
        document.getElementById("chat-window") ||
        document.getElementById("chat-box");

    const terminalOutput =
        document.getElementById("terminal-output");


    // ========================================================
    // ENVIRONMENT MODE
    // ========================================================

    const EDGE_LOCAL_MODE =
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname === "localhost";

    const EDGE_PUBLIC_MODE =
        !EDGE_LOCAL_MODE;


    // ========================================================
    // NEURAL STATE BRIDGE
    // ========================================================

    function setNeuralState(state) {

        const normalized =
            String(state || "READY")
                .toUpperCase();

        try {

            if (
                window.EdgeNeuralCore &&
                typeof window.EdgeNeuralCore.setState === "function"
            ) {

                window.EdgeNeuralCore.setState(
                    normalized
                );
            }


            window.dispatchEvent(
                new CustomEvent(
                    "edge-jarvis-state",
                    {
                        detail: {
                            state: normalized
                        }
                    }
                )
            );

        } catch (error) {

            console.warn(
                "Neural state update failed:",
                error
            );
        }
    }


    // ========================================================
    // SAFE RESPONSE FORMATTER
    // Prevents [object Object]
    // ========================================================

    function formatResponse(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        if (
            typeof value === "string"
        ) {
            return value;
        }

        if (
            typeof value === "object"
        ) {

            if (
                typeof value.response === "string"
            ) {
                return value.response;
            }

            if (
                typeof value.message === "string"
            ) {
                return value.message;
            }

            if (
                typeof value.result === "string"
            ) {
                return value.result;
            }

            if (
                typeof value.status === "string"
            ) {
                return value.status;
            }

            try {

                return JSON.stringify(
                    value,
                    null,
                    2
                );

            } catch (error) {

                return "Command completed.";
            }
        }

        return String(
            value
        );
    }


    // ========================================================
    // ADD CHAT MESSAGE
    // ========================================================

    function addMessage(
        sender,
        message
    ) {

        if (!chatWindow) {

            console.error(
                "Chat window not found."
            );

            return;
        }


        const wrapper =
            document.createElement("div");


        wrapper.className =
            sender === "YOU"
                ? "message user-message"
                : "message ai-message";


        const title =
            document.createElement("b");


        title.textContent =
            sender === "YOU"
                ? "YOU:"
                : "EDGE AI:";


        const text =
            document.createElement("span");


        text.textContent =
            " " +
            formatResponse(
                message
            );


        wrapper.appendChild(
            title
        );

        wrapper.appendChild(
            text
        );


        chatWindow.appendChild(
            wrapper
        );


        chatWindow.scrollTop =
            chatWindow.scrollHeight;
    }


    // ========================================================
    // TERMINAL LOG
    // ========================================================

    function addTerminalLog(
        message
    ) {

        if (!terminalOutput) {
            return;
        }


        const line =
            document.createElement("p");


        line.textContent =
            "> " +
            formatResponse(
                message
            );


        terminalOutput.appendChild(
            line
        );


        terminalOutput.scrollTop =
            terminalOutput.scrollHeight;
    }


    // ========================================================
    // OPEN PUBLIC WEB TARGET
    // ========================================================

    function openPublicURL(
        url,
        label
    ) {

        try {

            const newWindow =
                window.open(
                    url,
                    "_blank",
                    "noopener,noreferrer"
                );


            if (!newWindow) {

                addMessage(
                    "EDGE AI",
                    "Your browser blocked the new tab. Please allow pop-ups for EDGE AI OS."
                );

                addTerminalLog(
                    "PUBLIC WEB → POPUP BLOCKED"
                );

                return false;
            }


            addMessage(
                "EDGE AI",
                "Opening " +
                label +
                "."
            );


            addTerminalLog(
                "PUBLIC WEB → OPEN " +
                String(label)
                    .toUpperCase()
            );


            return true;

        } catch (error) {

            console.error(
                "Public URL error:",
                error
            );


            addMessage(
                "EDGE AI",
                "I could not open that website."
            );


            addTerminalLog(
                "PUBLIC WEB ERROR → " +
                error.message
            );


            return false;
        }
    }


    // ========================================================
    // PUBLIC WEBSITE COMMAND ENGINE
    // ========================================================

    function handlePublicCommand(
        command
    ) {

        if (!EDGE_PUBLIC_MODE) {
            return false;
        }


        const cmd =
            String(
                command || ""
            )
                .trim()
                .toLowerCase();


        if (!cmd) {
            return false;
        }


        // ----------------------------------------------------
        // WEBSITE DATABASE
        // ----------------------------------------------------

        const websites = {

            "youtube":
                "https://www.youtube.com",

            "google":
                "https://www.google.com",

            "github":
                "https://github.com",

            "spotify":
                "https://open.spotify.com",

            "instagram":
                "https://www.instagram.com",

            "facebook":
                "https://www.facebook.com",

            "linkedin":
                "https://www.linkedin.com",

            "gmail":
                "https://mail.google.com",

            "maps":
                "https://maps.google.com",

            "google maps":
                "https://maps.google.com",

            "chatgpt":
                "https://chatgpt.com",

            "reddit":
                "https://www.reddit.com",

            "whatsapp":
                "https://web.whatsapp.com",

            "whatsapp web":
                "https://web.whatsapp.com",

            "amazon":
                "https://www.amazon.com",

            "wikipedia":
                "https://www.wikipedia.org"

        };


        // ----------------------------------------------------
        // DIRECT WEBSITE NAME
        // Example:
        // youtube
        // spotify
        // ----------------------------------------------------

        if (
            Object.prototype.hasOwnProperty.call(
                websites,
                cmd
            )
        ) {

            return openPublicURL(
                websites[cmd],
                cmd
            );
        }


        // ----------------------------------------------------
        // OPEN / LAUNCH / START WEBSITE
        // ----------------------------------------------------

        const openMatch =
            cmd.match(
                /^(?:hey\s+jarvis\s+|jarvis\s+)?(?:open|launch|start|go to|visit)\s+(.+)$/
            );


        if (openMatch) {

            let target =
                openMatch[1]
                    .replace(
                        /\s+(website|site|app)$/i,
                        ""
                    )
                    .trim();


            if (
                Object.prototype.hasOwnProperty.call(
                    websites,
                    target
                )
            ) {

                return openPublicURL(
                    websites[target],
                    target
                );
            }


            // ------------------------------------------------
            // DIRECT URL
            // ------------------------------------------------

            if (
                target.startsWith(
                    "https://"
                ) ||
                target.startsWith(
                    "http://"
                )
            ) {

                return openPublicURL(
                    target,
                    target
                );
            }


            // ------------------------------------------------
            // DOMAIN SUPPORT
            // Example:
            // open wikipedia.org
            // ------------------------------------------------

            if (
                /^[a-z0-9.-]+\.[a-z]{2,}$/i
                    .test(
                        target
                    )
            ) {

                return openPublicURL(
                    "https://" +
                    target,
                    target
                );
            }
        }


        // ----------------------------------------------------
        // GOOGLE SEARCH
        // ----------------------------------------------------

        const searchMatch =
            cmd.match(
                /^(?:hey\s+jarvis\s+|jarvis\s+)?(?:search|google|search google)\s+(?:for\s+)?(.+)$/
            );


        if (searchMatch) {

            const query =
                searchMatch[1]
                    .trim();


            if (!query) {
                return false;
            }


            const url =
                "https://www.google.com/search?q=" +
                encodeURIComponent(
                    query
                );


            const opened =
                openPublicURL(
                    url,
                    "Google search for " +
                    query
                );


            if (opened) {

                addTerminalLog(
                    "PUBLIC WEB → GOOGLE SEARCH → " +
                    query
                );
            }


            return opened;
        }


        // ----------------------------------------------------
        // YOUTUBE SEARCH / PLAY
        // ----------------------------------------------------

        const youtubeMatch =
            cmd.match(
                /^(?:hey\s+jarvis\s+|jarvis\s+)?(?:play|watch|youtube search|search youtube for)\s+(.+)$/
            );


        if (youtubeMatch) {

            const query =
                youtubeMatch[1]
                    .replace(
                        /\s+(song|video)$/i,
                        ""
                    )
                    .trim();


            if (!query) {
                return false;
            }


            const url =
                "https://www.youtube.com/results?search_query=" +
                encodeURIComponent(
                    query
                );


            const opened =
                openPublicURL(
                    url,
                    "YouTube search for " +
                    query
                );


            if (opened) {

                addTerminalLog(
                    "PUBLIC WEB → YOUTUBE SEARCH → " +
                    query
                );
            }


            return opened;
        }


        // ----------------------------------------------------
        // MAP SEARCH
        // ----------------------------------------------------

        const mapMatch =
            cmd.match(
                /^(?:hey\s+jarvis\s+|jarvis\s+)?(?:navigate to|directions to|map|maps)\s+(.+)$/
            );


        if (mapMatch) {

            const place =
                mapMatch[1]
                    .trim();


            if (!place) {
                return false;
            }


            const url =
                "https://www.google.com/maps/search/?api=1&query=" +
                encodeURIComponent(
                    place
                );


            const opened =
                openPublicURL(
                    url,
                    "Maps for " +
                    place
                );


            if (opened) {

                addTerminalLog(
                    "PUBLIC WEB → MAPS → " +
                    place
                );
            }


            return opened;
        }


        // ----------------------------------------------------
        // WINDOWS-ONLY COMMANDS
        // ----------------------------------------------------

        const windowsOnly =
            /^(?:hey\s+jarvis\s+|jarvis\s+)?(?:open|launch|start|run)\s+(calculator|notepad|settings|file explorer|explorer|terminal|powershell|cmd|command prompt|task manager|paint|vscode|vs code)$/i;


        const systemOnly =
            /^(?:hey\s+jarvis\s+|jarvis\s+)?(?:volume up|volume down|mute|unmute|show desktop|desktop|lock|recent apps|back)$/i;


        if (
            windowsOnly.test(
                cmd
            ) ||
            systemOnly.test(
                cmd
            )
        ) {

            addMessage(
                "EDGE AI",
                "Windows control is unavailable in public web mode. Install the EDGE AI Windows Companion for local system actions."
            );


            addTerminalLog(
                "WINDOWS OFFLINE → LOCAL COMPANION REQUIRED"
            );


            return true;
        }


        return false;
    }


    // ========================================================
    // SEND COMMAND
    // ========================================================

    async function sendCommand() {

        if (!input) {

            console.error(
                "user-input element not found."
            );

            return;
        }


        const command =
            input.value.trim();


        if (!command) {
            return;
        }


        // ----------------------------------------------------
        // USER COMMAND
        // ----------------------------------------------------

        addMessage(
            "YOU",
            command
        );


        addTerminalLog(
            "COMMAND → " +
            command
        );


        input.value = "";

        input.focus();


        if (sendBtn) {

            sendBtn.disabled =
                true;
        }


        // ----------------------------------------------------
        // PUBLIC WEB COMMAND
        // ----------------------------------------------------

        if (
            handlePublicCommand(
                command
            )
        ) {

            setNeuralState(
                "EXECUTING"
            );


            addTerminalLog(
                "NEURAL CORE → EXECUTING"
            );


            setTimeout(
                () => {

                    setNeuralState(
                        "READY"
                    );


                    addTerminalLog(
                        "NEURAL CORE → READY"
                    );

                },
                1000
            );


            if (sendBtn) {

                sendBtn.disabled =
                    false;
            }


            input.focus();

            return;
        }


        // ----------------------------------------------------
        // THINKING
        // ----------------------------------------------------

        setNeuralState(
            "THINKING"
        );


        addTerminalLog(
            "NEURAL CORE → THINKING"
        );


        try {

            // ------------------------------------------------
            // EXECUTING
            // ------------------------------------------------

            setTimeout(
                () => {

                    setNeuralState(
                        "EXECUTING"
                    );

                },
                250
            );


            // ------------------------------------------------
            // FLASK / RENDER AI BACKEND
            // ------------------------------------------------

            const response =
                await fetch(
                    "/process_command",
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                command:
                                    command
                            })
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Server returned HTTP " +
                    response.status
                );
            }


            const data =
                await response.json();


            // ------------------------------------------------
            // SAFE RESPONSE EXTRACTION
            // ------------------------------------------------

            let result =
                data.response;


            if (
                result === undefined ||
                result === null
            ) {

                result =
                    data.message ||
                    data.result ||
                    data.status ||
                    "Command completed.";
            }


            result =
                formatResponse(
                    result
                );


            // ------------------------------------------------
            // SPEAKING / RESPONSE
            // ------------------------------------------------

            setNeuralState(
                "SPEAKING"
            );


            addMessage(
                "EDGE AI",
                result
            );


            addTerminalLog(
                "OK → " +
                result
            );


            addTerminalLog(
                "NEURAL CORE → SPEAKING"
            );


            // ------------------------------------------------
            // RETURN TO READY
            // ------------------------------------------------

            setTimeout(
                () => {

                    setNeuralState(
                        "READY"
                    );


                    addTerminalLog(
                        "NEURAL CORE → READY"
                    );

                },
                1800
            );


        } catch (error) {

            console.error(
                "Command error:",
                error
            );


            const errorMessage =
                "Connection error: " +
                error.message;


            addMessage(
                "EDGE AI",
                errorMessage
            );


            addTerminalLog(
                "ERROR → " +
                error.message
            );


            setNeuralState(
                "READY"
            );
        }


        if (sendBtn) {

            sendBtn.disabled =
                false;
        }


        input.focus();
    }


    // ========================================================
    // SEND BUTTON
    // ========================================================

    if (sendBtn) {

        sendBtn.addEventListener(
            "click",
            sendCommand
        );
    }


    // ========================================================
    // ENTER KEY
    // ========================================================

    if (input) {

        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    sendCommand();
                }
            }
        );
    }


    // ========================================================
    // QUICK COMMAND SUPPORT
    // ========================================================

    window.edgeSendCommand =
        function(command) {

            if (!input) {
                return;
            }

            input.value =
                command;

            sendCommand();
        };


    // ========================================================
    // OPTIONAL EXTERNAL STATE CONTROL
    // ========================================================

    window.edgeSetNeuralState =
        function(state) {

            setNeuralState(
                state
            );
        };


    // ========================================================
    // MODE INFO
    // ========================================================

    window.EdgeRuntimeMode = {

        local:
            EDGE_LOCAL_MODE,

        public:
            EDGE_PUBLIC_MODE,

        hostname:
            window.location.hostname
    };


    // ========================================================
    // INITIAL TERMINAL
    // ========================================================

    addTerminalLog(
        "EDGE AI OS interface connected."
    );

    addTerminalLog(
        "AI Neural Assistant ready."
    );

    addTerminalLog(
        "Vision Engine ready."
    );

    addTerminalLog(
        "Gesture Engine ready."
    );


    if (EDGE_LOCAL_MODE) {

        addTerminalLog(
            "RUNTIME MODE → WINDOWS LOCAL"
        );

    } else {

        addTerminalLog(
            "RUNTIME MODE → PUBLIC WEB"
        );

        addTerminalLog(
            "WINDOWS CONTROL → OFFLINE"
        );
    }


    // ========================================================
    // INITIAL STATE
    // ========================================================

    setNeuralState(
        "READY"
    );


    // ========================================================
    // INITIAL FOCUS
    // ========================================================

    if (input) {

        input.focus();
    }

});