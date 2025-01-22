// 


const mysql = require('mysql'); //l2/promise');
const request = require('supertest');
const app = require('./app');

let connection;

// Increase Jest timeout to 30 seconds
jest.setTimeout(30000);

beforeAll(async () => {
    try {
        // Create a MySQL connection for testing
        connection = await mysql.createConnection({
            host: 'localhost', // Replace with your MySQL host
            user: 'root',      // Replace with your MySQL user
            password: '',      // Replace with your MySQL password
            database: 'testdb', // Replace with your test database
        });

        console.log('Connected to MySQL test database');

        // Create a `users` table for testing
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Users table created or already exists');
    } catch (error) {
        console.error('Error connecting to MySQL:', error);
        throw error;
    }
});

afterEach(async () => {
    try {
        // Clear all data from the `users` table after each test
        await connection.query('TRUNCATE TABLE users;');
        console.log('Cleared all rows from users table');
    } catch (error) {
        console.error('Error clearing users table:', error);
        throw error;
    }
});

afterAll(async () => {
    try {
        // Close the MySQL connection
        await connection.end();
        console.log('Disconnected from MySQL');
    } catch (error) {
        console.error('Error disconnecting from MySQL:', error);
        throw error;
    }
});

describe('POST /signup', () => {
    it('should create a new user if username and email are unique', async () => {
        const response = await request(app)
            .post('/signup')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'User created successfully');

        // Verify the user was inserted into the database
        const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', ['testuser@example.com']);
        expect(rows.length).toBe(1);
        expect(rows[0]).toHaveProperty('username', 'testuser');
    });

    it('should return an error if the email already exists', async () => {
        // First, create a user
        await connection.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [
            'testuser',
            'testuser@example.com',
            'password123',
        ]);

        // Try to create another user with the same email
        const response = await request(app)
            .post('/signup')
            .send({
                username: 'newuser',
                email: 'testuser@example.com',
                password: 'password456',
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Email already exists');
    });
});
