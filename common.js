const c = document.getElementById("confettiCanvas");

if (c) {
    const x = c.getContext("2d");

    let particles = [];
    let animationRunning = false;

    /* =========================================
       CANVAS SETUP
    ========================================= */

    function resizeCanvas() {
        const dpr = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        c.width = window.innerWidth * dpr;
        c.height = window.innerHeight * dpr;

        c.style.width = window.innerWidth + "px";
        c.style.height = window.innerHeight + "px";

        x.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }

    resizeCanvas();

    window.addEventListener(
        "resize",
        resizeCanvas
    );


    /* =========================================
       CREATE CONFETTI BURST
    ========================================= */

    window.burst = function (amount = 420) {

        const colors = [
            "#ff4f87",
            "#ffb45c",
            "#ffffff",
            "#b889ff",
            "#70d8ff",
            "#7cf29a"
        ];

        const centerX =
            window.innerWidth / 2;

        const centerY =
            window.innerHeight * 0.45;


        for (let i = 0; i < amount; i++) {

            const angle =
                Math.random() * Math.PI * 2;

            const speed =
                6 + Math.random() * 15;


            particles.push({

                x:
                    centerX +
                    (Math.random() - 0.5) * 40,

                y:
                    centerY +
                    (Math.random() - 0.5) * 30,

                vx:
                    Math.cos(angle) * speed,

                vy:
                    Math.sin(angle) * speed - 7,

                gravity:
                    0.18 +
                    Math.random() * 0.10,

                drag:
                    0.985,

                width:
                    5 +
                    Math.random() * 8,

                height:
                    8 +
                    Math.random() * 14,

                rotation:
                    Math.random() *
                    Math.PI * 2,

                rotationSpeed:
                    (Math.random() - 0.5) * 0.35,

                life:
                    120 +
                    Math.random() * 100,

                color:
                    colors[
                        Math.floor(
                            Math.random() *
                            colors.length
                        )
                    ],

                circle:
                    Math.random() < 0.18
            });
        }


        /* Start animation if not already running */

        if (!animationRunning) {

            animationRunning = true;

            requestAnimationFrame(
                animateConfetti
            );
        }
    };


    /* =========================================
       CONFETTI ANIMATION
    ========================================= */

    function animateConfetti() {

        x.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );


        for (
            let i = particles.length - 1;
            i >= 0;
            i--
        ) {

            const p = particles[i];


            /* Physics */

            p.vx *= p.drag;

            p.vy *= p.drag;

            p.vy += p.gravity;

            p.x += p.vx;

            p.y += p.vy;

            p.rotation +=
                p.rotationSpeed;

            p.life--;


            /* Remove dead particles */

            if (
                p.life <= 0 ||
                p.y >
                    window.innerHeight + 120 ||
                p.x <
                    -120 ||
                p.x >
                    window.innerWidth + 120
            ) {

                particles.splice(i, 1);

                continue;
            }


            /* Draw */

            x.save();

            x.globalAlpha =
                Math.max(
                    0,
                    Math.min(
                        1,
                        p.life / 80
                    )
                );

            x.translate(
                p.x,
                p.y
            );

            x.rotate(
                p.rotation
            );

            x.fillStyle =
                p.color;


            if (p.circle) {

                x.beginPath();

                x.arc(
                    0,
                    0,
                    p.width * 0.6,
                    0,
                    Math.PI * 2
                );

                x.fill();

            } else {

                x.fillRect(
                    -p.width / 2,
                    -p.height / 2,
                    p.width,
                    p.height
                );
            }


            x.restore();
        }


        /* Continue until every particle is gone */

        if (particles.length > 0) {

            requestAnimationFrame(
                animateConfetti
            );

        } else {

            animationRunning = false;
        }
    }


    /* =========================================
       FIND CELEBRATE BUTTON
       
       Supports BOTH possible IDs:
       #celebrate
       #celebrateBtn
    ========================================= */

    const celebrateButton =
        document.getElementById("celebrate") ||
        document.getElementById("celebrateBtn");


    if (celebrateButton) {

        celebrateButton.addEventListener(
            "click",
            function () {

                /*
                 IMPORTANT:
                 Every click creates a NEW burst.
                 Previous particles are NOT removed.
                */

                window.burst(420);


                /* Update hint if it exists */

                const hint =
                    document.querySelector(
                        ".celebrate-hint"
                    );

                if (hint) {

                    hint.textContent =
                        "Again! 🎉 Tap it again!";
                }
            }
        );
    }
}
