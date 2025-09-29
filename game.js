Scroll down, write a short commit message, e.g. “Update index.html – add reward layer”.
Click Commit changes.
2.2 style.css
Return to the file list, click style.css, then the pencil icon.
Replace its contents with:
/* -------------------------------------------------
   Layout basics (unchanged)
   ------------------------------------------------- */
body {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
    font-family: sans-serif;
    position: relative;          /* needed for absolute rewards */
}
.logo {
    width: 150px;
    margin: 20px 0;
}
#score {
    font-size: 2.5rem;
    margin: 20px;
}
button {
    padding: 20px 40px;
    font-size: 1.2rem;
    cursor: pointer;
    transition: transform .1s;
}
button:active {
    transform: scale(0.9);
}

/* -------------------------------------------------
   Reward layer – sits on top of everything
   ------------------------------------------------- */
#reward-layer {
    position: absolute;
    inset: 0;                /* fill the whole viewport */
    pointer-events: none;    /* clicks go through */
    overflow: hidden;
}

/* -------------------------------------------------
   1. Flower (10 points)
   ------------------------------------------------- */
.flower-piece {
    position: absolute;
    width: 30px;
    opacity: 0;
    animation: blossom 1.2s forwards;
}
@keyframes blossom {
    0%   { transform: scale(0) rotate(0deg); opacity: 0; }
    50%  { opacity: 1; }
    100% { transform: scale(1) rotate(360deg); opacity: 0; }
}

/* -------------------------------------------------
   2. Cat arm (100 points)
   ------------------------------------------------- */
.cat-arm {
    position: absolute;
    width: 80px;
    opacity: 0;
    animation: arm-push 1s forwards;
}
@keyframes arm-push {
    0%   { transform: translateY(-50px) rotate(-30deg); opacity: 0; }
    30%  { opacity: 1; }
    100% { transform: translateY(0) rotate(0deg); opacity: 0; }
}

/* -------------------------------------------------
   3. Cat hug (1 000 points)
   ------------------------------------------------- */
.cat-hug {
    position: absolute;
    width: 120px;
    opacity: 0;
    animation: cat-hug 1.5s forwards;
}
@keyframes cat-hug {
    0%   { transform: translateY(80px) scale(0.5); opacity: 0; }
    30%  { opacity: 1; }
    70%  { transform: translateY(0) scale(1.1); }
    100% { transform: translateY(0) scale(1); opacity: 0; }
}

/* -------------------------------------------------
   4. Cat Superman (10 000 points)
   ------------------------------------------------- */
.cat-super {
    position: absolute;
    width: 150px;
    opacity: 0;
    animation: superman 2s forwards;
}
@keyframes superman {
    0%   { transform: translateY(120px) rotate(-45deg) scale(0.5); opacity: 0; }
    30%  { opacity: 1; }
    80%  { transform: translateY(0) rotate(0deg) scale(1.2); }
    100% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0; }
}
Commit with a message like “Add reward CSS and animations”.
2.3 game.js
Click game.js, then Edit.
Replace its contents with the full script below (it contains the reward‑creation logic for the four thresholds):
// -------------------------------------------------
// Elements
// -------------------------------------------------
const btn         = document.getElementById('btn');
const scoreEl     = document.getElementById('score');
const rewardLayer = document.getElementById('reward-layer');

// -------------------------------------------------
// Load saved score (if any)
// -------------------------------------------------
let score = Number(localStorage.getItem('score')) || 0;
scoreEl.textContent = score;

// -------------------------------------------------
// Helper: create an <img> element for a reward
// -------------------------------------------------
function createReward(src, className, x, y) {
    const img = document.createElement('img');
    img.src = src;
    img.className = className;
    img.style.left = `${x}px`;
    img.style.top  = `${y}px`;
    rewardLayer.appendChild(img);
    // Remove after the animation finishes (max 2.5 s)
    setTimeout(() => img.remove(), 2500);
}

// -------------------------------------------------
// Helper: generate a random position around the centre logo
// -------------------------------------------------
function randomPos(radius = 80) {
    // Get the centre of the page (roughly where the logo sits)
    const rect = document.querySelector('.logo').getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * radius;
    const x = cx + r * Math.cos(angle) - 15; // -15 to centre the 30‑px pieces
    const y = cy + r * Math.sin(angle) - 15;
    return {x, y};
}

// -------------------------------------------------
// Reward triggers for the four score milestones
// -------------------------------------------------
function triggerReward(newScore) {

    if (newScore === 10) {
        // 12 flower pieces made from the same logo image
        for (let i = 0; i < 12; i++) {
            const {x, y} = randomPos(100);
            createReward('assets/rialo.png', 'flower-piece', x, y);
        }
    }

    if (newScore === 100) {
        const {x, y} = randomPos(60);
        createReward('assets/cat-arm.png', 'cat-arm', x, y);
    }

    if (newScore === 1000) {
        const {x, y} = randomPos(40);
        createReward('assets/cat.png', 'cat-hug', x, y);
    }

    if (newScore === 10000) {
        const {x, y} = randomPos(30);
        createReward('assets/cat-superman.png', 'cat-super', x, y);
    }
}

// -------------------------------------------------
// Click handling – increment, persist, and check rewards
// -------------------------------------------------
