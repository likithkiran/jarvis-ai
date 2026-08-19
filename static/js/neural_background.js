/* ============================================================
   EDGE AI OS 2077
   EDGE REACTOR V1
   Cinematic JARVIS / Holographic Background Engine
============================================================ */

(() => {

    "use strict";

    console.log(
        "EDGE AI OS 2077: EDGE REACTOR loading..."
    );


    /* ========================================================
       CREATE BACKGROUND SYSTEM
    ======================================================== */

    const layer =
        document.createElement("div");

    layer.id =
        "edge-reactor-layer";


    const canvas =
        document.createElement("canvas");

    canvas.id =
        "edge-reactor-canvas";


    const reactor =
        document.createElement("div");

    reactor.id =
        "edge-reactor";


    reactor.innerHTML = `

        <div class="reactor-aura"></div>

        <div class="reactor-ring ring-1"></div>

        <div class="reactor-ring ring-2"></div>

        <div class="reactor-ring ring-3"></div>

        <div class="reactor-ring ring-4"></div>

        <div class="reactor-ring ring-5"></div>

        <div class="reactor-core">

            <div class="core-inner"></div>

            <div class="core-light"></div>

        </div>

        <div class="reactor-crosshair horizontal"></div>

        <div class="reactor-crosshair vertical"></div>

        <div class="reactor-label">

            <span>
                EDGE CORE
            </span>

            <strong>
                ONLINE
            </strong>

        </div>
    `;


    layer.appendChild(
        canvas
    );


    layer.appendChild(
        reactor
    );


    document.body.prepend(
        layer
    );


    const ctx =
        canvas.getContext(
            "2d"
        );


    /* ========================================================
       CSS
    ======================================================== */

    const style =
        document.createElement(
            "style"
        );


    style.id =
        "edge-reactor-style";


    style.textContent = `

        /* ====================================================
           BACKGROUND
        ==================================================== */

        body {

            background:

                radial-gradient(
                    circle at 50% 42%,
                    rgba(0, 140, 180, 0.09),
                    transparent 32%
                ),

                radial-gradient(
                    circle at 15% 20%,
                    rgba(0, 210, 255, 0.04),
                    transparent 30%
                ),

                radial-gradient(
                    circle at 90% 70%,
                    rgba(0, 100, 255, 0.05),
                    transparent 30%
                ),

                linear-gradient(
                    180deg,
                    #020711 0%,
                    #020914 40%,
                    #01040a 100%
                )

                !important;
        }


        #edge-reactor-layer {

            position:
                fixed;

            inset:
                0;

            overflow:
                hidden;

            pointer-events:
                none;

            z-index:
                0;
        }


        #edge-reactor-canvas {

            position:
                absolute !important;

            inset:
                0 !important;

            width:
                100vw !important;

            height:
                100vh !important;

            pointer-events:
                none !important;

            z-index:
                0 !important;
        }


        #dashboard {

            position:
                relative;

            z-index:
                2;
        }


        /* ====================================================
           REACTOR
        ==================================================== */

        #edge-reactor {

            position:
                fixed;

            left:
                50%;

            top:
                50%;

            width:
                540px;

            height:
                540px;

            transform:
                translate(
                    -50%,
                    -50%
                );

            pointer-events:
                none;

            z-index:
                1;

            opacity:
                0.84;
        }


        /* ====================================================
           REACTOR AURA
        ==================================================== */

        .reactor-aura {

            position:
                absolute;

            inset:
                15%;

            border-radius:
                50%;

            background:

                radial-gradient(
                    circle,
                    rgba(0, 238, 255, 0.15),
                    rgba(0, 180, 255, 0.05) 35%,
                    transparent 70%
                );

            filter:
                blur(18px);

            animation:
                reactorAuraPulse
                3.2s ease-in-out
                infinite alternate;
        }


        @keyframes reactorAuraPulse {

            from {

                transform:
                    scale(0.92);

                opacity:
                    0.45;
            }

            to {

                transform:
                    scale(1.15);

                opacity:
                    0.90;
            }
        }


        /* ====================================================
           RINGS
        ==================================================== */

        .reactor-ring {

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

            box-sizing:
                border-box;
        }


        .ring-1 {

            width:
                440px;

            height:
                440px;

            border:
                1px solid rgba(
                    0,
                    235,
                    255,
                    0.30
                );

            box-shadow:

                0 0 30px
                rgba(
                    0,
                    220,
                    255,
                    0.11
                ),

                inset 0 0 20px
                rgba(
                    0,
                    220,
                    255,
                    0.05
                );

            animation:
                reactorRotate
                18s linear
                infinite;
        }


        .ring-1::before {

            content:
                "";

            position:
                absolute;

            inset:
                -5px;

            border-radius:
                50%;

            border-top:
                4px solid
                rgba(
                    0,
                    255,
                    255,
                    0.80
                );

            border-left:
                2px solid
                transparent;

            border-right:
                2px solid
                transparent;
        }


        .ring-2 {

            width:
                375px;

            height:
                375px;

            border:

                1px dashed
                rgba(
                    0,
                    255,
                    255,
                    0.38
                );

            animation:
                reactorRotateReverse
                13s linear
                infinite;
        }


        .ring-3 {

            width:
                305px;

            height:
                305px;

            border:

                2px solid
                rgba(
                    0,
                    210,
                    255,
                    0.13
                );

            box-shadow:

                0 0 35px
                rgba(
                    0,
                    225,
                    255,
                    0.16
                );

            animation:
                reactorRotate
                9s linear
                infinite;
        }


        .ring-3::after {

            content:
                "";

            position:
                absolute;

            inset:
                -8px;

            border-radius:
                50%;

            border-bottom:

                6px solid
                rgba(
                    0,
                    255,
                    255,
                    0.75
                );

            border-left:

                6px solid
                transparent;

            border-right:

                6px solid
                transparent;

            filter:
                drop-shadow(
                    0 0 8px
                    #00ffff
                );
        }


        .ring-4 {

            width:
                225px;

            height:
                225px;

            border:

                1px dashed
                rgba(
                    0,
                    255,
                    255,
                    0.55
                );

            animation:
                reactorRotateReverse
                7s linear
                infinite;
        }


        .ring-5 {

            width:
                155px;

            height:
                155px;

            border:

                2px solid
                rgba(
                    0,
                    255,
                    255,
                    0.48
                );

            box-shadow:

                0 0 25px
                rgba(
                    0,
                    255,
                    255,
                    0.20
                );

            animation:
                reactorRingPulse
                2s ease-in-out
                infinite alternate;
        }


        @keyframes reactorRotate {

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


        @keyframes reactorRotateReverse {

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


        @keyframes reactorRingPulse {

            from {

                opacity:
                    0.4;

                transform:
                    translate(
                        -50%,
                        -50%
                    )
                    scale(0.92);
            }

            to {

                opacity:
                    1;

                transform:
                    translate(
                        -50%,
                        -50%
                    )
                    scale(1.08);
            }
        }


        /* ====================================================
           CENTRAL CORE
        ==================================================== */

        .reactor-core {

            position:
                absolute;

            left:
                50%;

            top:
                50%;

            width:
                90px;

            height:
                90px;

            border-radius:
                50%;

            transform:
                translate(
                    -50%,
                    -50%
                );

            background:

                radial-gradient(
                    circle,
                    #dfffff 0%,
                    #00eeff 15%,
                    #0088bb 38%,
                    rgba(
                        0,
                        160,
                        220,
                        0.15
                    ) 60%,
                    transparent 72%
                );

            box-shadow:

                0 0 18px
                #00ffff,

                0 0 45px
                rgba(
                    0,
                    255,
                    255,
                    0.85
                ),

                0 0 100px
                rgba(
                    0,
                    180,
                    255,
                    0.42
                );

            animation:
                coreHeartbeat
                1.8s ease-in-out
                infinite;
        }


        .core-inner {

            position:
                absolute;

            inset:
                25%;

            border-radius:
                50%;

            border:
                2px solid
                rgba(
                    255,
                    255,
                    255,
                    0.80
                );

            box-shadow:

                inset 0 0 15px
                white,

                0 0 15px
                #00ffff;
        }


        .core-light {

            position:
                absolute;

            width:
                8px;

            height:
                8px;

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

            background:
                white;

            box-shadow:

                0 0 8px white,

                0 0 25px #00ffff,

                0 0 60px #00ffff;
        }


        @keyframes coreHeartbeat {

            0% {

                transform:
                    translate(
                        -50%,
                        -50%
                    )
                    scale(0.94);
            }

            50% {

                transform:
                    translate(
                        -50%,
                        -50%
                    )
                    scale(1.08);
            }

            100% {

                transform:
                    translate(
                        -50%,
                        -50%
                    )
                    scale(0.94);
            }
        }


        /* ====================================================
           CROSSHAIRS
        ==================================================== */

        .reactor-crosshair {

            position:
                absolute;

            left:
                50%;

            top:
                50%;

            opacity:
                0.18;

            background:
                #00ffff;

            box-shadow:
                0 0 10px
                #00ffff;
        }


        .reactor-crosshair.horizontal {

            width:
                500px;

            height:
                1px;

            transform:
                translate(
                    -50%,
                    -50%
                );
        }


        .reactor-crosshair.vertical {

            width:
                1px;

            height:
                500px;

            transform:
                translate(
                    -50%,
                    -50%
                );
        }


        /* ====================================================
           LABEL
        ==================================================== */

        .reactor-label {

            position:
                absolute;

            left:
                50%;

            bottom:
                15px;

            transform:
                translateX(
                    -50%
                );

            text-align:
                center;

            font-family:
                Orbitron,
                Arial,
                sans-serif;

            letter-spacing:
                4px;

            opacity:
                0.55;
        }


        .reactor-label span {

            display:
                block;

            font-size:
                9px;

            color:
                #00ffff;
        }


        .reactor-label strong {

            display:
                block;

            margin-top:
                4px;

            font-size:
                7px;

            color:
                #00ff88;
        }


        /* ====================================================
           JUTSU BOOST
        ==================================================== */

        body.jutsu-core-active
        #edge-reactor {

            animation:
                reactorJutsuBoost
                0.25s ease-in-out
                infinite alternate;
        }


        @keyframes reactorJutsuBoost {

            from {

                filter:
                    brightness(1);
            }

            to {

                filter:
                    brightness(2.3)
                    drop-shadow(
                        0 0 35px
                        #00ffff
                    );
            }
        }


        @media(max-width:900px) {

            #edge-reactor {

                width:
                    360px;

                height:
                    360px;
            }


            .ring-1 {

                width:
                    330px;

                height:
                    330px;
            }


            .ring-2 {

                width:
                    280px;

                height:
                    280px;
            }


            .ring-3 {

                width:
                    225px;

                height:
                    225px;
            }


            .ring-4 {

                width:
                    170px;

                height:
                    170px;
            }
        }

    `;


    document.head.appendChild(
        style
    );


    /* ========================================================
       CANVAS SIZE
    ======================================================== */

    let width =
        window.innerWidth;

    let height =
        window.innerHeight;


    const pixelRatio =
        Math.min(
            window.devicePixelRatio || 1,
            1.5
        );


    function resize() {

        width =
            window.innerWidth;

        height =
            window.innerHeight;


        canvas.width =
            width *
            pixelRatio;


        canvas.height =
            height *
            pixelRatio;


        ctx.setTransform(
            pixelRatio,
            0,
            0,
            pixelRatio,
            0,
            0
        );
    }


    resize();


    window.addEventListener(
        "resize",
        resize
    );


    /* ========================================================
       PARTICLES
    ======================================================== */

    const particles =
        [];


    const particleCount =
        75;


    class Particle {

        constructor() {

            this.reset();
        }


        reset() {

            this.x =
                Math.random() *
                width;

            this.y =
                Math.random() *
                height;

            this.size =
                Math.random() *
                1.8 +
                0.4;

            this.speedX =
                (
                    Math.random() -
                    0.5
                ) *
                0.20;

            this.speedY =
                (
                    Math.random() -
                    0.5
                ) *
                0.16;

            this.alpha =
                Math.random() *
                0.65 +
                0.15;

            this.phase =
                Math.random() *
                Math.PI *
                2;
        }


        update() {

            this.x +=
                this.speedX;

            this.y +=
                this.speedY;

            this.phase +=
                0.02;


            if (
                this.x < -20 ||
                this.x >
                    width + 20 ||
                this.y < -20 ||
                this.y >
                    height + 20
            ) {

                this.reset();
            }
        }


        draw() {

            const brightness =
                this.alpha *
                (
                    0.75 +
                    Math.sin(
                        this.phase
                    ) *
                    0.25
                );


            ctx.beginPath();


            ctx.arc(

                this.x,

                this.y,

                this.size,

                0,

                Math.PI * 2

            );


            ctx.fillStyle =
                `rgba(
                    0,
                    235,
                    255,
                    ${brightness}
                )`;


            ctx.fill();
        }
    }


    for (
        let i = 0;
        i <
            particleCount;
        i++
    ) {

        particles.push(
            new Particle()
        );
    }


    /* ========================================================
       SPARKS
    ======================================================== */

    const sparks =
        [];


    function createSpark() {

        const centerX =
            width * 0.5;

        const centerY =
            height * 0.50;


        const angle =
            Math.random() *
            Math.PI *
            2;


        const distance =
            70 +
            Math.random() *
            150;


        sparks.push({

            x:
                centerX +
                Math.cos(
                    angle
                ) *
                distance,

            y:
                centerY +
                Math.sin(
                    angle
                ) *
                distance,

            vx:
                Math.cos(
                    angle
                ) *
                (
                    0.7 +
                    Math.random() *
                    1.6
                ),

            vy:
                Math.sin(
                    angle
                ) *
                (
                    0.7 +
                    Math.random() *
                    1.6
                ),

            life:
                1,

            size:
                Math.random() *
                2 +
                0.5
        });
    }


    function updateSparks() {

        if (
            Math.random() <
            0.20
        ) {

            createSpark();
        }


        for (
            let i =
                sparks.length - 1;
            i >= 0;
            i--
        ) {

            const spark =
                sparks[i];


            spark.x +=
                spark.vx;

            spark.y +=
                spark.vy;

            spark.life -=
                0.018;


            ctx.beginPath();


            ctx.arc(

                spark.x,

                spark.y,

                spark.size,

                0,

                Math.PI * 2

            );


            ctx.fillStyle =
                `rgba(
                    0,
                    255,
                    255,
                    ${spark.life}
                )`;


            ctx.shadowBlur =
                10;


            ctx.shadowColor =
                "#00ffff";


            ctx.fill();


            ctx.shadowBlur =
                0;


            if (
                spark.life <= 0
            ) {

                sparks.splice(
                    i,
                    1
                );
            }
        }
    }


    /* ========================================================
       NETWORK LINES
    ======================================================== */

    function drawConnections() {

        const maxDistance =
            115;


        for (
            let i = 0;
            i <
                particles.length;
            i++
        ) {

            for (
                let j =
                    i + 1;
                j <
                    particles.length;
                j++
            ) {

                const a =
                    particles[i];

                const b =
                    particles[j];


                const dx =
                    a.x -
                    b.x;

                const dy =
                    a.y -
                    b.y;


                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                if (
                    distance <
                    maxDistance
                ) {

                    const alpha =
                        (
                            1 -
                            distance /
                            maxDistance
                        ) *
                        0.08;


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
                            225,
                            255,
                            ${alpha}
                        )`;


                    ctx.lineWidth =
                        0.7;


                    ctx.stroke();
                }
            }
        }
    }


    /* ========================================================
       HUD ARC
    ======================================================== */

    let rotation =
        0;


    function drawHudArc() {

        rotation +=
            0.004;


        const x =
            width *
            0.5;

        const y =
            height *
            0.5;


        const radius =
            270;


        ctx.save();


        ctx.translate(
            x,
            y
        );


        ctx.rotate(
            rotation
        );


        ctx.beginPath();


        ctx.arc(
            0,
            0,
            radius,
            0,
            Math.PI *
            0.48
        );


        ctx.strokeStyle =
            "rgba(0,255,255,0.12)";


        ctx.lineWidth =
            2;


        ctx.stroke();


        ctx.beginPath();


        ctx.arc(
            0,
            0,
            radius + 18,
            Math.PI,
            Math.PI *
            1.35
        );


        ctx.strokeStyle =
            "rgba(0,255,255,0.20)";


        ctx.stroke();


        ctx.restore();
    }


    /* ========================================================
       SCANNER
    ======================================================== */

    let scanner =
        -100;


    function drawScanner() {

        scanner +=
            0.45;


        if (
            scanner >
            height + 100
        ) {

            scanner =
                -100;
        }


        const gradient =
            ctx.createLinearGradient(
                0,
                scanner - 50,
                0,
                scanner + 50
            );


        gradient.addColorStop(
            0,
            "rgba(0,255,255,0)"
        );


        gradient.addColorStop(
            0.5,
            "rgba(0,255,255,0.025)"
        );


        gradient.addColorStop(
            1,
            "rgba(0,255,255,0)"
        );


        ctx.fillStyle =
            gradient;


        ctx.fillRect(
            0,
            scanner - 50,
            width,
            100
        );
    }


    /* ========================================================
       ANIMATION LOOP
    ======================================================== */

    let lastFrame =
        0;


    function animate(
        time
    ) {

        requestAnimationFrame(
            animate
        );


        /*
         * ~30 FPS to leave CPU/GPU resources
         * for MediaPipe Spider Vision.
         */

        if (
            time -
            lastFrame <
            33
        ) {

            return;
        }


        lastFrame =
            time;


        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        drawScanner();


        for (
            const particle
            of particles
        ) {

            particle.update();

            particle.draw();
        }


        drawConnections();


        drawHudArc();


        updateSparks();
    }


    requestAnimationFrame(
        animate
    );


    /* ========================================================
       FOLLOW EXISTING AI CORE
    ======================================================== */

    function syncReactor() {

        const aiCore =
            document.getElementById(
                "ai-core"
            );


        if (aiCore) {

            const rect =
                aiCore.getBoundingClientRect();


            if (
                rect.width > 100 &&
                rect.height > 100
            ) {

                const centerX =
                    rect.left +
                    rect.width /
                    2;


                /*
                 * Move the cinematic reactor lower so that
                 * it stays completely below the top header.
                 */

                const centerY =
                    rect.top +
                    rect.height /
                    2 +
                    135;


                reactor.style.left =
                    centerX +
                    "px";


                reactor.style.top =
                    centerY +
                    "px";
            }
        }


        requestAnimationFrame(
            syncReactor
        );
    }


    syncReactor();


    /* ========================================================
       STARTUP EFFECT
    ======================================================== */

    reactor.style.opacity =
        "0";


    reactor.style.transform =
        "translate(-50%, -50%) scale(0.4)";


    setTimeout(
        () => {

            reactor.style.transition =
                "opacity 1.8s ease, transform 1.8s cubic-bezier(.2,.9,.2,1)";


            reactor.style.opacity =
                "0.84";


            reactor.style.transform =
                "translate(-50%, -50%) scale(1)";

        },
        450
    );


    console.log(
        "EDGE AI OS 2077: EDGE REACTOR ONLINE"
    );

})();