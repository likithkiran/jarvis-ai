// =========================================
// EDGE AI OS 2077
// DASHBOARD CONTROLLER
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    const bootScreen = document.getElementById("boot-screen");
    const dashboard = document.getElementById("dashboard");
    const clock = document.getElementById("clock");

    // -------------------------------
    // BOOT SEQUENCE
    // -------------------------------

    if (dashboard) {
        dashboard.style.display = "none";
    }

    setTimeout(() => {

        if (bootScreen) {
            bootScreen.style.opacity = "0";
            bootScreen.style.transition = "opacity 0.8s ease";

            setTimeout(() => {
                bootScreen.style.display = "none";

                if (dashboard) {
                    dashboard.style.display = "block";
                }

            }, 800);
        } else {

            if (dashboard) {
                dashboard.style.display = "block";
            }

        }

    }, 2500);


    // -------------------------------
    // DIGITAL CLOCK
    // -------------------------------

    function updateClock() {

        if (!clock) return;

        const now = new Date();

        clock.textContent = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

    }

    updateClock();

    setInterval(updateClock, 1000);


    // -------------------------------
    // SYSTEM MONITOR
    // -------------------------------

    const cpu = document.getElementById("cpu-value");
    const memory = document.getElementById("memory-value");
    const aiStatus = document.getElementById("ai-status");

    function updateSystemMonitor() {

        if (cpu) {
            const cpuValue = Math.floor(Math.random() * 35) + 35;
            cpu.textContent = cpuValue + "%";
        }

        if (memory) {
            const memoryValue = Math.floor(Math.random() * 20) + 55;
            memory.textContent = memoryValue + "%";
        }

        if (aiStatus) {
            aiStatus.textContent = "ACTIVE 🟢";
        }

    }

    updateSystemMonitor();

    setInterval(updateSystemMonitor, 3000);


    // -------------------------------
    // TERMINAL LOGS
    // -------------------------------

    const terminal = document.getElementById("terminal-output");

    if (terminal) {

        const logs = [
            "> Initializing EDGE AI OS...",
            "> Scanning system resources...",
            "> Neural Engine initialized...",
            "> Vision Engine online...",
            "> Voice Engine ready...",
            "> Windows control layer verified...",
            "> EDGE AI OS ready."
        ];

        terminal.innerHTML = "";

        logs.forEach((log, index) => {

            setTimeout(() => {

                const line = document.createElement("p");

                line.textContent = log;

                terminal.appendChild(line);

            }, index * 400);

        });

    }

});