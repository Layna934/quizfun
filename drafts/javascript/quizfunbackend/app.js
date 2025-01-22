const express = require('express');
const cors = require('cors');
const quizfundb = require('./quizfundb');
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');

const app = express();


app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);


quizfundb;

module.exports = app;