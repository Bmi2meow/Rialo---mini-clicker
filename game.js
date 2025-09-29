let score = 0;
let milestones = { 10: false, 100: false, 1000: false };

// ---------------- CLICK ----------------
function clickButton() {
  let multiplier = getRandomMultiplier();
  let gain = 1 * multiplier;
  score += gain;
  document.getElementById("score").innerText = score;

  if (multiplier > 1) {
    showMultiplierEffect(multiplier);
  }

  checkMilestones();
}

// ---------------- RANDOM MULTIPLIER ----------------
function getRandomMultiplier() {
  let roll = Math.random();
  if (roll < 0.05) return 10;   // 5% x10
  if (roll < 0.15) return 3;    // 10% x3
  if (roll < 0.35) return 2;    // 20% x2
  return 1;                     // 65% normal
}

function showMultiplierEffect(multiplier) {
  let msg = document.createElement("div");
  msg.innerText = `x${multiplier}!`;
  msg.style.position = "fixed";
  msg.style.top = "50%";
  msg.style.left = "50%";
  msg.style.transform = "translate(-50%, -50%)";
  msg.style.fontSize = "40px";
  msg.style.fontWeight = "bold";
  msg.style.color = "red";
  msg.style.zIndex = "5000";
  document.body.appendChild(msg);

  setTimeout(() => msg.remove(), 1000);
}

// ---------------- MILESTONES ----------------
function checkMilestones() {
  if (score >= 10 && !milestones[10]) {
    milestones[10] = true;
    launchFlowers();
  }
  if (score >= 100 && !milestones[100]) {
    milestones[100] = true;
    showCatHand();
  }
  if (score >= 1000 && !milestones[1000]) {
    milestones[1000] = true;
    flySuperCat();
  }
}

// ---------------- FLOWERS (10 points) ----------------
function launchFlowers() {
  let container = document.getElementById("effect-container");

  for (let i = 0; i < 1000; i++) {
    let flower = document.createElement("div");
    flower.className = "flower";
    flower.style.left = Math.random() * 100 + "vw";
    flower.style.animationDuration = (2 + Math.random() * 3) + "s";
    container.appendChild(flower);

    setTimeout(() => flower.remove(), 10000); // giữ 10s
  }
}

// ---------------- CAT HAND (100 points) ----------------
function showCatHand() {
  let btn = document.getElementById("clickBtn");
  let rect = btn.getBoundingClientRect();

  let hand = document.createElement("div");
  hand.className = "cat-hand";
  hand.id = "catHand"; // để dễ reset
  hand.style.left = rect.left + window.scrollX + "px";
  hand.style.top = rect.top + window.scroll
