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
    const rect = document.querySelector('.logo').getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * radius;
    // Offset half of the reward size (≈15 px) to centre it
    const x = cx + r * Math.cos(angle) - 15;
    const y = cy + r * Math.sin(angle) - 15;
    return { x, y };
}

// -------------------------------------------------
// Reward triggers for the four score milestones
// -------------------------------------------------
function triggerReward(newScore) {
    // 10 points – flower made of many tiny logos
    if (newScore === 10) {
        for (let i = 0; i < 12; i++) {
            const { x, y } = randomPos(100);
            createReward('assets/rialo.png', 'flower-piece', x, y);
        }
    }

    // 100 points – cat arm pushes the logo
    if (newScore === 100) {
        const { x, y } = randomPos(60);
        createReward('assets/cat-arm.png', 'cat-arm', x, y);
    }

    // 1 000 points – cat hugs the logo
    if (newScore === 1000) {
        const { x, y } = randomPos(40);
        createReward('assets/cat.png', 'cat-hug', x, y);
    }

    // 10 000 points – cat becomes Superman
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
    localStorage.setItem('score', score); // keep it across reloads

    // See if we just hit a reward threshold
    triggerReward(score);
});
