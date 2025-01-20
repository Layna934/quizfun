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
        this.currentCategoryElement = document.getElementById('current-category');
        this.finalScoreElement = document.getElementById('final-score');
        this.scoreMessageElement = document.getElementById('score-message');
        this.restartButton = document.getElementById('restart-btn');

        // Event Listeners
        this.startButton.addEventListener('click', () => this.startQuiz());
        this.nextButton.addEventListener('click', () => this.nextQuestion());
        this.restartButton.addEventListener('click', () => this.restart());
        this.categorySelect.addEventListener('change', () => this.validateForm());
        this.difficultySelect.addEventListener('change', () => this.validateForm());

        // Initialize
        this.fetchCategories();
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
        if (isCorrect) this.score++;
        
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
    // Theme management
    const themeToggle = document.getElementById('theme-toggle');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = `${savedTheme}-theme`;
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-theme');
        const newTheme = isLight ? 'dark' : 'light';
        document.body.className = `${newTheme}-theme`;
        localStorage.setItem('theme', newTheme);
    });

    // Quiz card hover effects
    const quizCards = document.querySelectorAll('.quiz-card');
    
    quizCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });

        // Handle click events
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const type = card.dataset.type;
            
            // Add click animation
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
                // Navigate to the appropriate quiz page
                window.location.href = card.href;
            }, 200);
        });
    });

    // Mobile navigation handling
    const mobileBreakpoint = 768;
    
    function handleResponsiveLayout() {
        const header = document.querySelector('.header .container');
        if (window.innerWidth <= mobileBreakpoint) {
            header.style.flexDirection = 'column';
        } else {
            header.style.flexDirection = 'row';
        }
    }

    // Initial check and event listener for resize
    handleResponsiveLayout();
    window.addEventListener('resize', handleResponsiveLayout);

    new TriviaQuiz();
});