/* ============================================================
   EDGE AI OS 2077
   CINEMATIC HUD V3
   Iron-Man-inspired holographic command environment
   Visual layer only
============================================================ */

(() => {

    "use strict";

    console.log(
        "EDGE AI OS 2077: Cinematic HUD V3 loading..."
    );


    /* ========================================================
       MAIN V3 LAYER
    ======================================================== */

    const layer =
        document.createElement("div");

    layer.id =
        "cinematic-hud-v3";


    layer.innerHTML = `

        <div class="v3-vignette"></div>

        <div class="v3-top-glow"></div>

        <div class="v3-left-beam"></div>

        <div class="v3-right-beam"></div>


        <div class="v3-orbit orbit-a"></div>

        <div class="v3-orbit orbit-b"></div>

        <div class="v3-orbit orbit-c"></div>


        <div class="v3-holo-panel v3-panel-left">

            <div class="v3-panel-title">
                NEURAL LINK
            </div>

            <div class="v3-data-line">
                CORE SYNCHRONIZED
            </div>

            <div class="v3-data-line">
                VOICE MATRIX ONLINE
            </div>

            <div class="v3-data-line">
                WINDOWS CONTROL
            </div>

            <div class="v3-meter">
                <span></span>
            </div>

        </div>


        <div class="v3-holo-panel v3-panel-upper">

            <div class="v3-panel-title">
                EDGE INTELLIGENCE
            </div>

            <div class="v3-mini-grid"></div>

            <div class="v3-small-text">
                REALTIME // ACTIVE
            </div>

        </div>


        <div class="v3-holo-panel v3-panel-lower">

            <div class="v3-panel-title">
                SYSTEM MATRIX
            </div>

            <div class="v3-numbers">
                2077 // AI // CORE
            </div>

            <div class="v3-wave">

                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>

            </div>

        </div>


        <div class="v3-crosshair"></div>


        <div class="v3-scan-line"></div>


        <div class="v3-corner corner-tl"></div>

        <div class="v3-corner corner-tr"></div>

        <div class="v3-corner corner-bl"></div>

        <div class="v3-corner corner-br"></div>


        <div id="v3-reactor-state">

            <span class="v3-state-small">
                EDGE CORE
            </span>

            <strong>
                STANDBY
            </strong>

        </div>


        <canvas id="v3-particle-canvas"></canvas>

    `;


    document.body.prepend(
        layer
    );


    /* ========================================================
       STYLES
    ======================================================== */

    const style =
        document.createElement("style");


    style.id =
        "cinematic-hud-v3-style";


    style.textContent = `

        #cinematic-hud-v3 {

            position: fixed;

            inset: 0;

            overflow: hidden;

            pointer-events: none;

            z-index: 1;

            font-family:
                Orbitron,
                Arial,
                sans-serif;

        }


        #dashboard {

            position: relative;

            z-index: 10;

        }


        /* ====================================================
           DARK CINEMATIC DEPTH
        ==================================================== */

        .v3-vignette {

            position: absolute;

            inset: 0;

            background:

                radial-gradient(
                    circle at 50% 45%,
                    transparent 15%,
                    rgba(0,0,0,0.08) 45%,
                    rgba(0,0,0,0.48) 100%
                );

        }


        .v3-top-glow {

            position: absolute;

            top: -180px;

            left: 50%;

            width: 900px;

            height: 500px;

            transform:
                translateX(-50%);

            background:

                radial-gradient(
                    ellipse,
                    rgba(0,255,255,0.13),
                    rgba(0,120,255,0.04) 42%,
                    transparent 72%
                );

            filter:
                blur(25px);

            animation:
                topGlowPulse
                5s ease-in-out
                infinite alternate;

        }


        @keyframes topGlowPulse {

            from {

                opacity: 0.35;

                transform:
                    translateX(-50%)
                    scale(0.92);

            }

            to {

                opacity: 0.85;

                transform:
                    translateX(-50%)
                    scale(1.12);

            }

        }


        /* ====================================================
           SIDE ENERGY BEAMS
        ==================================================== */

        .v3-left-beam,
        .v3-right-beam {

            position: absolute;

            top: 12%;

            width: 2px;

            height: 72%;

            background:

                linear-gradient(
                    transparent,
                    rgba(0,255,255,0.38),
                    transparent
                );

            box-shadow:
                0 0 18px
                rgba(0,255,255,0.55);

            opacity: 0.35;

        }


        .v3-left-beam {

            left: 17.5%;

        }


        .v3-right-beam {

            right: 22%;

        }


        /* ====================================================
           HUGE BACKGROUND ORBITS
        ==================================================== */

        .v3-orbit {

            position: absolute;

            left: 47%;

            top: 49%;

            transform:
                translate(-50%, -50%);

            border-radius: 50%;

        }


        .orbit-a {

            width: 760px;

            height: 760px;

            border:

                1px solid
                rgba(0,230,255,0.08);

            animation:
                v3Rotate
                30s linear infinite;

        }


        .orbit-a::before {

            content: "";

            position: absolute;

            inset: -5px;

            border-radius: 50%;

            border-top:

                3px solid
                rgba(0,255,255,0.30);

            border-right:

                3px solid
                transparent;

            border-left:

                3px solid
                transparent;

        }


        .orbit-b {

            width: 660px;

            height: 660px;

            border:

                1px dashed
                rgba(0,255,255,0.09);

            animation:
                v3Reverse
                23s linear infinite;

        }


        .orbit-c {

            width: 840px;

            height: 420px;

            border:

                1px solid
                rgba(0,180,255,0.08);

            transform:
                translate(-50%, -50%)
                rotate(-16deg);

            animation:
                orbitFloat
                7s ease-in-out
                infinite alternate;

        }


        @keyframes v3Rotate {

            from {

                transform:
                    translate(-50%, -50%)
                    rotate(0deg);

            }

            to {

                transform:
                    translate(-50%, -50%)
                    rotate(360deg);

            }

        }


        @keyframes v3Reverse {

            from {

                transform:
                    translate(-50%, -50%)
                    rotate(360deg);

            }

            to {

                transform:
                    translate(-50%, -50%)
                    rotate(0deg);

            }

        }


        @keyframes orbitFloat {

            from {

                transform:
                    translate(-50%, -50%)
                    rotate(-16deg)
                    scale(0.96);

            }

            to {

                transform:
                    translate(-50%, -50%)
                    rotate(-10deg)
                    scale(1.04);

            }

        }


        /* ====================================================
           HOLOGRAPHIC PANELS
        ==================================================== */

        .v3-holo-panel {

            position: absolute;

            padding: 13px 16px;

            border:

                1px solid
                rgba(0,235,255,0.18);

            border-radius: 10px;

            background:

                linear-gradient(
                    135deg,
                    rgba(2,20,38,0.38),
                    rgba(0,70,100,0.08)
                );

            backdrop-filter:
                blur(8px);

            -webkit-backdrop-filter:
                blur(8px);

            box-shadow:

                inset 0 0 18px
                rgba(0,255,255,0.025),

                0 0 28px
                rgba(0,180,255,0.04);

            color: #00eaff;

            opacity: 0.55;

        }


        .v3-panel-title {

            font-size: 8px;

            letter-spacing: 3px;

            margin-bottom: 10px;

            color:
                rgba(0,255,255,0.92);

        }


        .v3-data-line {

            font-size: 6px;

            letter-spacing: 1.6px;

            margin: 6px 0;

            color:
                rgba(200,250,255,0.55);

        }


        .v3-panel-left {

            left: 20%;

            top: 32%;

            width: 185px;

            transform:
                perspective(500px)
                rotateY(12deg);

            animation:
                holoFloatA
                6s ease-in-out
                infinite alternate;

        }


        .v3-panel-upper {

            right: 25%;

            top: 24%;

            width: 170px;

            animation:
                holoFloatB
                7s ease-in-out
                infinite alternate;

        }


        .v3-panel-lower {

            left: 23%;

            bottom: 16%;

            width: 205px;

            animation:
                holoFloatC
                5s ease-in-out
                infinite alternate;

        }


        @keyframes holoFloatA {

            from {

                transform:
                    perspective(500px)
                    rotateY(12deg)
                    translateY(-4px);

            }

            to {

                transform:
                    perspective(500px)
                    rotateY(6deg)
                    translateY(10px);

            }

        }


        @keyframes holoFloatB {

            from {

                transform:
                    translateY(-7px);

            }

            to {

                transform:
                    translateY(8px);

            }

        }


        @keyframes holoFloatC {

            from {

                transform:
                    translateY(4px);

            }

            to {

                transform:
                    translateY(-10px);

            }

        }


        /* ====================================================
           PANEL DETAILS
        ==================================================== */

        .v3-meter {

            margin-top: 9px;

            height: 3px;

            background:
                rgba(0,255,255,0.08);

            overflow: hidden;

        }


        .v3-meter span {

            display: block;

            width: 70%;

            height: 100%;

            background: #00ffff;

            box-shadow:
                0 0 8px #00ffff;

            animation:
                meterPulse
                2s ease-in-out
                infinite alternate;

        }


        @keyframes meterPulse {

            from {

                width: 45%;

            }

            to {

                width: 92%;

            }

        }


        .v3-mini-grid {

            height: 45px;

            background-image:

                linear-gradient(
                    rgba(0,255,255,0.10) 1px,
                    transparent 1px
                ),

                linear-gradient(
                    90deg,
                    rgba(0,255,255,0.10) 1px,
                    transparent 1px
                );

            background-size:
                12px 12px;

            opacity: 0.45;

        }


        .v3-small-text {

            margin-top: 7px;

            font-size: 6px;

            letter-spacing: 2px;

            color:
                rgba(200,255,255,0.6);

        }


        .v3-numbers {

            font-size: 7px;

            letter-spacing: 2.5px;

            color:
                rgba(200,255,255,0.62);

        }


        .v3-wave {

            display: flex;

            align-items: end;

            gap: 3px;

            height: 30px;

            margin-top: 8px;

        }


        .v3-wave span {

            width: 3px;

            height: 10px;

            background:
                rgba(0,255,255,0.75);

            box-shadow:
                0 0 5px #00ffff;

            animation:
                wavePulse
                1s ease-in-out
                infinite alternate;

        }


        .v3-wave span:nth-child(2) {

            animation-delay: 0.1s;

        }


        .v3-wave span:nth-child(3) {

            animation-delay: 0.2s;

        }


        .v3-wave span:nth-child(4) {

            animation-delay: 0.3s;

        }


        .v3-wave span:nth-child(5) {

            animation-delay: 0.4s;

        }


        .v3-wave span:nth-child(6) {

            animation-delay: 0.5s;

        }


        .v3-wave span:nth-child(7) {

            animation-delay: 0.6s;

        }


        @keyframes wavePulse {

            from {

                height: 5px;

            }

            to {

                height: 28px;

            }

        }


        /* ====================================================
           CROSSHAIR
        ==================================================== */

        .v3-crosshair {

            position: absolute;

            left: 47%;

            top: 49%;

            width: 900px;

            height: 900px;

            transform:
                translate(-50%, -50%);

            background:

                linear-gradient(
                    90deg,
                    transparent 49.8%,
                    rgba(0,255,255,0.045) 50%,
                    transparent 50.2%
                ),

                linear-gradient(
                    transparent 49.8%,
                    rgba(0,255,255,0.045) 50%,
                    transparent 50.2%
                );

        }


        /* ====================================================
           SCAN LINE
        ==================================================== */

        .v3-scan-line {

            position: absolute;

            left: 18%;

            right: 22%;

            top: 10%;

            height: 2px;

            background:

                linear-gradient(
                    90deg,
                    transparent,
                    rgba(0,255,255,0.35),
                    transparent
                );

            box-shadow:
                0 0 15px
                rgba(0,255,255,0.35);

            opacity: 0.4;

            animation:
                scanMove
                7s linear
                infinite;

        }


        @keyframes scanMove {

            from {

                top: 16%;

                opacity: 0;

            }

            15% {

                opacity: 0.4;

            }

            85% {

                opacity: 0.4;

            }

            to {

                top: 88%;

                opacity: 0;

            }

        }


        /* ====================================================
           HUD CORNERS
        ==================================================== */

        .v3-corner {

            position: absolute;

            width: 75px;

            height: 75px;

            border-color:
                rgba(0,255,255,0.16);

            border-style: solid;

        }


        .corner-tl {

            left: 19%;

            top: 18%;

            border-width:
                1px 0 0 1px;

        }


        .corner-tr {

            right: 23%;

            top: 18%;

            border-width:
                1px 1px 0 0;

        }


        .corner-bl {

            left: 19%;

            bottom: 12%;

            border-width:
                0 0 1px 1px;

        }


        .corner-br {

            right: 23%;

            bottom: 12%;

            border-width:
                0 1px 1px 0;

        }


        /* ====================================================
           REACTOR STATUS
        ==================================================== */

        #v3-reactor-state {

            position: absolute;

            left: 47%;

            top: 73%;

            transform:
                translateX(-50%);

            text-align: center;

            color: #00ffff;

            opacity: 0.72;

            text-shadow:
                0 0 10px #00ffff;

        }


        .v3-state-small {

            display: block;

            font-size: 6px;

            letter-spacing: 4px;

            margin-bottom: 5px;

        }


        #v3-reactor-state strong {

            display: block;

            font-size: 10px;

            letter-spacing: 5px;

        }


        /* ====================================================
           JARVIS STATES
        ==================================================== */

        body.jarvis-listening
        #cinematic-hud-v3 {

            filter:
                brightness(1.35);

        }


        body.jarvis-listening
        .v3-holo-panel {

            opacity: 0.9;

            border-color:
                rgba(0,255,255,0.48);

        }


        body.jarvis-listening
        .v3-orbit {

            filter:
                drop-shadow(
                    0 0 10px
                    #00ffff
                );

        }


        body.jarvis-processing
        .orbit-a {

            animation-duration:
                5s !important;

        }


        body.jarvis-processing
        .orbit-b {

            animation-duration:
                4s !important;

        }


        body.jarvis-processing
        .v3-scan-line {

            animation-duration:
                1.8s !important;

            opacity:
                0.8;

        }


        body.jarvis-success
        .v3-holo-panel {

            border-color:
                rgba(0,255,136,0.48);

            color: #00ff88;

        }


        body.jarvis-success
        #v3-reactor-state {

            color: #00ff88;

            text-shadow:
                0 0 15px #00ff88;

        }


        /* ====================================================
           JUTSU MODE
        ==================================================== */

        body.jutsu-stage-1
        #cinematic-hud-v3 {

            filter:
                brightness(1.25);

        }


        body.jutsu-stage-2
        #cinematic-hud-v3 {

            filter:
                brightness(1.65)
                contrast(1.15);

        }


        body.jutsu-stage-3
        #cinematic-hud-v3 {

            animation:
                jutsuV3Pulse
                0.22s ease-in-out
                infinite alternate;

        }


        @keyframes jutsuV3Pulse {

            from {

                filter:
                    brightness(1.6)
                    drop-shadow(
                        0 0 20px
                        #00ffff
                    );

            }

            to {

                filter:
                    brightness(2.5)
                    drop-shadow(
                        0 0 60px
                        #00ffff
                    );

            }

        }


        /* ====================================================
           PARTICLE CANVAS
        ==================================================== */

        #v3-particle-canvas {

            position: absolute !important;

            inset: 0 !important;

            width: 100% !important;

            height: 100% !important;

            pointer-events: none !important;

        }


        /* ====================================================
           KEEP RIGHT SYSTEM PANEL CLEAR
        ==================================================== */

        .status-panel {

            position: relative;

            z-index: 50 !important;

        }


        #spider-vision {

            position: relative !important;

            z-index: 60 !important;

        }


        /* ====================================================
           RESPONSIVE
        ==================================================== */

        @media(max-width:1200px) {

            .v3-panel-left,
            .v3-panel-upper,
            .v3-panel-lower {

                opacity: 0.30;

                transform:
                    scale(0.85);

            }


            .orbit-a {

                width: 620px;

                height: 620px;

            }


            .orbit-b {

                width: 540px;

                height: 540px;

            }

        }


        @media(max-width:900px) {

            .v3-holo-panel {

                display: none;

            }


            .v3-corner {

                display: none;

            }


            .v3-right-beam,
            .v3-left-beam {

                display: none;

            }

        }

    `;


    document.head.appendChild(
        style
    );


    /* ========================================================
       PARTICLES
    ======================================================== */

    const canvas =
        document.getElementById(
            "v3-particle-canvas"
        );


    const ctx =
        canvas.getContext(
            "2d"
        );


    let width = 0;

    let height = 0;


    const particles =
        [];


    const sparks =
        [];


    function resize() {

        width =
            window.innerWidth;

        height =
            window.innerHeight;


        canvas.width =
            width;

        canvas.height =
            height;

    }


    resize();


    window.addEventListener(
        "resize",
        resize
    );


    for (
        let i = 0;
        i < 85;
        i++
    ) {

        particles.push({

            x:
                Math.random() *
                window.innerWidth,

            y:
                Math.random() *
                window.innerHeight,

            vx:
                (
                    Math.random() -
                    0.5
                ) *
                0.15,

            vy:
                (
                    Math.random() -
                    0.5
                ) *
                0.12,

            size:
                Math.random() *
                1.6 +
                0.2,

            alpha:
                Math.random() *
                0.55 +
                0.10,

            phase:
                Math.random() *
                Math.PI *
                2

        });

    }


    /* ========================================================
       ENERGY SPARKS
    ======================================================== */

    function createSpark() {

        const cx =
            width *
            0.47;


        const cy =
            height *
            0.49;


        const angle =
            Math.random() *
            Math.PI *
            2;


        const radius =
            90 +
            Math.random() *
            260;


        sparks.push({

            x:
                cx +
                Math.cos(angle) *
                radius,

            y:
                cy +
                Math.sin(angle) *
                radius,

            vx:
                Math.cos(angle) *
                (
                    0.3 +
                    Math.random() *
                    0.8
                ),

            vy:
                Math.sin(angle) *
                (
                    0.3 +
                    Math.random() *
                    0.8
                ),

            life: 1,

            size:
                Math.random() *
                1.4 +
                0.4

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

            p.x += p.vx;

            p.y += p.vy;

            p.phase +=
                0.01;


            if (
                p.x < 0 ||
                p.x > width
            ) {

                p.vx *= -1;

            }


            if (
                p.y < 0 ||
                p.y > height
            ) {

                p.vy *= -1;

            }


            const alpha =
                p.alpha *
                (
                    0.70 +
                    Math.sin(
                        p.phase
                    ) *
                    0.30
                );


            ctx.beginPath();


            ctx.arc(
                p.x,
                p.y,
                p.size,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `rgba(0,235,255,${alpha})`;


            ctx.fill();

        }

    }


    /* ========================================================
       DRAW NETWORK
    ======================================================== */

    function drawNetwork() {

        const max =
            105;


        for (
            let i = 0;
            i < particles.length;
            i++
        ) {

            for (
                let j =
                    i + 1;
                j < particles.length;
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


                const dist =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                if (
                    dist < max
                ) {

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
                            220,
                            255,
                            ${
                                (
                                    1 -
                                    dist /
                                    max
                                ) *
                                0.05
                            }
                        )`;


                    ctx.lineWidth =
                        0.6;


                    ctx.stroke();

                }

            }

        }

    }


    /* ========================================================
       DRAW SPARKS
    ======================================================== */

    function drawSparks() {

        let chance =
            0.04;


        if (
            document.body
                .classList
                .contains(
                    "jarvis-listening"
                )
        ) {

            chance =
                0.12;

        }


        if (
            document.body
                .classList
                .contains(
                    "jarvis-processing"
                )
        ) {

            chance =
                0.22;

        }


        if (
            document.body
                .classList
                .contains(
                    "jutsu-stage-3"
                )
        ) {

            chance =
                0.48;

        }


        if (
            Math.random() <
            chance
        ) {

            createSpark();

        }


        for (
            let i =
                sparks.length - 1;
            i >= 0;
            i--
        ) {

            const s =
                sparks[i];


            s.x += s.vx;

            s.y += s.vy;

            s.life -=
                0.018;


            ctx.beginPath();


            ctx.arc(
                s.x,
                s.y,
                s.size,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `rgba(
                    0,
                    255,
                    255,
                    ${s.life}
                )`;


            ctx.shadowBlur =
                9;


            ctx.shadowColor =
                "#00ffff";


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
       ANIMATION LOOP
    ======================================================== */

    let lastFrame = 0;


    function animate(
        time
    ) {

        requestAnimationFrame(
            animate
        );


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


        drawParticles();


        drawNetwork();


        drawSparks();

    }


    requestAnimationFrame(
        animate
    );


    /* ========================================================
       REACT TO EXISTING REACTOR INTELLIGENCE
    ======================================================== */

    const state =
        document.querySelector(
            "#v3-reactor-state strong"
        );


    function updateState() {

        if (!state) {
            return;
        }


        if (
            document.body
                .classList
                .contains(
                    "jutsu-stage-3"
                )
        ) {

            state.textContent =
                "JUTSU MAXIMUM";

            return;

        }


        if (
            document.body
                .classList
                .contains(
                    "jutsu-stage-2"
                )
        ) {

            state.textContent =
                "JUTSU 66%";

            return;

        }


        if (
            document.body
                .classList
                .contains(
                    "jutsu-stage-1"
                )
        ) {

            state.textContent =
                "JUTSU 33%";

            return;

        }


        if (
            document.body
                .classList
                .contains(
                    "jarvis-processing"
                )
        ) {

            state.textContent =
                "PROCESSING";

            return;

        }


        if (
            document.body
                .classList
                .contains(
                    "jarvis-success"
                )
        ) {

            state.textContent =
                "COMMAND VERIFIED";

            return;

        }


        if (
            document.body
                .classList
                .contains(
                    "jarvis-listening"
                )
        ) {

            state.textContent =
                "JARVIS LISTENING";

            return;

        }


        state.textContent =
            "SYSTEM ONLINE";

    }


    const observer =
        new MutationObserver(
            updateState
        );


    observer.observe(
        document.body,
        {
            attributes: true,
            attributeFilter: [
                "class"
            ]
        }
    );


    updateState();


    console.log(
        "EDGE AI OS 2077: Cinematic HUD V3 ONLINE"
    );

})();