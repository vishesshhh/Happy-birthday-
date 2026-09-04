/* =========================================================
   EASY CUSTOMIZATION
========================================================= */

const SECRET_MESSAGE = "HAPPY BIRTHDAY UPMA";

/* =========================================================
   ELEMENTS
========================================================= */

const introScreen = document.getElementById("introScreen");
const gameScreen = document.getElementById("gameScreen");
const photoScreen = document.getElementById("photoScreen");
const noteScreen = document.getElementById("noteScreen");
const finalScreen = document.getElementById("finalScreen");

const startButton = document.getElementById("startButton");
const photoNextButton = document.getElementById("photoNextButton");
const noteNextButton = document.getElementById("noteNextButton");
const celebrateButton = document.getElementById("celebrateButton");

const keyboard = document.getElementById("keyboard");
const messageDisplay = document.getElementById("messageDisplay");
const progressBar = document.getElementById("progressBar");
const gameHint = document.getElementById("gameHint");
const celebrateHint = document.getElementById("celebrateHint");

const KEYBOARD_ROWS = [
  "QWERTYUIOP",
  "ASDFGHJKL",
  "ZXCVBNM"
];

/* =========================================================
   GAME STATE
========================================================= */

let currentTargetIndex = 0;
let letterPositions = [];

const targetLetters = SECRET_MESSAGE.toUpperCase().match(/[A-Z]/g) || [];

/* =========================================================
   PAGE HELPERS
========================================================= */

function showOnly(screen) {
  [introScreen, gameScreen, photoScreen, noteScreen, finalScreen]
    .forEach(s => s.classList.add("hidden"));

  screen.classList.remove("hidden");
}

/* =========================================================
   START GAME
========================================================= */

startButton.addEventListener("click", () => {
  showOnly(gameScreen);
  setupGame();
});

/* =========================================================
   GAME SETUP
========================================================= */

function setupGame() {
  currentTargetIndex = 0;
  createMessage();
  createKeyboard();
  updateTarget();
  updateProgress();
}

/* =========================================================
   MESSAGE
========================================================= */

function createMessage() {
  messageDisplay.innerHTML = "";
  letterPositions = [];

  let targetIndex = 0;

  for (const character of SECRET_MESSAGE.toUpperCase()) {
    if (character === " ") {
      const space = document.createElement("span");
      space.className = "message-space";
      space.innerHTML = "&nbsp;";
      messageDisplay.appendChild(space);
      continue;
    }

    const char = document.createElement("span");
    char.className = "message-char hidden-char";
    char.textContent = character;

    if (/[A-Z]/.test(character)) {
      char.dataset.targetIndex = targetIndex;
      letterPositions.push(char);
      targetIndex++;
    } else {
      char.classList.remove("hidden-char");
      char.classList.add("revealed");
    }

    messageDisplay.appendChild(char);
  }
}

/* =========================================================
   KEYBOARD
========================================================= */

function createKeyboard() {
  keyboard.innerHTML = "";

  KEYBOARD_ROWS.forEach(row => {
    const rowElement = document.createElement("div");
    rowElement.className = "key-row";

    [...row].forEach(letter => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "key";
      button.textContent = letter;
      button.dataset.letter = letter;

      /*
        IMPORTANT:
        The key is NEVER removed or disabled.
        It can be tapped repeatedly.
      */
      button.addEventListener("click", () => handleKey(button));

      rowElement.appendChild(button);
    });

    keyboard.appendChild(rowElement);
  });
}

/* =========================================================
   TARGET LETTER
========================================================= */

function updateTarget() {
  document.querySelectorAll(".key").forEach(key => {
    key.classList.remove("target");
  });

  if (currentTargetIndex >= targetLetters.length) return;

  const target = targetLetters[currentTargetIndex];
  const targetKey = document.querySelector(
    `.key[data-letter="${target}"]`
  );

  if (targetKey) {
    targetKey.classList.add("target");
  }
}

/* =========================================================
   HANDLE KEY
========================================================= */

