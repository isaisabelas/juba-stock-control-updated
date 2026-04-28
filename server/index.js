const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');

const authRoutes = require('./routes/auth');
const itemsRoutes = require('./routes/items');
const suppliersRoutes = require('./routes/suppliers');
const { authLimiter, apiLimiter } = require('./middleware/rateLimit');
require('./db/database');

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  config.frontendUrl,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

// Rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/suppliers', suppliersRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'Juba API - Controle de Estoque' });
});

// Serve React build (production)
const buildPath = path.join(__dirname, '../build');
const fs = require('fs');

if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));

  // Fallback para SPA
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  if (config.nodeEnv !== 'development') {
    console.warn('Pasta build não encontrada. Apenas API disponível.');
  }
  app.get('*', (req, res) => {
    res.json({ error: 'Frontend build não encontrado. Execute: npm run build' });
  });
}

// Start server
app.listen(config.port, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${config.port} [${config.nodeEnv}]`);
});
