import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import campaignRoutes from './routes/campaign.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

console.log('✅ Firebase configured');

// Routes
app.use('/api', campaignRoutes);

app.get('/', (req, res) => {
  res.json({ message: '🚀 CampaignX API Running' });
});

app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});
