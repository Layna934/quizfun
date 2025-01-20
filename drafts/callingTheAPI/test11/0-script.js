class TriviaQuiz {
    constructor() {
        this.questions = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.isAnswered = false;

        // DOM Elements
        this.loadingElement = document.getElementById('loading');
        this.quizContainer = document.getElementById('quiz-container');
        this.resultsContainer = document.getElementById('results');
        this.questionElement = document.getElementById('question');
        this.answersElement = document.getElementById('answers');
        this.nextButton = document.getElementById('next-btn');
        this.progressElement = document.getElementById('progress');
        this.currentQuestionElement = document.getElementById('current-question');
        this.scoreElement = document.getElementById('score');
        this.scoreDisplay = document.getElementById('score-display');
        this.finalScoreElement = document.getElementById('final-score');
        this.restartButton = document.getElementById('restart-btn');
        this.themeToggle = document.getElementById('theme-toggle');

        // Bind event listeners
        this.nextButton.addEventListener('click', () => this.nextQuestion());
        this.restartButton.addEventListener('click', () => this.restartQuiz());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Initialize theme
        this.loadTheme();
    }

    async fetchQuestions() {
        try {
            const response = await fetch('https://opentdb.com/api.php?amount=10');
            const data = await response.json();

            if (data.response_code === 0) {
                this.questions = data.results;
                this.startQuiz();
            } else {
                throw new Error('Failed to load questions');
            }
        } catch (error) {
            this.showError('Failed to load questions. Please try again.');
        }
    }

    startQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.loadingElement.classList.add('hidden');
        this.quizContainer.classList.remove('hidden');
        this.resultsContainer.classList.add('hidden');
        this.updateScore();
        this.displayQuestion();
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestion];
        this.isAnswered = false;

        // Update progress
        this.progressElement.style.width = `${(this.currentQuestion + 1) * 10}%`;
        this.currentQuestionElement.textContent = this.currentQuestion + 1;

        // Display question
        this.questionElement.innerHTML = this.decodeHTML(question.question);

        // Create answers array
        let answers = [...question.incorrect_answers, question.correct_answer];
        answers = this.shuffleArray(answers);

        // Generate answer buttons
        this.answersElement.innerHTML = answers
            .map(answer => `
                <button class="answer-button" data-answer="${answer}">
                    ${this.decodeHTML(answer)}
                </button>
            `).join('');

        // Add click handlers to answer buttons
        this.answersElement.querySelectorAll('.answer-button').forEach(button => {
            button.addEventListener('click', () => this.checkAnswer(button));
        });

        this.nextButton.classList.add('hidden');
    }

    checkAnswer(selectedButton) {
        if (this.isAnswered) return;

        this.isAnswered = true;
        const question = this.questions[this.currentQuestion];
        const selectedAnswer = selectedButton.dataset.answer;
        const isCorrect = selectedAnswer === question.correct_answer;

        // Highlight correct and incorrect answers
        this.answersElement.querySelectorAll('.answer-button').forEach(button => {
            button.disabled = true;
            if (button.dataset.answer === question.correct_answer) {
                button.classList.add('correct');
            } else if (button === selectedButton) {
                button.classList.add('incorrect');
            }
        });

        // Update score
        if (isCorrect) {
            this.score++;
            this.updateScore();
        }

        // Show next button
        this.nextButton.classList.remove('hidden');
    }

    nextQuestion() {
        this.currentQuestion++;

        if (this.currentQuestion >= this.questions.length) {
            this.showResults();
        } else {
            this.displayQuestion();
        }
    }

    showResults() {
        this.quizContainer.classList.add('hidden');
        this.resultsContainer.classList.remove('hidden');
        this.finalScoreElement.textContent = this.score;

        // Display custom message based on score
        let message = '';
        if (this.score <= 4) {
            message = "You tried, but you can do better!";
        } else if (this.score >= 5 && this.score <= 7) {
            message = "You're amazing. Keep it up!";
        } else if (this.score >= 8 && this.score <= 9) {
            message = "You're Almost There! 🤩";
        } else if (this.score === 10) {
            message = "You're A Trailblazer! 🥳🤩";
        }

        // Display the message in the score display in the header
        this.scoreDisplay.innerHTML = `Score: <span id="score">${this.score}</span>/<span id="total-questions">10</span><br><span id="score-message">${message}</span>`;
    }

    restartQuiz() {
        this.loadingElement.classList.remove('hidden');
        this.resultsContainer.classList.add('hidden');
        this.fetchQuestions();
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
    }

    showError(message) {
        this.loadingElement.innerHTML = `
            <p class="error">${message}</p>
            <button class="restart-button" onclick="quiz.fetchQuestions()">Try Again</button>
        `;
    }

    // Utility functions
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    decodeHTML(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    // Theme handling functions
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.className = `${savedTheme}-theme`;
    }

    toggleTheme() {
        const isLight = document.body.classList.contains('light-theme');
        const newTheme = isLight ? 'dark' : 'light';
        document.body.className = `${newTheme}-theme`;
        localStorage.setItem('theme', newTheme);
    }
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.quiz = new TriviaQuiz();
    quiz.fetchQuestions();
});
