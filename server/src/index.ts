import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import itineraryRouter from './routes/generateItinerary';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

// Itinerary generation route
app.use(itineraryRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🌍 Travel Planner API running on http://localhost:${PORT}`);
});

export default app;
