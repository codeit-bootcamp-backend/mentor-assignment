const express = require('express');
const groupRoutes = require('./src/routes/groupRoutes');

const app = express();

app.use(express.json());

app.use('/api', groupRoutes);

app.listen(3001);