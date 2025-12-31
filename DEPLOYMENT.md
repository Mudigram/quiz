# Deployment Guide

This guide covers deploying the Weekly Quiz Challenge platform to production.

## Pre-Deployment Checklist

- [ ] Supabase project created and configured
- [ ] Discord OAuth app created and configured
- [ ] Database schema executed
- [ ] Environment variables configured
- [ ] Local testing completed
- [ ] At least one quiz with questions added

## Recommended Platforms

### Option 1: Vercel (Recommended)

**Pros**: Official Next.js hosting, zero-config deployment, automatic HTTPS
**Cons**: None significant for this stack

#### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure environment variables (see below)
   - Deploy

3. **Environment Variables in Vercel**
   ```
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   NEXT_PUBLIC_SITE_URL=<your-vercel-url>
   ```

4. **Update Discord OAuth Redirect**
   - In Discord Developer Portal
   - Add Vercel URL to redirect URLs: `https://your-app.vercel.app`
   - In Supabase Auth settings
   - Add to Site URL and Redirect URLs

### Option 2: Netlify

**Steps**:
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables
5. Deploy

### Option 3: Self-Hosted (VPS/DigitalOcean)

**Requirements**: Node.js 18+, PM2 or similar process manager

```bash
# Clone repository
git clone <your-repo>
cd quiz

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
pm2 start npm --name "quiz-app" -- start
```

## Discord OAuth Setup

### 1. Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name: "Weekly Quiz Challenge" (or your choice)
4. Go to OAuth2 section

### 2. Configure OAuth2

- **Redirect URLs**: Add both:
  - `http://localhost:3000` (development)
  - `https://your-production-url.com` (production)
  
- **Scopes**: 
  - `identify` (get user ID and username)
  - `email` (optional, for email notifications)

- **Copy**:
  - Client ID
  - Client Secret

### 3. Add to Supabase

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Discord
3. Paste Client ID and Client Secret
4. Save

## Database Setup Checklist

Execute in this order in Supabase SQL Editor:

1. ✅ Create `users` table
2. ✅ Create `quizzes` table
3. ✅ Create `questions` table
4. ✅ Create `quiz_attempts` table
5. ✅ Create `get_leaderboard()` function
6. ✅ Create `handle_new_user()` function
7. ✅ Create trigger `on_auth_user_created`
8. ✅ Enable RLS on all tables
9. ✅ Create RLS policies
10. ✅ Create indexes

## Post-Deployment Tasks

### 1. Test Authentication Flow
- Sign in with Discord
- Verify user profile created in `users` table
- Check avatar and username display correctly

### 2. Add First Quiz

```sql
-- 1. Insert quiz
INSERT INTO quizzes (title, description, week_start_date, week_end_date, is_active)
VALUES (
  'Week 1: Blockchain Basics',
  'Learn fundamental blockchain concepts',
  NOW(),
  NOW() + INTERVAL '7 days',
  true
) RETURNING id;

-- 2. Insert questions (use quiz ID from above)
INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, order_index)
VALUES
  ('<quiz_id>', 'What is a blockchain?', 'A database', 'A distributed ledger', 'A cloud service', 'A programming language', 'B', 1),
  ('<quiz_id>', 'What consensus mechanism does Bitcoin use?', 'PoS', 'PoW', 'DPoS', 'PoA', 'B', 2),
  ('<quiz_id>', 'What is a smart contract?', 'Legal document', 'Self-executing code', 'Mining software', 'Wallet app', 'B', 3);
```

### 3. Test Quiz Flow
- [ ] Start quiz
- [ ] Answer questions
- [ ] Submit quiz
- [ ] View results
- [ ] Check leaderboard

### 4. Monitor Performance
- Check Supabase logs for errors
- Monitor Vercel analytics
- Review database query performance

## Weekly Quiz Management

### Creating New Weekly Quiz

1. **Deactivate current quiz**:
   ```sql
   UPDATE quizzes SET is_active = false WHERE is_active = true;
   ```

2. **Create new quiz**:
   ```sql
   INSERT INTO quizzes (title, description, week_start_date, week_end_date, is_active)
   VALUES (
     'Week 2: Advanced Topics',
     'Dive deeper into blockchain technology',
     NOW(),
     NOW() + INTERVAL '7 days',
     true
   ) RETURNING id;
   ```

3. **Add questions** (10-15 recommended)

4. **Announce to community** (Discord, email, etc.)

### Recommended Schedule
- Monday: Deactivate old quiz, activate new quiz
- Monday-Sunday: Users take quiz
- Sunday evening: Review leaderboard, announce winners
- Repeat

## Security Best Practices

### Supabase Security
- ✅ RLS enabled on all tables
- ✅ Auth policies restrict user actions
- ✅ Anon key is safe for client-side use
- ⚠️ Never expose service key in client code

### Environment Variables
- ✅ Use `.env.local` for local development
- ✅ Never commit `.env.local` to git
- ✅ Use platform's secret management in production

### Discord OAuth
- ✅ Keep Client Secret secure
- ✅ Only add trusted redirect URLs
- ✅ Regularly rotate secrets if compromised

## Monitoring & Maintenance

### Daily Checks
- Supabase auth logs for errors
- Database connection health
- Application uptime

### Weekly Tasks
- Review quiz participation metrics
- Check for any duplicate attempts (should be prevented)
- Backup database (Supabase auto-backups)

### Monthly Tasks
- Review and optimize slow queries
- Analyze user engagement trends
- Update quiz content based on feedback

## Troubleshooting Production Issues

### Users Can't Sign In
1. Check Discord OAuth redirect URLs
2. Verify Supabase Discord provider is enabled
3. Check browser console for CORS errors

### Duplicate Attempts Showing
1. Verify `UNIQUE(user_id, quiz_id)` constraint exists
2. Check RLS policies on quiz_attempts table

### Leaderboard Not Loading
1. Verify `get_leaderboard()` function exists
2. Check function permissions (should be STABLE)
3. Ensure quiz has submitted attempts

### Slow Performance
1. Check database indexes are created
2. Review Supabase query performance
3. Consider adding caching with React Query

## Scaling Considerations

### Current Architecture Supports:
- ✅ 10,000+ users
- ✅ 100+ concurrent quiz takers
- ✅ Unlimited past quizzes

### If You Need More:
- Add Redis caching for leaderboards
- Implement CDN for static assets
- Use Supabase Edge Functions for compute
- Consider read replicas for analytics

## Backup Strategy

### Supabase Automatic Backups
- Daily backups (retained 7 days on free tier)
- Point-in-time recovery (paid tiers)

### Manual Backups
```bash
# Export quiz data
pg_dump -h <host> -U <user> -d <database> > backup.sql
```

### Backup Quiz Content
- Export quizzes and questions regularly
- Keep in version control or spreadsheet
- Allows recreation if needed

## Support & Documentation

- **Technical Issues**: Check logs in Vercel/Supabase
- **Database Issues**: Review DATABASE.md
- **Feature Requests**: Track in GitHub Issues
- **Community**: Discord server (optional)

---

## Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Discord OAuth configured
- [ ] Supabase database schema executed
- [ ] First quiz added
- [ ] Test authentication works
- [ ] Test quiz submission works
- [ ] Test leaderboard displays
- [ ] Production URL added to Discord redirects
- [ ] Announce to community

**Time estimate**: 30-45 minutes for first deployment

---

Need help? Check the main README.md or create an issue in the repository.