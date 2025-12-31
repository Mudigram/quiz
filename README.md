# Weekly Quiz Challenge Platform

A gamified weekly quiz platform for onboarding and educating users about blockchain ecosystems. Built with Next.js 16, Supabase, and Tailwind CSS v4.

## 🎯 Product Overview

### Core Features
- ✅ **Discord OAuth Authentication** - Secure, one-click sign-in
- ✅ **Weekly Quiz System** - New quiz every week, one attempt per user
- ✅ **Competitive Scoring** - Accuracy + speed-based scoring system
- ✅ **Live Leaderboard** - Top 50 rankings with special top-3 highlighting
- ✅ **Strict Rules Enforcement** - Database-level constraints prevent cheating
- ✅ **Mobile-Responsive** - Works seamlessly on all devices

### What This Platform Does NOT Have
- ❌ No blockchain wallets
- ❌ No cryptocurrency tokens
- ❌ No DeFi integrations
- ❌ No on-chain interactions

## 🏗️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (Auth + Database)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Icons**: Lucide React, React Icons

## 📐 Architecture

### Quiz Rules (Strictly Enforced)

1. **One Quiz Per Week** - New quiz activated weekly
2. **One Attempt Per User** - Database constraint: `UNIQUE(user_id, quiz_id)`
3. **No Retries** - Answers locked after submission
4. **5-Minute Time Limit** - Auto-submit when time expires
5. **Scoring Formula**:
   ```
   Accuracy Score = correct_answers × 100
   Time Bonus = max(0, (300 - time_taken_seconds) × 2)
   Final Score = Accuracy Score + Time Bonus
   ```

### Database Schema

See [DATABASE.md](./DATABASE.md) for complete schema and setup instructions.

**Key Tables**:
- `users` - Discord user profiles
- `quizzes` - Weekly quiz metadata
- `questions` - Quiz questions with correct answers
- `quiz_attempts` - User submissions and scores

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account
- Discord application (for OAuth)

### 1. Clone and Install

```bash
git clone <your-repo>
cd quiz
npm install
```

### 2. Configure Supabase

1. Create a new Supabase project
2. Enable Discord OAuth:
   - Go to Authentication → Providers → Discord
   - Add Discord App credentials
   - Set redirect URL: `http://localhost:3000`

3. Execute database schema:
   - Open SQL Editor in Supabase
   - Copy and run all SQL from `DATABASE.md`
   - Verify tables and functions are created

### 3. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📱 User Flow

1. **Authentication** → User signs in with Discord
2. **Dashboard** → User sees active quiz or previous attempts
3. **Start Quiz** → User begins timed quiz session
4. **Answer Questions** → One question at a time, radio selection
5. **Submit** → Confirmation modal, then score calculation
6. **Results** → Score breakdown (accuracy + time bonus)
7. **Leaderboard** → View rankings and position

## 🎨 Design System

### Colors
- **Primary**: Indigo 600 (`#4F46E5`)
- **Discord**: Blurple (`#5865F2`)
- **Success**: Green 500 (`#10B981`)
- **Warning**: Yellow 500 (`#F59E0B`)
- **Danger**: Red 500 (`#EF4444`)

### Typography
- **Sans**: Geist Sans (UI)
- **Mono**: Geist Mono (timer, scores)

### Components
- Cards with subtle shadows
- High-contrast buttons
- Clean form inputs
- Responsive layouts

## 🗂️ Project Structure

```
quiz/
├── app/
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page (auth gate)
│   ├── providers.tsx      # Query + Auth providers
│   └── globals.css        # Tailwind + custom styles
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Avatar.tsx
│   ├── auth/              # Authentication screens
│   ├── dashboard/         # Dashboard components
│   ├── quiz/              # Quiz interface components
│   ├── results/           # Results screen components
│   ├── leaderboard/       # Leaderboard components
│   ├── Dashboard.tsx      # Main dashboard controller
│   ├── Header.tsx         # App header with user info
│   ├── ResultsScreen.tsx  # Results controller
│   └── Timer.tsx          # Countdown timer
├── lib/
│   ├── types.ts           # TypeScript interfaces
│   ├── utils.ts           # Utility functions
│   ├── formatters.ts      # String formatters
│   ├── supabase.ts        # Supabase client
│   ├── auth-context.tsx   # Auth provider & hooks
│   ├── api-hooks.ts       # TanStack Query hooks
│   └── quiz-store.ts      # Zustand quiz state
├── .env.local.example     # Environment template
├── DATABASE.md            # Database schema docs
└── README.md              # This file
```

## 🧪 Adding Quiz Content

### Create a New Quiz

```sql
INSERT INTO quizzes (title, description, week_start_date, week_end_date, is_active)
VALUES (
  'Blockchain Fundamentals Week 1',
  'Test your knowledge of blockchain basics',
  NOW(),
  NOW() + INTERVAL '7 days',
  true
);
```

### Add Questions

```sql
INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, order_index)
VALUES
  ('<quiz_id>', 'What is blockchain?', 'Database', 'Distributed ledger', 'Cloud storage', 'File system', 'B', 1),
  ('<quiz_id>', 'What is Bitcoin?', 'Company', 'Cryptocurrency', 'Stock', 'Bank', 'B', 2);
```

### Deactivate Old Quizzes

```sql
UPDATE quizzes SET is_active = false WHERE id = '<old_quiz_id>';
```

## 🔒 Security Features

- **Row Level Security** enabled on all tables
- **Auth-gated API routes** via Supabase policies
- **Database-level constraints** prevent duplicate attempts
- **Input validation** on all user submissions
- **CORS protection** via Supabase configuration

## 🐛 Troubleshooting

### User Profile Not Creating
- Check Discord OAuth is properly configured
- Verify `handle_new_user()` trigger exists
- Inspect auth.users metadata in Supabase

### Cannot Submit Quiz
- Ensure user exists in `users` table
- Check `quiz_attempts` constraint isn't violated
- Verify quiz and questions exist

### Leaderboard Not Loading
- Confirm `get_leaderboard()` function exists
- Check RLS policies on quiz_attempts
- Verify quiz has submitted attempts

## 📈 Future Enhancements

- Admin panel for quiz management
- Email notifications for new quizzes
- Question categories and tagging
- Detailed analytics dashboard
- Social sharing of results
- Quiz difficulty levels
- Achievement badges

## 🤝 Contributing

This is a production-ready template. Feel free to:
1. Fork the repository
2. Add features or fix bugs
3. Submit pull requests
4. Report issues

## 📄 License

MIT License - feel free to use for your own projects!

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Lucide Icons](https://lucide.dev/)

---

**Made for blockchain ecosystem education and community engagement** 🚀