// game.js - Rialo Mini Clicker (English UI & code)
// Author: assistant (provided to user)
// NOTES:
// - Milestones: 10, 100, 1000, 10000 -> show branded banner for 10 seconds
// - Reset clears localStorage and resets state
// - Script will try a few logo paths (cat-superman.png, cat.png, assets/...) automatically.
// - All public functions are attached to window so HTML onclick works.

"use strict";

/* -------------------- CONFIG -------------------- */
const LOGO_CANDIDATES = [
  "cat-superman.png",
  "cat.png",
  "assets/cat-superman.png",
  "assets/cat.png"
];

const MILESTONES = [10, 100, 1000, 10000];

/* -------------------- GAME STATE -------------------- */
let score = 0;
let clickValue = 1;

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

let milestoneShown = {}; // { "10": true, ... }
let prevScore = 0;

/* intervals */
let passiveInterval = null;
let autosaveInterval = null;

/* -------------------- UTIL -------------------- */
function formatNumber(num) {
  if (num === null || num === undefined) return "0";
  if (Number.isNaN(num)) return "0";
  const n = Number(num);
  if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(2) + "K";
  return Math.floor(n).toString();
}

/* choose first existing logo by trying to load images */
function chooseLogo() {
  return new Promise((resolve) => {
    let i = 0;
    function tryNext() {
      if (i >= LOGO_CANDIDATES.length) return resolve(null);
      const src = LOGO_CANDIDATES[i++];
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => tryNext();
      img.src = src;
    }
    tryNext();
  });
}

/* -------------------- UI UPDATES -------------------- */
function updateDisplay() {
  const scoreEl = document.getElementById("score");
  const clickValEl = document.getElementById("clickValue");
  if (scoreEl) scoreEl.innerText = formatNumber(score);
  if (clickValEl) clickValEl.innerText = formatNumber(clickValue);
}

function updateUpgradeUI() {
  const btn = document.getElementById("btnDoubleClick");
  if (!btn) return;
  if (upgrades.doubleClick.purchased) {
    btn.innerText = "Purchased";
    btn.disabled = true;
  } else {
    btn.innerText = `Buy x2 (Cost: ${formatNumber(upgrades.doubleClick.cost)})`;
    btn.disabled = score < upgrades.doubleClick.cost;
  }
}

function updatePassiveUI() {
  const btn = document.getElementById("btnAutoClicker");
  if (!btn) return;
  btn.innerText = `Buy AutoClicker (Cost: ${formatNumber(passiveUpgrades.autoClicker.cost)}) — Owned: ${passiveUpgrades.autoClicker.amount}`;
  btn.disabled = score < passiveUpgrades.autoClicker.cost;
}

/* -------------------- CORE ACTIONS -------------------- */
function clickButton() {
  prevScore = score;
  score += clickValue;
  updateDisplay();
  checkMilestonesCrossing(prevScore);
  saveGame();
}

function buyDoubleClick() {
  const u = upgrades.doubleClick;
  if (u.purchased) return;
  if (score < u.cost) return;
  score -= u.cost;
  clickValue *= u.multiplier;
  u.purchased = true;
  updateDisplay();
  updateUpgradeUI();
  saveGame();
}

function buyAutoClicker() {
  const u = passiveUpgrades.autoClicker;
  if (score < u.cost) return;
  score -= u.cost;
