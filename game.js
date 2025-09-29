// -------------------- VARIABLES --------------------
let score = 0;
let clickValue = 1;

// Upgrade objects
let upgrades = {
  doubleClick: {
    cost: 50,
    multiplier: 2,
    purchased: false
  }
};

let passiveUpgrades = {
  autoClicker: {
    cost: 100,
    cps: 1,
    amount: 0
  }
};

// Milestone animation control
let milestones = [10, 100, 1000, 10000];
let milestoneShown = {}; // to avoid repeating animation for the same milestone

// -------------------- CORE GAME --------------------
function clickButton() {
  score += clickValue;
  updateDisplay();
  checkMilestones();
}

// -------------------- UPGRADES --------------------
function buyDoubleClick() {
  let u = upgrades.doubleClick;
  if (!u.purchased && score >= u.cost) {
    score -= u.cost;
    clickValue *= u.multiplier;
    u.purchased = true;
    updateDisplay();
    updateUpgradeUI();
    saveGame();
  }
}

function buyAutoClicker() {
  let u = passiveUpgrades.autoClicker;
  if (score >= u.cost) {
    score -= u.cost;
    u.amount += 1;
    u.cost = Math.floor(u.cost * 1.3);
    updateDisplay();
    updatePassiveUI();
    saveGame();
  }
}

// -------------------- UI UPDATES --------------------
function updateDisplay() {
  document.getElementById("score").innerText = formatNumber(score);
}

function updateUpgradeUI() {
  let btn = document.getElementById("btnDoubleClick");
  if (upgrades.doubleClick.purchased) {
    btn.innerText = "Purchased";
    btn.disabled = true;
  } else {
    btn.innerText = `Buy x2 (Cost: ${upgrades.doubleClick.cost})`;
  }
}

function updatePassiveUI() {
  let btn = document.getElementById("btnAutoClicker");
  btn.innerText = `Buy AutoClicker (Cost: ${passiveUpgrades.autoClicker.cost}) — Owned: ${passiveUpgrades.autoClicker.amount}`;
}

// -------------------- PASSIVE INCOME --------------------
setInterval(function () {
  let inc = passiveUpgrades.autoClicker.amount * passiveUpgrades.autoClicker.cps;
  score += inc;
  if (inc > 0) {
    updateDisplay();
    checkMilestones();
  }
}, 1000);

// -------------------- MILESTONE ANIMATIONS --------------------
function checkMilestones() {
  for (let m of milestones) {
    if (score >= m && !milestoneShown[m]) {
      showMilestoneAnimation(m);
      milestoneShown[m] = true;
    }
  }
}

function showMilestoneAnimation(m) {
  let banner = document.createElement("div");
  banner.className = "milestone-banner";
  banner.innerText = `Milestone reached: ${formatNumber(m)}!`;
  document.body.appendChild(banner);

  setTimeout(() => {
    banner.remove();
  }, 10000); // 10 seconds
}

// -------------------- SAVE / LOAD --------------------
function saveGame() {
  let data = {
    score,
    clickValue,
    upgrades,
    passiveUpgrades,
    milestoneShown
  };
  localStorage.setItem("rialoClicker_save", JSON.stringify(data));
}

function loadGame() {
  let data = JSON.parse(localStorage.getItem("rialoClicker_save"));
  if (data) {
    score = data.score;
    clickValue = data.clickValue;
    upgrades = data.upgrades;
    passiveUpgrades = data.passiveUpgrades;
    milestoneShown = data.milestoneShown || {};
  }
  updateDisplay();
  updateUpgradeUI();
  updatePassiveUI();
}

// Auto save every 5 seconds
setInterval(saveGame, 5000);

// -------------------- HELPER --------------------
function formatNumber(num) {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
  return num;
}

// -------------------- INIT --------------------
window.onload = function () {
  loadGame();
};
