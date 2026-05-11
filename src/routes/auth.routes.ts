import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

router.get('/health', (_req, res) => {
  res.json({ status: 'auth ok' });
});

router.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { username },
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json(data.user);
});

export default router;
