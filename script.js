/* =====================================================
   CUSTOMIZE THIS
===================================================== */

/*
   Change ONLY this line if you want another message.

   Spaces are automatically preserved.

   Example:

   const SECRET_MESSAGE =
       "I LOVE YOU UPMA";

*/

const SECRET_MESSAGE =
    "HAPPY BIRTHDAY UPMA ❤️";


/* =====================================================
   ELEMENTS
===================================================== */

const introScreen =
    document.getElementById("introScreen");

const gameScreen =
    document.getElementById("gameScreen");

const photoScreen =
    document.getElementById("photoScreen");

const finalScreen =
    document.getElementById("finalScreen");

const startButton =
    document.getElementById("startButton");

const finalButton =
    document.getElementById("finalButton");

const celebrateButton =
    document.getElementById("celebrateButton");

const celebrateHint =
    document.getElementById("celebrateHint");

const keyboard =
    document.getElementById("keyboard");

const messageDisplay =
    document.getElementById("messageDisplay");

const progressBar =
    document.getElementById("progressBar");

const gameHint =
    document.getElementById("gameHint");


/* =====================================================
   KEYBOARD
===================================================== */

const KEYBOARD_ROWS = [
    "QWERTYUIOP",
    "ASDFGHJKL",
    "ZXCVBNM"
];


/* =====================================================
   GAME STATE
===================================================== */

let letterPositions = [];

let currentTargetIndex = 0;


/*
   Only alphabetic characters are targets.

   Spaces and ❤️ don't require keyboard taps.
*/

const targetLetters =
    SECRET_MESSAGE
        .toUpperCase()
        .match(/[A-Z]/g) || [];


/* =====================================================
   START
===================================================== */

startButton.addEventListener(
    "click",
    () => {

        introScreen.classList.add("hidden");

        gameScreen.classList.remove("hidden");

        setupGame();

    }
);


/* =====================================================
   SETUP
===================================================== */

function setupGame() {

    currentTargetIndex = 0;

    createMessage();

    createKeyboard();

    updateTarget();

    updateProgress();

}


/* =====================================================
   MESSAGE DISPLAY
===================================================== */

function createMessage() {

    messageDisplay.innerHTML = "";

    letterPositions = [];

    let targetIndex = 0;


    for (
        let i = 0;
        i < SECRET_MESSAGE.length;
        i++
    ) {

        const character =
            SECRET_MESSAGE[i];


        /*
           SPACE
        */

        if (character === " ") {

            const space =
                document.createElement("span");

            space.className =
                "message-space";

            space.innerHTML =
                "&nbsp;";

            messageDisplay.appendChild(
                space
            );

            continue;
        }


        /*
           Letter
        */

        const char =
            document.createElement("span");

        char.className =
            "message-char hidden-char";

        char.textContent =
            character.toUpperCase();


        /*
           Only alphabetic characters
           are part of the game.
        */

        if (
            /[A-Z]/i.test(character)
        ) {

            char.dataset.targetIndex =
                targetIndex;

            letterPositions.push(char);

            targetIndex++;

        } else {

            /*
               Emoji such as ❤️
               stays visible.
            */

            char.classList.remove(
                "hidden-char"
            );

            char.classList.add(
                "revealed"
            );

        }


        messageDisplay.appendChild(
            char
        );

    }

}


/* =====================================================
   KEYBOARD
===================================================== */

function createKeyboard() {

    keyboard.innerHTML = "";


    KEYBOARD_ROWS.forEach(
        row => {

            const rowElement =
                document.createElement("div");

            rowElement.className =
                "key-row";


            [...row].forEach(
                letter => {

                    const button =
                        document.createElement("button");

                    button.type =
                        "button";

                    button.className =
                        "key";

                    button.textContent =
                        letter;

                    button.dataset.letter =
                        letter;


                    /*
                       IMPORTANT:

                       The key is NEVER removed.

                       It gets another click
                       listener every time the
                       game is initialized.
                    */

                    button.addEventListener(
                        "click",
                        () => handleKey(button)
                    );


                    rowElement.appendChild(
                        button
                    );

                }
            );


            keyboard.appendChild(
                rowElement
            );

        }
    );

}


