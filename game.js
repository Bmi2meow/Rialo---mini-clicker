// -------------------------------------------------
// Elements
// -------------------------------------------------
const btn         = document.getElementById('btn');
const scoreEl     = document.getElementById('score');
const rewardLayer = document.getElementById('reward-layer');
const resetBtn    = document.getElementById('reset');

// -------------------------------------------------
// Load saved score
// -------------------------------------------------
let score = Number(localStorage.getItem('score')) || 0;
scoreEl.textContent = score;

// -------------------------------------------------
// Helper: create an <img> element for a reward
// -------------------------------------------------
function createReward(src, className, x, y) {
    const img = document.createElement('img');
    img.src = src;
    img.className = className + ' rotate-10s';
    img.style.left = `${x}px`;
    img.style.top  = `${y}px`;
    rewardLayer.appendChild(img);
    setTimeout(() => img.remove(), 10_000);   // 10 s
}

// -------------------------------------------------
// Random position helper (unchanged)
// -------------------------------------------------
function randomPos(radius = 80) {
    const rect = document.querySelector('.logo').getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * radius;
    const x = cx + r * Math.cos(angle) - 15;
    const y = cy + r * Math.sin(angle) - 15;
    return { x, y };
}

// -------------------------------------------------
// Milestone rewards
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
// Click handling
// -------------------------------------------------
btn.addEventListener('click', () => {
    score++;
    scoreEl.textContent = score;
    localStorage.setItem('score', score);
    triggerReward(score);
});

// -------------------------------------------------
// Reset game (unchanged from earlier)
// -------------------------------------------------
function resetGame() {
    score = 0;
    scoreEl.textContent = score;
    localStorage.setItem('score', score);
    while (rewardLayer.firstChild) rewardLayer.removeChild(rewardLayer.firstChild);
}
resetBtn.addEventListener('click', () => {
    if (confirm('Reset the game and start over?')) resetGame();
});
