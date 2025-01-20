// URL of the Quiz API
const quizApiUrl = "https://opentdb.com/api.php?amount=1&type=multiple"; // Example API

// Elements from the HTML
const quizContainer = document.getElementById("quiz");
const nextButton = document.getElementById("next");

// Fetch and display the quiz question
async function fetchQuiz() {
    try {
        const response = await fetch(quizApiUrl);
        const data = await response.json();
        displayQuiz(data.results[0]);
    } catch (error) {
        console.error("Error fetching quiz data:", error);
        quizContainer.innerHTML = `<p>Unable to load quiz. Please try again later.</p>`;
    }
}

// Display the quiz question and answers
function    displayQuiz(questionData) {
    const { question, correct_answer, incorrect_answers } = questionData;
    const allAnswers = [...incorrect_answers, correct_answer].sort(() => Math.random() - 0.5);

    quizContainer.innerHTML = `
        <h2>${question}</h2>
        <ul>
            ${allAnswers.map(answer => `<li class="option">${answer}</li>`).join("")}
        </ul>
    `;

    // Add event listeners to options
    document.querySelectorAll(".option").forEach(option => {
        option.addEventListener("click", () => {
            if (option.textContent === correct_answer) {
                option.style.backgroundColor = "green";
            } else {
                option.style.backgroundColor = "red";
            }
        });
    });
}

// Fetch a new quiz question when "Next" is clicked
nextButton.addEventListener("click", fetchQuiz);

// Fetch the first quiz question on page load
fetchQuiz();
