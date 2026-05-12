/* game.js — SmileCare Dental Quiz */

const questions = [
  {
    category: "Brushing Technique",
    text: "At what angle should you hold your toothbrush for the most effective cleaning?",
    answers: ["90° straight up", "45° toward gumline", "30° away from gums", "Any angle works"],
    correct: 1,
    explanation: "A 45° angle toward the gumline lets bristles clean both the tooth surface and the edge of the gums simultaneously — the most effective position."
  },
  {
    category: "Time & Frequency",
    text: "How long should you brush your teeth each time?",
    answers: ["30 seconds", "1 minute", "2 minutes", "5 minutes"],
    correct: 2,
    explanation: "Dentists recommend brushing for 2 full minutes — splitting your mouth into 4 zones of 30 seconds each ensures thorough coverage."
  },
  {
    category: "Daily Habits",
    text: "Which brushing session is considered most important for cavity prevention?",
    answers: ["Morning, after breakfast", "Afternoon, after lunch", "Before bed at night", "Whenever you feel like it"],
    correct: 2,
    explanation: "Night brushing is most critical because saliva flow drops dramatically during sleep, leaving bacteria to feed on food particles for hours."
  },
  {
    category: "Equipment",
    text: "How often should you replace your toothbrush?",
    answers: ["Every month", "Every 3 months", "Every 6 months", "Once a year"],
    correct: 1,
    explanation: "Replace your toothbrush every 3 months — worn bristles lose cleaning ability and harbor bacteria. Also replace after any illness."
  },
  {
    category: "Dental Products",
    text: "What ingredient in toothpaste is most important for preventing cavities?",
    answers: ["Baking soda", "Hydrogen peroxide", "Fluoride", "Menthol"],
    correct: 2,
    explanation: "Fluoride strengthens enamel and remineralizes early cavities. Adults should use a toothpaste with 1000-1500 ppm fluoride."
  },
  {
    category: "Flossing",
    text: "What percentage of tooth surfaces does brushing alone clean?",
    answers: ["100%", "85%", "60%", "40%"],
    correct: 2,
    explanation: "Brushing only cleans about 60% of tooth surfaces. The remaining 40% — the spaces between teeth — can only be reached by floss or interdental brushes."
  },
  {
    category: "Tongue & Breath",
    text: "What is the primary cause of bad breath (halitosis)?",
    answers: ["Not using mouthwash", "Bacteria on the tongue", "Drinking too much coffee", "Skipping breakfast"],
    correct: 1,
    explanation: "The tongue harbors millions of bacteria that produce sulfur compounds — the main cause of bad breath. Cleaning your tongue daily dramatically reduces this."
  },
  {
    category: "Diet & Health",
    text: "Which food actually helps strengthen tooth enamel naturally?",
    answers: ["Candy", "Carbonated drinks", "Cheese & dairy", "Fruit juice"],
    correct: 2,
    explanation: "Cheese and dairy products are high in calcium and casein, which neutralize acids and actively help remineralize tooth enamel."
  },
  {
    category: "Brushing Technique",
    text: "What motion should you use when brushing to avoid damaging enamel?",
    answers: ["Hard back-and-forth scrubbing", "Gentle circular strokes", "Up-and-down only", "Diagonal zig-zag"],
    correct: 1,
    explanation: "Gentle circular motions lift plaque effectively without wearing away enamel or causing gum recession — unlike aggressive back-and-forth scrubbing."
  },
  {
    category: "Dental Visits",
    text: "How often should healthy adults visit the dentist for checkups?",
    answers: ["Once every 5 years", "Once a year", "Every 6 months", "Only when there's pain"],
    correct: 2,
    explanation: "Visiting the dentist every 6 months allows for professional cleaning to remove tartar and early detection of cavities — preventing costly treatment later."
  }
];

// State
let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let timerInterval = null;
let timerVal = 20;
const TIMER_MAX = 20;

function showScreen(id) {
  document.querySelectorAll('.game-screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function startGame() {
  currentQuestion = 0;
  score = 0;
  userAnswers = [];
  showScreen('quizScreen');
  loadQuestion();
}

function loadQuestion() {
  const q = questions[currentQuestion];

  // Header
  document.getElementById('questionCounter').textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;
  document.getElementById('liveScore').textContent = score;
  document.getElementById('progressFill').style.width =
    `${(currentQuestion / questions.length) * 100}%`;

  // Question text
  document.getElementById('qCategory').textContent = q.category;
  document.getElementById('questionText').textContent = q.text;

  // Answers
  const grid = document.getElementById('answerGrid');
  grid.innerHTML = '';
  q.answers.forEach((ans, i) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = ans;
    btn.onclick = () => selectAnswer(i);
    grid.appendChild(btn);
  });

  // Hide feedback
  const fb = document.getElementById('feedback');
  fb.classList.add('hidden');

  // Timer
  startQuestionTimer();
}

