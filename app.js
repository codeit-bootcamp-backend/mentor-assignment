import express from 'express';
import groupRoutes from './src/routes/groupRoutes.js';
import postRoutes from './src/routes/postRoutes.js';
// import commentRoutes from './src/routes/commentRoutes.js';

const app = express();

app.use(express.json());

app.use('/api', groupRoutes);
app.use('/api', postRoutes);
// app.use('/api', commentRoutes);

app.listen(3001);