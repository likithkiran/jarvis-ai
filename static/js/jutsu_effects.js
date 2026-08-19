/* ============================================================
   EDGE AI OS 2077
   SPIDER VISION JUTSU EFFECTS
   CAMERA-CONTAINED WEB VERSION
============================================================ */

(() => {

    "use strict";

    console.log(
        "EDGE AI OS 2077: Jutsu Effects loading..."
    );


    let effectRunning = false;


    /* ========================================================
       CREATE JUTSU EFFECT LAYER
    ======================================================== */

    function createEffectLayer() {

        if (
            document.getElementById(
                "jutsu-vfx-layer"
            )
        ) {

            return;
        }


        const layer =
            document.createElement(
                "div"
            );


        layer.id =
            "jutsu-vfx-layer";


        layer.innerHTML = `

            <canvas
                id="jutsu-vfx-canvas">
            </canvas>


            <div
                id="jutsu-energy-ring">
            </div>


            <div
                id="jutsu-activation-text">

                <div class="jutsu-small">
                    NEURAL SEQUENCE VERIFIED
                </div>

                <div class="jutsu-main">
                    JUTSU ACTIVATED
                </div>

                <div class="jutsu-sub">
                    SPIDER VISION // EDGE CORE
                </div>

            </div>


            <div
                id="jutsu-flash">
            </div>

        `;


        document.body.appendChild(
            layer
        );


        addStyles();
    }


    /* ========================================================
       JUTSU STYLES
    ======================================================== */

    function addStyles() {

        if (
            document.getElementById(
                "jutsu-vfx-style"
            )
        ) {

            return;
        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "jutsu-vfx-style";


        style.textContent = `

            /* ================================================
               FULL-SCREEN CONTAINER
               Only text/flash uses whole screen.
               Web canvas gets positioned over camera by JS.
            ================================================ */

            #jutsu-vfx-layer {

                position:
                    fixed;

                inset:
                    0;

                z-index:
                    25000;

                pointer-events:
                    none;

                overflow:
                    visible;

            }


            /* ================================================
               CAMERA WEB CANVAS
            ================================================ */

            #jutsu-vfx-canvas {

                position:
                    fixed !important;

                left:
                    0;

                top:
                    0;

                width:
                    1px;

                height:
                    1px;

                z-index:
                    25010;

                pointer-events:
                    none !important;

                border-radius:
                    8px;

                overflow:
                    hidden;

                opacity:
                    0;

                transition:
                    opacity 0.15s ease;

            }


            #jutsu-vfx-canvas.active {

                opacity:
                    1;

            }


            /* ================================================
               ENERGY RING
            ================================================ */

            #jutsu-energy-ring {

                position:
                    fixed;

                left:
                    50%;

                top:
                    50%;

                width:
                    100px;

                height:
                    100px;

                transform:
                    translate(-50%, -50%)
                    scale(0);

                border-radius:
                    50%;

                border:
                    2px solid
                    rgba(
                        0,
                        255,
                        255,
                        0.9
                    );

                box-shadow:

                    0 0 25px
                    #00ffff,

                    0 0 70px
                    rgba(
                        0,
                        255,
                        255,
                        0.55
                    );

                opacity:
                    0;

            }


            #jutsu-vfx-layer.active
            #jutsu-energy-ring {

                animation:
                    jutsuRing
                    1.2s ease-out
                    forwards;

            }


            @keyframes jutsuRing {

                0% {

                    transform:
                        translate(-50%, -50%)
                        scale(0.2);

                    opacity:
                        1;

                }

                100% {

                    transform:
                        translate(-50%, -50%)
                        scale(9);

                    opacity:
                        0;

                }

            }


            /* ================================================
               ACTIVATION TEXT
            ================================================ */

            #jutsu-activation-text {

                position:
                    fixed;

                left:
                    50%;

                top:
                    50%;

                transform:
                    translate(-50%, -50%)
                    scale(0.8);

                text-align:
                    center;

                font-family:
                    Orbitron,
                    Arial,
                    sans-serif;

                color:
                    #00ffff;

                opacity:
                    0;

                z-index:
                    25020;

                text-shadow:

                    0 0 10px
                    #00ffff,

                    0 0 35px
                    rgba(
                        0,
                        255,
                        255,
                        0.85
                    );

            }


            #jutsu-vfx-layer.active
            #jutsu-activation-text {

                animation:
                    jutsuText
                    2.4s ease
                    forwards;

            }


            .jutsu-small {

                font-size:
                    11px;

                letter-spacing:
                    5px;

                margin-bottom:
                    10px;

            }


            .jutsu-main {

                font-size:
                    clamp(
                        30px,
                        5vw,
                        72px
                    );

                font-weight:
                    900;

                letter-spacing:
                    8px;

                white-space:
                    nowrap;

            }


            .jutsu-sub {

                margin-top:
                    12px;

                font-size:
                    10px;

                letter-spacing:
                    4px;

                color:
                    #ffffff;

            }


            @keyframes jutsuText {

                0% {

                    opacity:
                        0;

                    transform:
                        translate(-50%, -50%)
                        scale(0.75);

                }

                18% {

                    opacity:
                        1;

                    transform:
                        translate(-50%, -50%)
                        scale(1.05);

                }

                65% {

                    opacity:
                        1;

                    transform:
                        translate(-50%, -50%)
                        scale(1);

                }

                100% {

                    opacity:
                        0;

                    transform:
                        translate(-50%, -50%)
                        scale(1.12);

                }

            }


            /* ================================================
               SCREEN FLASH
            ================================================ */

            #jutsu-flash {

                position:
                    fixed;

                inset:
                    0;

                background:
                    rgba(
                        0,
                        255,
                        255,
                        0.10
                    );

                opacity:
                    0;

                z-index:
                    25005;

            }


            #jutsu-vfx-layer.active
            #jutsu-flash {

                animation:
                    jutsuFlash
                    0.55s ease-out;

            }


            @keyframes jutsuFlash {

                0% {

                    opacity:
                        0;

                }

                18% {

                    opacity:
                        1;

                }

                100% {

                    opacity:
                        0;

                }

            }


            /* ================================================
               REACTOR BOOST
            ================================================ */

            body.jutsu-core-active
            #edge-reactor {

                filter:

                    brightness(2.2)

                    drop-shadow(
                        0 0 35px
                        #00ffff
                    )

                    drop-shadow(
                        0 0 90px
                        rgba(
                            0,
                            255,
                            255,
                            0.65
                        )
                    )

                    !important;

            }


            body.jutsu-core-active
            #spider-vision {

                box-shadow:

                    0 0 25px
                    #00ffff,

                    0 0 55px
                    rgba(
                        0,
                        255,
                        255,
                        0.45
                    ),

                    inset 0 0 25px
                    rgba(
                        0,
                        255,
                        255,
                        0.12
                    )

                    !important;

            }

        `;


        document.head.appendChild(
            style
        );
    }


    /* ========================================================
       FIND SPIDER CAMERA AREA
    ======================================================== */

    function getSpiderCamera() {

        const spiderVision =
            document.getElementById(
                "spider-vision"
            );


        if (!spiderVision) {

            return null;
        }


        return (
            spiderVision.querySelector(
                ".spider-camera"
            )
        );
    }


    /* ========================================================
       POSITION WEB CANVAS OVER CAMERA ONLY
    ======================================================== */

    function positionWebCanvas(
        canvas
    ) {

        const camera =
            getSpiderCamera();


        if (!camera) {

            console.warn(
                "Jutsu VFX: Spider camera not found."
            );

            return false;
        }


        const rect =
            camera.getBoundingClientRect();


        if (
            rect.width <= 0 ||
            rect.height <= 0
        ) {

            return false;
        }


        canvas.style.left =
            rect.left +
            "px";


        canvas.style.top =
            rect.top +
            "px";


        canvas.style.width =
            rect.width +
            "px";


        canvas.style.height =
            rect.height +
            "px";


        canvas.style.right =
            "auto";


        canvas.style.bottom =
            "auto";


        canvas.style.inset =
            "auto";


        canvas.width =
            Math.max(
                1,
                Math.floor(
                    rect.width
                )
            );


        canvas.height =
            Math.max(
                1,
                Math.floor(
                    rect.height
                )
            );


        return true;
    }


    /* ========================================================
       CAMERA-CONTAINED SPIDER WEB BURST
    ======================================================== */

    function spiderBurst() {

        const canvas =
            document.getElementById(
                "jutsu-vfx-canvas"
            );


        if (!canvas) {

            return;
        }


        if (
            !positionWebCanvas(
                canvas
            )
        ) {

            return;
        }


        const ctx =
            canvas.getContext(
                "2d"
            );


        if (!ctx) {

            return;
        }


        canvas.classList.add(
            "active"
        );


        const width =
            canvas.width;


        const height =
            canvas.height;


        /*
         * Web originates from lower-centre area,
         * similar to shooting from the user's hand.
         */

        const cx =
            width *
            0.52;


        const cy =
            height *
            0.62;


        const rays =
            18;


        /*
         * IMPORTANT:
         * Radius is intentionally limited to the
         * camera dimensions.
         */

        const radius =
            Math.max(
                width,
                height
            ) *
            0.72;


        const points =
            [];


        for (
            let i = 0;
            i < rays;
            i++
        ) {

            const angle =
                (
                    Math.PI *
                    2 /
                    rays
                ) *
                i;


            points.push({

                x:

                    cx +
                    Math.cos(
                        angle
                    ) *
                    radius,

                y:

                    cy +
                    Math.sin(
                        angle
                    ) *
                    radius

            });

        }


        let progress =
            0;


        function animate() {

            ctx.clearRect(
                0,
                0,
                width,
                height
            );


            progress +=
                0.042;


            const expansion =
                Math.min(
                    progress *
                    2.1,
                    1
                );


            const fade =
                Math.max(
                    0,
                    1 -
                    progress /
                    1.15
                );


            /* ================================================
               CENTRAL ENERGY GLOW
            ================================================ */

            const glow =
                ctx.createRadialGradient(

                    cx,
                    cy,
                    0,

                    cx,
                    cy,
                    Math.max(
                        width,
                        height
                    ) *
                    0.45

                );


            glow.addColorStop(
                0,
                `rgba(
                    0,
                    255,
                    255,
                    ${0.16 * fade}
                )`
            );


            glow.addColorStop(
                1,
                "rgba(0,255,255,0)"
            );


            ctx.fillStyle =
                glow;


            ctx.fillRect(
                0,
                0,
                width,
                height
            );


            /* ================================================
               RADIAL WEB STRANDS
            ================================================ */

            ctx.lineWidth =
                1.4;


            ctx.strokeStyle =
                `rgba(
                    0,
                    255,
                    255,
                    ${0.88 * fade}
                )`;


            ctx.shadowBlur =
                7;


            ctx.shadowColor =
                "#00ffff";


            for (
                const point
                of points
            ) {

                const x =
                    cx +
                    (
                        point.x -
                        cx
                    ) *
                    expansion;


                const y =
                    cy +
                    (
                        point.y -
                        cy
                    ) *
                    expansion;


                ctx.beginPath();


                ctx.moveTo(
                    cx,
                    cy
                );


                ctx.lineTo(
                    x,
                    y
                );


                ctx.stroke();

            }


            /* ================================================
               WEB RINGS
            ================================================ */

            const rings =
                6;


            for (
                let ring = 1;
                ring <= rings;
                ring++
            ) {

                const ringScale =
                    (
                        ring /
                        rings
                    ) *
                    expansion;


                ctx.beginPath();


                for (
                    let i = 0;
                    i <= points.length;
                    i++
                ) {

                    const point =
                        points[
                            i %
                            points.length
                        ];


                    /*
                     * Slight variation makes it look
                     * more organic than a perfect polygon.
                     */

                    const wobble =
                        0.94 +
                        Math.sin(
                            i *
                            1.8 +
                            ring
                        ) *
                        0.035;


                    const x =
                        cx +
                        (
                            point.x -
                            cx
                        ) *
                        ringScale *
                        wobble;


                    const y =
                        cy +
                        (
                            point.y -
                            cy
                        ) *
                        ringScale *
                        wobble;


                    if (
                        i === 0
                    ) {

                        ctx.moveTo(
                            x,
                            y
                        );

                    } else {

                        ctx.lineTo(
                            x,
                            y
                        );
                    }
                }


                ctx.closePath();


                ctx.strokeStyle =
                    `rgba(
                        190,
                        255,
                        255,
                        ${0.62 * fade}
                    )`;


                ctx.lineWidth =
                    0.9;


                ctx.stroke();

            }


            /* ================================================
               CENTRAL WEB NODE
            ================================================ */

            ctx.beginPath();


            ctx.arc(
                cx,
                cy,
                5 +
                progress *
                4,
                0,
                Math.PI *
                2
            );


            ctx.fillStyle =
                `rgba(
                    220,
                    255,
                    255,
                    ${fade}
                )`;


            ctx.fill();


            ctx.shadowBlur =
                0;


            if (
                progress <
                1.15
            ) {

                requestAnimationFrame(
                    animate
                );

            } else {

                ctx.clearRect(
                    0,
                    0,
                    width,
                    height
                );


                canvas.classList.remove(
                    "active"
                );
            }
        }


        animate();
    }


    /* ========================================================
       JARVIS SPEECH
    ======================================================== */

    function speakActivation() {

        if (
            !(
                "speechSynthesis"
                in window
            )
        ) {

            return;
        }


        /*
         * Avoid interfering too heavily with the
         * Hey Jarvis recognition system.
         */

        try {

            window.speechSynthesis.cancel();

        } catch (error) {

            console.log(
                error
            );
        }


        const speech =
            new SpeechSynthesisUtterance(
                "Jutsu sequence recognized. Spider vision activated."
            );


        speech.rate =
            0.90;


        speech.pitch =
            0.82;


        speech.volume =
            1;


        window.speechSynthesis.speak(
            speech
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
       ACTIVATE JUTSU EFFECTS
    ======================================================== */

    function activateJutsuEffects() {

        if (
            effectRunning
        ) {

            return;
        }


        effectRunning =
            true;


        const layer =
            document.getElementById(
                "jutsu-vfx-layer"
            );


        if (!layer) {

            effectRunning =
                false;

            return;
        }


        document.body
            .classList
            .add(
                "jutsu-core-active"
            );


        layer.classList.remove(
            "active"
        );


        /*
         * Force animation restart.
         */

        void layer.offsetWidth;


        layer.classList.add(
            "active"
        );


        /*
         * Web effect is now CAMERA ONLY.
         */

        spiderBurst();


        terminalMessage(
            "JUTSU SEQUENCE VERIFIED"
        );


        terminalMessage(
            "Neural energy synchronization initiated..."
        );


        terminalMessage(
            "SPIDER VISION JUTSU ACTIVATED"
        );


        speakActivation();


        setTimeout(
            () => {

                layer.classList.remove(
                    "active"
                );


                document.body
                    .classList
                    .remove(
                        "jutsu-core-active"
                    );


                const canvas =
                    document.getElementById(
                        "jutsu-vfx-canvas"
                    );


                if (canvas) {

                    const ctx =
                        canvas.getContext(
                            "2d"
                        );


                    if (ctx) {

                        ctx.clearRect(
                            0,
                            0,
                            canvas.width,
                            canvas.height
                        );
                    }


                    canvas.classList.remove(
                        "active"
                    );
                }


                effectRunning =
                    false;

            },
            3000
        );
    }


    /* ========================================================
       WATCH EXISTING JUTSU ENGINE
    ======================================================== */

    function watchJutsuEngine() {

        const status =
            document.getElementById(
                "jutsu-status"
            );


        if (!status) {

            setTimeout(
                watchJutsuEngine,
                500
            );

            return;
        }


        let previous =
            status.textContent
                .trim()
                .toUpperCase();


        const observer =
            new MutationObserver(
                () => {

                    const current =
                        status.textContent
                            .trim()
                            .toUpperCase();


                    if (

                        current ===
                        "JUTSU COMPLETE"

                        &&

                        previous !==
                        "JUTSU COMPLETE"

                    ) {

                        activateJutsuEffects();
                    }


                    previous =
                        current;
                }
            );


        observer.observe(
            status,
            {

                childList:
                    true,

                subtree:
                    true,

                characterData:
                    true

            }
        );


        console.log(
            "EDGE AI OS 2077: Jutsu VFX connected."
        );
    }


    /* ========================================================
       KEEP CANVAS ATTACHED TO CAMERA DURING PAGE MOVEMENT
    ======================================================== */

    function followSpiderCamera() {

        const canvas =
            document.getElementById(
                "jutsu-vfx-canvas"
            );


        if (
            canvas &&
            canvas.classList.contains(
                "active"
            )
        ) {

            positionWebCanvas(
                canvas
            );
        }


        requestAnimationFrame(
            followSpiderCamera
        );
    }


    /* ========================================================
       START
    ======================================================== */

    window.addEventListener(
        "load",
        () => {

            createEffectLayer();


            setTimeout(
                watchJutsuEngine,
                1200
            );


            requestAnimationFrame(
                followSpiderCamera
            );


            console.log(
                "EDGE AI OS 2077: CAMERA-CONTAINED JUTSU VFX ONLINE"
            );

        }
    );

})();