function startQuestionTimer() {
  clearInterval(timerInterval);
  timerVal = TIMER_MAX;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timerVal--;
    updateTimerDisplay();
    if (timerVal <= 0) {
      clearInterval(timerInterval);
      timeOut();
    }
  }, 1000);
}

function updateTimerDisplay() {
  document.getElementById('timerNum').textContent = timerVal;
  const pct = timerVal / TIMER_MAX;
  const circ = 2 * Math.PI * 25; // r=25
  const offset = circ * (1 - pct);
  document.getElementById('timerCircle').style.strokeDashoffset = offset;
  document.getElementById('timerCircle').style.stroke =
    pct > 0.4 ? 'var(--mint)' : pct > 0.2 ? '#f39c12' : '#e74c3c';
}

function timeOut() {
  disableAnswers();
  const q = questions[currentQuestion];
  document.querySelectorAll('.answer-btn')[q.correct].classList.add('correct');
  showFeedback(false, `⏱ Time's up! The correct answer: "${q.answers[q.correct]}" — ${q.explanation}`);
  userAnswers.push({ question: currentQuestion, selected: -1, correct: false });
}

function selectAnswer(index) {
  clearInterval(timerInterval);
  const q = questions[currentQuestion];
  const isCorrect = index === q.correct;
  if (isCorrect) score++;

  disableAnswers();

  const btns = document.querySelectorAll('.answer-btn');
  btns[q.correct].classList.add('correct');
  if (!isCorrect) btns[index].classList.add('wrong');

  userAnswers.push({ question: currentQuestion, selected: index, correct: isCorrect });
  showFeedback(isCorrect, isCorrect
    ? `✅ Correct! ${q.explanation}`
    : `❌ Not quite. ${q.explanation}`
  );
}

function disableAnswers() {
  document.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);
}

function showFeedback(correct, text) {
  const fb = document.getElementById('feedback');
  document.getElementById('fbIcon').textContent = correct ? '🎉' : '💡';
  document.getElementById('fbText').textContent = text;
  fb.classList.remove('hidden');
  document.getElementById('liveScore').textContent = score;
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion >= questions.length) {
    showResults();
  } else {
    loadQuestion();
  }
}

function showResults() {
  clearInterval(timerInterval);
  showScreen('resultScreen');

  document.getElementById('finalScore').textContent = score;
  document.getElementById('progressFill').style.width = '100%';

  const pct = score / questions.length;
  let grade, title, subtitle, emoji;

  if (pct === 1)        { grade = 'A+'; title = 'Perfect!';      subtitle = 'A flawless score — you truly know your dental health!'; emoji = '🏆'; }
  else if (pct >= 0.8)  { grade = 'A';  title = 'Excellent!';    subtitle = 'Outstanding knowledge of oral hygiene. Keep it up!';   emoji = '⭐'; }
  else if (pct >= 0.6)  { grade = 'B';  title = 'Good Job!';     subtitle = 'Solid understanding — review the tricky ones to ace it.'; emoji = '👍'; }
  else if (pct >= 0.4)  { grade = 'C';  title = 'Getting There'; subtitle = 'A good start! Explore the guide pages for more knowledge.'; emoji = '📚'; }
  else                   { grade = 'D';  title = 'Keep Learning'; subtitle = 'Check out our brushing and tips pages to boost your score!'; emoji = '🦷'; }

  document.getElementById('resultEmoji').textContent = emoji;
  document.getElementById('resultGrade').textContent = grade;
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultSubtitle').textContent = subtitle;

  // Breakdown
  const breakdown = document.getElementById('resultBreakdown');
  breakdown.innerHTML = userAnswers.map((ua, i) => {
    const q = questions[i];
    const sel = ua.selected === -1 ? 'Time out' : q.answers[ua.selected];
    return `
      <div class="rb-row">
        <strong>Q${i+1}: ${q.text.substring(0,45)}...</strong>
        <span class="${ua.correct ? 'rb-result-correct' : 'rb-result-wrong'}">
          ${ua.correct ? '✓ Correct' : '✗ Wrong'}
        </span>
      </div>
    `;
  }).join('');
}

function restartGame() {
  startGame();
}
