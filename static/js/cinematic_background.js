/* ============================================================
   EDGE AI OS 2077
   CINEMATIC BACKGROUND V2
   Iron-Man-inspired holographic depth + Vision-style glass
   Visual only
============================================================ */

(() => {

    "use strict";

    console.log("EDGE AI OS 2077: Cinematic Background loading...");

    const canvas = document.createElement("canvas");
    canvas.id = "cinematic-bg";

    document.body.prepend(canvas);

    const ctx = canvas.getContext("2d");

    const style = document.createElement("style");

    style.textContent = `

        #cinematic-bg {
            position: fixed !important;
            inset: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 0 !important;
            pointer-events: none !important;
        }

        #dashboard {
            position: relative;
            z-index: 2;
        }

        body {
            background:
                radial-gradient(
                    circle at 50% 42%,
                    rgba(0, 180, 255, 0.10),
                    transparent 34%
                ),
                radial-gradient(
                    circle at 12% 18%,
                    rgba(0, 255, 255, 0.045),
                    transparent 28%
                ),
                radial-gradient(
                    circle at 88% 20%,
                    rgba(0, 120, 255, 0.05),
                    transparent 30%
                ),
                linear-gradient(
                    180deg,
                    #020611 0%,
                    #030b18 48%,
                    #01040a 100%
                ) !important;
        }

        .card,
        aside,
        #spider-vision {
            backdrop-filter: blur(22px) saturate(120%);
            -webkit-backdrop-filter: blur(22px) saturate(120%);
        }

    `;

    document.head.appendChild(style);

    let width = 0;
    let height = 0;

    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);

    function resize() {

        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = Math.floor(width * DPR);
        canvas.height = Math.floor(height * DPR);

        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        ctx.setTransform(
            DPR,
            0,
            0,
            DPR,
            0,
            0
        );
    }

    resize();

    window.addEventListener("resize", resize);


    /* ========================================================
       PARTICLES
    ======================================================== */

    const particles = [];

    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {

        particles.push({

            x: Math.random() * width,
            y: Math.random() * height,

            vx: (Math.random() - 0.5) * 0.12,
            vy: (Math.random() - 0.5) * 0.12,

            size: Math.random() * 1.7 + 0.3,
            alpha: Math.random() * 0.55 + 0.12,

            phase: Math.random() * Math.PI * 2

        });
    }


    /* ========================================================
       FLOATING HUD ORBITS
    ======================================================== */

    const orbiters = [];

    for (let i = 0; i < 18; i++) {

        orbiters.push({

            angle:
                Math.random() *
                Math.PI *
                2,

            radius:
                160 +
                Math.random() *
                300,

            speed:
                0.0008 +
                Math.random() *
                0.0016,

            size:
                1 +
                Math.random() *
                2

        });
    }


    /* ========================================================
       PARALLAX
    ======================================================== */

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener(
        "mousemove",
        event => {

            mouseX =
                (
                    event.clientX /
                    window.innerWidth -
                    0.5
                );

            mouseY =
                (
                    event.clientY /
                    window.innerHeight -
                    0.5
                );

        }
    );


    /* ========================================================
       GRID
    ======================================================== */

    let gridShift = 0;

    function drawGrid() {

        gridShift += 0.06;

        const spacing = 72;

        ctx.lineWidth = 0.6;

        ctx.strokeStyle =
            "rgba(0,220,255,0.025)";


        for (
            let x =
                -spacing;
            x <
                width +
                spacing;
            x += spacing
        ) {

            ctx.beginPath();

            ctx.moveTo(
                x +
                mouseX * 12,
                0
            );

            ctx.lineTo(
                x +
                mouseX * 12,
                height
            );

            ctx.stroke();
        }


        for (
            let y =
                -spacing;
            y <
                height +
                spacing;
            y += spacing
        ) {

            ctx.beginPath();

            ctx.moveTo(
                0,
                y +
                gridShift +
                mouseY * 10
            );

            ctx.lineTo(
                width,
                y +
                gridShift +
                mouseY * 10
            );

            ctx.stroke();
        }

        if (gridShift > spacing) {
            gridShift = 0;
        }
    }


    /* ========================================================
       PARTICLES
    ======================================================== */

    function drawParticles() {

        for (
            const p
            of particles
        ) {

            p.x += p.vx;
            p.y += p.vy;

            p.phase += 0.012;

            if (p.x < -20) p.x = width + 20;
            if (p.x > width + 20) p.x = -20;

            if (p.y < -20) p.y = height + 20;
            if (p.y > height + 20) p.y = -20;


            const alpha =
                p.alpha *
                (
                    0.75 +
                    Math.sin(
                        p.phase
                    ) *
                    0.25
                );


            ctx.beginPath();

            ctx.arc(
                p.x +
                mouseX * 18,
                p.y +
                mouseY * 14,
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
       CONNECTIONS
    ======================================================== */

    function drawConnections() {

        const maxDistance =
            110;

        for (
            let i = 0;
            i < particles.length;
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

                const d =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );

                if (
                    d <
                    maxDistance
                ) {

                    const alpha =
                        (
                            1 -
                            d /
                            maxDistance
                        ) *
                        0.07;

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
                        `rgba(0,220,255,${alpha})`;

                    ctx.stroke();
                }
            }
        }
    }


    /* ========================================================
       CENTER HALO
    ======================================================== */

    let haloPhase = 0;

    function drawHalo() {

        haloPhase += 0.008;

        const cx =
            width * 0.5 +
            mouseX * 20;

        const cy =
            height * 0.46 +
            mouseY * 14;

        const radius =
            330 +
            Math.sin(
                haloPhase
            ) *
            28;


        const gradient =
            ctx.createRadialGradient(
                cx,
                cy,
                0,
                cx,
                cy,
                radius
            );


        gradient.addColorStop(
            0,
            "rgba(0,235,255,0.075)"
        );

        gradient.addColorStop(
            0.38,
            "rgba(0,160,255,0.025)"
        );

        gradient.addColorStop(
            1,
            "rgba(0,100,255,0)"
        );


        ctx.fillStyle =
            gradient;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );
    }


    /* ========================================================
       ORBITAL HUD DOTS
    ======================================================== */

    function drawOrbiters(time) {

        const cx =
            width *
            0.5 +
            mouseX *
            30;

        const cy =
            height *
            0.46 +
            mouseY *
            20;


        for (
            const item
            of orbiters
        ) {

            item.angle +=
                item.speed *
                time *
                0.02;


            const x =
                cx +
                Math.cos(
                    item.angle
                ) *
                item.radius;


            const y =
                cy +
                Math.sin(
                    item.angle
                ) *
                item.radius *
                0.45;


            ctx.beginPath();

            ctx.arc(
                x,
                y,
                item.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "rgba(0,255,255,0.38)";

            ctx.fill();


            ctx.beginPath();

            ctx.moveTo(
                x - 18,
                y
            );

            ctx.lineTo(
                x + 18,
                y
            );

            ctx.strokeStyle =
                "rgba(0,255,255,0.07)";

            ctx.stroke();
        }
    }


    /* ========================================================
       SCANNER
    ======================================================== */

    let scanY = -100;

    function drawScanner() {

        scanY +=
            0.42;

        if (
            scanY >
            height + 100
        ) {

            scanY =
                -100;
        }


        const gradient =
            ctx.createLinearGradient(
                0,
                scanY - 60,
                0,
                scanY + 60
            );


        gradient.addColorStop(
            0,
            "rgba(0,255,255,0)"
        );

        gradient.addColorStop(
            0.5,
            "rgba(0,255,255,0.028)"
        );

        gradient.addColorStop(
            1,
            "rgba(0,255,255,0)"
        );


        ctx.fillStyle =
            gradient;


        ctx.fillRect(
            0,
            scanY - 60,
            width,
            120
        );
    }


    /* ========================================================
       ANIMATION
    ======================================================== */

    let lastFrame = 0;

    function animate(time) {

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


        drawHalo();

        drawGrid();

        drawScanner();

        drawParticles();

        drawConnections();

        drawOrbiters(
            time
        );
    }


    requestAnimationFrame(
        animate
    );


    console.log(
        "EDGE AI OS 2077: Cinematic Background ONLINE"
    );

})();