// ============================================================
// EDGE AI OS 2077
// MAIN APP CONTROLLER + LIVE NEURAL STATE INTEGRATION
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
    // NEURAL STATE BRIDGE
    // ========================================================

    function setNeuralState(state) {

        const normalized =
            String(state || "READY")
                .toUpperCase();

        try {

            // Direct API if available
            if (
                window.EdgeNeuralCore &&
                typeof window.EdgeNeuralCore.setState === "function"
            ) {

                window.EdgeNeuralCore.setState(
                    normalized
                );
            }


            // Event fallback / other listeners
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

        if (value === null || value === undefined) {
            return "";
        }

        if (typeof value === "string") {
            return value;
        }

        if (typeof value === "object") {

            if (typeof value.response === "string") {
                return value.response;
            }

            if (typeof value.message === "string") {
                return value.message;
            }

            if (typeof value.result === "string") {
                return value.result;
            }

            if (typeof value.status === "string") {
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

        return String(value);
    }


    // ========================================================
    // ADD CHAT MESSAGE
    // ========================================================

    function addMessage(sender, message) {

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
            formatResponse(message);


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

    function addTerminalLog(message) {

        if (!terminalOutput) {
            return;
        }


        const line =
            document.createElement("p");


        line.textContent =
            "> " +
            formatResponse(message);


        terminalOutput.appendChild(
            line
        );


        terminalOutput.scrollTop =
            terminalOutput.scrollHeight;
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