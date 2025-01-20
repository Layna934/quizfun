from flask import Flask, render_template, request, flash, redirect, session, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from os import getenv, environ
from dotenv import load_dotenv
from datetime import timedelta, datetime, timezone

# Load the environment variables
load_dotenv()
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = getenv('SQLALCHEMY_DATABASE_URI')
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)  # Set session timeout to 30 minute
app.secret_key = getenv('SECRET_KEY')
db = SQLAlchemy(app)


# User model
class Users(db.Model):
    userId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    firstname = db.Column(db.String(50), nullable=False)
    lastname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)


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


# Handling error pages or wrong redirections
@app.errorhandler(404)
def page_not_found(e):
    if 'userId' in session:
        user = Users.query.get(session['userId'])
        flash('Login successful! Welcome to your home!', 'success')
        # return render_template('comingsoon.html', user=user)
        return render_template('404.html', user=user), 404
    return redirect('/login')


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
        return render_template('choosequiz.html', user=user)
    return redirect('/login')


@app.route('/multiquiz')
def multiquiz():
    if 'userId' in session:
        user = Users.query.get(session['userId'])
        flash('Login successful! Welcome to your home!', 'success')
        return render_template('multiquiz.html', user=user)
    return redirect('/login')


@app.route('/random-quiz')
def singlequizquiz():
    if 'userId' in session:
        user = Users.query.get(session['userId'])
        flash('Login successful! Welcome to your home!', 'success')
        return render_template('singlequiz.html', user=user)
    return redirect('/login')


# Implement this route to handle the quiz submission
@app.route('/my-quizzes')
def myQuizzes():
    if 'userId' in session:
        user = Users.query.get(session['userId'])
        flash('Login successful! Welcome to your home!', 'success')
        return render_template('comingsoon.html', user=user)
    return redirect('/login')


@app.route('/profile')
def userProfile():
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
    port = int(environ.get("PORT", 5000))  # Default to 5000 if PORT is not set
    app.run(host="0.0.0.0", port=port)
    # app.run(debug=True, port=5000)
