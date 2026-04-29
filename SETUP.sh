# SkillBridge — Project Setup Guide
# ============================================================
# ── 1. SCAFFOLD ────────────────────────────────────────────
npx create-next-app@latest skillbridge \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd skillbridge

# ── 2. CORE DEPENDENCIES ───────────────────────────────────
npm install \
  @prisma/client \
  prisma \
  framer-motion \
  lucide-react \
  clsx \
  tailwind-merge \
  @vercel/postgres \
  zod \
  next-auth@beta \
  @auth/prisma-adapter

# ── 3. DEV / TOOLING ───────────────────────────────────────
npm install -D \
  @types/node \
  tsx \
  prettier \
  prettier-plugin-tailwindcss

# ── 4. INIT PRISMA ─────────────────────────────────────────
npx prisma init --datasource-provider postgresql

# (Replace generated schema.prisma with the SkillBridge schema)

# ── 5. VERCEL POSTGRES SETUP ───────────────────────────────
# In Vercel dashboard → Storage → Create Postgres DB
# Then pull env vars:
vercel env pull .env.local
# The following vars will be populated automatically:
#   POSTGRES_PRISMA_URL
#   POSTGRES_URL_NON_POOLING

# ── 6. PUSH SCHEMA TO DB ───────────────────────────────────
npx prisma db push

# ── 7. GENERATE CLIENT ─────────────────────────────────────
npx prisma generate

# ── 8. SEED (optional dev data) ────────────────────────────
npx prisma db seed   # requires prisma.seed in package.json

# ── 9. OPEN STUDIO ─────────────────────────────────────────
npx prisma studio

# ── 10. DEV SERVER ─────────────────────────────────────────
npm run dev


# ============================================================
# ECONOMIC LOGIC — Implementation Reference
# ============================================================

# ── A. STAGGERED ONBOARDING ────────────────────────────────
# File: src/lib/economy/onboarding.ts
#
# TRIGGER: After a Review is created with rating > 3
#   AND it is the teacher's FIRST session as teacher
#   AND user.onboardingBonus === false
#
# ACTION:
#   prisma.$transaction([
#     prisma.user.update({ where: { id: teacherId },
#       data: { credits: { increment: 6 },
#               onboardingBonus: true,
#               isFullyOnboarded: true } }),
#     prisma.transaction.create({ data: {
#       senderId:   SYSTEM_USER_ID,
#       receiverId: teacherId,
#       amount:     6,
#       type:       'REWARD',
#       note:       'First-session onboarding bonus'
#     }})
#   ])


# ── B. ESCROW SYSTEM ───────────────────────────────────────
# File: src/lib/economy/escrow.ts
#
# BOOKING  (status: PENDING → escrowStatus: HELD)
#   - Verify learner.credits >= session.creditCost
#   - prisma.$transaction([
#       decrement learner.credits by creditCost,
#       increment learner.escrowBalance by creditCost,
#       create Session with escrowStatus=HELD,
#       create Transaction { type: EXCHANGE, note: 'Escrow hold' }
#     ])
#
# RELEASE  (status: COMPLETED + review submitted)
#   - prisma.$transaction([
#       decrement learner.escrowBalance by creditCost,
#       increment teacher.credits        by creditCost,
#       update  session.escrowStatus = RELEASED,
#       create  Transaction { type: EXCHANGE, note: 'Escrow release' }
#       run     onboarding bonus check (section A)
#     ])
#
# REFUND   (dispute resolved for learner)
#   - prisma.$transaction([
#       decrement learner.escrowBalance by creditCost,
#       increment learner.credits       by creditCost,
#       update  session.escrowStatus = REFUNDED,
#       create  Transaction { type: EXCHANGE, note: 'Dispute refund' }
#     ])


# ── C. FARMING PROTECTION ──────────────────────────────────
# File: src/lib/economy/farming.ts
#
# getISOWeekKey(date: Date): string
#   → `${year}-W${String(week).padStart(2,'0')}`
#     e.g. "2024-W23"
#
# CHECK before booking:
#   const record = await prisma.weeklyLimit.findUnique({
#     where: { teacherId_learnerId_weekKey: {
#       teacherId, learnerId, weekKey: getISOWeekKey(new Date())
#     }}
#   })
#   if (record && record.weeklyCreditsEarned >= 3) throw FarmingLimitError
#
# UPDATE after successful session release:
#   await prisma.weeklyLimit.upsert({
#     where: { teacherId_learnerId_weekKey: { teacherId, learnerId, weekKey } },
#     update: { weeklyCreditsEarned: { increment: creditCost } },
#     create: { teacherId, learnerId, weekKey, weeklyCreditsEarned: creditCost }
#   })


# ── D. CHECK-IN ANTI-FARMING ──────────────────────────────
# File: src/lib/economy/checkin.ts
#
# Both teacher AND learner must independently call /api/session/[id]/checkin
# This sets teacherCheckedIn / learnerCheckedIn = true
# Only once BOTH flags are true does status → ONGOING
# checkInCount is incremented on each valid ping
# A session with checkInCount < 2 cannot be marked COMPLETED


# ============================================================
# TAILWIND CONFIG ADDITIONS (tailwind.config.ts)
# ============================================================
# module.exports = {
#   theme: {
#     extend: {
#       fontFamily: {
#         display: ['Syne', 'sans-serif'],
#         body:    ['DM Sans', 'sans-serif'],
#       },
#       colors: {
#         space: {
#           950: '#03020a',
#           900: '#080612',
#           800: '#0d0b1e',
#           700: '#13102c',
#           600: '#1a163d',
#         },
#       },
#       backdropBlur: { xs: '4px' },
#       animation: {
#         'float':      'float 3s ease-in-out infinite',
#         'spin-slow':  'spin 12s linear infinite',
#         'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
#       }
#     }
#   }
# }