function handleKey(key) {
  const selected = key.dataset.letter;
  const correct = targetLetters[currentTargetIndex];

  if (selected === correct) {
    key.classList.add("correct-tap");

    setTimeout(() => {
      key.classList.remove("correct-tap");
    }, 180);

    const character = letterPositions[currentTargetIndex];

    if (character) {
      character.classList.remove("hidden-char");
      character.classList.add("revealed");
    }

    currentTargetIndex++;

    updateProgress();
    updateTarget();

    if (currentTargetIndex >= targetLetters.length) {
      finishGame();
    }
  } else {
    key.classList.add("wrong-tap");

    setTimeout(() => {
      key.classList.remove("wrong-tap");
    }, 300);
  }
}

/* =========================================================
   PROGRESS
========================================================= */

function updateProgress() {
  const percentage = targetLetters.length
    ? (currentTargetIndex / targetLetters.length) * 100
    : 100;

  progressBar.style.width = `${percentage}%`;
}

/* =========================================================
   GAME COMPLETE
========================================================= */

function finishGame() {
  gameHint.textContent = "You found every letter ❤️";
  launchConfetti(260);

  // Let the completed message be seen briefly, then clear it
  // before moving on so the secret text does not remain visible.
  setTimeout(() => {
    messageDisplay.classList.add("secret-fade");
  }, 650);

  setTimeout(() => {
    messageDisplay.classList.remove("secret-fade");
    showOnly(photoScreen);
  }, 1100);
}

/* =========================================================
   PHOTO -> NOTE
========================================================= */

photoNextButton.addEventListener("click", () => {
  showOnly(noteScreen);
  launchConfetti(90);
});

/* =========================================================
   NOTE -> FINAL
========================================================= */

noteNextButton.addEventListener("click", () => {
  showOnly(finalScreen);
  launchConfetti(320);
});

/* =========================================================
   CONFETTI ENGINE
========================================================= */

const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
let animationRunning = false;
let lastFrameTime = 0;

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function launchConfetti(amount = 250) {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight * 0.48;

  const colors = [
    "#ff4f86",
    "#ff709b",
    "#ffca70",
    "#ffffff",
    "#b78cff",
    "#70d8ff"
  ];

  for (let i = 0; i < amount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 6 + Math.random() * 15;

    particles.push({
      x: centerX + (Math.random() - .5) * 80,
      y: centerY + (Math.random() - .5) * 50,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 6,
      gravity: .22 + Math.random() * .12,
      drag: .985,
      width: 5 + Math.random() * 8,
      height: 8 + Math.random() * 14,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - .5) * .3,
      life: 1,
      decay: .004 + Math.random() * .006,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  if (!animationRunning) {
    animationRunning = true;
    lastFrameTime = 0;
    requestAnimationFrame(animateConfetti);
  }
}

function animateConfetti(timestamp) {
  if (!lastFrameTime) lastFrameTime = timestamp;

  const delta = Math.min(
    (timestamp - lastFrameTime) / 16.67,
    2
  );

  lastFrameTime = timestamp;

  ctx.clearRect(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    p.vx *= Math.pow(p.drag, delta);
    p.vy += p.gravity * delta;

    p.x += p.vx * delta;
    p.y += p.vy * delta;

    p.rotation += p.rotationSpeed * delta;
    p.life -= p.decay * delta;

    ctx.save();
    ctx.globalAlpha = Math.max(p.life, 0);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;

    ctx.fillRect(
      -p.width / 2,
      -p.height / 2,
      p.width,
      p.height
    );

    ctx.restore();

    if (
      p.life <= 0 ||
      p.y > window.innerHeight + 100
    ) {
      particles.splice(i, 1);
    }
  }

  if (particles.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    animationRunning = false;
    lastFrameTime = 0;
  }
}

/* =========================================================
   CELEBRATE — WORKS EVERY SINGLE TAP
========================================================= */

celebrateButton.addEventListener("click", () => {
  /*
    Add a fresh burst instead of replacing the old particles.
    Therefore rapid repeated taps work too.
  */
  launchConfetti(380);

  celebrateHint.textContent = "Again! 🎉 Tap it again!";

  celebrateButton.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(.90)" },
      { transform: "scale(1.08)" },
      { transform: "scale(1)" }
    ],
    {
      duration: 350,
      easing: "ease-out"
    }
  );
});
