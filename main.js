const screens = {
  start: document.getElementById("start-screen"),
  game: document.getElementById("game-screen"),
  result: document.getElementById("result-screen"),
};

const startBtn = document.getElementById("start-btn");
const tapBtn = document.getElementById("tap-btn");
const shareBtn = document.getElementById("share-btn");
const retryBtn = document.getElementById("retry-btn");

const timeLeftEl = document.getElementById("time-left");
const scoreEl = document.getElementById("score");
const finalScoreEl = document.getElementById("final-score");
const bestScoreEl = document.getElementById("best-score");
const shareMessageEl = document.getElementById("share-message");

const DURATION = 60;
let state = "idle";
let score = 0;
let timeLeft = DURATION;
let timerId = null;

function loadBestScore() {
  const raw = localStorage.getItem("tap_challenge_best");
  const value = Number(raw);
  return Number.isFinite(value) ? value : 0;
}

function saveBestScore(value) {
  localStorage.setItem("tap_challenge_best", String(value));
}

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
}

function renderGame() {
  timeLeftEl.textContent = String(timeLeft);
  scoreEl.textContent = String(score);
}

function startGame() {
  state = "playing";
  score = 0;
  timeLeft = DURATION;
  shareMessageEl.textContent = "";
  shareMessageEl.className = "share-message";
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
  scoreEl.textContent = String(score);
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
  showScreen("result");
}

async function shareResult() {
  const text = `나는 60초 탭 챌린지에서 ${score}점을 기록했어! 너도 도전해봐!`;

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

startBtn.addEventListener("click", startGame);
tapBtn.addEventListener("click", handleTap);
shareBtn.addEventListener("click", shareResult);
retryBtn.addEventListener("click", startGame);

bestScoreEl.textContent = String(loadBestScore());
showScreen("start");
