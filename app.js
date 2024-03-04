import express from 'express';
import groupRoutes from './src/routes/groupRoutes.js';

const app = express();

app.use(express.json());

app.use('/api', groupRoutes);

app.listen(3001);