import "dotenv/config";
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
import userRoutes from './routes/user.routes.js';
import scoreRoutes from './routes/score.routes.js';
// import sessionRoutes from './routes/session.routes.js';

console.log(process.env.MONGODB_URI);
console.log(process.env.SUPER_SECRET);

const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));


const MONGODB_URL = process.env.MONGODB_URI || 'mongodb://127.0.0.1/sudoku';

mongoose.connect(MONGODB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));


const frontend_dir = path.join(path.resolve(), '..', 'frontend', 'dist')

app.use(express.static(frontend_dir));


app.use('/api/user', userRoutes);
app.use('/api/highscore', scoreRoutes);
// app.use('/api/game', sessionRoutes);
app.get('*', function (req, res) {
    res.sendFile(path.join(frontend_dir, "index.html"));
});


app.listen(8000, function() {
    console.log("Starting server now...")
})
