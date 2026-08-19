/* ============================================================
   EDGE AI OS 2077
   HUD POLISH / APPLE-VISION + JARVIS LAYOUT
   VISUAL ONLY
============================================================ */

(() => {

    "use strict";

    console.log("EDGE AI OS 2077: HUD Polish loading...");


    /* ========================================================
       STYLE OVERRIDES
    ======================================================== */

    const style =
        document.createElement("style");

    style.id =
        "edge-hud-polish";


    style.textContent = `

        /* ====================================================
           HEADER
        ==================================================== */

        header {

            position: sticky !important;

            top: 0 !important;

            z-index: 5000 !important;

            min-height: 92px;

            backdrop-filter:
                blur(22px);

            -webkit-backdrop-filter:
                blur(22px);

            background:
                linear-gradient(
                    180deg,
                    rgba(2, 12, 28, 0.96),
                    rgba(2, 12, 28, 0.82)
                ) !important;

            box-shadow:
                0 12px 35px rgba(0,0,0,0.35),
                0 1px 0 rgba(0,255,255,0.18);

        }


        /* ====================================================
           MAIN AREA
        ==================================================== */

        .main-container {

            position: relative;

            align-items: start !important;

            min-height:
                calc(100vh - 92px);

        }


        aside {

            position: relative;

            z-index: 40;

        }


        .chat-section {

            position: relative;

            z-index: 10;

            overflow: visible !important;

        }


        .status-panel {

            position: relative;

            z-index: 40;

        }


        /* ====================================================
           APPLE-VISION STYLE GLASS
        ==================================================== */

        aside,
        .card,
        #spider-vision {

            backdrop-filter:
                blur(20px);

            -webkit-backdrop-filter:
                blur(20px);

        }


        .card {

            background:
                linear-gradient(
                    145deg,
                    rgba(18,35,62,0.78),
                    rgba(5,15,31,0.88)
                ) !important;

            border:
                1px solid rgba(0,230,255,0.22) !important;

            box-shadow:
                inset 0 1px 0 rgba(255,255,255,0.035),
                0 18px 50px rgba(0,0,0,0.24);

        }


        /* ====================================================
           CENTRAL REACTOR
        ==================================================== */

        #edge-reactor {

            width: 470px !important;

            height: 470px !important;

            max-width:
                44vw !important;

            max-height:
                64vh !important;

            opacity:
                0.88 !important;

        }


        #ai-core {

            position: relative;

            z-index: 5;

            min-height: 480px;

        }


        /* Keep reactor from visually touching the header */

        .chat-section {

            padding-top: 10px;

        }


        /* ====================================================
           SPIDER VISION
        ==================================================== */

        #spider-vision {

            position: relative !important;

            width: 100% !important;

            right: auto !important;

            bottom: auto !important;

            margin-top: 18px !important;

            margin-bottom: 18px !important;

            z-index: 50 !important;

        }


        #spider-canvas {

            position: absolute !important;

            inset: 0 !important;

            width: 100% !important;

            height: 100% !important;

        }


        /* ====================================================
           JARVIS BUTTON
        ==================================================== */

        #voice-btn {

            width: 68px !important;

            height: 52px !important;

            min-width: 68px !important;

            border-radius: 18px !important;

            font-size: 12px !important;

            letter-spacing: 0.6px;

            font-family:
                Orbitron,
                sans-serif;

            overflow: hidden;

            white-space: nowrap;

        }


        #voice-btn.listening {

            box-shadow:
                0 0 18px rgba(255,45,100,0.75),
                0 0 45px rgba(255,45,100,0.25) !important;

        }


        /* ====================================================
           INPUT
        ==================================================== */

        .input-area {

            position: relative;

            z-index: 100;

            gap: 10px !important;

        }


        #user-input {

            backdrop-filter:
                blur(15px);

            background:
                rgba(2,14,29,0.86) !important;

        }


        /* ====================================================
           RESPONSIVE
        ==================================================== */

        @media(max-width:1200px) {

            #edge-reactor {

                width: 400px !important;

                height: 400px !important;

            }

        }


        @media(max-width:900px) {

            #edge-reactor {

                width: 320px !important;

                height: 320px !important;

                max-width: 80vw !important;

            }

        }

    `;


    document.head.appendChild(
        style
    );


    /* ========================================================
       CHANGE ANDROID LABELS TO WINDOWS / SYSTEM
    ======================================================== */

    function updateLabels() {

        const connectionText =
            document.getElementById(
                "connection-text"
            );


        if (connectionText) {

            connectionText.textContent =
                "WINDOWS ONLINE";
        }


        const deviceStatus =
            document.getElementById(
                "device-status"
            );


        if (deviceStatus) {

            deviceStatus.textContent =
                "ONLINE";
        }


        /*
         * Change visible metric label ANDROID -> SYSTEM
         */

        document
            .querySelectorAll(".metric span")
            .forEach(
                element => {

                    if (
                        element.textContent
                            .trim()
                            .toUpperCase()
                        === "ANDROID"
                    ) {

                        element.textContent =
                            "SYSTEM";
                    }

                }
            );

    }


    updateLabels();


    setTimeout(
        updateLabels,
        1000
    );


    console.log(
        "EDGE AI OS 2077: HUD Polish ONLINE"
    );

})();