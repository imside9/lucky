// 중학생 필수 영단어 데이터셋
const wordPool = [
    { word: "apple", meaning: "사과" },
    { word: "book", meaning: "책" },
    { word: "school", meaning: "학교" },
    { word: "friend", meaning: "친구" },
    { word: "happy", meaning: "행복한" },
    { word: "music", meaning: "음악" },
    { word: "water", meaning: "물" },
    { word: "family", meaning: "가족" },
    { word: "dream", meaning: "꿈" },
    { word: "travel", meaning: "여행" },
    { word: "beautiful", meaning: "아름다운" },
    { word: "weather", meaning: "날씨" },
    { word: "garden", meaning: "정원" },
    { word: "animal", meaning: "동물" },
    { word: "history", meaning: "역사" },
    { word: "science", meaning: "과학" },
    { word: "kitchen", meaning: "부엌" },
    { word: "mountain", meaning: "산" },
    { word: "island", meaning: "섬" },
    { word: "library", meaning: "도서관" },
    { word: "hospital", meaning: "병원" },
    { word: "bridge", meaning: "다리" },
    { word: "village", meaning: "마을" },
    { word: "holiday", meaning: "휴일" },
    { word: "morning", meaning: "아침" },
    { word: "evening", meaning: "저녁" },
    { word: "summer", meaning: "여름" },
    { word: "winter", meaning: "겨울" },
    { word: "spring", meaning: "봄" },
    { word: "country", meaning: "나라" },
    { word: "language", meaning: "언어" },
    { word: "market", meaning: "시장" },
    { word: "picture", meaning: "그림" },
    { word: "success", meaning: "성공" },
    { word: "nature", meaning: "자연" },
    { word: "window", meaning: "창문" },
    { word: "together", meaning: "함께" },
    { word: "shoulder", meaning: "어깨" },
    { word: "teacher", meaning: "선생님" },
    { word: "student", meaning: "학생" },
    { word: "culture", meaning: "문화" },
    { word: "example", meaning: "예시" },
    { word: "problem", meaning: "문제" },
    { word: "special", meaning: "특별한" },
    { word: "foreign", meaning: "외국의" },
    { word: "popular", meaning: "인기 있는" },
    { word: "produce", meaning: "생산하다" },
    { word: "protect", meaning: "보호하다" },
    { word: "promise", meaning: "약속" },
    { word: "prepare", meaning: "준비하다" },
];

// 고양이 유튜브 숏츠 영상 ID 풀
const catVideoIds = [
    "JxS5E-kZc2s",
    "tpiyEe_CqB4",
    "SMYgcS53Ezk",
    "tVx2uCcDXAo",
    "4FnCPCbBgs8",
    "W86cTIoMv2U",
    "QH2-TGUlwu4",
    "j5a0jTc9S10",
    "hY7m5jjJ9mM",
    "0Bmhjf0rKe8",
];

// 상태
let currentQuiz = [];
let currentStep = 0;

// DOM 요소
const screens = {
    start: document.getElementById("start-screen"),
    quiz: document.getElementById("quiz-screen"),
    wrong: document.getElementById("wrong-screen"),
    reward: document.getElementById("reward-screen"),
};

const startBtn = document.getElementById("start-btn");
const submitBtn = document.getElementById("submit-btn");
const retryBtn = document.getElementById("retry-btn");
const replayBtn = document.getElementById("replay-btn");
const answerInput = document.getElementById("answer-input");
const quizNumber = document.getElementById("quiz-number");
const quizMeaning = document.getElementById("quiz-meaning");
const quizHint = document.getElementById("quiz-hint");
const feedback = document.getElementById("feedback");
const wrongMessage = document.getElementById("wrong-message");
const videoContainer = document.getElementById("video-container");

// 화면 전환
function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove("active"));
    screens[name].classList.add("active");
}

// 랜덤 단어 3개 뽑기 (중복 없이, 출제 방향 랜덤 지정)
function pickRandomWords() {
    const shuffled = [...wordPool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3).map((item) => ({
        ...item,
        // "en-to-kr": 영단어 보여주고 한국어 뜻 입력
        // "kr-to-en": 한국어 뜻 보여주고 영단어 입력
        direction: Math.random() < 0.5 ? "en-to-kr" : "kr-to-en",
    }));
}