/* =====================================================
   TARGET
===================================================== */

function updateTarget() {

    /*
       Remove glow from ALL keys.
    */

    document
        .querySelectorAll(".key")
        .forEach(
            key => {

                key.classList.remove(
                    "target"
                );

            }
        );


    /*
       Game complete
    */

    if (
        currentTargetIndex >=
        targetLetters.length
    ) {

        return;

    }


    const target =
        targetLetters[
            currentTargetIndex
        ];


    /*
       Find the correct keyboard key.

       There is only one key for each
       alphabet letter.

       It stays there permanently.
    */

    const targetKey =
        document.querySelector(
            `.key[data-letter="${target}"]`
        );


    if (targetKey) {

        targetKey.classList.add(
            "target"
        );

    }

}


/* =====================================================
   HANDLE KEY
===================================================== */

function handleKey(key) {

    const selected =
        key.dataset.letter;

    const correct =
        targetLetters[
            currentTargetIndex
        ];


    /*
       CORRECT LETTER
    */

    if (
        selected === correct
    ) {

        /*
           Tap animation only.

           WE DO NOT:
           - remove the key
           - hide the key
           - disable the key
           - add pointer-events:none
        */

        key.classList.add(
            "correct-tap"
        );


        setTimeout(
            () => {

                key.classList.remove(
                    "correct-tap"
                );

            },
            180
        );


        /*
           Reveal the corresponding
           character in the message.
        */

        const character =
            letterPositions[
                currentTargetIndex
            ];


        if (character) {

            character.classList.remove(
                "hidden-char"
            );

            character.classList.add(
                "revealed"
            );

        }


        currentTargetIndex++;


        updateProgress();

        updateTarget();


        /*
           Finished
        */

        if (
            currentTargetIndex >=
            targetLetters.length
        ) {

            finishGame();

        }

        return;

    }


    /*
       WRONG LETTER
    */

    key.classList.add(
        "wrong-tap"
    );


    setTimeout(
        () => {

            key.classList.remove(
                "wrong-tap"
            );

        },
        300
    );

}


/* =====================================================
   PROGRESS
===================================================== */

function updateProgress() {

    const percentage =
        (
            currentTargetIndex /
            targetLetters.length
        ) * 100;


    progressBar.style.width =
        `${percentage}%`;

}


/* =====================================================
   GAME FINISHED
===================================================== */

function finishGame() {

    gameHint.textContent =
        "You found every letter ❤️";


    /*
       Small celebration when
       the hidden message is completed.
    */

    launchConfetti(180);


    /*
       Then reveal the photo.
    */

    setTimeout(
        () => {

            gameScreen.classList.add(
                "hidden"
            );

            photoScreen.classList.remove(
                "hidden"
            );

        },
        1300
    );

}


/* =====================================================
   PHOTO → FINAL
===================================================== */

finalButton.addEventListener(
    "click",
    () => {

        photoScreen.classList.add(
            "hidden"
        );

        finalScreen.classList.remove(
            "hidden"
        );


        /*
           Big first celebration
        */

        launchConfetti(280);

    }
);


/* =====================================================
   CONFETTI CANVAS
===================================================== */

const canvas =
    document.getElementById(
        "confettiCanvas"
    );

const ctx =
    canvas.getContext("2d");


let particles = [];

let animationRunning =
    false;

let lastFrameTime = 0;


/* =====================================================
   CANVAS SIZE
===================================================== */

