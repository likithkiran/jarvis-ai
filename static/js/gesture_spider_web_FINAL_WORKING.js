/* ============================================================
   EDGE AI OS 2077
   SPIDER VISION + INDIVIDUAL HAND JUTSU V7

   NORMAL MODE
   ------------------------------------------------------------
   WEB SNAP        -> Spider Web Shot
   PINCH           -> optional normal action

   JUTSU MODE
   ------------------------------------------------------------
   ✊ FIST          -> ARM JUTSU

   Then:

   ✌ PEACE         -> RASENGAN
   ☝ POINT         -> CHIDORI
   🖐 OPEN PALM    -> KATON
   🤏 PINCH         -> SUSANOO
   🕸 WEB SNAP     -> AMATERASU

   Uses:
   window.EdgeJutsuV51.start(name)

   Therefore keyboard and hand use SAME:
   animation + sound engine.
============================================================ */

(() => {

    "use strict";


    /* =========================================================
       DUPLICATE PROTECTION
    ========================================================= */

    if (
        window.EDGE_SPIDER_JUTSU_V7
    ) {

        console.log(
            "EDGE Spider Vision V7 already loaded."
        );

        return;
    }


    window.EDGE_SPIDER_JUTSU_V7 =
        true;


    console.log(
        "EDGE AI OS 2077: Spider Vision + Individual Jutsu V7 loading..."
    );


    /* =========================================================
       CAMERA / MEDIAPIPE
    ========================================================= */

    let video =
        null;

    let canvas =
        null;

    let ctx =
        null;

    let hands =
        null;

    let camera =
        null;

    let running =
        false;


    /* =========================================================
       GESTURE STATE
    ========================================================= */

    let stableGesture =
        "IDLE";

    let stableSince =
        0;

    let lastGesture =
        "IDLE";


    const GESTURE_HOLD_MS =
        480;


    /* =========================================================
       ACTION STATE
    ========================================================= */

    let lastAction =
        0;


    const ACTION_COOLDOWN =
        2200;


    /* =========================================================
       HAND STATE
    ========================================================= */

    let currentHandCount =
        0;


    const trail =
        [];


    const TRAIL_MAX =
        55;


    /* =========================================================
       WEB SYSTEM
    ========================================================= */

    const webShots =
        [];


    const webParticles =
        [];


    let webFlash =
        0;


    let lastWebShot =
        0;


    const WEB_COOLDOWN =
        1300;


    /* =========================================================
       JUTSU STATE
    ========================================================= */

    let jutsuArmed =
        false;


    let jutsuCompleting =
        false;


    let jutsuArmTime =
        0;


    const JUTSU_ARM_TIMEOUT =
        15000;


    /* =========================================================
       JUTSU HAND MAP

       Same mapping as:
       Alt+1 ... Alt+5
    ========================================================= */

    const HAND_JUTSU_MAP = {

        "PEACE": {

            name:
                "rasengan",

            label:
                "RASENGAN"

        },


        "POINT": {

            name:
                "chidori",

            label:
                "CHIDORI"

        },


        "OPEN PALM": {

            name:
                "katon",

            label:
                "KATON"

        },


        "PINCH": {

            name:
                "susanoo",

            label:
                "SUSANOO"

        },


        "WEB SNAP": {

            name:
                "amaterasu",

            label:
                "AMATERASU"

        }

    };


    /* =========================================================
       HELPERS
    ========================================================= */

    function $(
        id
    ) {

        return document.getElementById(
            id
        );
    }


    function distance(
        a,
        b
    ) {

        return Math.hypot(

            a.x -
            b.x,

            a.y -
            b.y

        );
    }


    function clamp(
        value,
        minimum,
        maximum
    ) {

        return Math.max(

            minimum,

            Math.min(
                maximum,
                value
            )

        );
    }


    function safeText(
        value
    ) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";
        }


        if (
            typeof value ===
            "string"
        ) {

            return value;
        }


        if (
            typeof value ===
            "number" ||
            typeof value ===
            "boolean"
        ) {

            return String(
                value
            );
        }


        if (
            typeof value ===
            "object"
        ) {

            if (
                typeof value.response ===
                "string"
            ) {

                return value.response;
            }


            if (
                typeof value.message ===
                "string"
            ) {

                return value.message;
            }


            if (
                typeof value.result ===
                "string"
            ) {

                return value.result;
            }


            if (
                typeof value.status ===
                "string"
            ) {

                return value.status;
            }


            try {

                return JSON.stringify(
                    value
                );

            } catch {

                return (
                    "Command completed."
                );
            }
        }


        return String(
            value
        );
    }


    /* =========================================================
       TERMINAL LOG
    ========================================================= */

    function addLogSafe(
        message
    ) {

        const text =
            safeText(
                message
            );


        if (
            typeof window.addLog ===
            "function"
        ) {

            window.addLog(
                text
            );

            return;
        }


        const terminal =
            document.getElementById(
                "terminal-output"
            );


        if (
            !terminal
        ) {

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


    /* =========================================================
       CREATE / FIND SPIDER HUD
    ========================================================= */

    function createVisionUI() {

        let panel =
            document.getElementById(
                "spider-vision"
            );


        /* =====================================================
           EXISTING CAMERA HUD
        ===================================================== */

        if (
            panel
        ) {

            video =

                document.getElementById(
                    "spider-video"
                )

                ||

                document.getElementById(
                    "hand-video"
                );


            canvas =

                document.getElementById(
                    "spider-canvas"
                )

                ||

                document.getElementById(
                    "hand-canvas"
                );


            if (
                canvas
            ) {

                ctx =
                    canvas.getContext(
                        "2d"
                    );
            }


            ensureJutsuUI();

            addVisionStyles();

            return;
        }


        /* =====================================================
           CREATE CAMERA HUD
        ===================================================== */

        panel =
            document.createElement(
                "div"
            );


        panel.id =
            "spider-vision";


        panel.innerHTML = `

            <div class="spider-header">

                <span>
                    🕷 SPIDER VISION
                </span>

                <span id="spider-status">
                    INITIALIZING
                </span>

            </div>


            <div class="spider-camera">

                <video
                    id="spider-video"
                    autoplay
                    muted
                    playsinline>
                </video>


                <canvas
                    id="spider-canvas">
                </canvas>


                <div class="spider-overlay">

                    <div class="scan-line">
                    </div>

                    <div class="corner tl">
                    </div>

                    <div class="corner tr">
                    </div>

                    <div class="corner bl">
                    </div>

                    <div class="corner br">
                    </div>


                    <div id="jutsu-camera-text">

                        SPIDER VISION
                        •
                        FIST = JUTSU

                    </div>

                </div>

            </div>


            <div class="spider-info">

                <div>

                    GESTURE

                    <strong
                        id="spider-gesture">

                        IDLE

                    </strong>

                </div>


                <div>

                    HANDS

                    <strong
                        id="spider-hands">

                        0

                    </strong>

                </div>


                <div>

                    JUTSU

                    <strong
                        id="jutsu-status">

                        READY

                    </strong>

                </div>

            </div>

        `;


        document.body.appendChild(
            panel
        );


        video =
            document.getElementById(
                "spider-video"
            );


        canvas =
            document.getElementById(
                "spider-canvas"
            );


        ctx =
            canvas.getContext(
                "2d"
            );


        addVisionStyles();
    }


    /* =========================================================
       ENSURE JUTSU UI
    ========================================================= */

    function ensureJutsuUI() {

        const panel =
            document.getElementById(
                "spider-vision"
            );


        if (
            !panel
        ) {

            return;
        }


        let status =
            document.getElementById(
                "jutsu-status"
            );


        if (
            !status
        ) {

            const info =
                panel.querySelector(
                    ".spider-info"
                );


            if (
                info
            ) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.innerHTML = `

                    JUTSU

                    <strong
                        id="jutsu-status">

                        READY

                    </strong>

                `;


                info.appendChild(
                    item
                );
            }
        }


        if (
            !document.getElementById(
                "jutsu-camera-text"
            )
        ) {

            const cameraBox =
                panel.querySelector(
                    ".spider-camera"
                );


            if (
                cameraBox
            ) {

                const label =
                    document.createElement(
                        "div"
                    );


                label.id =
                    "jutsu-camera-text";


                label.textContent =
                    "SPIDER VISION • FIST = JUTSU";


                cameraBox.appendChild(
                    label
                );
            }
        }
    }


    /* =========================================================
       VISUAL STYLE
    ========================================================= */

    function addVisionStyles() {

        if (
            document.getElementById(
                "edge-spider-jutsu-v7-style"
            )
        ) {

            return;
        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "edge-spider-jutsu-v7-style";


        style.textContent = `

            #spider-vision {

                transition:
                    .3s ease !important;

            }


            .spider-camera {

                position:
                    relative !important;

                overflow:
                    hidden !important;

                transition:
                    .3s ease !important;

            }


            #spider-canvas,
            #hand-canvas {

                position:
                    absolute !important;

                inset:
                    0 !important;

                width:
                    100% !important;

                height:
                    100% !important;

                z-index:
                    20 !important;

                pointer-events:
                    none !important;

            }


            #jutsu-status {

                transition:
                    .25s ease;

                text-shadow:
                    0 0 10px
                    currentColor;

            }


            #jutsu-camera-text {

                position:
                    absolute;

                left:
                    50%;

                bottom:
                    12px;

                transform:
                    translateX(-50%);

                z-index:
                    40;

                background:
                    rgba(
                        0,
                        8,
                        18,
                        .72
                    );

                border:
                    1px solid
                    rgba(
                        0,
                        240,
                        255,
                        .35
                    );

                color:
                    #d8ffff;

                border-radius:
                    20px;

                padding:
                    5px 11px;

                font-family:
                    Orbitron,
                    sans-serif;

                font-size:
                    7px;

                letter-spacing:
                    1.4px;

                white-space:
                    nowrap;

                pointer-events:
                    none;

            }


            /* ================================================
               JUTSU ARMED
            ================================================ */

            body.jutsu-seal-mode
            #spider-vision {

                border-color:
                    rgba(
                        165,
                        75,
                        255,
                        .95
                    ) !important;

                box-shadow:

                    0 0 25px
                    rgba(
                        140,
                        55,
                        255,
                        .55
                    ),

                    0 0 60px
                    rgba(
                        0,
                        230,
                        255,
                        .20
                    ),

                    inset
                    0 0 30px
                    rgba(
                        100,
                        45,
                        255,
                        .15
                    ) !important;

            }


            body.jutsu-seal-mode
            #jutsu-status {

                color:
                    #d080ff !important;

                text-shadow:

                    0 0 10px
                    #b653ff,

                    0 0 25px
                    #663cff;

            }


            /* ================================================
               OUTER CHAKRA RING
            ================================================ */

            body.jutsu-seal-mode
            .spider-camera::before {

                content:
                    "";

                position:
                    absolute;

                left:
                    50%;

                top:
                    50%;

                width:
                    73%;

                aspect-ratio:
                    1;

                transform:
                    translate(
                        -50%,
                        -50%
                    );

                border-radius:
                    50%;

                border:
                    2px dashed
                    rgba(
                        170,
                        75,
                        255,
                        .8
                    );

                box-shadow:

                    0 0 18px
                    rgba(
                        145,
                        55,
                        255,
                        .75
                    ),

                    inset
                    0 0 24px
                    rgba(
                        0,
                        235,
                        255,
                        .18
                    );

                z-index:
                    14;

                animation:
                    edgeJutsuOuterV7
                    2s linear infinite;

                pointer-events:
                    none;

            }


            body.jutsu-seal-mode
            .spider-camera::after {

                content:
                    "";

                position:
                    absolute;

                left:
                    50%;

                top:
                    50%;

                width:
                    48%;

                aspect-ratio:
                    1;

                transform:
                    translate(
                        -50%,
                        -50%
                    );

                border-radius:
                    50%;

                border:
                    1px solid
                    rgba(
                        0,
                        240,
                        255,
                        .75
                    );

                box-shadow:

                    0 0 22px
                    rgba(
                        0,
                        240,
                        255,
                        .4
                    );

                z-index:
                    14;

                animation:
                    edgeJutsuInnerV7
                    1.2s linear infinite reverse;

                pointer-events:
                    none;

            }


            @keyframes edgeJutsuOuterV7 {

                from {

                    transform:
                        translate(
                            -50%,
                            -50%
                        )
                        rotate(
                            0deg
                        )
                        scale(
                            .92
                        );

                }


                50% {

                    transform:
                        translate(
                            -50%,
                            -50%
                        )
                        rotate(
                            180deg
                        )
                        scale(
                            1.05
                        );

                }


                to {

                    transform:
                        translate(
                            -50%,
                            -50%
                        )
                        rotate(
                            360deg
                        )
                        scale(
                            .92
                        );

                }

            }


            @keyframes edgeJutsuInnerV7 {

                from {

                    transform:
                        translate(
                            -50%,
                            -50%
                        )
                        rotate(
                            0deg
                        );

                }


                to {

                    transform:
                        translate(
                            -50%,
                            -50%
                        )
                        rotate(
                            360deg
                        );

                }

            }


            /* ================================================
               ACTIVATION FLASH
            ================================================ */

            .spider-camera.jutsu-camera-burst {

                animation:
                    edgeCameraBurstV7
                    .22s ease-in-out
                    9 alternate;

            }


            @keyframes edgeCameraBurstV7 {

                from {

                    filter:
                        brightness(
                            1
                        )
                        contrast(
                            1
                        );

                }


                to {

                    filter:

                        brightness(
                            1.9
                        )

                        contrast(
                            1.45
                        )

                        saturate(
                            1.7
                        );

                    box-shadow:

                        0 0 45px
                        rgba(
                            0,
                            245,
                            255,
                            .9
                        ),

                        0 0 95px
                        rgba(
                            160,
                            60,
                            255,
                            .7
                        );

                }

            }


            body.jutsu-core-active
            #spider-vision {

                animation:
                    edgeCoreJutsuPulseV7
                    .3s ease-in-out
                    infinite alternate;

            }


            @keyframes edgeCoreJutsuPulseV7 {

                from {

                    filter:
                        brightness(
                            1
                        );

                }


                to {

                    filter:
                        brightness(
                            1.4
                        );

                }

            }

        `;


        document.head.appendChild(
            style
        );
    }


    /* =========================================================
       HUD STATUS
    ========================================================= */

    function setSpiderStatus(
        text,
        color = "#00ff88"
    ) {

        const element =
            document.getElementById(
                "spider-status"
            );


        if (
            element
        ) {

            element.textContent =
                text;


            element.style.color =
                color;
        }
    }


    function setJutsuStatus(
        text
    ) {

        const element =
            document.getElementById(
                "jutsu-status"
            );


        if (
            element
        ) {

            element.textContent =
                text;
        }
    }


    function setCameraText(
        text
    ) {

        const element =
            document.getElementById(
                "jutsu-camera-text"
            );


        if (
            element
        ) {

            element.textContent =
                text;
        }
    }


    /* =========================================================
       JARVIS BROWSER VOICE
    ========================================================= */

    function speakJutsu(
        text
    ) {

        try {

            if (
                !(
                    "speechSynthesis"
                    in window
                )
            ) {

                return;
            }


            window.speechSynthesis.cancel();


            const utterance =
                new SpeechSynthesisUtterance(
                    text
                );


            utterance.rate =
                .92;


            utterance.pitch =
                .8;


            utterance.volume =
                1;


            const voices =
                speechSynthesis.getVoices();


            const preferred =
                voices.find(
                    voice => {

                        const name =
                            (
                                voice.name
                                ||
                                ""
                            )
                            .toLowerCase();


                        return (

                            name.includes(
                                "david"
                            )

                            ||

                            name.includes(
                                "mark"
                            )

                        );

                    }
                );


            if (
                preferred
            ) {

                utterance.voice =
                    preferred;
            }


            speechSynthesis.speak(
                utterance
            );


        } catch (
            error
        ) {

            console.error(
                "JUTSU SPEECH ERROR:",
                error
            );
        }
    }


    /* =========================================================
       MEDIAPIPE HAND INITIALIZATION
    ========================================================= */

    function initializeHands() {

        if (
            typeof Hands ===
            "undefined"
        ) {

            console.error(
                "MediaPipe Hands not loaded."
            );


            setSpiderStatus(
                "HANDS ERROR",
                "#ff405f"
            );


            return false;
        }


        hands =
            new Hands({

                locateFile:
                    file => {

                        return (

                            "https://cdn.jsdelivr.net/npm/@mediapipe/hands/"
                            +
                            file

                        );

                    }

            });


        hands.setOptions({

            maxNumHands:
                2,

            modelComplexity:
                1,

            minDetectionConfidence:
                .63,

            minTrackingConfidence:
                .63

        });


        hands.onResults(
            processResults
        );


        return true;
    }


    /* =========================================================
       FINGER DETECTION
    ========================================================= */

    function fingerOpen(
        lm,
        tip,
        pip
    ) {

        return (

            distance(
                lm[tip],
                lm[0]
            )

            >

            distance(
                lm[pip],
                lm[0]
            )
            *
            1.10

        );
    }


    /* =========================================================
       GESTURE DETECTOR
    ========================================================= */

    function detectGesture(
        lm
    ) {

        const indexOpen =
            fingerOpen(
                lm,
                8,
                6
            );


        const middleOpen =
            fingerOpen(
                lm,
                12,
                10
            );


        const ringOpen =
            fingerOpen(
                lm,
                16,
                14
            );


        const pinkyOpen =
            fingerOpen(
                lm,
                20,
                18
            );


        const palmSize =
            Math.max(

                distance(
                    lm[0],
                    lm[9]
                ),

                .001

            );


        /* =====================================================
           PINCH
        ===================================================== */

        if (

            distance(
                lm[4],
                lm[8]
            )

            <

            palmSize *
            .48

        ) {

            return "PINCH";
        }


        /* =====================================================
           WEB SNAP
        ===================================================== */

        if (

            indexOpen

            &&

            !middleOpen

            &&

            !ringOpen

            &&

            pinkyOpen

        ) {

            return "WEB SNAP";
        }


        /* =====================================================
           FIST
        ===================================================== */

        if (

            !indexOpen

            &&

            !middleOpen

            &&

            !ringOpen

            &&

            !pinkyOpen

        ) {

            return "FIST";
        }


        /* =====================================================
           PEACE
        ===================================================== */

        if (

            indexOpen

            &&

            middleOpen

            &&

            !ringOpen

            &&

            !pinkyOpen

        ) {

            return "PEACE";
        }


        /* =====================================================
           POINT
        ===================================================== */

        if (

            indexOpen

            &&

            !middleOpen

            &&

            !ringOpen

            &&

            !pinkyOpen

        ) {

            return "POINT";
        }


        /* =====================================================
           OPEN PALM
        ===================================================== */

        if (

            indexOpen

            &&

            middleOpen

            &&

            ringOpen

            &&

            pinkyOpen

        ) {

            return "OPEN PALM";
        }


        return "IDLE";
    }


    /* =========================================================
       HAND CENTER
    ========================================================= */

    function getHandCenter(
        lm
    ) {

        const ids =
            [
                0,
                5,
                9,
                13,
                17
            ];


        let x =
            0;


        let y =
            0;


        for (
            const id
            of ids
        ) {

            x +=
                lm[id].x;


            y +=
                lm[id].y;
        }


        return {

            x:
                x /
                ids.length,

            y:
                y /
                ids.length

        };
    }


    /* =========================================================
       DRAW HAND SKELETON
    ========================================================= */

    function drawHand(
        lm,
        index = 0
    ) {

        const connections = [

            [0,1],
            [1,2],
            [2,3],
            [3,4],

            [0,5],
            [5,6],
            [6,7],
            [7,8],

            [0,9],
            [9,10],
            [10,11],
            [11,12],

            [0,13],
            [13,14],
            [14,15],
            [15,16],

            [0,17],
            [17,18],
            [18,19],
            [19,20],

            [5,9],
            [9,13],
            [13,17]

        ];


        ctx.save();


        ctx.lineWidth =
            2.4;


        ctx.strokeStyle =

            index ===
            0

            ?

            "rgba(0,245,255,.9)"

            :

            "rgba(190,95,255,.9)";


        ctx.shadowBlur =
            10;


        ctx.shadowColor =

            index ===
            0

            ?

            "#00efff"

            :

            "#b75cff";


        for (
            const [
                a,
                b
            ]
            of connections
        ) {

            ctx.beginPath();


            ctx.moveTo(

                lm[a].x *
                canvas.width,

                lm[a].y *
                canvas.height

            );


            ctx.lineTo(

                lm[b].x *
                canvas.width,

                lm[b].y *
                canvas.height

            );


            ctx.stroke();
        }


        for (
            let i = 0;
            i < lm.length;
            i++
        ) {

            const point =
                lm[i];


            ctx.beginPath();


            ctx.arc(

                point.x *
                canvas.width,

                point.y *
                canvas.height,

                (
                    i === 4 ||
                    i === 8 ||
                    i === 12 ||
                    i === 16 ||
                    i === 20
                )

                ?

                4

                :

                2.7,

                0,

                Math.PI *
                2

            );


            ctx.fillStyle =

                index === 0

                ?

                "#00f5ff"

                :

                "#c46cff";


            ctx.fill();
        }


        ctx.restore();
    }


    /* =========================================================
       STABLE GESTURE DETECTION
    ========================================================= */

    function updateGesture(
        gesture
    ) {

        const display =
            document.getElementById(
                "spider-gesture"
            );


        if (
            display
        ) {

            display.textContent =
                gesture;
        }


        const now =
            Date.now();


        /* =====================================================
           NEW GESTURE
        ===================================================== */

        if (
            gesture !==
            stableGesture
        ) {

            stableGesture =
                gesture;


            stableSince =
                now;


            return;
        }


        /* =====================================================
           HOLD IT
        ===================================================== */

        if (
            now -
            stableSince <
            GESTURE_HOLD_MS
        ) {

            return;
        }


        /* =====================================================
           IDLE RESETS GESTURE LOCK
        ===================================================== */

        if (
            gesture ===
            "IDLE"
        ) {

            lastGesture =
                "IDLE";


            return;
        }


        /* =====================================================
           DO NOT REPEAT SAME GESTURE
        ===================================================== */

        if (
            gesture ===
            lastGesture
        ) {

            return;
        }


        lastGesture =
            gesture;


        console.log(
            "SPIDER GESTURE:",
            gesture
        );


        routeGesture(
            gesture
        );
    }


    /* =========================================================
       MASTER ROUTER
    ========================================================= */

    function routeGesture(
        gesture
    ) {

        /* =====================================================
           FIST = ARM
        ===================================================== */

        if (
            gesture ===
            "FIST"
        ) {

            if (
                !jutsuArmed &&
                !jutsuCompleting
            ) {

                armJutsu();
            }


            return;
        }


        /* =====================================================
           JUTSU MODE
        ===================================================== */

        if (
            jutsuArmed
        ) {

            activateHandJutsu(
                gesture
            );


            return;
        }


        /* =====================================================
           NORMAL MODE

           Peace, Point, Open Palm are reserved.
           They no longer launch apps.
        ===================================================== */

        if (

            gesture ===
            "PEACE"

            ||

            gesture ===
            "POINT"

            ||

            gesture ===
            "OPEN PALM"

        ) {

            return;
        }


        executeNormalGesture(
            gesture
        );
    }


    /* =========================================================
       ARM JUTSU MODE
    ========================================================= */

    function armJutsu() {

        if (
            jutsuArmed ||
            jutsuCompleting
        ) {

            return;
        }


        jutsuArmed =
            true;


        jutsuArmTime =
            Date.now();


        document.body.classList.add(
            "jutsu-seal-mode"
        );


        setJutsuStatus(
            "JUTSU ARMED"
        );


        setCameraText(
            "SELECT JUTSU • PEACE / POINT / PALM / PINCH / WEB"
        );


        addLogSafe(
            "JUTSU → SELECTION MODE ARMED"
        );


        speakJutsu(
            "Jutsu interface armed. Select technique."
        );


        console.log(
            "JUTSU MODE ARMED"
        );
    }


    /* =========================================================
       ACTIVATE INDIVIDUAL HAND JUTSU
    ========================================================= */

    function activateHandJutsu(
        gesture
    ) {

        if (
            !jutsuArmed ||
            jutsuCompleting
        ) {

            return;
        }


        /* =====================================================
           TIMEOUT
        ===================================================== */

        if (
            Date.now() -
            jutsuArmTime >
            JUTSU_ARM_TIMEOUT
        ) {

            speakJutsu(
                "Jutsu selection cancelled."
            );


            addLogSafe(
                "JUTSU → SELECTION TIMEOUT"
            );


            resetJutsu();


            return;
        }


        /* =====================================================
           FIST DOES NOTHING ONCE ARMED
        ===================================================== */

        if (
            gesture ===
            "FIST"
        ) {

            return;
        }


        /* =====================================================
           IDLE
        ===================================================== */

        if (
            gesture ===
            "IDLE"
        ) {

            return;
        }


        /* =====================================================
           LOOK UP JUTSU
        ===================================================== */

        const selected =
            HAND_JUTSU_MAP[
                gesture
            ];


        if (
            !selected
        ) {

            return;
        }


        /* =====================================================
           CHECK V5.1
        ===================================================== */

        if (

            !window.EdgeJutsuV51

            ||

            typeof window.EdgeJutsuV51.start
            !==
            "function"

        ) {

            console.error(
                "EdgeJutsuV51.start() unavailable."
            );


            setJutsuStatus(
                "VFX ERROR"
            );


            speakJutsu(
                "Jutsu visual engine unavailable."
            );


            return;
        }


        jutsuCompleting =
            true;


        setJutsuStatus(
            selected.label
        );


        setCameraText(

            "⚡ "
            +
            selected.label
            +
            " ACTIVATED ⚡"

        );


        document.body.classList.add(
            "jutsu-core-active"
        );


        addLogSafe(

            "JUTSU → HAND → "
            +
            gesture
            +
            " → "
            +
            selected.label

        );


        console.log(

            "HAND JUTSU:",
            gesture,
            "=>",
            selected.name

        );


        /* =====================================================
           SHORT JARVIS ANNOUNCEMENT
        ===================================================== */

        speakJutsu(

            selected.label
            +
            " activated."

        );


        /* =====================================================
           SAME ENGINE AS ALT+1 - ALT+5

           SOUND IS INSIDE startJutsu()
        ===================================================== */

        try {

            window.EdgeJutsuV51.start(
                selected.name
            );

        } catch (
            error
        ) {

            console.error(
                "HAND JUTSU START ERROR:",
                error
            );
        }


        /* =====================================================
           CAMERA BURST
        ===================================================== */

        const cameraElement =
            document.querySelector(
                ".spider-camera"
            );


        if (
            cameraElement
        ) {

            cameraElement.classList.add(
                "jutsu-camera-burst"
            );


            setTimeout(
                () => {

                    cameraElement.classList.remove(
                        "jutsu-camera-burst"
                    );

                },
                1900
            );
        }


        /* =====================================================
           BROADCAST EVENT
        ===================================================== */

        try {

            window.dispatchEvent(

                new CustomEvent(
                    "edge-hand-jutsu",
                    {

                        detail: {

                            gesture:
                                gesture,

                            jutsu:
                                selected.name,

                            timestamp:
                                Date.now()

                        }

                    }
                )

            );

        } catch (
            error
        ) {

            console.error(
                error
            );
        }


        /* =====================================================
           RESET
        ===================================================== */

        setTimeout(
            () => {

                resetJutsu();

            },
            2600
        );
    }


    /* =========================================================
       RESET JUTSU
    ========================================================= */

    function resetJutsu() {

        jutsuArmed =
            false;


        jutsuCompleting =
            false;


        jutsuArmTime =
            0;


        lastGesture =
            "IDLE";


        stableGesture =
            "IDLE";


        stableSince =
            0;


        document.body.classList.remove(
            "jutsu-seal-mode"
        );


        document.body.classList.remove(
            "jutsu-core-active"
        );


        setJutsuStatus(
            "READY"
        );


        setCameraText(
            "SPIDER VISION • FIST = JUTSU"
        );
    }


    /* =========================================================
       NORMAL GESTURES
    ========================================================= */

    function executeNormalGesture(
        gesture
    ) {

        const now =
            Date.now();


        if (
            now -
            lastAction <
            ACTION_COOLDOWN
        ) {

            return;
        }


        switch (
            gesture
        ) {

            /* =================================================
               WEB SNAP
               Visual Web Shot handled elsewhere.
            ================================================= */

            case "WEB SNAP":

                return;


            /* =================================================
               PINCH NORMAL ACTION
            ================================================= */

            case "PINCH":

                lastAction =
                    now;


                sendCommand(
                    "ping"
                );


                return;


            /* =================================================
               RESERVED JUTSU POSES
            ================================================= */

            case "FIST":

            case "PEACE":

            case "POINT":

            case "OPEN PALM":

                return;


            default:

                return;
        }
    }


    /* =========================================================
       SEND TO FLASK
    ========================================================= */

    async function sendCommand(
        command
    ) {

        if (
            !command
        ) {

            return;
        }


        try {

            console.log(
                "SPIDER COMMAND:",
                command
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


            if (
                !response.ok
            ) {

                throw new Error(

                    "HTTP "
                    +
                    response.status

                );
            }


            const data =
                await response.json();


            const result =
                safeText(

                    data.response
                    ??
                    data.message
                    ??
                    data.result
                    ??
                    data.status
                    ??
                    "Command completed."

                );


            addLogSafe(
                "OK → "
                +
                result
            );


        } catch (
            error
        ) {

            console.error(
                "SPIDER COMMAND ERROR:",
                error
            );


            addLogSafe(
                "GESTURE ERROR → "
                +
                error.message
            );
        }
    }


    /* =========================================================
       SPIDER TRAIL
    ========================================================= */

    function addTrailPoint(
        x,
        y
    ) {

        trail.push({

            x,
            y

        });


        while (
            trail.length >
            TRAIL_MAX
        ) {

            trail.shift();
        }
    }


    function drawTrail() {

        if (
            trail.length <
            2
        ) {

            return;
        }


        ctx.save();


        ctx.lineCap =
            "round";


        ctx.lineJoin =
            "round";


        for (
            let i = 1;
            i < trail.length;
            i++
        ) {

            const a =
                trail[
                    i - 1
                ];


            const b =
                trail[i];


            const alpha =
                i /
                trail.length;


            ctx.beginPath();


            ctx.moveTo(
                a.x,
                a.y
            );


            ctx.lineTo(
                b.x,
                b.y
            );


            ctx.strokeStyle =
                `rgba(
                    0,
                    240,
                    255,
                    ${0.05 + alpha * .58}
                )`;


            ctx.lineWidth =
                1 +
                alpha *
                3;


            ctx.shadowBlur =
                8;


            ctx.shadowColor =
                "#00efff";


            ctx.stroke();
        }


        ctx.restore();
    }


    /* =========================================================
       SPIDER WEB SHOT
    ========================================================= */

    function shootWeb(
        x,
        y,
        tx,
        ty
    ) {

        webShots.push({

            sx:
                x,

            sy:
                y,

            tx,
            ty,

            start:
                performance.now(),

            duration:
                430

        });


        for (
            let i = 0;
            i < 28;
            i++
        ) {

            const angle =
                Math.random()
                *
                Math.PI
                *
                2;


            const speed =
                .01
                +
                Math.random()
                *
                .032;


            webParticles.push({

                x:
                    x,

                y:
                    y,

                vx:
                    Math.cos(
                        angle
                    )
                    *
                    speed,

                vy:
                    Math.sin(
                        angle
                    )
                    *
                    speed,

                life:
                    1,

                size:
                    1
                    +
                    Math.random()
                    *
                    2.5

            });
        }


        webFlash =
            1;


        setCameraText(
            "🕸 WEB SHOT FIRED"
        );


        addLogSafe(
            "SPIDER VISION → WEB SHOT"
        );


        setTimeout(
            () => {

                if (
                    !jutsuArmed
                ) {

                    setCameraText(
                        "SPIDER VISION • FIST = JUTSU"
                    );
                }

            },
            850
        );
    }


    /* =========================================================
       DRAW WEB SHOT
    ========================================================= */

    function drawWebShot(
        shot,
        now
    ) {

        const progress =
            clamp(

                (
                    now -
                    shot.start
                )
                /
                shot.duration,

                0,

                1

            );


        const eased =
            1 -
            Math.pow(
                1 -
                progress,
                3
            );


        const x =
            shot.sx
            +
            (
                shot.tx -
                shot.sx
            )
            *
            eased;


        const y =
            shot.sy
            +
            (
                shot.ty -
                shot.sy
            )
            *
            eased;


        ctx.save();


        ctx.lineCap =
            "round";


        ctx.shadowBlur =
            14;


        ctx.shadowColor =
            "#ffffff";


        for (
            let strand = 0;
            strand < 5;
            strand++
        ) {

            const wobble =
                Math.sin(
                    progress *
                    18 +
                    strand
                )
                *
                .014;


            const offset =
                (
                    strand -
                    2
                )
                *
                .008;


            ctx.beginPath();


            ctx.moveTo(

                shot.sx *
                canvas.width,

                shot.sy *
                canvas.height

            );


            const centerX =
                (
                    (
                        shot.sx +
                        x
                    )
                    /
                    2
                    +
                    wobble
                )
                *
                canvas.width;


            const centerY =
                (
                    (
                        shot.sy +
                        y
                    )
                    /
                    2
                    +
                    offset
                )
                *
                canvas.height;


            ctx.quadraticCurveTo(

                centerX,
                centerY,

                x *
                canvas.width,

                y *
                canvas.height

            );


            ctx.strokeStyle =

                strand ===
                2

                ?

                "rgba(255,255,255,.97)"

                :

                "rgba(195,235,255,.68)";


            ctx.lineWidth =

                strand ===
                2

                ?

                2.5

                :

                1;


            ctx.stroke();
        }


        if (
            progress >
            .72
        ) {

            const impact =
                (
                    progress -
                    .72
                )
                /
                .28;


            const radius =
                (
                    .02 +
                    impact *
                    .07
                )
                *
                canvas.width;


            ctx.beginPath();


            ctx.arc(

                x *
                canvas.width,

                y *
                canvas.height,

                radius,

                0,

                Math.PI *
                2

            );


            ctx.strokeStyle =
                `rgba(
                    255,
                    255,
                    255,
                    ${1 - impact}
                )`;


            ctx.lineWidth =
                2;


            ctx.stroke();
        }


        ctx.restore();


        return (
            progress >=
            1
        );
    }


    /* =========================================================
       DRAW WEB FX
    ========================================================= */

    function drawWebEffects(
        now
    ) {

        for (
            let i =
                webShots.length -
                1;

            i >= 0;

            i--
        ) {

            if (
                drawWebShot(
                    webShots[i],
                    now
                )
            ) {

                webShots.splice(
                    i,
                    1
                );
            }
        }


        ctx.save();


        for (
            let i =
                webParticles.length -
                1;

            i >= 0;

            i--
        ) {

            const p =
                webParticles[i];


            p.x +=
                p.vx;


            p.y +=
                p.vy;


            p.life -=
                .04;


            if (
                p.life <=
                0
            ) {

                webParticles.splice(
                    i,
                    1
                );


                continue;
            }


            ctx.beginPath();


            ctx.arc(

                p.x *
                canvas.width,

                p.y *
                canvas.height,

                p.size,

                0,

                Math.PI *
                2

            );


            ctx.fillStyle =
                `rgba(
                    235,
                    250,
                    255,
                    ${p.life}
                )`;


            ctx.fill();
        }


        if (
            webFlash >
            0
        ) {

            ctx.fillStyle =
                `rgba(
                    255,
                    255,
                    255,
                    ${webFlash * .10}
                )`;


            ctx.fillRect(

                0,
                0,

                canvas.width,
                canvas.height

            );


            webFlash *=
                .80;
        }


        ctx.restore();
    }


    /* =========================================================
       PROCESS HAND RESULTS
    ========================================================= */

    function processResults(
        results
    ) {

        if (
            !canvas ||
            !ctx ||
            !video
        ) {

            return;
        }


        const width =
            video.videoWidth
            ||
            640;


        const height =
            video.videoHeight
            ||
            480;


        if (
            canvas.width !==
            width
        ) {

            canvas.width =
                width;
        }


        if (
            canvas.height !==
            height
        ) {

            canvas.height =
                height;
        }


        ctx.clearRect(

            0,
            0,

            canvas.width,
            canvas.height

        );


        const all =
            results.multiHandLandmarks
            ||
            [];


        currentHandCount =
            all.length;


        const handsDisplay =
            document.getElementById(
                "spider-hands"
            );


        if (
            handsDisplay
        ) {

            handsDisplay.textContent =
                currentHandCount;
        }


        const now =
            performance.now();


        /* =====================================================
           NO HAND
        ===================================================== */

        if (
            !all.length
        ) {

            updateGesture(
                "IDLE"
            );


            drawTrail();


            drawWebEffects(
                now
            );


            return;
        }


        /* =====================================================
           DRAW HANDS
        ===================================================== */

        all.forEach(
            (
                landmarks,
                index
            ) => {

                drawHand(
                    landmarks,
                    index
                );


                const center =
                    getHandCenter(
                        landmarks
                    );


                addTrailPoint(

                    center.x *
                    canvas.width,

                    center.y *
                    canvas.height

                );

            }
        );


        /* =====================================================
           FIRST HAND CONTROLS GESTURE
        ===================================================== */

        const first =
            all[0];

/* =========================================================
   SEND HAND POSITION TO JUTSU VFX
========================================================= */

const handCenter =
    getHandCenter(
        first
    );


const cameraRect =
    canvas.getBoundingClientRect();


window.EdgeJutsuHandPoint = {

    x:
        cameraRect.left +
        handCenter.x *
        cameraRect.width,

    y:
        cameraRect.top +
        handCenter.y *
        cameraRect.height

};
        const gesture =
            detectGesture(
                first
            );


        updateGesture(
            gesture
        );


        /* =====================================================
           NORMAL WEB SHOT

           When Jutsu is armed,
           WEB SNAP = Amaterasu instead.
        ===================================================== */

        if (

            gesture ===
            "WEB SNAP"

            &&

            !jutsuArmed

            &&

            Date.now() -
            lastWebShot >
            WEB_COOLDOWN

        ) {

            lastWebShot =
                Date.now();


            const wrist =
                first[0];


            const indexTip =
                first[8];


            const dx =
                indexTip.x -
                wrist.x;


            const dy =
                indexTip.y -
                wrist.y;


            const length =
                Math.hypot(
                    dx,
                    dy
                )
                ||
                1;


            const dirX =
                dx /
                length;


            const dirY =
                dy /
                length;


            const tx =
                clamp(

                    indexTip.x
                    +
                    dirX *
                    .95,

                    .02,

                    .98

                );


            const ty =
                clamp(

                    indexTip.y
                    +
                    dirY *
                    .95,

                    .02,

                    .98

                );


            shootWeb(

                indexTip.x,

                indexTip.y,

                tx,

                ty

            );
        }


        drawTrail();


        drawWebEffects(
            now
        );
    }


    /* =========================================================
       START CAMERA
    ========================================================= */

    async function startCamera() {

        if (
            !video
        ) {

            throw new Error(
                "Spider Vision video element unavailable."
            );
        }


        if (
            typeof Camera ===
            "undefined"
        ) {

            throw new Error(
                "MediaPipe Camera API unavailable."
            );
        }


        try {

            camera =
                new Camera(
                    video,
                    {

                        onFrame:
                            async () => {

                                if (
                                    hands &&
                                    running
                                ) {

                                    try {

                                        await hands.send({

                                            image:
                                                video

                                        });

                                    } catch (
                                        error
                                    ) {

                                        console.error(
                                            "MediaPipe frame error:",
                                            error
                                        );
                                    }
                                }
                            },

                        width:
                            640,

                        height:
                            480

                    }
                );


            running =
                true;


            await camera.start();


            setSpiderStatus(
                "ONLINE",
                "#00ff88"
            );


            setJutsuStatus(
                "READY"
            );


            setCameraText(
                "SPIDER VISION • FIST = JUTSU"
            );


            addLogSafe(
                "VISION → SPIDER VISION ONLINE"
            );


            addLogSafe(
                "JUTSU → INDIVIDUAL HAND JUTSU READY"
            );


            console.log(
                "Spider Vision camera ONLINE"
            );


        } catch (
            error
        ) {

            running =
                false;


            setSpiderStatus(
                "CAMERA ERROR",
                "#ff405f"
            );


            console.error(
                "Spider camera error:",
                error
            );


            addLogSafe(
                "VISION ERROR → "
                +
                error.message
            );
        }
    }


    /* =========================================================
       START ENGINE
    ========================================================= */

    function startSpiderVision() {

        createVisionUI();


        if (
            !video ||
            !canvas ||
            !ctx
        ) {

            console.error(
                "Spider Vision UI initialization failed."
            );


            return;
        }


        if (
            !initializeHands()
        ) {

            return;
        }


        canvas.width =
            640;


        canvas.height =
            480;


        startCamera();


        console.log(
            "EDGE AI OS 2077: SPIDER VISION + HAND JUTSU V7 ONLINE"
        );
    }


    /* =========================================================
       STOP ENGINE
    ========================================================= */

    function stopSpiderVision() {

        running =
            false;


        try {

            if (
                camera &&
                typeof camera.stop ===
                "function"
            ) {

                camera.stop();
            }

        } catch (
            error
        ) {

            console.error(
                error
            );
        }


        if (
            video &&
            video.srcObject
        ) {

            try {

                video.srcObject
                    .getTracks()
                    .forEach(
                        track =>
                            track.stop()
                    );


                video.srcObject =
                    null;

            } catch (
                error
            ) {

                console.error(
                    error
                );
            }
        }


        trail.length =
            0;


        webShots.length =
            0;


        webParticles.length =
            0;


        webFlash =
            0;


        resetJutsu();


        setSpiderStatus(
            "OFFLINE",
            "#ff405f"
        );


        if (
            canvas &&
            ctx
        ) {

            ctx.clearRect(

                0,
                0,

                canvas.width,
                canvas.height

            );
        }


        addLogSafe(
            "VISION → Spider Vision stopped."
        );
    }


    /* =========================================================
       PUBLIC API
    ========================================================= */

    window.startSpiderVision =
        startSpiderVision;


    window.stopSpiderVision =
        stopSpiderVision;


    window.armEdgeJutsu =
        armJutsu;


    window.resetEdgeJutsu =
        resetJutsu;


    window.getEdgeJutsuState =
        function () {

            return {

                armed:
                    jutsuArmed,

                completing:
                    jutsuCompleting,

                mapping:
                    HAND_JUTSU_MAP

            };
        };


    /* =========================================================
       AUTO START
    ========================================================= */

    window.addEventListener(
        "load",
        () => {

            setTimeout(
                () => {

                    startSpiderVision();

                },
                1300
            );

        }
    );


})();