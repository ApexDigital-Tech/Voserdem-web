import dotenv from 'dotenv';
import express from 'express';
import app from './api/index.js';

dotenv.config();

const port = process.env.PORT || 3001;

console.log('[Backend] SUPABASE_URL loaded:', process.env.SUPABASE_URL ? 'YES' : 'NO');

// Only listen if this file is run directly (which we do locally)
app.listen(port as number, '127.0.0.1', () => {
  console.log(`[Backend] API Server running locally on http://127.0.0.1:${port}`);
});
