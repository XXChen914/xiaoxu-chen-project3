import "dotenv/config";
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
import userRoutes from './routes/user.routes.js';
import scoreRoutes from './routes/score.routes.js';

import { PORT, LOCAL_HOST } from 'common/constants.js';
import gameRoutes from './routes/game.routes.js';

const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

const MONGODB_URL = process.env.MONGODB_URI || 'mongodb://127.0.0.1/sudoku';

mongoose.connect(MONGODB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));
db.once("open", () => console.log("Connected to MongoDB successfully"));

const frontend_dir = path.join(path.resolve(), '..', 'frontend', 'dist')
app.use(express.static(frontend_dir));

app.use('/api/user', userRoutes);
app.use('/api/highscore', scoreRoutes);
app.use('/api/game', gameRoutes);
app.get('*', function (_, res) {
    res.sendFile(path.join(frontend_dir, "index.html"));
});

app.listen(PORT, function() {
    console.log(`Starting server now on ${LOCAL_HOST}:${PORT}...`)
})
