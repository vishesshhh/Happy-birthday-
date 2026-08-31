/* =========================================
   CONFETTI ENGINE
========================================= */

const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);


/* Create confetti */

function createConfetti(amount = 180) {

    particles = [];

    for (let i = 0; i < amount; i++) {

        particles.push({

            x: Math.random() * canvas.width,

            y: -Math.random() * canvas.height,

            size: Math.random() * 7 + 3,

            speedY: Math.random() * 4 + 2,

            speedX: (Math.random() - 0.5) * 4,

            rotation: Math.random() * Math.PI,

            rotationSpeed:
                (Math.random() - 0.5) * 0.25,

            gravity:
                Math.random() * 0.05 + 0.03,

            opacity: 1,

            color: [
                "#ff4f86",
                "#ffcc70",
                "#ffffff",
                "#ff7aa5",
                "#b98cff",
                "#70d6ff"
            ][Math.floor(Math.random() * 6)]

        });

    }

    animateConfetti();
}


/* Draw */

function animateConfetti() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    particles.forEach((p, index) => {

        p.y += p.speedY;

        p.x += p.speedX;

        p.speedY += p.gravity;

        p.rotation += p.rotationSpeed;

        p.opacity -= 0.0015;


        ctx.save();

        ctx.globalAlpha = Math.max(p.opacity, 0);

        ctx.translate(p.x, p.y);

        ctx.rotate(p.rotation);

        ctx.fillStyle = p.color;

        ctx.fillRect(
            -p.size / 2,
            -p.size / 2,
            p.size,
            p.size * 1.8
        );

        ctx.restore();


        if (
            p.y > canvas.height + 30 ||
            p.opacity <= 0
        ) {
            particles.splice(index, 1);
        }

    });


    if (particles.length > 0) {
        requestAnimationFrame(animateConfetti);
    }

}


/* =========================================
   CONFETTI BURST
========================================= */

function burstConfetti() {

    createConfetti(220);

}


/* =========================================
   FIRST LOAD
========================================= */

window.addEventListener("load", () => {

    setTimeout(() => {

        burstConfetti();

    }, 900);

});


/* =========================================
   SURPRISE BUTTON
========================================= */

const surpriseBtn =
    document.getElementById("surpriseBtn");

const surpriseScreen =
    document.getElementById("surpriseScreen");


surpriseBtn.addEventListener("click", () => {

    surpriseScreen.classList.add("active");

    burstConfetti();

});


/* =========================================
   AGAIN BUTTON
========================================= */

const againBtn =
    document.getElementById("againBtn");


againBtn.addEventListener("click", () => {

    burstConfetti();

});


/* =========================================
   OPTIONAL: CLICK ANYWHERE FOR CONFETTI
========================================= */

document.addEventListener("click", (event) => {

    if (
        event.target.tagName !== "BUTTON" &&
        Math.random() < 0.15
    ) {
        createConfetti(60);
    }

});
