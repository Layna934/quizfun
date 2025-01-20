from flask import Flask, render_template, request, flash, redirect, session, url_for, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from os import getenv
from dotenv import load_dotenv
from datetime import timedelta, datetime, timezone

# Load the environment variables
load_dotenv()
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=60)  # Set session timeout to 1 minute
app.secret_key = getenv('SECRET_KEY')
db = SQLAlchemy(app)


# User model
class Users(db.Model):
    userId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    firstname = db.Column(db.String(50), nullable=False)
    lastname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)


# Define the Score model
class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer, nullable=False)
    userId = db.Column(db.Integer, db.ForeignKey('users.userId'), nullable=False)
    user = db.relationship('Users', backref=db.backref('scores', lazy=True))

    def __repr__(self):
        return f"<Score {self.score}>"


# Create the table (if it doesn't exist)
with app.app_context():
    db.create_all()


@app.before_request
def session_timeout_handler():
    now = datetime.utcnow()  # Naive datetime (UTC)
    last_activity = session.get('last_activity')

    if last_activity:
        if isinstance(last_activity, str):
            # Parse last_activity if it's stored as a string
            last_activity = datetime.strptime(last_activity, "%Y-%m-%d %H:%M:%S.%f")
        # Ensure both datetime objects are naive
        last_activity = last_activity.replace(tzinfo=None)

        if (now - last_activity).total_seconds() > app.config['PERMANENT_SESSION_LIFETIME'].total_seconds():
            session.pop('userId', None)
            session.pop('last_activity', None)
            flash('Your session has expired. Please log in again.', 'error')
            return redirect('/login')

    # Update last_activity to the current time (store naive UTC datetime)
    session['last_activity'] = now


@app.route('/')
def homePage():
    if 'userId' in session:
        user = Users.query.get(session['userId'])
        flash('Login successful! Welcome to your home!', 'success')
        return render_template('home.html', user=user)
    return render_template('index.html')


# Endpoint to submit the score
@app.route('/submit-score', methods=['POST'])
def submit_score():
    try:
        data = request.get_json()
        score = data.get('score')
        quiz_type = data.get('quiz_type')

        if score is None or quiz_type is None:
            return jsonify({"error": "Score and quiz type are required"}), 400

        # Store the score and quiz type in the database
        new_score = Score(score=score, quiz_type=quiz_type)
        db.session.add(new_score)
        db.session.commit()

        return jsonify({"message": "Score submitted successfully", "score": score, "quiz_type": quiz_type}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Handling error pages or wrong redirections
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.route('/signup', methods=['GET', 'POST'])
def signUpNewUser():
    if request.method == 'POST':
        UserFirstName = request.form['firstname']
        UserLastName = request.form['lastname']
        UserEmail = request.form['email']
        UserPassword = request.form['password']
        hashed_password = generate_password_hash(UserPassword)
        new_user = Users(firstname=UserFirstName, lastname=UserLastName, email=UserEmail, password=hashed_password)
        try:
            db.session.add(new_user)
            db.session.commit()
            flash('Registration successful! Please log in.', 'success')
            return redirect('/login')
        except:
            flash('Email already registered. Please log in.', 'error')
            return redirect('/signup')
    return render_template('signup.html')


@app.route('/login', methods=['GET', 'POST'])
def logInExistingUser():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = Users.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            session['userId'] = user.userId
            session['last_activity'] = datetime.utcnow()  # Initialize last activity timestamp
            session.permanent = True  # Mark session as permanent
            flash('Logged in successfully!', 'success')
            return redirect('/home')
        flash('Invalid email or password. Please try again.', 'error')
        return redirect('/login')
    return render_template('login.html')


@app.route('/home')
def loggedInHomePage():
    if 'userId' in session:
        user = Users.query.get(session['userId'])
        return render_template('home.html', user=user)
    flash('You must be logged in to access the home page.', 'error')
    return redirect('/login')


@app.route('/playquiz')
def quizPage():
    if 'userId' in session:
        user = Users.query.get(session['userId'])
        flash('Login successful! Welcome to your home!', 'success')
        return render_template('quiz.html', user=user)
    return redirect('/login')


@app.route('/multiquiz')
def multiquiz():
    if 'userId' in session:
        user = Users.query.get(session['userId'])
        flash('Login successful! Welcome to your home!', 'success')
        return render_template('multiquiz.html', user=user)
    return redirect('/login')


# Implement this route to handle the quiz submission
@app.route('/my-quizzes')
def myQuizzes():
    if 'userId' in session:
        user = Users.query.get(session['userId'])
        flash('Login successful! Welcome to your home!', 'success')
        return render_template('comingsoon.html', user=user)
    return redirect('/login')


@app.route('/leaderboard')
def leaderboard():
    if 'userId' in session:
        user = Users.query.get(session['userId'])
        flash('Login successful! Welcome to your home!', 'success')
        return render_template('comingsoon.html', user=user)
    return redirect('/login')


@app.route('/logout')
def logout():
    session.pop('userId', None)
    session.pop('last_activity', None)  # Clear last activity timestamp
    flash('You have been logged out.', 'info')
    return redirect('/login')


if __name__ == '__main__':
    app.run(debug=True) 
