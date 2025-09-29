// -------------------------------------------------
// Elements
// -------------------------------------------------
const btn         = document.getElementById('btn');
const scoreEl     = document.getElementById('score');
const rewardLayer = document.getElementById('reward-layer');
const resetBtn    = document.getElementById('reset');

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
    const rect = document.querySelector('.logo').getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * radius;
    const x = cx + r * Math.cos(angle) - 15; // offset half of reward size
    const y = cy + r * Math.sin(angle) - 15;
    return { x, y };
}

// -------------------------------------------------
// Reward triggers for the four score milestones
// -------------------------------------------------
function triggerReward(newScore) {
    if (newScore === 10) {
        for (let i = 0; i < 12; i++) {
            const { x, y } = randomPos(100);
            createReward('assets/rialo.png', 'flower-piece', x, y);
        }
    }

    if (newScore === 100) {
        const { x, y } = randomPos(60);
        createReward('assets/cat-arm.png', 'cat-arm', x, y);
    }

    if (newScore === 1000) {
        const { x, y } = randomPos(40);
        createReward('assets/cat.png', 'cat-hug', x, y);
    }

    if (newScore === 10000) {
        const { x, y } = randomPos(30);
        createReward('assets/cat-superman.png', 'cat-super', x, y);
    }
}

// -------------------------------------------------
// Click handling – increment, persist, and check rewards
// -------------------------------------------------
btn.addEventListener('click', () => {
    score++;
    scoreEl.textContent = score;
    localStorage.setItem('score', score);
    triggerReward(score);
});

// -------------------------------------------------
// Reset game – bring everything back to the initial state
// -------------------------------------------------
function resetGame() {
    // 1️⃣ Reset the score
    score = 0;
    scoreEl.textContent = score;
    localStorage.setItem('score', score);

    // 2️⃣ Remove all reward images that were added to the page
    while (rewardLayer.firstChild) {
        rewardLayer.removeChild(rewardLayer.firstChild);
    }
}

// -------------------------------------------------
// Listen for the Reset button
// -------------------------------------------------
resetBtn.addEventListener('click', () => {
    if (confirm('Reset the game and start over?')) {
        resetGame();
    }
});