function resizeCanvas() {

    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    canvas.width =
        window.innerWidth * dpr;

    canvas.height =
        window.innerHeight * dpr;


    canvas.style.width =
        window.innerWidth + "px";

    canvas.style.height =
        window.innerHeight + "px";


    ctx.setTransform(
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


/* =====================================================
   CREATE CONFETTI
===================================================== */

function launchConfetti(
    amount = 250
) {

    /*
       IMPORTANT:

       We ADD particles to the existing
       array instead of replacing it.

       Therefore:

       Tap → burst
       Tap → another burst
       Tap → another burst
       Tap → another burst

       Every tap works.
    */


    const centerX =
        window.innerWidth / 2;

    const centerY =
        window.innerHeight * .48;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const angle =
            Math.random() *
            Math.PI *
            2;


        const speed =
            6 +
            Math.random() * 15;


        particles.push({

            x:
                centerX +
                (Math.random() - .5) *
                80,

            y:
                centerY +
                (Math.random() - .5) *
                50,


            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed -
                6,


            gravity:
                .22 +
                Math.random() * .12,


            drag:
                .985,


            size:
                4 +
                Math.random() * 7,


            width:
                5 +
                Math.random() * 8,


            height:
                8 +
                Math.random() * 14,


            rotation:
                Math.random() *
                Math.PI *
                2,


            rotationSpeed:
                (Math.random() - .5) *
                .3,


            life:
                1,


            decay:
                .004 +
                Math.random() *
                .006,


            color:
                [
                    "#ff4f86",
                    "#ff709b",
                    "#ffca70",
                    "#ffffff",
                    "#b78cff",
                    "#70d8ff"
                ][
                    Math.floor(
                        Math.random() * 6
                    )
                ]

        });

    }


    /*
       Start animation if it isn't
       already running.
    */

    if (!animationRunning) {

        animationRunning = true;

        lastFrameTime = 0;

        requestAnimationFrame(
            animateConfetti
        );

    }

}


/* =====================================================
   CONFETTI ANIMATION
===================================================== */

function animateConfetti(
    timestamp
) {

    if (!lastFrameTime) {

        lastFrameTime =
            timestamp;

    }


    /*
       Delta time keeps the animation
       consistent across refresh rates.
    */

    const delta =
        Math.min(
            (timestamp -
                lastFrameTime) /
                16.67,
            2
        );


    lastFrameTime =
        timestamp;


    ctx.clearRect(
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

        const p =
            particles[i];


        /*
           Physics
        */

        p.vx *=
            Math.pow(
                p.drag,
                delta
            );

        p.vy +=
            p.gravity *
            delta;


        p.x +=
            p.vx *
            delta;

        p.y +=
            p.vy *
            delta;


        p.rotation +=
            p.rotationSpeed *
            delta;


        p.life -=
            p.decay *
            delta;


        /*
           Draw
        */

        ctx.save();

        ctx.globalAlpha =
            Math.max(
                p.life,
                0
            );


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
            -p.width / 2,
            -p.height / 2,
            p.width,
            p.height
        );


        ctx.restore();


        /*
           Remove dead particles
        */

        if (
            p.life <= 0 ||
            p.y >
                window.innerHeight +
                100
        ) {

            particles.splice(
                i,
                1
            );

        }

    }


    /*
       Continue while particles exist.
    */

    if (
        particles.length > 0
    ) {

        requestAnimationFrame(
            animateConfetti
        );

    } else {

        animationRunning =
            false;

        lastFrameTime = 0;

    }

}


/* =====================================================
   "LET'S CELEBRATE"
===================================================== */

celebrateButton.addEventListener(
    "click",
    () => {

        /*
           THIS HAPPENS EVERY SINGLE TAP.
        */

        launchConfetti(350);


        /*
           Change the little text so
           the user knows repeated taps work.
        */

        celebrateHint.textContent =
            "Again? Tap it again 🎉";


        /*
           Little button animation.
        */

        celebrateButton.animate(
            [
                {
                    transform:
                        "scale(1)"
                },

                {
                    transform:
                        "scale(0.90)"
                },

                {
                    transform:
                        "scale(1.08)"
                },

                {
                    transform:
                        "scale(1)"
                }
            ],
            {
                duration: 350,
                easing: "ease-out"
            }
        );

    }
);
