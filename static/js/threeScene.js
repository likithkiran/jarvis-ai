// ============================================================
// EDGE AI OS 2077
// NEURAL AI CORE - THREE.JS
// ============================================================

window.addEventListener("load", () => {

    const container = document.getElementById("ai-core");

    if (!container) {
        console.error("EDGE AI: #ai-core not found");
        return;
    }

    // --------------------------------------------------------
    // SCENE
    // --------------------------------------------------------

    const scene = new THREE.Scene();

    // --------------------------------------------------------
    // CAMERA
    // --------------------------------------------------------

    const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );

    camera.position.z = 5;

    // --------------------------------------------------------
    // RENDERER
    // --------------------------------------------------------

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

    renderer.setClearColor(0x000000, 0);

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // --------------------------------------------------------
    // LIGHTS
    // --------------------------------------------------------

    const ambient = new THREE.AmbientLight(
        0xffffff,
        1.2
    );

    scene.add(ambient);

    const cyanLight = new THREE.PointLight(
        0x00eaff,
        8,
        20
    );

    cyanLight.position.set(3, 3, 4);

    scene.add(cyanLight);

    const blueLight = new THREE.PointLight(
        0x087cff,
        5,
        20
    );

    blueLight.position.set(-3, -2, 3);

    scene.add(blueLight);

    // --------------------------------------------------------
    // MAIN NEURAL CORE
    // --------------------------------------------------------

    const coreGeometry =
        new THREE.IcosahedronGeometry(1.05, 4);

    const coreMaterial =
        new THREE.MeshPhysicalMaterial({

            color: 0x00dfff,

            emissive: 0x00aaff,

            emissiveIntensity: 2.5,

            metalness: 0.85,

            roughness: 0.12,

            transparent: true,

            opacity: 0.92,

            clearcoat: 1,

            clearcoatRoughness: 0.05
        });

    const core =
        new THREE.Mesh(
            coreGeometry,
            coreMaterial
        );

    scene.add(core);

    // --------------------------------------------------------
    // INNER CORE
    // --------------------------------------------------------

    const innerGeometry =
        new THREE.IcosahedronGeometry(0.65, 3);

    const innerMaterial =
        new THREE.MeshBasicMaterial({

            color: 0x00ffff,

            transparent: true,

            opacity: 0.28,

            wireframe: true
        });

    const innerCore =
        new THREE.Mesh(
            innerGeometry,
            innerMaterial
        );

    scene.add(innerCore);

    // --------------------------------------------------------
    // OUTER WIREFRAME
    // --------------------------------------------------------

    const wireGeometry =
        new THREE.IcosahedronGeometry(1.3, 2);

    const wireMaterial =
        new THREE.MeshBasicMaterial({

            color: 0x00eaff,

            wireframe: true,

            transparent: true,

            opacity: 0.32
        });

    const wireCore =
        new THREE.Mesh(
            wireGeometry,
            wireMaterial
        );

    scene.add(wireCore);

    // --------------------------------------------------------
    // ORBIT RINGS
    // --------------------------------------------------------

    function createRing(
        radius,
        rotationX,
        rotationY,
        opacity
    ) {

        const geometry =
            new THREE.TorusGeometry(
                radius,
                0.018,
                12,
                100
            );

        const material =
            new THREE.MeshBasicMaterial({

                color: 0x00eaff,

                transparent: true,

                opacity: opacity
            });

        const ring =
            new THREE.Mesh(
                geometry,
                material
            );

        ring.rotation.x = rotationX;
        ring.rotation.y = rotationY;

        scene.add(ring);

        return ring;
    }

    const ring1 =
        createRing(
            1.55,
            Math.PI / 2.3,
            0,
            0.75
        );

    const ring2 =
        createRing(
            1.75,
            0.5,
            Math.PI / 3,
            0.45
        );

    const ring3 =
        createRing(
            1.95,
            -0.7,
            0.4,
            0.3
        );

    // --------------------------------------------------------
    // ENERGY PARTICLES
    // --------------------------------------------------------

    const particleCount = 900;

    const positions =
        new Float32Array(
            particleCount * 3
        );

    for (let i = 0; i < particleCount; i++) {

        const radius =
            1.5 + Math.random() * 1.4;

        const theta =
            Math.random() * Math.PI * 2;

        const phi =
            Math.acos(
                2 * Math.random() - 1
            );

        positions[i * 3] =
            radius *
            Math.sin(phi) *
            Math.cos(theta);

        positions[i * 3 + 1] =
            radius *
            Math.sin(phi) *
            Math.sin(theta);

        positions[i * 3 + 2] =
            radius *
            Math.cos(phi);
    }

    const particleGeometry =
        new THREE.BufferGeometry();

    particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );

    const particleMaterial =
        new THREE.PointsMaterial({

            color: 0x00eaff,

            size: 0.025,

            transparent: true,

            opacity: 0.8
        });

    const particles =
        new THREE.Points(
            particleGeometry,
            particleMaterial
        );

    scene.add(particles);

    // --------------------------------------------------------
    // CENTRAL ENERGY SPHERE
    // --------------------------------------------------------

    const energyGeometry =
        new THREE.SphereGeometry(
            0.35,
            32,
            32
        );

    const energyMaterial =
        new THREE.MeshBasicMaterial({

            color: 0xffffff,

            transparent: true,

            opacity: 0.9
        });

    const energy =
        new THREE.Mesh(
            energyGeometry,
            energyMaterial
        );

    scene.add(energy);

    // --------------------------------------------------------
    // ANIMATION
    // --------------------------------------------------------

    const clock =
        new THREE.Clock();

    function animate() {

        requestAnimationFrame(animate);

        const time =
            clock.getElapsedTime();

        // Main core rotation
        core.rotation.x += 0.004;
        core.rotation.y += 0.007;

        // Inner core
        innerCore.rotation.x -= 0.006;
        innerCore.rotation.y += 0.009;

        // Outer wire
        wireCore.rotation.x += 0.002;
        wireCore.rotation.y -= 0.004;

        // Orbit rings
        ring1.rotation.z += 0.008;
        ring1.rotation.y += 0.004;

        ring2.rotation.z -= 0.006;
        ring2.rotation.x += 0.005;

        ring3.rotation.y += 0.004;
        ring3.rotation.z += 0.003;

        // Particles
        particles.rotation.y += 0.0008;
        particles.rotation.x += 0.0004;

        // Pulsing energy
        const pulse =
            1 +
            Math.sin(time * 3) * 0.12;

        core.scale.set(
            pulse,
            pulse,
            pulse
        );

        innerCore.scale.set(
            1 + Math.sin(time * 4) * 0.08,
            1 + Math.sin(time * 4) * 0.08,
            1 + Math.sin(time * 4) * 0.08
        );

        energy.scale.set(
            pulse,
            pulse,
            pulse
        );

        // Moving light
        cyanLight.position.x =
            Math.sin(time) * 4;

        cyanLight.position.y =
            Math.cos(time) * 3;

        renderer.render(
            scene,
            camera
        );
    }

    animate();

    // --------------------------------------------------------
    // RESIZE
    // --------------------------------------------------------

    function resize() {

        const width =
            container.clientWidth;

        const height =
            container.clientHeight;

        if (!width || !height) {
            return;
        }

        camera.aspect =
            width / height;

        camera.updateProjectionMatrix();

        renderer.setSize(
            width,
            height
        );
    }

    window.addEventListener(
        "resize",
        resize
    );

    resize();

    console.log(
        "EDGE AI: Neural Core initialized."
    );
});