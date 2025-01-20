document.addEventListener("DOMContentLoaded", () => {
    const categoryDropdown = document.getElementById("category-dropdown");
    const startQuizButton = document.getElementById("start-quiz");
    const quizContent = document.getElementById("quiz-content");
    const questionText = document.getElementById("question-text");
    const optionsList = document.getElementById("options-list");
    const nextQuestionButton = document.getElementById("next-question");
  
    let currentQuestionIndex = 0;
    let questions = [];
  
    // Fetch categories
    fetch("https://opentdb.com/api_category.php")
      .then((response) => response.json())
      .then((data) => {
        const categories = data.trivia_categories;
        categoryDropdown.innerHTML = `<option value="" disabled selected>Select a category</option>`;
        categories.forEach((category) => {
          const option = document.createElement("option");
          option.value = category.id;
          option.textContent = category.name;
          categoryDropdown.appendChild(option);
        });
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        categoryDropdown.innerHTML = `<option value="" disabled selected>Failed to load categories</option>`;
      });
  
    // Start quiz
    startQuizButton.addEventListener("click", () => {
      const selectedCategory = categoryDropdown.value;
  
      if (!selectedCategory) {
        alert("Please select a category!");
        return;
      }
  
      fetch(`https://opentdb.com/api.php?amount=10&category=${selectedCategory}`)
        .then((response) => response.json())
        .then((data) => {
          questions = data.results;
          currentQuestionIndex = 0;
          quizContent.classList.remove("hidden");
          displayQuestion();
        })
        .catch((error) => {
          console.error("Error fetching questions:", error);
          alert("Failed to fetch questions. Please try again later.");
        });
    });
  
    // Display a question
    function displayQuestion() {
      const currentQuestion = questions[currentQuestionIndex];
      questionText.innerHTML = currentQuestion.question;
  
      optionsList.innerHTML = "";
      const allOptions = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort(
        () => Math.random() - 0.5
      );
  
      allOptions.forEach((option) => {
        const li = document.createElement("li");
        li.textContent = option;
        li.addEventListener("click", () => handleAnswer(option, currentQuestion.correct_answer, li));
        optionsList.appendChild(li);
      });
  
      nextQuestionButton.classList.add("hidden");
    }
  
    // Handle answer selection
    function handleAnswer(selected, correct, element) {
      if (selected === correct) {
        element.classList.add("correct");
      } else {
        element.classList.add("incorrect");
        [...optionsList.children].forEach((li) => {
          if (li.textContent === correct) {
            li.classList.add("correct");
          }
        });
      }
  
      [...optionsList.children].forEach((li) => {
        li.style.pointerEvents = "none";
      });
  
      if (currentQuestionIndex < questions.length - 1) {
        nextQuestionButton.classList.remove("hidden");
      } else {
        nextQuestionButton.textContent = "Restart Quiz";
        nextQuestionButton.classList.remove("hidden");
      }
    }
  
    // Handle next question or restart
    nextQuestionButton.addEventListener("click", () => {
      if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
      } else {
        location.reload();
      }
    });
  });
  