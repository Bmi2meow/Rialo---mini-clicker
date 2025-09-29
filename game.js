// Elements
const btn      = document.getElementById('btn');
const scoreEl  = document.getElementById('score');

// Load saved score (if any)
let score = Number(localStorage.getItem('score')) || 0;
scoreEl.textContent = score;

// Increment score on click
btn.addEventListener('click', () => {
    score++;
    scoreEl.textContent = score;
    localStorage.setItem('score', score); // persist across reloads
});
