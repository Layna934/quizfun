# Quizolia

Welcome to **Quizolia**, the ultimate quiz experience designed to make learning fun, engaging, and interactive! Quizolia is a Flask-based web application that fetches quiz questions across various categories and difficulties, providing an enjoyable way to test and expand your knowledge.

## Features

- **Dynamic Quiz Generation**: Get quiz questions in real-time.
- **Customizable Difficulty**: Choose from easy, medium, or hard questions.
- **Wide Range of Categories**: Explore quizzes in categories such as Science, History, Entertainment, and more.
- **Instant Feedback**: Receive immediate feedback on your answers to track your progress.
- **Responsive Design**: Enjoy a seamless experience on both desktop and mobile devices.

## Demo

Check out the live version of Quizolia: [Quizolia on Render](https://quizolia.onrender.com)

## How to Use Quizolia

1. **Access the App**: Visit the deployed link at [Quizolia](https://quizolia.onrender.com).
2. **Select a Category**: Pick a category that interests you from the dropdown menu.
3. **Choose Difficulty**: Select the difficulty level of your quiz.
4. **Start the Quiz**: Click on the "Start Quiz" button to begin.
5. **Answer Questions**: Provide answers to the questions presented and receive instant feedback.
6. **View Results**: After completing the quiz, see your score and review your answers.

## Installation (Local Setup)

If you’d like to run Quizolia locally, follow these steps:

### Prerequisites

- Python 3.8+
- pip (Python package installer)

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/quizolia.git
   cd quizolia
   ```

2. **Set Up a Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Application**:
   ```bash
   flask run
   ```

5. **Access the App**:
   Open your browser and navigate to `http://127.0.0.1:5000`.

## API Integration

Quizolia fetches quiz questions dynamically using an external quiz API. For developers, this makes it easy to integrate or extend the app with additional features or APIs.

## Contributing

We welcome contributions to improve Quizolia! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Describe your changes"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a Pull Request.

## Future Plans

- Add a leaderboard to track top performers.
- Implement user authentication for personalized experiences.
- Expand question categories and languages.
- Integrate timer functionality for timed quizzes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements

- Flask: For powering the backend.
- Open Trivia API: For providing a rich database of quiz questions.
- Render: For hosting the live application.

---

Enjoy the fun and challenge of Quizolia! Whether you're a trivia enthusiast or just looking to learn something new, Quizolia has something for everyone. Start your quiz adventure today!

Built with 💖 by [Daniel Dohou](https:/github.com/dohoudaniel) and [Precious Ese](https:/github.com/Layna934)
