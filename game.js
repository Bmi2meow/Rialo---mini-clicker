// -------------------------------------------------
// Elements
// -------------------------------------------------
const btn     = document.getElementById('btn');
const scoreEl = document.getElementById('score');
const rewardLayer = document.getElementById('reward-layer');

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
    img.className = className;
    // Position relative to the logo (center of viewport)
    img.style.left = `${x}px`;
    img.style.top  = `${y}px`;
    rewardLayer.appendChild(img);
    // Remove after animation ends (max 2.5s)
    setTimeout(() => img.remove(), 2500);
}

// -------------------------------------------------
// Generate random positions around the center logo
// ------------------------------------------
