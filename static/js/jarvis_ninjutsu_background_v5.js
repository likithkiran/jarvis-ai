/* ============================================================
   EDGE AI OS 2077
   JARVIS × NINJUTSU CINEMATIC BACKGROUND V5
   Animated frontend background — NO IMAGE
============================================================ */

(() => {
    "use strict";

    // Prevent duplicate background
    if (document.getElementById("edge-v5-bg")) {
        return;
    }

    /* ========================================================
       CREATE BACKGROUND
    ======================================================== */

    const root = document.createElement("div");
    root.id = "edge-v5-bg";

    root.innerHTML = `
        <canvas id="edge-v5-canvas"></canvas>

        <div class="v5-ambient v5-ambient-cyan"></div>
        <div class="v5-ambient v5-ambient-red"></div>

        <div class="v5-grid"></div>
        <div class="v5-scan"></div>

        <div class="v5-reactor-field">

            <div class="v5-ring r1"></div>
            <div class="v5-ring r2"></div>
            <div class="v5-ring r3"></div>
            <div class="v5-ring r4"></div>
            <div class="v5-ring r5"></div>

            <div class="v5-core-aura"></div>

            <div class="v5-jutsu-node rasengan">
                <span class="v5-icon">◉</span>
                <small>RASENGAN</small>
            </div>

            <div class="v5-jutsu-node chidori">
                <span class="v5-icon">ϟ</span>
                <small>CHIDORI</small>
            </div>

            <div class="v5-jutsu-node katon">
                <span class="v5-icon">▲</span>
                <small>KATON</small>
            </div>

            <div class="v5-jutsu-node susanoo">
                <span class="v5-icon">◆</span>
                <small>SUSANOO</small>
            </div>

            <div class="v5-jutsu-node amaterasu">
                <span class="v5-icon">✦</span>
                <small>AMATERASU</small>
            </div>

            <div class="v5-energy-floor"></div>

        </div>

        <div class="v5-circuit c1"></div>
        <div class="v5-circuit c2"></div>
        <div class="v5-circuit c3"></div>
        <div class="v5-circuit c4"></div>

        <div class="v5-edge-line top"></div>
        <div class="v5-edge-line bottom"></div>
    `;

    document.body.prepend(root);

    /* ========================================================
       STYLES
    ======================================================== */

    const style = document.createElement("style");

    style.id = "edge-v5-bg-style";

    style.textContent = `

        #edge-v5-bg {

            position: fixed;

            inset: 0;

            z-index: 0;

            overflow: hidden;

            pointer-events: none;

            background:
                radial-gradient(
                    circle at 47% 44%,
                    rgba(0,180,255,.13),
                    transparent 24%
                ),

                radial-gradient(
                    circle at 58% 38%,
                    rgba(255,30,40,.055),
                    transparent 24%
                ),

                radial-gradient(
                    circle at 42% 72%,
                    rgba(110,40,255,.06),
                    transparent 22%
                ),

                linear-gradient(
                    180deg,
                    #01050c 0%,
                    #020916 52%,
                    #01040a 100%
                );
        }


        #dashboard {

            position: relative;

            z-index: 5;
        }


        #edge-v5-canvas {

            position: absolute !important;

            inset: 0 !important;

            width: 100% !important;

            height: 100% !important;

            z-index: 1 !important;

            pointer-events: none !important;
        }


        /* ====================================================
           FUTURISTIC GRID
        ==================================================== */

        .v5-grid {

            position: absolute;

            inset: 0;

            opacity: .34;

            background-image:

                linear-gradient(
                    rgba(0,230,255,.04) 1px,
                    transparent 1px
                ),

                linear-gradient(
                    90deg,
                    rgba(0,230,255,.04) 1px,
                    transparent 1px
                ),

                linear-gradient(
                    rgba(255,65,35,.018) 1px,
                    transparent 1px
                ),

                linear-gradient(
                    90deg,
                    rgba(255,65,35,.018) 1px,
                    transparent 1px
                );

            background-size:

                44px 44px,
                44px 44px,
                176px 176px,
                176px 176px;

            animation:
                v5GridDrift
                18s linear infinite;
        }


        @keyframes v5GridDrift {

            from {

                transform:
                    translate3d(0,0,0);
            }

            to {

                transform:
                    translate3d(
                        -44px,
                        44px,
                        0
                    );
            }
        }


        /* ====================================================
           AMBIENT LIGHT
        ==================================================== */

        .v5-ambient {

            position: absolute;

            border-radius: 50%;

            filter:
                blur(70px);

            opacity: .42;

            animation:
                v5Ambient
                7s ease-in-out
                infinite alternate;
        }


        .v5-ambient-cyan {

            width: 760px;

            height: 760px;

            left: 24%;

            top: 8%;

            background:
                rgba(0,185,255,.16);
        }


        .v5-ambient-red {

            width: 540px;

            height: 540px;

            left: 46%;

            top: 16%;

            background:
                rgba(255,38,20,.075);

            animation-delay:
                -2s;
        }


        @keyframes v5Ambient {

            from {

                transform:
                    scale(.86);

                opacity:
                    .24;
            }

            to {

                transform:
                    scale(1.12);

                opacity:
                    .5;
            }
        }


        /* ====================================================
           CENTRAL JARVIS / JUTSU FIELD
        ==================================================== */

        .v5-reactor-field {

            position: absolute;

            left: 47%;

            top: 47%;

            width:
                min(68vw, 980px);

            aspect-ratio:
                1 / 1;

            transform:
                translate(
                    -50%,
                    -50%
                );

            z-index: 2;
        }


        .v5-ring {

            position: absolute;

            left: 50%;

            top: 50%;

            border-radius:
                50%;

            transform:
                translate(
                    -50%,
                    -50%
                );

            box-sizing:
                border-box;

            filter:
                drop-shadow(
                    0 0 12px
                    rgba(0,220,255,.15)
                );
        }


        .v5-ring::before,
        .v5-ring::after {

            content: "";

            position: absolute;

            inset: -1px;

            border-radius:
                50%;
        }


        /* INNER RING */

        .r1 {

            width: 32%;

            height: 32%;

            border:
                1px solid
                rgba(0,245,255,.42);

            animation:
                v5Spin
                8s linear infinite;
        }


        .r1::before {

            border-top:
                4px solid
                #00f3ff;

            border-right:
                4px solid
                transparent;

            border-left:
                4px solid
                transparent;
        }


        /* SECOND RING */

        .r2 {

            width: 46%;

            height: 46%;

            border:
                1px dashed
                rgba(0,225,255,.27);

            animation:
                v5SpinReverse
                13s linear infinite;
        }


        .r2::before {

            border-bottom:
                3px solid
                rgba(0,234,255,.85);

            border-left:
                3px solid
                transparent;

            border-right:
                3px solid
                transparent;
        }


        /* THIRD RING */

        .r3 {

            width: 61%;

            height: 61%;

            border:
                1px solid
                rgba(40,145,255,.20);

            animation:
                v5Spin
                22s linear infinite;
        }


        .r3::after {

            inset: 7%;

            border:
                1px dotted
                rgba(255,50,35,.26);
        }


        /* OUTER RING */

        .r4 {

            width: 77%;

            height: 77%;

            border:
                1px solid
                rgba(0,225,255,.12);

            animation:
                v5SpinReverse
                32s linear infinite;
        }


        .r4::before {

            border-top:
                2px solid
                rgba(255,52,32,.35);

            border-bottom:
                2px solid
                rgba(0,235,255,.35);
        }


        /* ELLIPTICAL ORBIT */

        .r5 {

            width: 92%;

            height: 56%;

            border:
                1px solid
                rgba(0,190,255,.13);

            transform:
                translate(
                    -50%,
                    -50%
                )
                rotate(-13deg);

            animation:
                v5TiltFloat
                6s ease-in-out
                infinite alternate;
        }


        @keyframes v5Spin {

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


        @keyframes v5SpinReverse {

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


        @keyframes v5TiltFloat {

            from {

                transform:
                    translate(
                        -50%,
                        -50%
                    )
                    rotate(-17deg)
                    scale(.96);
            }

            to {

                transform:
                    translate(
                        -50%,
                        -50%
                    )
                    rotate(-8deg)
                    scale(1.05);
            }
        }


        /* ====================================================
           CORE ENERGY
        ==================================================== */

        .v5-core-aura {

            position: absolute;

            left: 50%;

            top: 50%;

            width: 29%;

            height: 29%;

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
                    rgba(255,255,255,.20) 0%,
                    rgba(0,245,255,.16) 18%,
                    rgba(0,100,255,.08) 42%,
                    transparent 72%
                );

            box-shadow:

                0 0 60px
                rgba(0,235,255,.22),

                0 0 150px
                rgba(0,160,255,.12);

            animation:
                v5CorePulse
                2.6s ease-in-out
                infinite alternate;
        }


        @keyframes v5CorePulse {

            from {

                transform:
                    translate(
                        -50%,
                        -50%
                    )
                    scale(.88);

                filter:
                    brightness(.9);
            }

            to {

                transform:
                    translate(
                        -50%,
                        -50%
                    )
                    scale(1.13);

                filter:
                    brightness(1.45);
            }
        }


        /* ====================================================
           JUTSU NODES
        ==================================================== */

        .v5-jutsu-node {

            position: absolute;

            width: 92px;

            height: 92px;

            margin:
                -46px 0 0 -46px;

            border-radius:
                50%;

            display:
                grid;

            place-items:
                center;

            border:
                1px solid
                rgba(0,235,255,.36);

            background:

                radial-gradient(
                    circle,
                    rgba(0,225,255,.13),
                    rgba(0,30,60,.35) 55%,
                    transparent 72%
                );

            box-shadow:

                0 0 18px
                rgba(0,235,255,.18),

                inset 0 0 16px
                rgba(0,235,255,.08);

            color:
                #bffcff;

            font-family:
                Orbitron,
                sans-serif;

            animation:
                v5NodeFloat
                3.6s ease-in-out
                infinite alternate;

            opacity:
                .74;
        }


        .v5-jutsu-node::after {

            content: "";

            position: absolute;

            inset: -10px;

            border-radius:
                50%;

            border:
                1px dashed
                currentColor;

            opacity:
                .24;

            animation:
                v5NodeOrbit
                8s linear infinite;
        }


        .v5-jutsu-node .v5-icon {

            font-size:
                34px;

            line-height:
                1;

            text-shadow:
                0 0 15px
                currentColor;
        }


        .v5-jutsu-node small {

            position:
                absolute;

            top:
                calc(100% + 8px);

            font-size:
                8px;

            letter-spacing:
                1.4px;

            color:
                currentColor;

            white-space:
                nowrap;

            opacity:
                .8;
        }


        /* RASENGAN */

        .rasengan {

            left: 50%;

            top: 10%;

            color:
                #00efff;
        }


        /* CHIDORI */

        .chidori {

            left: 78%;

            top: 31%;

            color:
                #4cd8ff;

            animation-delay:
                -.8s;
        }


        /* KATON */

        .katon {

            left: 23%;

            top: 64%;

            color:
                #ff6a32;

            animation-delay:
                -1.3s;

            border-color:
                rgba(255,80,35,.42);

            background:

                radial-gradient(
                    circle,
                    rgba(255,60,20,.15),
                    rgba(60,10,0,.32) 55%,
                    transparent 72%
                );
        }


        /* SUSANOO */

        .susanoo {

            left: 77%;

            top: 66%;

            color:
                #bd66ff;

            animation-delay:
                -1.8s;

            border-color:
                rgba(180,90,255,.42);

            background:

                radial-gradient(
                    circle,
                    rgba(145,40,255,.16),
                    rgba(35,0,65,.32) 55%,
                    transparent 72%
                );
        }


        /* AMATERASU */

        .amaterasu {

            left: 50%;

            top: 85%;

            color:
                #9d5cff;

            animation-delay:
                -2.2s;

            border-color:
                rgba(150,70,255,.42);

            background:

                radial-gradient(
                    circle,
                    rgba(100,35,255,.15),
                    rgba(28,0,56,.32) 55%,
                    transparent 72%
                );
        }


        @keyframes v5NodeFloat {

            from {

                transform:
                    translateY(-8px)
                    scale(.96);
            }

            to {

                transform:
                    translateY(10px)
                    scale(1.05);
            }
        }


        @keyframes v5NodeOrbit {

            from {

                transform:
                    rotate(0deg);
            }

            to {

                transform:
                    rotate(360deg);
            }
        }


        /* ====================================================
           HOLOGRAPHIC FLOOR
        ==================================================== */

        .v5-energy-floor {

            position: absolute;

            left: 50%;

            bottom: 3%;

            width: 62%;

            height: 13%;

            transform:
                translateX(-50%);

            border-radius:
                50%;

            border:
                1px solid
                rgba(0,225,255,.22);

            background:

                radial-gradient(
                    ellipse,
                    rgba(0,225,255,.12),
                    transparent 67%
                );

            box-shadow:

                0 0 22px
                rgba(0,225,255,.18),

                inset 0 0 24px
                rgba(0,225,255,.1);

            animation:
                v5Floor
                2.7s ease-in-out
                infinite alternate;
        }


        @keyframes v5Floor {

            from {

                transform:
                    translateX(-50%)
                    scaleX(.82);

                opacity:
                    .34;
            }

            to {

                transform:
                    translateX(-50%)
                    scaleX(1.08);

                opacity:
                    .78;
            }
        }


        /* ====================================================
           SCANNER
        ==================================================== */

        .v5-scan {

            position:
                absolute;

            left:
                15%;

            right:
                20%;

            top:
                -5%;

            height:
                90px;

            background:

                linear-gradient(
                    180deg,
                    transparent,
                    rgba(0,245,255,.045),
                    transparent
                );

            animation:
                v5Scan
                7s linear infinite;

            z-index:
                3;
        }


        @keyframes v5Scan {

            from {

                top:
                    -8%;
            }

            to {

                top:
                    108%;
            }
        }


        /* ====================================================
           CIRCUIT LINES
        ==================================================== */

        .v5-circuit {

            position:
                absolute;

            height:
                1px;

            transform-origin:
                left center;

            background:

                linear-gradient(
                    90deg,
                    rgba(0,245,255,.45),
                    transparent
                );

            opacity:
                .22;

            box-shadow:
                0 0 8px
                rgba(0,225,255,.2);
        }


        .v5-circuit::before,
        .v5-circuit::after {

            content: "";

            position:
                absolute;

            width:
                5px;

            height:
                5px;

            top:
                -2px;

            border-radius:
                50%;

            background:
                #00eaff;

            box-shadow:
                0 0 10px
                #00eaff;
        }


        .v5-circuit::before {

            left:
                0;
        }


        .v5-circuit::after {

            right:
                0;
        }


        .c1 {

            left:
                18%;

            top:
                23%;

            width:
                18%;

            transform:
                rotate(16deg);
        }


        .c2 {

            left:
                56%;

            top:
                21%;

            width:
                18%;

            transform:
                rotate(-18deg);

            background:

                linear-gradient(
                    90deg,
                    rgba(255,65,30,.36),
                    transparent
                );
        }


        .c3 {

            left:
                20%;

            top:
                76%;

            width:
                20%;

            transform:
                rotate(-13deg);
        }


        .c4 {

            left:
                58%;

            top:
                74%;

            width:
                16%;

            transform:
                rotate(14deg);

            background:

                linear-gradient(
                    90deg,
                    rgba(160,80,255,.35),
                    transparent
                );
        }


        /* ====================================================
           EDGE ENERGY LINES
        ==================================================== */

        .v5-edge-line {

            position:
                absolute;

            left:
                0;

            right:
                0;

            height:
                1px;

            z-index:
                4;

            opacity:
                .42;

            background:

                linear-gradient(
                    90deg,
                    transparent,
                    #00eaff 18%,
                    transparent 48%,
                    #ff3b26 72%,
                    transparent
                );

            animation:
                v5EdgeFlow
                3.4s linear infinite;
        }


        .v5-edge-line.top {

            top:
                8.8%;
        }


        .v5-edge-line.bottom {

            bottom:
                4%;

            animation-direction:
                reverse;
        }


        @keyframes v5EdgeFlow {

            0% {

                filter:
                    brightness(.65);

                transform:
                    scaleX(.85);
            }

            50% {

                filter:
                    brightness(1.8);

                transform:
                    scaleX(1.06);
            }

            100% {

                filter:
                    brightness(.65);

                transform:
                    scaleX(.85);
            }
        }


        /* ====================================================
           JARVIS STATES
        ==================================================== */

        body.jarvis-listening
        #edge-v5-bg
        .v5-ring,

        body.jarvis-processing
        #edge-v5-bg
        .v5-ring,

        body.jutsu-core-active
        #edge-v5-bg
        .v5-ring {

            filter:

                brightness(1.5)

                drop-shadow(
                    0 0 16px
                    rgba(0,235,255,.45)
                );
        }


        body.jarvis-processing
        #edge-v5-bg
        .r1 {

            animation-duration:
                2.4s;
        }


        body.jarvis-processing
        #edge-v5-bg
        .r2 {

            animation-duration:
                3.2s;
        }


        body.jarvis-processing
        #edge-v5-bg
        .r3 {

            animation-duration:
                4s;
        }


        body.jarvis-success
        #edge-v5-bg {

            filter:
                hue-rotate(18deg)
                brightness(1.08);
        }


        body.jutsu-core-active
        #edge-v5-bg {

            animation:
                v5JutsuBoost
                .32s ease-in-out
                infinite alternate;
        }


        body.jutsu-core-active
        #edge-v5-bg
        .v5-jutsu-node {

            opacity:
                1;

            filter:
                brightness(1.7);
        }


        @keyframes v5JutsuBoost {

            from {

                filter:
                    brightness(1.12)
                    contrast(1.04);
            }

            to {

                filter:
                    brightness(1.5)
                    contrast(1.12);
            }
        }


        /* ====================================================
           RESPONSIVE
        ==================================================== */

        @media(max-width:1200px) {

            .v5-reactor-field {

                width:
                    820px;

                left:
                    48%;
            }


            .v5-jutsu-node {

                width:
                    76px;

                height:
                    76px;

                margin:
                    -38px 0 0 -38px;
            }


            .v5-jutsu-node small {

                font-size:
                    7px;
            }
        }


        @media(max-width:900px) {

            .v5-jutsu-node,
            .v5-circuit {

                display:
                    none;
            }


            .v5-reactor-field {

                width:
                    680px;

                left:
                    50%;

                opacity:
                    .62;
            }
        }

    `;

    document.head.appendChild(style);


    /* ========================================================
       PARTICLE CANVAS
    ======================================================== */

    const canvas =
        document.getElementById(
            "edge-v5-canvas"
        );


    const ctx =
        canvas.getContext("2d");


    let w = 0;

    let h = 0;


    let dpr =
        Math.min(
            window.devicePixelRatio || 1,
            1.5
        );


    function resize() {

        w =
            window.innerWidth;

        h =
            window.innerHeight;


        canvas.width =
            Math.floor(
                w * dpr
            );


        canvas.height =
            Math.floor(
                h * dpr
            );


        canvas.style.width =
            w + "px";


        canvas.style.height =
            h + "px";


        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
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
        Array.from(
            {
                length: 120
            },

            () => ({

                x:
                    Math.random() * w,

                y:
                    Math.random() * h,

                vx:
                    (Math.random() - .5)
                    * .18,

                vy:
                    (Math.random() - .5)
                    * .13,

                r:
                    Math.random()
                    * 1.4
                    + .25,

                a:
                    Math.random()
                    * .55
                    + .08,

                type:
                    Math.random() < .16
                        ? "red"
                        : "cyan",

                phase:
                    Math.random()
                    * Math.PI
                    * 2
            })
        );


    const sparks = [];


    /* ========================================================
       CREATE ENERGY SPARK
    ======================================================== */

    function spawnSpark() {

        const cx =
            w * .47;


        const cy =
            h * .47;


        const angle =
            Math.random()
            * Math.PI
            * 2;


        const radius =
            120
            + Math.random()
            * Math.min(
                w,
                h
            )
            * .24;


        sparks.push({

            x:
                cx
                + Math.cos(angle)
                * radius,

            y:
                cy
                + Math.sin(angle)
                * radius,

            vx:
                Math.cos(angle)
                * (
                    .2
                    + Math.random()
                    * .7
                ),

            vy:
                Math.sin(angle)
                * (
                    .2
                    + Math.random()
                    * .7
                ),

            life:
                1,

            red:
                Math.random()
                < .28
        });
    }


    /* ========================================================
       DRAW PARTICLES
    ======================================================== */

    function drawParticles() {

        for (
            const p
            of particles
        ) {

            p.x +=
                p.vx;


            p.y +=
                p.vy;


            p.phase +=
                .012;


            if (
                p.x < -20
            ) {

                p.x =
                    w + 20;
            }


            if (
                p.x > w + 20
            ) {

                p.x =
                    -20;
            }


            if (
                p.y < -20
            ) {

                p.y =
                    h + 20;
            }


            if (
                p.y > h + 20
            ) {

                p.y =
                    -20;
            }


            const alpha =

                p.a
                * (
                    .72
                    + Math.sin(
                        p.phase
                    )
                    * .28
                );


            ctx.beginPath();


            ctx.arc(
                p.x,
                p.y,
                p.r,
                0,
                Math.PI * 2
            );


            if (
                p.type ===
                "red"
            ) {

                ctx.fillStyle =
                    `rgba(
                        255,
                        70,
                        36,
                        ${alpha}
                    )`;

            } else {

                ctx.fillStyle =
                    `rgba(
                        0,
                        235,
                        255,
                        ${alpha}
                    )`;
            }


            ctx.fill();
        }
    }


    /* ========================================================
       NEURAL CONNECTIONS
    ======================================================== */

    function drawConnections() {

        const max =
            95;


        for (
            let i = 0;
            i < particles.length;
            i += 2
        ) {

            for (
                let j = i + 1;
                j < particles.length;
                j += 3
            ) {

                const a =
                    particles[i];


                const b =
                    particles[j];


                const dx =
                    a.x - b.x;


                const dy =
                    a.y - b.y;


                const dist =
                    Math.sqrt(
                        dx * dx
                        + dy * dy
                    );


                if (
                    dist < max
                ) {

                    const alpha =

                        (
                            1
                            - dist / max
                        )
                        * .045;


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
                            210,
                            255,
                            ${alpha}
                        )`;


                    ctx.lineWidth =
                        .5;


                    ctx.stroke();
                }
            }
        }
    }


    /* ========================================================
       ENERGY ARCS
    ======================================================== */

    function drawEnergyArc(
        time
    ) {

        const cx =
            w * .47;


        const cy =
            h * .47;


        const base =
            Math.min(
                w,
                h
            )
            * .27;


        const pulse =
            Math.sin(
                time * .0015
            )
            * 12;


        ctx.save();


        ctx.translate(
            cx,
            cy
        );


        ctx.rotate(
            time * .00008
        );


        for (
            let i = 0;
            i < 4;
            i++
        ) {

            const r =
                base
                + i * 34
                + pulse;


            ctx.beginPath();


            ctx.arc(
                0,
                0,
                r,
                .2 + i * .55,
                1.15 + i * .55
            );


            if (
                i % 2
            ) {

                ctx.strokeStyle =
                    "rgba(255,62,35,.18)";

            } else {

                ctx.strokeStyle =
                    "rgba(0,235,255,.20)";
            }


            ctx.lineWidth =
                i === 0
                    ? 1.8
                    : .8;


            ctx.stroke();
        }


        ctx.restore();
    }


    /* ========================================================
       SPARKS
    ======================================================== */

    function drawSparks() {

        let chance =
            .05;


        if (
            document.body.classList.contains(
                "jarvis-listening"
            )
        ) {

            chance =
                .13;
        }


        if (
            document.body.classList.contains(
                "jarvis-processing"
            )
        ) {

            chance =
                .22;
        }


        if (
            document.body.classList.contains(
                "jutsu-core-active"
            )
        ) {

            chance =
                .45;
        }


        if (
            Math.random()
            < chance
        ) {

            spawnSpark();
        }


        for (
            let i =
                sparks.length - 1;

            i >= 0;

            i--
        ) {

            const s =
                sparks[i];


            s.x +=
                s.vx;


            s.y +=
                s.vy;


            s.life -=
                .018;


            ctx.beginPath();


            ctx.arc(
                s.x,
                s.y,
                1.2,
                0,
                Math.PI * 2
            );


            if (
                s.red
            ) {

                ctx.fillStyle =
                    `rgba(
                        255,
                        70,
                        35,
                        ${s.life}
                    )`;


                ctx.shadowColor =
                    "#ff4623";

            } else {

                ctx.fillStyle =
                    `rgba(
                        0,
                        245,
                        255,
                        ${s.life}
                    )`;


                ctx.shadowColor =
                    "#00f5ff";
            }


            ctx.shadowBlur =
                12;


            ctx.fill();


            ctx.shadowBlur =
                0;


            if (
                s.life <= 0
            ) {

                sparks.splice(
                    i,
                    1
                );
            }
        }
    }


    /* ========================================================
       MAIN ANIMATION
    ======================================================== */

    let last =
        0;


    function animate(
        time
    ) {

        requestAnimationFrame(
            animate
        );


        // Around 30 FPS to keep laptop load reasonable
        if (
            time - last
            < 32
        ) {

            return;
        }


        last =
            time;


        ctx.clearRect(
            0,
            0,
            w,
            h
        );


        drawConnections();

        drawParticles();

        drawEnergyArc(
            time
        );

        drawSparks();
    }


    requestAnimationFrame(
        animate
    );


    console.log(
        "EDGE AI OS 2077: JARVIS × NINJUTSU BACKGROUND V5 ONLINE"
    );

})();