document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category');
    const startQuizButton = document.getElementById('start-quiz');
    const quizContainer = document.getElementById('quiz-container');
    const resultsContainer = document.getElementById('results');
    const questionText = document.getElementById('question');
    const answersContainer = document.getElementById('answers');
    const progress = document.getElementById('progress');
    const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');
    let currentQuestionIndex = 0;
    let quizData = [];
    let score = 0;

    // Fetch categories from the trivia API
    fetch('https://opentdb.com/api_category.php')
        .then(response => response.json())
        .then(data => {
            const categories = data.trivia_categories;
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
        });

    // Handle Start Quiz Button Click
    startQuizButton.addEventListener('click', () => {
        const selectedCategory = categorySelect.value;
        const selectedDifficulty = document.getElementById('difficulty').value;

        if (!selectedCategory) {
            alert('Please select a category');
            return;
        }

        // Fetch questions for the selected category and difficulty
        fetch(`https://opentdb.com/api.php?amount=10&category=${selectedCategory}&difficulty=${selectedDifficulty}`)
            .then(response => response.json())
            .then(data => {
                quizData = data.results;
                totalQuestionsSpan.textContent = quizData.length;
                loadQuestion();
                quizContainer.classList.remove('hidden');
                startQuizButton.disabled = true;
            })
            .catch(error => {
                console.error('Error fetching quiz questions:', error);
                document.getElementById('error-message').textContent = 'There was an error fetching the quiz data.';
                document.getElementById('error-container').classList.remove('hidden');
            });
    });

    // Function to load the current question and answers
    function loadQuestion() {
        const currentQuestion = quizData[currentQuestionIndex];
        questionText.textContent = currentQuestion.question;
        answersContainer.innerHTML = '';
        const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
        shuffleArray(allAnswers).forEach(answer => {
            const answerButton = document.createElement('button');
            answerButton.textContent = answer;
            answerButton.classList.add('answer-btn');
            answerButton.addEventListener('click', () => handleAnswerClick(answer));
            answersContainer.appendChild(answerButton);
        });

        currentQuestionSpan.textContent = currentQuestionIndex + 1;
        progress.style.width = `${((currentQuestionIndex + 1) / quizData.length) * 100}%`;
    }

    // Function to handle answer click
    function handleAnswerClick(selectedAnswer) {
        const correctAnswer = quizData[currentQuestionIndex].correct_answer;

        if (selectedAnswer === correctAnswer) {
            score++;
        }

        // Move to the next question
        currentQuestionIndex++;

        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }

    // Function to show results
    function showResults() {
        quizContainer.classList.add('hidden');
        resultsContainer.classList.remove('hidden');
        document.getElementById('final-score').textContent = `${score}/${quizData.length}`;
        document.getElementById('score-message').textContent = getScoreMessage(score);
    }

    // Function to get the score message
    function getScoreMessage(score) {
        if (score === quizData.length) {
            return 'Perfect score!';
        } else if (score >= quizData.length * 0.7) {
            return 'Great job!';
        } else {
            return 'Better luck next time!';
        }
    }

    // Shuffle array function (Fisher-Yates algorithm)
    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Restart the quiz
    document.getElementById('restart-btn').addEventListener('click', () => {
        location.reload();
    });
});


class TriviaQuiz {
    constructor() {
        this.categories = [];
        this.questions = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.isAnswered = false;

        // DOM Elements
        this.setupContainer = document.getElementById('quiz-setup');
        this.quizContainer = document.getElementById('quiz-container');
        this.resultsContainer = document.getElementById('results');
        this.errorContainer = document.getElementById('error-container');
        this.categorySelect = document.getElementById('category');
        this.difficultySelect = document.getElementById('difficulty');
        this.startButton = document.getElementById('start-quiz');
        this.questionElement = document.getElementById('question');
        this.answersElement = document.getElementById('answers');
        this.nextButton = document.getElementById('next-btn');
        this.progressElement = document.getElementById('progress');
        this.currentQuestionElement = document.getElementById('current-question');
        this.currentScoreElement = document.getElementById('current-score');
        this.totalQuestionsElement = document.getElementById('total-questions');
        this.currentCategoryElement = document.getElementById('current-category');
        this.finalScoreElement = document.getElementById('final-score');
        this.scoreMessageElement = document.getElementById('score-message');
        this.restartButton = document.getElementById('restart-btn');
        this.themeToggle = document.getElementById('theme-toggle');

        // Event Listeners
        this.startButton.addEventListener('click', () => this.startQuiz());
        this.nextButton.addEventListener('click', () => this.nextQuestion());
        this.restartButton.addEventListener('click', () => this.restart());
        this.categorySelect.addEventListener('change', () => this.validateForm());
        this.difficultySelect.addEventListener('change', () => this.validateForm());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Initialize
        this.loadTheme();
        this.fetchCategories();
    }

    loadTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        document.body.className = `${theme}-theme`;
    }

    toggleTheme() {
        const isLight = document.body.classList.contains('light-theme');
        const newTheme = isLight ? 'dark' : 'light';
        document.body.className = `${newTheme}-theme`;
        localStorage.setItem('theme', newTheme);
    }

    async fetchCategories() {
        try {
            const response = await fetch('https://opentdb.com/api_category.php');
            const data = await response.json();
            
            this.categories = data.trivia_categories;
            this.populateCategoryDropdown();
        } catch (error) {
            this.showError('Failed to load categories. Please try again.');
        }
    }

    populateCategoryDropdown() {
        this.categorySelect.innerHTML = `
            <option value="">Select a Category</option>
            ${this.categories.map(category => 
                `<option value="${category.id}">${category.name}</option>`
            ).join('')}
        `;
    }

    validateForm() {
        this.startButton.disabled = !this.categorySelect.value;
    }

    async startQuiz() {
        const category = this.categorySelect.value;
        const difficulty = this.difficultySelect.value;
        const url = `https://opentdb.com/api.php?amount=10&category=${category}${difficulty ? `&difficulty=${difficulty}` : ''}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.response_code === 0) {
                this.questions = data.results;
                this.currentQuestion = 0;
                this.score = 0;
                this.showQuiz();
                this.updateScore();
                this.displayQuestion();
            } else {
                throw new Error('Failed to load questions');
            }
        } catch (error) {
            this.showError('Failed to load questions. Please try again.');
        }
    }

    showQuiz() {
        this.setupContainer.classList.add('hidden');
        this.quizContainer.classList.remove('hidden');
        this.resultsContainer.classList.add('hidden');
        this.errorContainer.classList.add('hidden');
    }

    updateScore() {
        this.currentScoreElement.textContent = this.score;
        this.totalQuestionsElement.textContent = this.questions.length;
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestion];
        this.isAnswered = false;
        
        // Update progress
        this.progressElement.style.width = `${(this.currentQuestion + 1) * 10}%`;
        this.currentQuestionElement.textContent = this.currentQuestion + 1;
        this.currentCategoryElement.textContent = 
            this.categories.find(c => c.id === parseInt(this.categorySelect.value)).name;
        
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
            } else if (button === selectedButton && !isCorrect) {
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
        
        // Set score message
        let message = '';
        if (this.score === 10) {
            message = 'Perfect score! You\'re a trivia master! 🏆';
        } else if (this.score >= 7) {
            message = 'Great job! You really know your stuff! 🌟';
        } else if (this.score >= 5) {
            message = 'Good effort! Keep practicing! 👍';
        } else {
            message = 'Keep learning and try again! 📚';
        }
        this.scoreMessageElement.textContent = message;

        // Send score to the server
        this.sendScoreToServer(this.score);
    }

    async sendScoreToServer(score) {
        const quizType = this.categorySelect.value ? 'Categorized' : 'Random';  // Determine quiz type
    
        try {
            const response = await fetch('/submit-score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    score: score,
                    quiz_type: quizType
                })
            });
    
            const result = await response.json();
            if (response.ok) {
                console.log('Score submitted successfully:', result);
            } else {
                console.error('Failed to submit score:', result);
            }
        } catch (error) {
            console.error('Error sending score:', error);
        }
    }

    restart() {
        this.resultsContainer.classList.add('hidden');
        this.setupContainer.classList.remove('hidden');
        this.categorySelect.value = '';
        this.difficultySelect.value = '';
        this.validateForm();
    }

    showError(message) {
        this.setupContainer.classList.add('hidden');
        this.quizContainer.classList.add('hidden');
        this.resultsContainer.classList.add('hidden');
        this.errorContainer.classList.remove('hidden');
        document.getElementById('error-message').textContent = message;
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
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', () => {
    new TriviaQuiz();
});
