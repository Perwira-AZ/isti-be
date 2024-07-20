require('dotenv').config();

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocket = require('ws');

const speciesRoutes = require('./routes/speciesRoutes');
const treeRoutes = require('./routes/treeRoutes');
const articleRoutes = require('./routes/articleRoutes');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

app.use(bodyParser.json());
app.use(express.json());

app.use(
  cors({
    origin: '*', // Restrict this in production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use('/api/tree', treeRoutes);
app.use('/api/species', speciesRoutes);
app.use('/api/article', articleRoutes);

app.post('/trigger-alert/:id', async (req, res) => {
  // Notify all connected clients
  const { id } = req.params;
  try {
    const [changeStat] = await pool.query(
      'UPDATE tree SET status = true WHERE id = ?',
      [id]
    );
    if (changeStat.affectedRows > 0) {
      const [species] = await pool.query(
        'SELECT species_id FROM tree WHERE id = ?',
        [id]
      );
      const speciesId = species[0].species_id;
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(`ALERT ${speciesId}`);
        }
      });
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post('/stop-alert/:id', async (req, res) => {
  // Notify all connected clients
  const { id } = req.params;
  try {
    const [changeStat] = await pool.query(
      'UPDATE tree SET status = false WHERE id = ?',
      [id]
    );
    if (changeStat.affectedRows > 0) {
      const [species] = await pool.query(
        'SELECT species_id FROM tree WHERE id = ?',
        [id]
      );
      const speciesId = species[0].species_id;
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(`STOP ${speciesId}`);
        }
      });
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

server.listen(8080, () => {
  console.log('Server is running on port 8080');
});
