/* ============================================================
   EDGE AI OS 2077
   V5.1 JUTSU ANIMATION ENGINE
   Rasengan / Chidori / Katon / Susanoo / Amaterasu
============================================================ */

(() => {
    "use strict";

    if (window.EdgeJutsuV51Loaded) return;
    window.EdgeJutsuV51Loaded = true;

    const JUTSU = {
        RASENGAN: "rasengan",
        CHIDORI: "chidori",
        KATON: "katon",
        SUSANOO: "susanoo",
        AMATERASU: "amaterasu"
    };

    let activeJutsu = JUTSU.RASENGAN;
    let running = false;

    /* ========================================================
       CREATE VFX LAYER
    ======================================================== */

    const layer = document.createElement("div");
    layer.id = "jutsu-v51-layer";

    layer.innerHTML = `
        <canvas id="jutsu-v51-canvas"></canvas>

        <div id="jutsu-v51-label">
            <span id="jutsu-v51-name">RASENGAN</span>
            <small>CHAKRA MATRIX READY</small>
        </div>
    `;

    document.body.appendChild(layer);

    const style = document.createElement("style");

    style.textContent = `
        #jutsu-v51-layer {
            position: fixed;
            inset: 0;
            z-index: 22000;
            pointer-events: none;
            overflow: hidden;
        }

        #jutsu-v51-canvas {
            position: fixed !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            pointer-events: none !important;
            z-index: 22001 !important;
        }

        #jutsu-v51-label {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(.8);
            text-align: center;
            font-family: Orbitron, sans-serif;
            opacity: 0;
            z-index: 22002;
            transition: .25s ease;
        }

        #jutsu-v51-label.active {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }

        #jutsu-v51-name {
            display: block;
            font-size: clamp(28px, 4vw, 60px);
            letter-spacing: 8px;
            font-weight: 900;
            color: #00efff;
            text-shadow:
                0 0 12px currentColor,
                0 0 35px currentColor;
        }

        #jutsu-v51-label small {
            display: block;
            margin-top: 10px;
            font-size: 9px;
            letter-spacing: 4px;
            color: rgba(230,255,255,.75);
        }

        body.jutsu-v51-active #edge-v5-bg {
            filter: brightness(1.25) contrast(1.08);
        }

        body.jutsu-v51-active #ai-core {
            filter:
                brightness(1.7)
                drop-shadow(0 0 24px #00efff);
        }
    `;

    document.head.appendChild(style);

    const canvas = document.getElementById("jutsu-v51-canvas");
    const ctx = canvas.getContext("2d");

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    function resize() {
        w = window.innerWidth;
        h = window.innerHeight;

        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);

        canvas.style.width = w + "px";
        canvas.style.height = h + "px";

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    /* ========================================================
       HELPERS
    ======================================================== */

    function reactorCenter() {

    /* ========================================================
       HAND-CENTERED JUTSU
    ======================================================== */

    if (
        window.EdgeJutsuHandPoint &&
        Number.isFinite(window.EdgeJutsuHandPoint.x) &&
        Number.isFinite(window.EdgeJutsuHandPoint.y)
    ) {

        return {

            x:
                window.EdgeJutsuHandPoint.x,

            y:
                window.EdgeJutsuHandPoint.y
        };
    }


    /* ========================================================
       FALLBACK: AI CORE
    ======================================================== */

    const core =
        document.getElementById(
            "ai-core"
        );


    if (core) {

        const r =
            core.getBoundingClientRect();


        return {

            x:
                r.left +
                r.width / 2,

            y:
                r.top +
                r.height / 2
        };
    }


    return {

        x:
            w * 0.47,

        y:
            h * 0.47
    };
}

    function setLabel(name, color) {
        const label = document.getElementById("jutsu-v51-label");
        const title = document.getElementById("jutsu-v51-name");

        title.textContent = name;
        title.style.color = color;

        label.classList.add("active");

        setTimeout(() => {
            label.classList.remove("active");
        }, 1400);
    }

    function clear() {
        ctx.clearRect(0, 0, w, h);
    }

    /* ========================================================
       RASENGAN
    ======================================================== */

    function rasengan(duration = 1800) {
        const start = performance.now();
        const center = reactorCenter();

        setLabel("RASENGAN", "#00efff");

        function frame(now) {
            clear();

            const t = (now - start) / duration;

            const pulse =
                65 +
                Math.sin(now * .015) * 12;

            const g = ctx.createRadialGradient(
                center.x,
                center.y,
                0,
                center.x,
                center.y,
                pulse * 1.9
            );

            g.addColorStop(
                0,
                "rgba(255,255,255,.95)"
            );

            g.addColorStop(
                .15,
                "rgba(0,245,255,.85)"
            );

            g.addColorStop(
                .45,
                "rgba(0,130,255,.40)"
            );

            g.addColorStop(
                1,
                "rgba(0,100,255,0)"
            );

            ctx.fillStyle = g;

            ctx.beginPath();

            ctx.arc(
                center.x,
                center.y,
                pulse * 1.9,
                0,
                Math.PI * 2
            );

            ctx.fill();

            for (let i = 0; i < 12; i++) {
                const a =
                    now * .006 +
                    i * Math.PI / 6;

                const r =
                    42 +
                    (i % 3) * 12;

                const x =
                    center.x +
                    Math.cos(a) * r;

                const y =
                    center.y +
                    Math.sin(a) * r;

                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    9,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    `rgba(
                        0,
                        240,
                        255,
                        ${1 - t}
                    )`;

                ctx.fill();
            }

            if (t < 1) {
                requestAnimationFrame(frame);
            } else {
                clear();
                finishJutsu();
            }
        }

        requestAnimationFrame(frame);
    }

    /* ========================================================
       CHIDORI
    ======================================================== */

    function chidori(duration = 1600) {
        const start = performance.now();
        const center = reactorCenter();

        setLabel("CHIDORI", "#6de4ff");

        function lightning(x1, y1, x2, y2, depth) {
            if (depth <= 0) {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                return;
            }

            const mx =
                (x1 + x2) / 2 +
                (Math.random() - .5) * 42;

            const my =
                (y1 + y2) / 2 +
                (Math.random() - .5) * 42;

            lightning(
                x1,
                y1,
                mx,
                my,
                depth - 1
            );

            lightning(
                mx,
                my,
                x2,
                y2,
                depth - 1
            );
        }

        function frame(now) {
            clear();

            const t =
                (now - start) /
                duration;

            ctx.lineWidth = 2;

            ctx.strokeStyle =
                `rgba(
                    120,
                    225,
                    255,
                    ${1 - t * .6}
                )`;

            ctx.shadowBlur = 16;
            ctx.shadowColor = "#60dcff";

            for (let i = 0; i < 10; i++) {
                const angle =
                    Math.random() *
                    Math.PI *
                    2;

                const radius =
                    100 +
                    Math.random() *
                    180;

                const x =
                    center.x +
                    Math.cos(angle) *
                    radius;

                const y =
                    center.y +
                    Math.sin(angle) *
                    radius;

                lightning(
                    center.x,
                    center.y,
                    x,
                    y,
                    4
                );
            }

            ctx.shadowBlur = 0;

            if (t < 1) {
                requestAnimationFrame(frame);
            } else {
                clear();
                finishJutsu();
            }
        }

        requestAnimationFrame(frame);
    }

    /* ========================================================
       KATON
    ======================================================== */

    function katon(duration = 1700) {
        const start = performance.now();
        const center = reactorCenter();

        setLabel("KATON", "#ff5b2e");

        const flames = [];

        for (let i = 0; i < 85; i++) {
            flames.push({
                x:
                    center.x +
                    (Math.random() - .5) *
                    90,

                y:
                    center.y +
                    Math.random() *
                    30,

                vx:
                    (Math.random() - .5) *
                    1.8,

                vy:
                    -1.2 -
                    Math.random() *
                    3,

                life:
                    Math.random(),

                size:
                    4 +
                    Math.random() *
                    12
            });
        }

        function frame(now) {
            clear();

            const t =
                (now - start) /
                duration;

            for (const f of flames) {
                f.x += f.vx;
                f.y += f.vy;
                f.life -= .012;

                if (f.life <= 0) {
                    f.life = 1;
                    f.x =
                        center.x +
                        (Math.random() - .5) *
                        90;

                    f.y =
                        center.y + 35;
                }

                ctx.beginPath();

                ctx.arc(
                    f.x,
                    f.y,
                    f.size,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    `rgba(
                        255,
                        ${80 + Math.random() * 80},
                        20,
                        ${f.life * (1 - t)}
                    )`;

                ctx.shadowBlur = 12;
                ctx.shadowColor = "#ff4a18";

                ctx.fill();
            }

            ctx.shadowBlur = 0;

            if (t < 1) {
                requestAnimationFrame(frame);
            } else {
                clear();
                finishJutsu();
            }
        }

        requestAnimationFrame(frame);
    }

    /* ========================================================
       SUSANOO
    ======================================================== */

    function susanoo(duration = 1900) {
        const start = performance.now();
        const center = reactorCenter();

        setLabel("SUSANOO", "#bd66ff");

        function frame(now) {
            clear();

            const t =
                (now - start) /
                duration;

            for (let i = 0; i < 7; i++) {
                const radius =
                    90 +
                    i * 28 +
                    Math.sin(
                        now * .004 +
                        i
                    ) * 12;

                ctx.beginPath();

                ctx.arc(
                    center.x,
                    center.y,
                    radius,
                    0,
                    Math.PI * 2
                );

                ctx.strokeStyle =
                    `rgba(
                        178,
                        80,
                        255,
                        ${(1 - t) * (.55 - i * .045)}
                    )`;

                ctx.lineWidth =
                    2 + (i % 2);

                ctx.shadowBlur = 15;
                ctx.shadowColor = "#a64dff";

                ctx.stroke();
            }

            ctx.shadowBlur = 0;

            if (t < 1) {
                requestAnimationFrame(frame);
            } else {
                clear();
                finishJutsu();
            }
        }

        requestAnimationFrame(frame);
    }

    /* ========================================================
       AMATERASU
    ======================================================== */

    function amaterasu(duration = 1800) {
        const start = performance.now();
        const center = reactorCenter();

        setLabel("AMATERASU", "#8e48ff");

        const flames = [];

        for (let i = 0; i < 70; i++) {
            flames.push({
                angle:
                    Math.random() *
                    Math.PI *
                    2,

                radius:
                    40 +
                    Math.random() *
                    120,

                speed:
                    .004 +
                    Math.random() *
                    .008,

                size:
                    5 +
                    Math.random() *
                    12
            });
        }

        function frame(now) {
            clear();

            const t =
                (now - start) /
                duration;

            for (const f of flames) {
                f.angle += f.speed;

                const r =
                    f.radius +
                    Math.sin(
                        now * .006 +
                        f.angle
                    ) * 14;

                const x =
                    center.x +
                    Math.cos(
                        f.angle
                    ) * r;

                const y =
                    center.y +
                    Math.sin(
                        f.angle
                    ) * r;

                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    f.size,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    `rgba(
                        70,
                        0,
                        100,
                        ${1 - t}
                    )`;

                ctx.shadowBlur = 20;
                ctx.shadowColor = "#7f2cff";

                ctx.fill();
            }

            ctx.shadowBlur = 0;

            if (t < 1) {
                requestAnimationFrame(frame);
            } else {
                clear();
                finishJutsu();
            }
        }

        requestAnimationFrame(frame);
    }

    /* ========================================================
       START / FINISH
    ======================================================== */
/* ========================================================
   JUTSU SOUND ENGINE
======================================================== */

const JUTSU_SOUNDS = {

    rasengan: "/static/sounds/rasengan.mp3",
    chidori: "/static/sounds/chidori.mp3",
    katon: "/static/sounds/katon.mp3",
    susanoo: "/static/sounds/susanoo.mp3",
    amaterasu: "/static/sounds/amaterasu.mp3"
};


const jutsuAudioCache = {};


function playJutsuSound(name) {

    const key =
        String(name || "")
            .toLowerCase()
            .trim();


    const source =
        JUTSU_SOUNDS[key];


    if (!source) {
        return;
    }


    try {

        let audio =
            jutsuAudioCache[key];


        if (!audio) {

            audio =
                new Audio(source);

            audio.preload =
                "auto";

            audio.volume =
                1.0;

            jutsuAudioCache[key] =
                audio;
        }


        audio.pause();

        audio.currentTime =
            0;


        audio.play()
            .catch(error => {

                console.warn(
                    "JUTSU AUDIO ERROR:",
                    error
                );

            });


        console.log(
            "JUTSU SOUND:",
            key
        );


    } catch (error) {

        console.error(
            "JUTSU SOUND FAILED:",
            error
        );
    }
}
    function startJutsu(name) {

    if (running) return;

    running = true;


    playJutsuSound(
        name
    );


    document.body.classList.add(
        "jutsu-v51-active"
    );

        switch (name) {
            case JUTSU.CHIDORI:
                chidori();
                break;

            case JUTSU.KATON:
                katon();
                break;

            case JUTSU.SUSANOO:
                susanoo();
                break;

            case JUTSU.AMATERASU:
                amaterasu();
                break;

            default:
                rasengan();
        }
    }

    function finishJutsu() {
        running = false;

        document.body.classList.remove(
            "jutsu-v51-active"
        );
    }

    /* ========================================================
       CONNECT TO EXISTING JUTSU COMPLETE
    ======================================================== */

    function watchExistingJutsu() {
        const status =
            document.getElementById(
                "jutsu-status"
            );

        if (!status) {
            setTimeout(
                watchExistingJutsu,
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
                        "JUTSU COMPLETE" &&
                        previous !==
                        "JUTSU COMPLETE"
                    ) {
                        startJutsu(
                            activeJutsu
                        );
                    }

                    previous =
                        current;
                }
            );

        observer.observe(
            status,
            {
                childList: true,
                subtree: true,
                characterData: true
            }
        );
    }

    /* ========================================================
       OPTIONAL CLICKABLE V5 NODES
       Click node to choose active jutsu
    ======================================================== */

    function bindNodes() {
        const map = {
            ".rasengan": JUTSU.RASENGAN,
            ".chidori": JUTSU.CHIDORI,
            ".katon": JUTSU.KATON,
            ".susanoo": JUTSU.SUSANOO,
            ".amaterasu": JUTSU.AMATERASU
        };

        for (const [selector, name] of Object.entries(map)) {
            const node =
                document.querySelector(
                    selector
                );

            if (!node) continue;

            node.style.pointerEvents =
                "auto";

            node.style.cursor =
                "pointer";

            node.addEventListener(
                "click",
                () => {
                    activeJutsu =
                        name;

                    const label =
                        name.toUpperCase();

                    const terminal =
                        document.getElementById(
                            "terminal-output"
                        );

                    if (terminal) {
                        const line =
                            document.createElement(
                                "p"
                            );

                        line.textContent =
                            "> JUTSU SELECTED: " +
                            label;

                        terminal.appendChild(
                            line
                        );

                        terminal.scrollTop =
                            terminal.scrollHeight;
                    }

                    startJutsu(
                        name
                    );
                }
            );
        }
    }

    /* ========================================================
       KEYBOARD TESTS
       Alt+1 ... Alt+5
    ======================================================== */

    document.addEventListener(
        "keydown",
        event => {
            if (!event.altKey) {
                return;
            }

            if (event.key === "1") {
                activeJutsu =
                    JUTSU.RASENGAN;

                startJutsu(
                    activeJutsu
                );
            }

            if (event.key === "2") {
                activeJutsu =
                    JUTSU.CHIDORI;

                startJutsu(
                    activeJutsu
                );
            }

            if (event.key === "3") {
                activeJutsu =
                    JUTSU.KATON;

                startJutsu(
                    activeJutsu
                );
            }

            if (event.key === "4") {
                activeJutsu =
                    JUTSU.SUSANOO;

                startJutsu(
                    activeJutsu
                );
            }

            if (event.key === "5") {
                activeJutsu =
                    JUTSU.AMATERASU;

                startJutsu(
                    activeJutsu
                );
            }
        }
    );

    window.EdgeJutsuV51 = {
        start: startJutsu,

        select(name) {
            activeJutsu =
                String(name)
                    .toLowerCase();
        },

        current() {
            return activeJutsu;
        }
    };

    window.addEventListener(
        "load",
        () => {
            setTimeout(
                () => {
                    watchExistingJutsu();
                    bindNodes();
                },
                1500
            );
        }
    );

    console.log(
        "EDGE AI OS 2077: JUTSU ANIMATION V5.1 ONLINE"
    );
})();