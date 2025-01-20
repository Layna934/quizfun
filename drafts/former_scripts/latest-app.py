from flask import Flask, render_template, request, flash, redirect, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from os import getenv
from dotenv import load_dotenv
from datetime import timedelta

# Load the environment variables
load_dotenv()
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = getenv('SQLALCHEMY_DATABASE_URI')
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=1)  # Set session timeout to 30 minutes
app.secret_key = getenv('SECRET_KEY')
db = SQLAlchemy(app)


# expiration_time = datetime.utcnow() + app.permanent_session_lifetime
# return render_template('dashboard.html', expiration_time=expiration_time)


# User model
class Users(db.Model):
    userId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    firstname = db.Column(db.String(50), nullable=False)
    lastname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)


@app.route('/')
def homePage():
    if 'userId' in session:
        user = Users.query.get(session['userId'])
        flash('Login successful! Welcome to your home!', 'success')
        return render_template('home.html', user=user)
    return render_template('index.html')


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
            session.permanent = True  # Mark session as permanent
            flash('Logged in successfully!', 'success')
            return redirect('/home')
        flash('Invalid email or password. Please try again.', 'error')
        return redirect('/login')
    return render_template('login.html')


@app.before_request
def session_timeout_handler():
    session.permanent = True
    if 'userId' not in session:
        # Redirect to login if session does not exist
        flash('Your session has expired. Please log in again.', 'error')
        return redirect('/login')
    # Redirect to login if session exists but user is not found


@app.before_request
def reset_session_timer():
    session.modified = True


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


@app.route('/logout')
def logout():
    session.pop('userId', None)
    flash('You have been logged out.', 'info')
    return redirect('/login')


if __name__ == '__main__':
    app.run(debug=True)
