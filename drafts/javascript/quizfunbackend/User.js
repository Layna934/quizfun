// // const mysql = require('mysql');
// // const bcrypt = require('bcrypt')

// // const User = new mongoose.Schema({
// //     username: {type: String, required:true, unique: true},
// //     email: { type: String, required: true, unique: true },
// //     password: {type: String, required: true},
// //     scores: [{score: Number, date: Date}],
// // })

// // UserSchema.pre('save', async function(next){
// //     if (this.isModified('password')){
// //         this.password = await bcrypt.hash(this.password, 10)
// //     }
// //     next()
// // })

// // module.exports = mongoose.model('User', UserSchema)

// // User.js
// const bcrypt = require('bcrypt');
// const db = require('./db'); // MySQL connection

// // Helper function to check if a user already exists
// async function findUserByEmailOrUsername(email, username) {
//     const [rows] = await db.execute('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
//     return rows[0]; // returns the first user or undefined if not found
// }

// // Helper function to create a new user
// async function createUser(username, email, password) {
//     // Hash the password before saving
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Insert the user into the database
//     const [result] = await db.execute(
//         'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
//         [username, email, hashedPassword]
//     );
//     return result; // Returns the result of the insertion
// }

// // Helper function to check if the password is correct
// async function validatePassword(emailOrUsername, password) {
//     // Find the user by username or email
//     const [rows] = await db.execute('SELECT * FROM users WHERE email = ? OR username = ?', [emailOrUsername, emailOrUsername]);

//     if (rows.length === 0) return null; // No user found

//     const user = rows[0];
//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (passwordMatch) {
//         return user; // return user if password matches
//     } else {
//         return null; // return null if passwords do not match
//     }
// }

// module.exports = { findUserByEmailOrUsername, createUser, validatePassword };


// User.js
const bcrypt = require('bcrypt');
const db = require('./quizfundb'); // MySQL connection

// Helper function to check if a user already exists
async function findUserByEmailOrUsername(email, username) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
    return rows[0]; // returns the first user or undefined if not found
}

// Helper function to create a new user
async function createUser(username, email, password) {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const [result] = await db.execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
    );
    return result; // Returns the result of the insertion
}

// Helper function to check if the password is correct
async function validatePassword(emailOrUsername, password) {
    // Find the user by username or email
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ? OR username = ?', [emailOrUsername, emailOrUsername]);

    if (rows.length === 0) return null; // No user found

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
        return user; // return user if password matches
    } else {
        return null; // return null if passwords do not match
    }
}

module.exports = { findUserByEmailOrUsername, createUser, validatePassword };
