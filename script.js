/* =========================================
   SETTINGS
========================================= */

/*
   CHANGE THIS MESSAGE IF YOU WANT.

   Keep it reasonably short for the
   mobile keyboard experience.
*/

const SECRET_MESSAGE =
    "HAPPY BIRTHDAY UPMA ❤️";


/* =========================================
   SCREEN ELEMENTS
========================================= */

const introScreen =
    document.getElementById("introScreen");

const letterScreen =
    document.getElementById("letterScreen");

const photoScreen =
    document.getElementById("photoScreen");

const finalScreen =
    document.getElementById("finalScreen");

const startBtn =
    document.getElementById("startBtn");

const finalBtn =
    document.getElementById("finalBtn");

const confettiBtn =
    document.getElementById("confettiBtn");

const keyboard =
    document.getElementById("keyboard");

const hiddenMessage =
    document.getElementById("hiddenMessage");

const revealedMessage =
    document.getElementById("revealedMessage");

const progressFill =
    document.getElementById("progressFill");

const hint =
    document.getElementById("hint");


/* =========================================
   KEYBOARD
========================================= */

const rows = [
    "QWERTYUIOP",
    "ASDFGHJKL",
    "ZXCVBNM"
];


/* =========================================
   BUILD HIDDEN MESSAGE
========================================= */

let targetLetters = [];

let currentPosition = 0;


/*
   Remove spaces and emoji when determining
   keyboard letters.
*/

const cleanMessage =
    SECRET_MESSAGE
        .toUpperCase()
        .replace(/[^A-Z]/g, "");


/* =========================================
   START
========================================= */

startBtn.addEventListener("click", () => {

    introScreen.classList.add("hidden");

    letterScreen.classList.remove("hidden");

    createLetterGame();

});


/* =========================================
   CREATE GAME
========================================= */

function createLetterGame() {

    currentPosition = 0;

    targetLetters =
        cleanMessage.split("");

    /*
       Show the hidden message as dots.
    */

    hiddenMessage.textContent =
        targetLetters
            .map(() => "•")
            .join(" ");


    revealedMessage.textContent = "";

    updateProgress();

    createKeyboard();

    updateTargetKeys();

}


/* =========================================
   CREATE KEYBOARD
========================================= */

function createKeyboard() {

    keyboard.innerHTML = "";

    rows.forEach(row => {

        const rowElement =
            document.createElement("div");

        rowElement.className =
            "key-row";

        [...row].forEach(letter => {

            const key =
                document.createElement("button");

            key.className = "key";

            key.textContent = letter;

            key.dataset.letter = letter;

            key.addEventListener(
                "click",
                handleKeyClick
            );

            rowElement.appendChild(key);

        });

        keyboard.appendChild(rowElement);

    });

}


/* =========================================
   TARGET LETTER
========================================= */

function updateTargetKeys() {

    /*
       Remove previous highlights.
    */

    document
        .querySelectorAll(".key")
        .forEach(key => {

            key.classList.remove("target");

        });


    if (
        currentPosition >= targetLetters.length
    ) {
        return;
    }


    const target =
        targetLetters[currentPosition];


    /*
       Highlight every occurrence of the
       correct letter subtly.
    */

    document
        .querySelectorAll(
            `.key[data-letter="${target}"]`
        )
        .forEach(key => {

            key.classList.add("target");

        });

}


/* =========================================
   KEY CLICK
========================================= */

function handleKeyClick(event) {

    const key =
        event.currentTarget;

    const selected =
        key.dataset.letter;

    const correct =
        targetLetters[currentPosition];


    /* Correct */

    if (selected === correct) {

        key.classList.remove("target");

        key.classList.add("used");

        revealLetter(correct);

        currentPosition++;

        updateProgress();

        updateTargetKeys();


        /*
           Finished!
        */

        if (
            currentPosition >=
            targetLetters.length
        ) {

            setTimeout(() => {

                finishLetterGame();

            }, 900);

        }

        return;
    }


    /* Wrong */

    key.classList.add("wrong");

    setTimeout(() => {

        key.classList.remove("wrong");

    }, 350);

}


