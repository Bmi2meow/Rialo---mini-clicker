const btn      = document.getElementById('btn');
const scoreEl  = document.getElementById('score');
let score      = Number(localStorage.getItem('score')) || 0;

// Đưa điểm đã lưu (nếu có) lên giao diện
scoreEl.textContent = score;

btn.addEventListener('click', () => {
    score++;
    scoreEl.textContent = score;
    localStorage.setItem('score', score);   // lưu điểm
});
