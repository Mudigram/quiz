# Database Schema Documentation

This document outlines the required database schema for the Weekly Quiz Platform. Execute these SQL statements in your Supabase SQL Editor.

## Required Tables

### 1. users
Stores Discord-authenticated user information. This table is automatically populated via a database trigger when a user signs in.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  discord_id TEXT UNIQUE NOT NULL,
  discord_username TEXT NOT NULL,
  discord_avatar_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all user profiles
CREATE POLICY "Users can read all profiles"
  ON users FOR SELECT
  USING (true);

-- Policy: Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

### 2. quizzes
Stores weekly quiz information.

```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  week_start_date TIMESTAMPTZ NOT NULL,
  week_end_date TIMESTAMPTZ NOT NULL,
  max_time_seconds INTEGER DEFAULT 300 NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read quizzes
CREATE POLICY "Anyone can read quizzes"
  ON quizzes FOR SELECT
  USING (true);

-- Index for active quizzes
CREATE INDEX idx_quizzes_active ON quizzes(is_active) WHERE is_active = true;
```

### 3. questions
Stores questions for each quiz.

```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read questions
CREATE POLICY "Anyone can read questions"
  ON questions FOR SELECT
  USING (true);

-- Index for quiz questions
CREATE INDEX idx_questions_quiz ON questions(quiz_id, order_index);
```

### 4. quiz_attempts
Stores user quiz attempts with scores. **CRITICAL: Enforces one attempt per user per quiz.**

```sql
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  time_taken_seconds INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- CRITICAL: Unique constraint to enforce one attempt per user per quiz
  CONSTRAINT unique_user_quiz_attempt UNIQUE (user_id, quiz_id)
);

-- Enable Row Level Security
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all attempts (for leaderboard)
CREATE POLICY "Users can read all attempts"
  ON quiz_attempts FOR SELECT
  USING (true);

-- Policy: Users can only insert their own attempts
CREATE POLICY "Users can insert own attempts"
  ON quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX idx_attempts_score ON quiz_attempts(quiz_id, score DESC, time_taken_seconds ASC);
```

## Database Functions

### Leaderboard Function
This function efficiently retrieves the leaderboard with rankings.

```sql
CREATE OR REPLACE FUNCTION get_leaderboard(p_quiz_id UUID, p_limit INTEGER DEFAULT 50)
RETURNS TABLE (
  rank BIGINT,
  user_id UUID,
  discord_username TEXT,
  discord_avatar_url TEXT,
  score INTEGER,
  time_taken_seconds INTEGER,
  correct_answers INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    RANK() OVER (ORDER BY qa.score DESC, qa.time_taken_seconds ASC) as rank,
    qa.user_id,
    u.discord_username,
    u.discord_avatar_url,
    qa.score,
    qa.time_taken_seconds,
    qa.correct_answers
  FROM quiz_attempts qa
  JOIN users u ON qa.user_id = u.id
  WHERE qa.quiz_id = p_quiz_id
  ORDER BY rank
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;
```

## Authentication Trigger

### Auto-create User Profile
This trigger automatically creates a user profile when someone signs in with Discord.

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, discord_id, discord_username, discord_avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'provider_id',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    discord_username = EXCLUDED.discord_username,
    discord_avatar_url = EXCLUDED.discord_avatar_url;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## Sample Data (Optional for Testing)

```sql
-- Insert a sample quiz
INSERT INTO quizzes (title, description, week_start_date, week_end_date, is_active)
VALUES (
  'Blockchain Fundamentals Week 1',
  'Test your knowledge of basic blockchain concepts including consensus mechanisms, cryptography, and distributed systems.',
  NOW(),
  NOW() + INTERVAL '7 days',
  true
);

-- Get the quiz ID (replace with actual ID after insertion)
-- Then insert sample questions
INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, order_index)
VALUES
  ('<quiz_id>', 'What is the primary purpose of a blockchain?', 'To mine cryptocurrency', 'To create a decentralized, immutable ledger', 'To store files', 'To send emails', 'B', 1),
  ('<quiz_id>', 'Which consensus mechanism does Bitcoin use?', 'Proof of Stake', 'Proof of Work', 'Delegated Proof of Stake', 'Proof of Authority', 'B', 2),
  ('<quiz_id>', 'What is a smart contract?', 'A legal document', 'Self-executing code on the blockchain', 'A type of cryptocurrency', 'A mining algorithm', 'B', 3);
```

## Setup Instructions

1. **Enable Discord OAuth in Supabase**:
   - Go to Authentication → Providers
   - Enable Discord
   - Add your Discord OAuth credentials
   - Set redirect URL to: `<your-site-url>/`

2. **Execute Schema**:
   - Copy and run all SQL statements above in Supabase SQL Editor
   - Verify tables are created with proper constraints

3. **Test Database Constraints**:
   - Try to insert duplicate attempts (should fail)
   - Verify RLS policies work correctly

## Key Constraints & Rules

✅ **One Attempt Per Quiz**: `UNIQUE (user_id, quiz_id)` constraint enforced at database level
✅ **Automatic User Profile**: Trigger creates user profile on Discord sign-in
✅ **Efficient Leaderboard**: Function uses window functions for ranking
✅ **Row Level Security**: All tables protected with appropriate policies

## Troubleshooting

If you encounter issues:

1. **Users table not populating**: Check the trigger is created and auth.users has Discord metadata
2. **Cannot insert attempts**: Verify user exists in users table first
3. **Leaderboard not showing**: Ensure function has STABLE security and proper permissions