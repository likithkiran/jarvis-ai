/* ============================================================
   EDGE AI OS 2077
   REACTOR INTELLIGENCE
   Connects Jarvis + Commands + Jutsu to the central reactor
   Visual / UI behavior only
============================================================ */

(() => {

    "use strict";

    console.log(
        "EDGE AI OS 2077: Reactor Intelligence loading..."
    );


    /* ========================================================
       STYLE LAYER
    ======================================================== */

    const style =
        document.createElement("style");


    style.id =
        "reactor-intelligence-style";


    style.textContent = `

        /* ====================================================
           REACTOR STATES
        ==================================================== */

        #edge-reactor {

            transition:
                filter 0.35s ease,
                opacity 0.35s ease !important;

        }


        /* LISTENING */

        body.jarvis-listening
        #edge-reactor {

            filter:
                brightness(1.6)
                drop-shadow(
                    0 0 20px #00ffff
                )
                drop-shadow(
                    0 0 55px rgba(0,255,255,0.45)
                );

        }


        body.jarvis-listening
        .ring-1 {

            animation-duration:
                4s !important;

        }


        body.jarvis-listening
        .ring-2 {

            animation-duration:
                3s !important;

        }


        body.jarvis-listening
        .ring-3 {

            animation-duration:
                2.4s !important;

        }


        /* COMMAND PROCESSING */

        body.jarvis-processing
        #edge-reactor {

            filter:
                brightness(2)
                drop-shadow(
                    0 0 30px #00ffff
                )
                drop-shadow(
                    0 0 90px rgba(0,200,255,0.65)
                );

        }


        body.jarvis-processing
        .reactor-core {

            animation:
                commandCorePulse
                0.3s ease-in-out
                infinite alternate !important;

        }


        @keyframes commandCorePulse {

            from {

                transform:
                    translate(-50%, -50%)
                    scale(1);

            }

            to {

                transform:
                    translate(-50%, -50%)
                    scale(1.16);

            }

        }


        /* SUCCESS */

        body.jarvis-success
        #edge-reactor {

            filter:
                brightness(1.9)
                drop-shadow(
                    0 0 28px #00ff88
                )
                drop-shadow(
                    0 0 75px rgba(0,255,136,0.55)
                );

        }


        body.jarvis-success
        .reactor-core {

            box-shadow:
                0 0 20px #00ff88,
                0 0 50px rgba(0,255,136,0.9),
                0 0 110px rgba(0,255,136,0.45)
                !important;

        }


        /* JUTSU CHARGE */

        body.jutsu-stage-1
        #edge-reactor {

            filter:
                brightness(1.35);

        }


        body.jutsu-stage-2
        #edge-reactor {

            filter:
                brightness(1.7)
                drop-shadow(
                    0 0 35px #00ffff
                );

        }


        body.jutsu-stage-3
        #edge-reactor {

            filter:
                brightness(2.4)
                drop-shadow(
                    0 0 60px #00ffff
                )
                drop-shadow(
                    0 0 120px rgba(0,255,255,0.65)
                );

        }


        /* ====================================================
           REACTOR STATUS TEXT
        ==================================================== */

        #reactor-intelligence-status {

            position:
                fixed;

            left:
                50%;

            top:
                63%;

            transform:
                translateX(-50%);

            z-index:
                30;

            pointer-events:
                none;

            font-family:
                Orbitron,
                sans-serif;

            font-size:
                10px;

            letter-spacing:
                4px;

            color:
                #00ffff;

            text-align:
                center;

            opacity:
                0.72;

            text-shadow:
                0 0 10px #00ffff;

            transition:
                color 0.25s ease,
                opacity 0.25s ease,
                transform 0.25s ease;

        }


        #reactor-intelligence-status.active {

            opacity:
                1;

            transform:
                translateX(-50%)
                scale(1.08);

        }


        #reactor-intelligence-status.success {

            color:
                #00ff88;

            text-shadow:
                0 0 12px #00ff88;

        }


        #reactor-intelligence-status.jutsu {

            color:
                #ffffff;

            text-shadow:
                0 0 12px #00ffff,
                0 0 30px #00ffff;

        }


        /* ====================================================
           BOTTOM COMMAND BAR FIX
        ==================================================== */

        .chat-section {

            padding-bottom:
                110px !important;

        }


        .input-area {

            position:
                sticky !important;

            bottom:
                18px !important;

            z-index:
                300 !important;

            padding:
                10px !important;

            border-radius:
                18px;

            background:
                rgba(2, 12, 25, 0.82);

            backdrop-filter:
                blur(18px);

            -webkit-backdrop-filter:
                blur(18px);

            border:
                1px solid rgba(0,255,255,0.22);

            box-shadow:
                0 15px 40px rgba(0,0,0,0.32),
                0 0 20px rgba(0,255,255,0.06);

        }


        .command-label {

            position:
                relative;

            z-index:
                310;

            margin-bottom:
                20px;

        }


        #voice-btn {

            min-width:
                74px !important;

        }


        #send-btn {

            min-width:
                62px;

            min-height:
                52px;

        }


        /* ====================================================
           RESPONSIVE
        ==================================================== */

        @media(max-width:900px) {

            #reactor-intelligence-status {

                top:
                    58%;

                font-size:
                    8px;

                letter-spacing:
                    2px;

            }

        }

    `;


    document.head.appendChild(
        style
    );


    /* ========================================================
       STATUS ELEMENT
    ======================================================== */

    const status =
        document.createElement("div");


    status.id =
        "reactor-intelligence-status";


    status.textContent =
        "EDGE CORE // STANDBY";


    document.body.appendChild(
        status
    );


    /* ========================================================
       STATE HELPERS
    ======================================================== */

    let stateTimer =
        null;


    function clearStates() {

        document.body.classList.remove(
            "jarvis-listening",
            "jarvis-processing",
            "jarvis-success",
            "jutsu-stage-1",
            "jutsu-stage-2",
            "jutsu-stage-3"
        );


        status.classList.remove(
            "active",
            "success",
            "jutsu"
        );

    }


    function setStatus(
        text,
        mode = "normal"
    ) {

        status.textContent =
            text;


        status.classList.add(
            "active"
        );


        status.classList.remove(
            "success",
            "jutsu"
        );


        if (
            mode === "success"
        ) {

            status.classList.add(
                "success"
            );

        }


        if (
            mode === "jutsu"
        ) {

            status.classList.add(
                "jutsu"
            );

        }

    }


    function temporaryState(
        className,
        text,
        duration = 1500,
        mode = "normal"
    ) {

        clearTimeout(
            stateTimer
        );


        clearStates();


        document.body.classList.add(
            className
        );


        setStatus(
            text,
            mode
        );


        stateTimer =
            setTimeout(
                () => {

                    clearStates();

                    status.textContent =
                        "EDGE CORE // ONLINE";

                },
                duration
            );

    }


    /* ========================================================
       WATCH JARVIS BUTTON
    ======================================================== */

    function watchJarvisButton() {

        const button =
            document.getElementById(
                "voice-btn"
            );


        if (!button) {

            setTimeout(
                watchJarvisButton,
                500
            );

            return;
        }


        const observer =
            new MutationObserver(
                () => {

                    const text =
                        button.textContent
                            .trim()
                            .toUpperCase();


                    if (
                        text === "CMD"
                    ) {

                        clearStates();


                        document.body.classList.add(
                            "jarvis-listening"
                        );


                        setStatus(
                            "JARVIS // LISTENING"
                        );

                    }


                    if (
                        text === "JARVIS"
                    ) {

                        if (
                            !document.body
                                .classList
                                .contains(
                                    "jarvis-processing"
                                )
                        ) {

                            clearStates();


                            status.textContent =
                                "EDGE CORE // ONLINE";

                        }

                    }

                }
            );


        observer.observe(
            button,
            {
                childList: true,
                subtree: true,
                characterData: true
            }
        );


        console.log(
            "Reactor Intelligence: Jarvis button linked."
        );

    }


    /* ========================================================
       WATCH TERMINAL
    ======================================================== */

    function watchTerminal() {

        const terminal =
            document.getElementById(
                "terminal-output"
            );


        if (!terminal) {

            setTimeout(
                watchTerminal,
                500
            );

            return;
        }


        const observer =
            new MutationObserver(
                mutations => {

                    mutations.forEach(
                        mutation => {

                            mutation.addedNodes
                                .forEach(
                                    node => {

                                        const text =
                                            (
                                                node.textContent ||
                                                ""
                                            )
                                            .trim()
                                            .toUpperCase();


                                        /* ---------------------
                                           WAKE WORD
                                        --------------------- */

                                        if (
                                            text.includes(
                                                "WAKE WORD DETECTED"
                                            )
                                        ) {

                                            clearStates();


                                            document.body
                                                .classList
                                                .add(
                                                    "jarvis-listening"
                                                );


                                            setStatus(
                                                "JARVIS // LISTENING"
                                            );

                                        }


                                        /* ---------------------
                                           COMMAND
                                        --------------------- */

                                        if (
                                            text.includes(
                                                "JARVIS COMMAND"
                                            ) ||
                                            text.includes(
                                                "COMMAND"
                                            ) &&
                                            text.includes(
                                                "→"
                                            )
                                        ) {

                                            temporaryState(
                                                "jarvis-processing",
                                                "EDGE CORE // PROCESSING",
                                                1700
                                            );

                                        }


                                        /* ---------------------
                                           SUCCESS
                                        --------------------- */

                                        if (
                                            text.includes(
                                                "OK →"
                                            ) ||
                                            text.includes(
                                                "SUCCESS"
                                            ) ||
                                            text.includes(
                                                "LAUNCHING"
                                            ) ||
                                            text.includes(
                                                "OPENING HTTPS"
                                            )
                                        ) {

                                            temporaryState(
                                                "jarvis-success",
                                                "COMMAND EXECUTED",
                                                1400,
                                                "success"
                                            );

                                        }

                                    }
                                );

                        }
                    );

                }
            );


        observer.observe(
            terminal,
            {
                childList: true,
                subtree: true
            }
        );


        console.log(
            "Reactor Intelligence: Terminal linked."
        );

    }


    /* ========================================================
       WATCH JUTSU
    ======================================================== */

    function watchJutsu() {

        const jutsu =
            document.getElementById(
                "jutsu-status"
            );


        if (!jutsu) {

            setTimeout(
                watchJutsu,
                500
            );

            return;
        }


        const observer =
            new MutationObserver(
                () => {

                    const text =
                        jutsu.textContent
                            .trim()
                            .toUpperCase();


                    document.body
                        .classList
                        .remove(
                            "jutsu-stage-1",
                            "jutsu-stage-2",
                            "jutsu-stage-3"
                        );


                    if (
                        text.includes(
                            "1/3"
                        )
                    ) {

                        document.body
                            .classList
                            .add(
                                "jutsu-stage-1"
                            );


                        setStatus(
                            "JUTSU ENERGY // 33%",
                            "jutsu"
                        );

                    }


                    if (
                        text.includes(
                            "2/3"
                        )
                    ) {

                        document.body
                            .classList
                            .add(
                                "jutsu-stage-2"
                            );


                        setStatus(
                            "JUTSU ENERGY // 66%",
                            "jutsu"
                        );

                    }


                    if (
                        text.includes(
                            "3/3"
                        ) ||
                        text.includes(
                            "JUTSU COMPLETE"
                        )
                    ) {

                        document.body
                            .classList
                            .add(
                                "jutsu-stage-3"
                            );


                        setStatus(
                            "JUTSU // MAXIMUM ENERGY",
                            "jutsu"
                        );


                        setTimeout(
                            () => {

                                document.body
                                    .classList
                                    .remove(
                                        "jutsu-stage-3"
                                    );


                                status.textContent =
                                    "EDGE CORE // ONLINE";


                                status.classList.remove(
                                    "active",
                                    "jutsu"
                                );

                            },
                            3000
                        );

                    }

                }
            );


        observer.observe(
            jutsu,
            {
                childList: true,
                subtree: true,
                characterData: true
            }
        );


        console.log(
            "Reactor Intelligence: Jutsu linked."
        );

    }


    /* ========================================================
       START
    ======================================================== */

    window.addEventListener(
        "load",
        () => {

            setTimeout(
                () => {

                    status.textContent =
                        "EDGE CORE // ONLINE";


                    watchJarvisButton();

                    watchTerminal();

                    watchJutsu();


                    console.log(
                        "EDGE AI OS 2077: Reactor Intelligence ONLINE"
                    );

                },
                1400
            );

        }
    );

})();