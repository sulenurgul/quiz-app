const startButton = document.querySelector("#start-btn");
const startScreen = document.querySelector("#start-screen");
const quizScreen = document.querySelector("#quiz-screen");

const questionElement = document.querySelector("#question");
const optionsContainer = document.querySelector("#options-container");
const questionNumber = document.querySelector("#question-number");

const nextButton = document.querySelector("#next-btn");

const resultScreen = document.querySelector("#result-screen");
const resultText = document.querySelector("#result-text");

const replayButton = document.querySelector("#replay-btn");
const quitButton = document.querySelector("#quit-btn");

const timerElement = document.querySelector("#timer");

let timeLeft = 10;
let timer;

function Question(question, options, correctAnswer) {
  this.question = question;
  this.options = options;
  this.correctAnswer = correctAnswer;
}

Question.prototype.checkAnswer = function (selectedAnswer) {
  return selectedAnswer === this.correctAnswer;
};

function Quiz(questions) {
  this.questions = questions;
  this.currentQuestion = 0;
  this.score = 0;
}

Quiz.prototype.nextQuestion = function () {
  this.currentQuestion++;
};

Quiz.prototype.resetQuiz = function () {
  this.currentQuestion = 0;
  this.score = 0;
};

Quiz.prototype.isFinished = function () {
  return this.currentQuestion >= this.questions.length;
};

const questions = [
  new Question(
    "Web sayfalarına stil vermek için hangi dil kullanılır?",
    ["HTML", "CSS", "JavaScript", "Python"],
    "CSS",
  ),

  new Question(
    "DOM'un açılımı nedir?",
    [
      "Document Object Model",
      "Data Object Model",
      "Document Oriented Model",
      "Desktop Object Model",
    ],
    "Document Object Model",
  ),

  new Question(
    "Bir HTML elementini seçmek için hangi metot kullanılabilir?",
    [
      "document.querySelector()",
      "document.createElement()",
      "document.append()",
      "document.remove()",
    ],
    "document.querySelector()",
  ),

  new Question(
    "Sabit bir değişken oluşturmak için hangi anahtar kelime kullanılır?",
    ["let", "var", "const", "function"],
    "const",
  ),
];

const quiz = new Quiz(questions);

function startQuiz() {
  quiz.resetQuiz();

  startScreen.classList.add("d-none");
  quizScreen.classList.remove("d-none");

  showQuestion();
  startTimer();
}

function showQuestion() {
  nextButton.classList.add("d-none");

  const currentQuizQuestion = quiz.questions[quiz.currentQuestion];

  questionElement.textContent = currentQuizQuestion.question;

  questionNumber.textContent = `${quiz.currentQuestion + 1} / ${quiz.questions.length}`;

  optionsContainer.innerHTML = "";

  currentQuizQuestion.options.forEach(function (option) {
    const optionButton = document.createElement("button");

    optionButton.textContent = option;

    optionButton.classList.add(
      "btn",
      "btn-outline-primary",
      "text-start",
      "p-3",
    );

    optionButton.addEventListener("click", selectAnswer);

    optionsContainer.append(optionButton);
  });
}

function showCorrectAnswer() {
  const currentQuizQuestion = quiz.questions[quiz.currentQuestion];

  const correctAnswer = currentQuizQuestion.correctAnswer;

  const allOptions = document.querySelectorAll("#options-container button");

  allOptions.forEach(function (button) {
    button.disabled = true;

    if (button.textContent === correctAnswer) {
      button.classList.remove("btn-outline-primary");
      button.classList.add("btn-success");

      button.textContent += " ✓";
    }
  });
}

function selectAnswer(event) {
  clearInterval(timer);

  const selectedButton = event.target;
  const selectedAnswer = selectedButton.textContent;

  const currentQuizQuestion = quiz.questions[quiz.currentQuestion];

  const isCorrect = currentQuizQuestion.checkAnswer(selectedAnswer);

  if (isCorrect) {
    quiz.score++;
  }

  showCorrectAnswer();

  if (!isCorrect) {
    selectedButton.classList.remove("btn-outline-primary");
    selectedButton.classList.add("btn-danger");

    selectedButton.textContent += " ✕";
  }

  nextButton.classList.remove("d-none");
}

function nextQuestion() {
  quiz.nextQuestion();

  if (!quiz.isFinished()) {
    showQuestion();
    startTimer();
  } else {
    showResult();
  }
}

function showResult() {
  clearInterval(timer);

  quizScreen.classList.add("d-none");
  resultScreen.classList.remove("d-none");

  resultText.textContent = `${quiz.questions.length} sorudan ${quiz.score} doğru yaptın.`;
}

function replayQuiz() {
  quiz.resetQuiz();

  resultScreen.classList.add("d-none");
  quizScreen.classList.remove("d-none");

  showQuestion();
  startTimer();
}

function quitQuiz() {
  clearInterval(timer);

  quiz.resetQuiz();

  resultScreen.classList.add("d-none");
  quizScreen.classList.add("d-none");
  startScreen.classList.remove("d-none");
}

function timeIsUp() {
  showCorrectAnswer();

  nextButton.classList.remove("d-none");
}

function startTimer() {
  clearInterval(timer);

  timeLeft = 10;
  timerElement.textContent = timeLeft;

  timer = setInterval(function () {
    timeLeft--;

    timerElement.textContent = timeLeft;

    if (timeLeft === 0) {
      clearInterval(timer);
      timeIsUp();
    }
  }, 1000);
}

startButton.addEventListener("click", startQuiz);

nextButton.addEventListener("click", nextQuestion);

replayButton.addEventListener("click", replayQuiz);

quitButton.addEventListener("click", quitQuiz);
