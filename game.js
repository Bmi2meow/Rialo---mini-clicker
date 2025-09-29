const btn   = document.getElementById('btn');
const scoreEl = document.getElementById('score');
let score = 0;

btn.addEventListener('click', () => {
    score++;
    scoreEl.textContent = score;
});

