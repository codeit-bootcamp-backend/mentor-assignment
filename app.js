import express from 'express';
import groupRoutes from './src/routes/groupRoutes.js';
import postRoutes from './src/routes/postRoutes.js';

const app = express();

app.use(express.json());

app.use('/api', groupRoutes);
app.use('/api', postRoutes);

app.listen(3001);