/* =========================================
   REVEAL LETTER
========================================= */

function revealLetter(letter) {

    const old =
        revealedMessage.textContent;

    revealedMessage.textContent =
        old + letter;

    /*
       Rebuild visible message with spaces
       approximately where appropriate.
    */

    const visible =
        buildVisibleMessage();

    revealedMessage.textContent =
        visible;
}


/* =========================================
   BUILD VISIBLE MESSAGE
========================================= */

function buildVisibleMessage() {

    let output = "";

    let position = 0;

    for (
        let i = 0;
        i < SECRET_MESSAGE.length;
        i++
    ) {

        const char =
            SECRET_MESSAGE[i];


        if (
            /[A-Za-z]/.test(char)
        ) {

            if (
                position < currentPosition
            ) {

                output +=
                    char.toUpperCase();

            } else {

                output += "•";

            }

            position++;

        } else {

            output += char;

        }

    }

    return output;
}


/* =========================================
   PROGRESS
========================================= */

function updateProgress() {

    const percent =
        (
            currentPosition /
            targetLetters.length
        ) * 100;

    progressFill.style.width =
        percent + "%";

}


/* =========================================
   FINISH LETTER GAME
========================================= */

function finishLetterGame() {

    /*
       Strong confetti burst
    */

    burstConfetti(240);

    hint.textContent =
        "You found it ❤️";

    /*
       Wait, then reveal photograph.
    */

    setTimeout(() => {

        letterScreen.classList.add("hidden");

        photoScreen.classList.remove("hidden");

    }, 1400);

}


/* =========================================
   PHOTO → FINAL
========================================= */

finalBtn.addEventListener("click", () => {

    photoScreen.classList.add("hidden");

    finalScreen.classList.remove("hidden");

    burstConfetti(320);

});


/* =========================================
   CONFETTI
========================================= */

const canvas =
    document.getElementById("confetti");

const ctx =
    canvas.getContext("2d");

let particles = [];

function resizeCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

}

resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);


/* =========================================
   CREATE CONFETTI
========================================= */

function burstConfetti(amount = 200) {

    for (let i = 0; i < amount; i++) {

        particles.push({

            x:
                canvas.width / 2,

            y:
                canvas.height * .45,

            vx:
                (Math.random() - .5) * 18,

            vy:
                (Math.random() - .5) * 18 - 6,

            gravity:
                .25,

            size:
                Math.random() * 7 + 3,

            rotation:
                Math.random() * 6,

            rotationSpeed:
                (Math.random() - .5) * .3,

            life:
                1,

            decay:
                Math.random() * .008 + .004,

            color:
                [
                    "#ff5c8a",
                    "#ffcf70",
                    "#ffffff",
                    "#ff9abb",
                    "#b98cff",
                    "#72d8ff"
                ][
                    Math.floor(
                        Math.random() * 6
                    )
                ]

        });

    }

    if (!animationRunning) {

        animationRunning = true;

        animateConfetti();

    }

}


let animationRunning = false;


/* =========================================
   CONFETTI ANIMATION
========================================= */

function animateConfetti() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    particles.forEach((p, index) => {

        p.x += p.vx;

        p.y += p.vy;

        p.vy += p.gravity;

        p.vx *= .995;

        p.rotation +=
            p.rotationSpeed;

        p.life -= p.decay;


        ctx.save();

        ctx.globalAlpha =
            Math.max(0, p.life);

        ctx.translate(
            p.x,
            p.y
        );

        ctx.rotate(
            p.rotation
        );

        ctx.fillStyle =
            p.color;

        ctx.fillRect(
            -p.size / 2,
            -p.size / 2,
            p.size,
            p.size * 1.8
        );

        ctx.restore();


        if (
            p.life <= 0 ||
            p.y > canvas.height + 50
        ) {

            particles.splice(
                index,
                1
            );

        }

    });


    if (particles.length > 0) {

        requestAnimationFrame(
            animateConfetti
        );

    } else {

        animationRunning = false;

    }

}


/* =========================================
   FINAL CONFETTI
========================================= */

confettiBtn.addEventListener(
    "click",
    () => {

        burstConfetti(350);

    }
);
