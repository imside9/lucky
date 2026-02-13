const DURATION = 15;
let state = "idle";
let score = 0;
let timeLeft = DURATION;
let timerId = null;
let combo = 0;
let soundOn = true;
let screens;
let startBtn;
let tapBtn;
let shareBtn;
let retryBtn;
let soundToggleBtn;
let timeLeftEl;
let scoreEl;
let finalScoreEl;
let bestScoreEl;
let shareMessageEl;
let comboTextEl;
let hypeTextEl;
let rankEl;
let resultComboEl;

function loadBestScore() {
  try {
    const raw = localStorage.getItem("tap_challenge_best");
    const value = Number(raw);
    return Number.isFinite(value) ? value : 0;
  } catch (error) {
    return 0;
  }
}

function saveBestScore(value) {
  try {
    localStorage.setItem("tap_challenge_best", String(value));
  } catch (error) {
    // Keep app running even when storage is blocked.
  }
}

function showScreen(name) {
  Object.values(screens).forEach((screen) => {
    if (screen) screen.classList.remove("active");
  });
  if (screens[name]) {
    screens[name].classList.add("active");
  }
}

function renderGame() {
  timeLeftEl.textContent = String(timeLeft);
  scoreEl.textContent = String(score);
}

function startGame() {
  state = "playing";
  score = 0;
  timeLeft = DURATION;
  combo = 0;
  shareMessageEl.textContent = "";
  shareMessageEl.className = "share-message";
  comboTextEl.textContent = "콤보 x0";
  hypeTextEl.textContent = "";
  tapBtn.classList.remove("heated", "explode");
  renderGame();
  showScreen("game");

  if (timerId) clearInterval(timerId);
  timerId = setInterval(tickTimer, 1000);
}

function tickTimer() {
  if (state !== "playing") return;
  timeLeft -= 1;
  renderGame();

  if (timeLeft <= 0) {
    endGame();
  }
}

function handleTap() {
  if (state !== "playing") return;
  score += 1;
  combo += 1;
  scoreEl.textContent = String(score);
  comboTextEl.textContent = `콤보 x${combo}`;
  updateBurstState();
  playTapSound();
}

function getRank(score) {
  if (score >= 60) return "🔥 탭 마스터";
  if (score >= 45) return "⚡ 탭 고수";
  if (score >= 30) return "👍 탭 중수";
  if (score >= 15) return "🌱 탭 초보";
  return "🐢 느긋한 탭";
}

function endGame() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }

  state = "ended";

  const best = loadBestScore();
  const nextBest = Math.max(best, score);
  if (nextBest !== best) {
    saveBestScore(nextBest);
  }

  finalScoreEl.textContent = String(score);
  bestScoreEl.textContent = String(nextBest);
  rankEl.textContent = getRank(score);
  resultComboEl.textContent = String(combo);
  showScreen("result");
}

async function shareResult() {
  const text = `나는 15초 탭 버스트에서 ${score}점! 콤보는 ${combo}까지 갔어. 너도 도전해봐!`;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      shareMessageEl.textContent = "결과가 복사됐어요. 친구에게 붙여넣기 해보세요!";
      shareMessageEl.className = "share-message ok";
      return;
    }
    throw new Error("Clipboard API unavailable");
  } catch (error) {
    shareMessageEl.textContent = "복사에 실패했어요. 텍스트를 직접 공유해 주세요.";
    shareMessageEl.className = "share-message error";
  }
}

function initDom() {
  screens = {
    start: document.getElementById("start-screen"),
    game: document.getElementById("game-screen"),
    result: document.getElementById("result-screen"),
  };
  startBtn = document.getElementById("start-btn");
  tapBtn = document.getElementById("tap-btn");
  shareBtn = document.getElementById("share-btn");
  retryBtn = document.getElementById("retry-btn");
  soundToggleBtn = document.getElementById("sound-toggle");
  timeLeftEl = document.getElementById("time-left");
  scoreEl = document.getElementById("score");
  finalScoreEl = document.getElementById("final-score");
  bestScoreEl = document.getElementById("best-score");
  shareMessageEl = document.getElementById("share-message");
  comboTextEl = document.getElementById("combo-text");
  hypeTextEl = document.getElementById("hype-text");
  rankEl = document.getElementById("rank");
  resultComboEl = document.getElementById("result-combo");

  const required = [
    screens.start,
    screens.game,
    screens.result,
    startBtn,
    tapBtn,
    shareBtn,
    retryBtn,
    soundToggleBtn,
    timeLeftEl,
    scoreEl,
    finalScoreEl,
    bestScoreEl,
    shareMessageEl,
    comboTextEl,
    hypeTextEl,
    rankEl,
    resultComboEl,
  ];

  if (required.some((el) => !el)) {
    throw new Error("Required DOM elements are missing.");
  }
}

function init() {
  try {
    initDom();
  } catch (error) {
    console.error("Initialization failed:", error);
    return;
  }

  startBtn.addEventListener("click", startGame);
  tapBtn.addEventListener("click", handleTap);
  shareBtn.addEventListener("click", shareResult);
  retryBtn.addEventListener("click", startGame);
  soundToggleBtn.addEventListener("click", () => {
    soundOn = !soundOn;
    soundToggleBtn.textContent = soundOn ? "사운드 ON" : "사운드 OFF";
  });

  bestScoreEl.textContent = String(loadBestScore());
  showScreen("start");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

function updateBurstState() {
  if (combo >= 30) {
    tapBtn.classList.add("explode");
    tapBtn.classList.remove("heated");
    hypeTextEl.textContent = "HYPER BURST!";
    return;
  }
  if (combo >= 15) {
    tapBtn.classList.add("heated");
    tapBtn.classList.remove("explode");
    hypeTextEl.textContent = "HOT STREAK!";
    return;
  }
  tapBtn.classList.remove("heated", "explode");
  hypeTextEl.textContent = combo >= 8 ? "NICE COMBO!" : "";
}

function playTapSound() {
  if (!soundOn) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = 520 + Math.min(combo, 30) * 6;
    gain.gain.value = 0.04;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (error) {
    // Ignore sound errors.
  }
}
