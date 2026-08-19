/* ============================================================
   EDGE AI OS 2077
   DEMO MODE
   Startup choreography for interview / project presentation
   Visual + voice only
============================================================ */

(() => {

    "use strict";

    console.log(
        "EDGE AI OS 2077: Demo Mode loading..."
    );


    /* ========================================================
       CONFIG
    ======================================================== */

    const ENABLE_WELCOME_VOICE = true;

    const bootMessages = [

        "INITIALIZING EDGE CORE...",

        "LOADING NEURAL MATRIX...",

        "CONNECTING WINDOWS CONTROL LAYER...",

        "SYNCHRONIZING JARVIS VOICE ENGINE...",

        "ACTIVATING SPIDER VISION...",

        "LOADING JUTSU MATRIX...",

        "SYSTEM INTEGRITY VERIFIED...",

        "EDGE AI OS ONLINE"

    ];


    /* ========================================================
       CREATE DEMO OVERLAY
    ======================================================== */

    function createDemoOverlay() {

        if (
            document.getElementById(
                "edge-demo-overlay"
            )
        ) {
            return;
        }


        const overlay =
            document.createElement(
                "div"
            );


        overlay.id =
            "edge-demo-overlay";


        overlay.innerHTML = `

            <div class="demo-scan"></div>

            <div class="demo-core">

                <div class="demo-ring demo-ring-1"></div>

                <div class="demo-ring demo-ring-2"></div>

                <div class="demo-ring demo-ring-3"></div>

                <div class="demo-center"></div>

            </div>


            <div class="demo-title">
                EDGE AI OS 2077
            </div>


            <div class="demo-subtitle">
                AUTONOMOUS NEURAL INTERFACE
            </div>


            <div id="demo-status">
                INITIALIZING...
            </div>


            <div class="demo-progress">

                <div
                    id="demo-progress-fill">
                </div>

            </div>

        `;


        document.body.appendChild(
            overlay
        );


        addDemoStyles();
    }


    /* ========================================================
       STYLES
    ======================================================== */

    function addDemoStyles() {

        if (
            document.getElementById(
                "edge-demo-style"
            )
        ) {
            return;
        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "edge-demo-style";


        style.textContent = `

            #edge-demo-overlay {

                position:
                    fixed;

                inset:
                    0;

                z-index:
                    999999;

                display:
                    flex;

                flex-direction:
                    column;

                align-items:
                    center;

                justify-content:
                    center;

                overflow:
                    hidden;

                background:

                    radial-gradient(
                        circle at center,
                        rgba(0,100,140,0.20),
                        transparent 32%
                    ),

                    linear-gradient(
                        180deg,
                        #01050d,
                        #020915 55%,
                        #010308
                    );

                color:
                    #00ffff;

                font-family:
                    Orbitron,
                    Arial,
                    sans-serif;

                opacity:
                    1;

                transition:
                    opacity 1s ease;

            }


            #edge-demo-overlay.hide {

                opacity:
                    0;

                pointer-events:
                    none;

            }


            .demo-core {

                position:
                    relative;

                width:
                    260px;

                height:
                    260px;

                margin-bottom:
                    40px;

            }


            .demo-ring {

                position:
                    absolute;

                left:
                    50%;

                top:
                    50%;

                border-radius:
                    50%;

                transform:
                    translate(
                        -50%,
                        -50%
                    );

            }


            .demo-ring-1 {

                width:
                    250px;

                height:
                    250px;

                border:
                    1px solid
                    rgba(
                        0,
                        255,
                        255,
                        0.35
                    );

                border-top:
                    4px solid
                    #00ffff;

                animation:
                    demoSpin
                    5s linear
                    infinite;

            }


            .demo-ring-2 {

                width:
                    195px;

                height:
                    195px;

                border:
                    1px dashed
                    rgba(
                        0,
                        255,
                        255,
                        0.55
                    );

                animation:
                    demoSpinReverse
                    3.5s linear
                    infinite;

            }


            .demo-ring-3 {

                width:
                    135px;

                height:
                    135px;

                border:
                    2px solid
                    rgba(
                        0,
                        255,
                        255,
                        0.45
                    );

                border-bottom:
                    5px solid
                    #00ffff;

                animation:
                    demoSpin
                    2s linear
                    infinite;

            }


            .demo-center {

                position:
                    absolute;

                left:
                    50%;

                top:
                    50%;

                width:
                    70px;

                height:
                    70px;

                transform:
                    translate(
                        -50%,
                        -50%
                    );

                border-radius:
                    50%;

                background:

                    radial-gradient(
                        circle,
                        #ffffff 0%,
                        #00ffff 18%,
                        #0088bb 45%,
                        transparent 72%
                    );

                box-shadow:

                    0 0 20px
                    #00ffff,

                    0 0 55px
                    rgba(
                        0,
                        255,
                        255,
                        0.75
                    ),

                    0 0 120px
                    rgba(
                        0,
                        180,
                        255,
                        0.35
                    );

                animation:
                    demoCorePulse
                    1.2s ease-in-out
                    infinite alternate;

            }


            @keyframes demoSpin {

                from {

                    transform:
                        translate(
                            -50%,
                            -50%
                        )
                        rotate(0deg);

                }

                to {

                    transform:
                        translate(
                            -50%,
                            -50%
                        )
                        rotate(360deg);

                }

            }


            @keyframes demoSpinReverse {

                from {

                    transform:
                        translate(
                            -50%,
                            -50%
                        )
                        rotate(360deg);

                }

                to {

                    transform:
                        translate(
                            -50%,
                            -50%
                        )
                        rotate(0deg);

                }

            }


            @keyframes demoCorePulse {

                from {

                    transform:
                        translate(
                            -50%,
                            -50%
                        )
                        scale(0.92);

                    filter:
                        brightness(1);

                }

                to {

                    transform:
                        translate(
                            -50%,
                            -50%
                        )
                        scale(1.12);

                    filter:
                        brightness(1.8);

                }

            }


            .demo-title {

                font-size:
                    clamp(
                        28px,
                        4vw,
                        62px
                    );

                font-weight:
                    900;

                letter-spacing:
                    8px;

                text-shadow:

                    0 0 12px
                    #00ffff,

                    0 0 35px
                    rgba(
                        0,
                        255,
                        255,
                        0.60
                    );

            }


            .demo-subtitle {

                margin-top:
                    10px;

                font-size:
                    9px;

                letter-spacing:
                    5px;

                opacity:
                    0.55;

            }


            #demo-status {

                margin-top:
                    42px;

                min-height:
                    18px;

                font-size:
                    11px;

                letter-spacing:
                    3px;

                color:
                    rgba(
                        210,
                        255,
                        255,
                        0.85
                    );

                text-shadow:
                    0 0 8px
                    rgba(
                        0,
                        255,
                        255,
                        0.55
                    );

            }


            .demo-progress {

                width:
                    min(
                        520px,
                        70vw
                    );

                height:
                    3px;

                margin-top:
                    20px;

                overflow:
                    hidden;

                background:
                    rgba(
                        0,
                        255,
                        255,
                        0.10
                    );

                box-shadow:
                    0 0 10px
                    rgba(
                        0,
                        255,
                        255,
                        0.10
                    );

            }


            #demo-progress-fill {

                width:
                    0%;

                height:
                    100%;

                background:

                    linear-gradient(
                        90deg,
                        #007799,
                        #00ffff,
                        #ffffff
                    );

                box-shadow:
                    0 0 12px
                    #00ffff;

                transition:
                    width 0.45s ease;

            }


            .demo-scan {

                position:
                    absolute;

                left:
                    0;

                right:
                    0;

                top:
                    -10%;

                height:
                    80px;

                background:

                    linear-gradient(
                        180deg,
                        transparent,
                        rgba(
                            0,
                            255,
                            255,
                            0.07
                        ),
                        transparent
                    );

                animation:
                    demoScan
                    3s linear
                    infinite;

            }


            @keyframes demoScan {

                from {

                    top:
                        -10%;

                }

                to {

                    top:
                        110%;

                }

            }

        `;


        document.head.appendChild(
            style
        );
    }


    /* ========================================================
       TERMINAL LOGGER
    ======================================================== */

    function terminalMessage(
        text
    ) {

        const terminal =
            document.getElementById(
                "terminal-output"
            );


        if (!terminal) {
            return;
        }


        const line =
            document.createElement(
                "p"
            );


        line.textContent =
            "> " +
            text;


        terminal.appendChild(
            line
        );


        terminal.scrollTop =
            terminal.scrollHeight;
    }


    /* ========================================================
       SPEAK WELCOME
    ======================================================== */

    function speakWelcome() {

        if (
            !ENABLE_WELCOME_VOICE
        ) {
            return;
        }


        if (
            !(
                "speechSynthesis"
                in window
            )
        ) {
            return;
        }


        try {

            window.speechSynthesis.cancel();

        } catch (error) {

            console.log(
                error
            );
        }


        const speech =
            new SpeechSynthesisUtterance(
                "Welcome back. EDGE AI OS is online. Jarvis systems are ready."
            );


        speech.rate =
            0.90;


        speech.pitch =
            0.80;


        speech.volume =
            1;


        window.speechSynthesis.speak(
            speech
        );
    }


    /* ========================================================
       REACTOR STARTUP BOOST
    ======================================================== */

    function reactorStartup() {

        document.body
            .classList
            .add(
                "jarvis-processing"
            );


        setTimeout(
            () => {

                document.body
                    .classList
                    .remove(
                        "jarvis-processing"
                    );


                document.body
                    .classList
                    .add(
                        "jarvis-success"
                    );


                setTimeout(
                    () => {

                        document.body
                            .classList
                            .remove(
                                "jarvis-success"
                            );

                    },
                    1400
                );

            },
            1800
        );
    }


    /* ========================================================
       BOOT SEQUENCE
    ======================================================== */

    function runBootSequence() {

        createDemoOverlay();


        const overlay =
            document.getElementById(
                "edge-demo-overlay"
            );


        const status =
            document.getElementById(
                "demo-status"
            );


        const progress =
            document.getElementById(
                "demo-progress-fill"
            );


        if (
            !overlay ||
            !status ||
            !progress
        ) {
            return;
        }


        let index =
            0;


        function nextMessage() {

            if (
                index >=
                bootMessages.length
            ) {

                status.textContent =
                    "ACCESS GRANTED // SYSTEM ONLINE";


                progress.style.width =
                    "100%";


                terminalMessage(
                    "EDGE AI OS cinematic startup complete."
                );


                setTimeout(
                    () => {

                        overlay.classList.add(
                            "hide"
                        );


                        reactorStartup();


                        speakWelcome();


                        setTimeout(
                            () => {

                                overlay.remove();

                            },
                            1200
                        );

                    },
                    800
                );


                return;
            }


            status.textContent =
                bootMessages[
                    index
                ];


            const percent =
                (
                    (
                        index +
                        1
                    ) /
                    bootMessages.length
                ) *
                100;


            progress.style.width =
                percent +
                "%";


            terminalMessage(
                bootMessages[
                    index
                ]
            );


            index++;


            setTimeout(
                nextMessage,
                420
            );
        }


        setTimeout(
            nextMessage,
            400
        );
    }


    /* ========================================================
       OPTIONAL DEMO SHORTCUT
       Ctrl + Shift + D = replay startup
    ======================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.ctrlKey &&
                event.shiftKey &&
                event.key.toLowerCase() ===
                    "d"
            ) {

                const old =
                    document.getElementById(
                        "edge-demo-overlay"
                    );


                if (old) {
                    old.remove();
                }


                runBootSequence();
            }

        }
    );


    /* ========================================================
       START
    ======================================================== */

    window.addEventListener(
        "load",
        () => {

            setTimeout(
                runBootSequence,
                350
            );


            console.log(
                "EDGE AI OS 2077: Demo Mode ONLINE"
            );

        }
    );

})();