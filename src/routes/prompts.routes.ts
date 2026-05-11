import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

router.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return res.status(404).json({ error: error.message });
  }

  res.json(data);
});

router.post('/', async (req, res) => {
  const { title, content, category, ai_model, description, subcategory, tags, visibility, example_output, user_id } = req.body;

  if (!title || !content || !category || !ai_model) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { data, error } = await supabase
    .from('prompts')
    .insert([
      {
        title,
        description: description || '',
        content,
        category,
        subcategory: subcategory || '',
        tags: tags || [],
        ai_model,
        visibility: visibility || 'public',
        example_output: example_output || '',
        user_id: user_id || null,
      },
    ])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data?.[0]);
});

export default router;