// 힌트 생성: 글자 수만 표시 (첫 글자 노출 없음)
function makeHint(answer) {
    return "_ ".repeat(answer.length).trim() + ` (${answer.length}글자)`;
}

// 프로그레스 바 업데이트
function updateProgress() {
    const steps = document.querySelectorAll(".progress-step");
    const lines = document.querySelectorAll(".progress-line");

    steps.forEach((step, i) => {
        step.classList.remove("active", "done");
        if (i < currentStep) step.classList.add("done");
        else if (i === currentStep) step.classList.add("active");
    });

    lines.forEach((line, i) => {
        line.classList.remove("done");
        if (i < currentStep) line.classList.add("done");
    });
}

// 현재 문제의 질문/정답 가져오기
function getQuestionData(q) {
    if (q.direction === "en-to-kr") {
        return { display: q.word, answer: q.meaning, hint: makeHint(q.meaning), placeholder: "한국어 뜻을 입력하세요" };
    }
    return { display: q.meaning, answer: q.word, hint: makeHint(q.word), placeholder: "영단어를 입력하세요" };
}

// 퀴즈 문제 표시
function showQuestion() {
    const q = currentQuiz[currentStep];
    const data = getQuestionData(q);
    quizNumber.textContent = currentStep + 1;
    quizMeaning.textContent = data.display;
    quizHint.textContent = data.hint;
    answerInput.value = "";
    answerInput.placeholder = data.placeholder;
    feedback.textContent = "";
    feedback.className = "feedback";
    answerInput.classList.remove("shake");
    answerInput.focus();
    updateProgress();
}

// 퀴즈 시작
function startQuiz() {
    currentQuiz = pickRandomWords();
    currentStep = 0;
    showScreen("quiz");
    showQuestion();
}

// 정답 확인
function checkAnswer() {
    const q = currentQuiz[currentStep];
    const data = getQuestionData(q);
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = data.answer.toLowerCase();

    if (!userAnswer) {
        answerInput.classList.add("shake");
        setTimeout(() => answerInput.classList.remove("shake"), 400);
        return;
    }

    if (userAnswer === correctAnswer) {
        // 정답
        feedback.textContent = "정답이에요!";
        feedback.className = "feedback correct";
        document.querySelector(".quiz-card").classList.add("celebrate");
        setTimeout(() => document.querySelector(".quiz-card").classList.remove("celebrate"), 400);

        submitBtn.disabled = true;
        answerInput.disabled = true;

        setTimeout(() => {
            submitBtn.disabled = false;
            answerInput.disabled = false;
            currentStep++;

            if (currentStep >= 3) {
                showReward();
            } else {
                showQuestion();
            }
        }, 800);
    } else {
        // 오답
        feedback.textContent = `오답! 정답은 "${data.answer}" 이에요.`;
        feedback.className = "feedback wrong";
        answerInput.classList.add("shake");
        setTimeout(() => answerInput.classList.remove("shake"), 400);

        submitBtn.disabled = true;
        answerInput.disabled = true;

        setTimeout(() => {
            wrongMessage.innerHTML = `"${data.display}" 의 정답은<br><strong>"${data.answer}"</strong> 이에요.<br>다시 도전해보세요!`;
            showScreen("wrong");
            submitBtn.disabled = false;
            answerInput.disabled = false;
        }, 1200);
    }
}

// 보상 화면: 랜덤 고양이 숏츠 1개 표시
function showReward() {
    const shuffled = [...catVideoIds].sort(() => Math.random() - 0.5);
    const id = shuffled[0];

    videoContainer.innerHTML = `
        <div class="video-wrapper">
            <iframe
                src="https://www.youtube.com/embed/${id}?rel=0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
            ></iframe>
        </div>
    `;

    showScreen("reward");
}

// 이벤트 리스너
startBtn.addEventListener("click", startQuiz);
submitBtn.addEventListener("click", checkAnswer);
retryBtn.addEventListener("click", startQuiz);
replayBtn.addEventListener("click", () => {
    showScreen("start");
});

// Enter 키로 정답 제출
answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        checkAnswer();
    }
});
