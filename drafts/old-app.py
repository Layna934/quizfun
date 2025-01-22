from flask import Flask

# Render HTML templates
from flask import render_template

# Handle the requests from the frontend and fetching the values using their names
from flask import request, flash

# Redirect people to certain HTML pages
from flask import redirect
from flask import session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from os import getenv
from dotenv import load_dotenv

# Load the environmental variables from my .env file
load_dotenv()
# Storing the database URL I saved as an environmental variable (in the .env file) to a string
myDbURL = getenv('SQLALCHEMY_DATABASE_URI')
# Creating the Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = myDbURL
app.secret_key = getenv('SECRET_KEY')
db = SQLAlchemy(app)
# Create the User instance that we use for signup just the way it is done in SQLAlchemy
class Users(db.Model):
    userId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    firstname = db.Column(db.String(50), nullable=False)
    lastname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)

# Routes
@app.route('/') # Home page
def homePage():
    """
    This function renders the home page when the
    route requested is '/'
    """
    if 'userId' in session:
        userId = session['userId']
        user = Users.query.get(userId)
        flash('Login successful! Welcome to your dashboard!')
        return render_template('/dashboard.html', user=user)
    else:
        return render_template('/index.html')


@app.route('/login') # Login page
def loginPage():
    """
    This function renders the home page when the
    route requested is '/'
    """
    return render_template('/login.html')
#
#
@app.route('/signup') # Signup page
def signupPage():
    """
    This function renders the home page when the
    route requested is '/'
    """
    return render_template('/signup.html')
#
#
@app.route('/dashboard') # Dashboard page
def dashboardPage():
    """
    This function renders the home page when the
    route requested is '/'
    """
    if 'userId' in session:
        userId = session['userId']
        user = Users.query.get(userId)
        flash('Login successful! Welcome to your dashboard!')
        return render_template('/dashboard.html', user=user)
    else:
        flash('You must be logged in to access the dashboard.')
        return redirect('/login')
    # return render_template('/dashboard.html')

# Handling the sign up and login functionalities
# Signup Functionality
@app.route('/signup', methods=['GET', 'POST']) # Displaying the signup page
def signUpNewUser():
    """
    Signing up a user
    """
    if request.method == 'POST':
        UserFirstName = request.form['firstname']
        UserLastName = request.form['lastname']
        UserEmail = request.form['email']
        UserPassword = request.form['password']
        # Hashing user password
        hashed_password = generate_password_hash(UserPassword)
        new_user = Users(firstname=UserFirstName, lastname=UserLastName, email=UserEmail, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        flash('Registration successful! Please log in.')
        return redirect('/login')


# Signup Functionality
@app.route('/login', methods=['GET', 'POST']) # Displaying the signup page
def logInExistingUser():
    """
    Logging the user in
    """
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = Users.query.filter_by(email=email, password=password).first()
        # Running the user's password against its hash
        if user and check_password_hash(user.password, password):
            # Store the user's ID in the session
            session['userId'] = user.userId
            return redirect('/dashboard')
        else:
            return redirect('/signup')
    return redirect('/dashboard')

@app.route('/logout')
def logout():
    """
    Logging out the user
    """
    session.pop('userId', None)
    flash('You have been logged out.')
    return redirect('/login')


if __name__ == '__main__':
    app.run(debug=True)
