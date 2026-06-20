/**
 * scripts/seed.ts
 *
 * Seeds the PTESOL database with:
 *   1. Sample questions (3 per section — Listening / Structure / Reading)
 *   2. 1 default admin account (created via Auth Admin API; role set to 'admin')
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the
 * environment. Point at development or production by loading the matching
 * .env file:
 *   npx dotenv -e .env.local npx tsx scripts/seed.ts          # dev
 *   npx dotenv -e .env.production npx tsx scripts/seed.ts     # prod
 *
 * The script is IDEMPOTENT: it skips any question that already exists by
 * checking for a matching question_text, and skips the admin user if their
 * email already exists. Safe to run multiple times.
 */

import "dotenv/config"
import { createClient } from "@supabase/supabase-js"

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "❌  Missing env vars: NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY"
  )
  process.exit(1)
}

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@ptesol.dev"
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Admin@ptesol123!"
const ADMIN_NAME = process.env.SEED_ADMIN_NAME ?? "Admin PTESOL"

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function log(msg: string) {
  process.stdout.write(`${msg}\n`)
}

function ok(msg: string) {
  log(`  ✓  ${msg}`)
}

function skip(msg: string) {
  log(`  –  ${msg} (skipped — already exists)`)
}

function fail(msg: string) {
  log(`  ✗  ${msg}`)
}

// ---------------------------------------------------------------------------
// 1. Admin account
// ---------------------------------------------------------------------------
async function seedAdmin() {
  log("\n▶ Admin account")

  // Check if the admin email is already registered.
  const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  const existing = listData?.users.find((u) => u.email === ADMIN_EMAIL)

  if (existing) {
    skip(`Admin "${ADMIN_EMAIL}"`)
    return existing.id
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: {
      full_name: ADMIN_NAME,
    },
  })

  if (error || !data.user) {
    fail(`Create admin user: ${error?.message ?? "unknown"}`)
    process.exit(1)
  }

  // Promote to admin in the public.users table (the trigger creates it as
  // 'student' by default — set role to 'admin' immediately after).
  const { error: roleError } = await supabase
    .from("users")
    .update({ role: "admin", full_name: ADMIN_NAME })
    .eq("id", data.user.id)

  if (roleError) {
    fail(`Set admin role: ${roleError.message}`)
    process.exit(1)
  }

  ok(`Admin "${ADMIN_EMAIL}" created (role: admin)`)
  return data.user.id
}

// ---------------------------------------------------------------------------
// 2. Sample questions
// ---------------------------------------------------------------------------
interface SampleQuestion {
  section: "listening" | "structure" | "reading"
  question_text: string
  options: Record<"A" | "B" | "C" | "D", string>
  correct_answer: "A" | "B" | "C" | "D"
  explanation?: string
  difficulty: "easy" | "medium" | "hard"
  passage_title?: string
  passage_content?: string
}

const SAMPLE_QUESTIONS: SampleQuestion[] = [
  // ---- LISTENING (no audio — placeholder text only, audio uploaded later) ----
  {
    section: "listening",
    question_text: "What does the woman suggest the man do?",
    options: {
      A: "Call the office",
      B: "Send an email",
      C: "Visit in person",
      D: "Wait until tomorrow",
    },
    correct_answer: "A",
    explanation:
      'The woman says "You should call the office directly to confirm."',
    difficulty: "easy",
  },
  {
    section: "listening",
    question_text: "Where does the conversation most likely take place?",
    options: {
      A: "In a library",
      B: "In a coffee shop",
      C: "In a university cafeteria",
      D: "In a dormitory",
    },
    correct_answer: "C",
    explanation:
      "The background noise of food service and the reference to student meal plans indicate a cafeteria.",
    difficulty: "medium",
  },
  {
    section: "listening",
    question_text: "What problem does the man mention?",
    options: {
      A: "He lost his student ID",
      B: "He missed the registration deadline",
      C: "He cannot find the classroom",
      D: "He forgot his assignment",
    },
    correct_answer: "B",
    explanation:
      'The man explicitly says "I didn\'t realize registration had already closed."',
    difficulty: "hard",
  },

  // ---- STRUCTURE ----
  {
    section: "structure",
    question_text:
      "The committee ___ to review all submitted proposals by Friday.",
    options: {
      A: "plan",
      B: "plans",
      C: "planning",
      D: "are planning",
    },
    correct_answer: "B",
    explanation:
      '"The committee" is a collective noun treated as singular in formal writing, requiring the singular verb "plans".',
    difficulty: "easy",
  },
  {
    section: "structure",
    question_text:
      "Not until the experiment had been repeated three times ___ the results accurate.",
    options: {
      A: "the scientists considered",
      B: "did the scientists consider",
      C: "the scientists did consider",
      D: "considered the scientists",
    },
    correct_answer: "B",
    explanation:
      "When a negative adverbial phrase opens a sentence, the auxiliary verb inverts to precede the subject.",
    difficulty: "hard",
  },
  {
    section: "structure",
    question_text:
      "Each of the participants ___ required to submit a consent form.",
    options: {
      A: "are",
      B: "were",
      C: "is",
      D: "have been",
    },
    correct_answer: "C",
    explanation:
      '"Each of" takes a singular verb regardless of the noun that follows it.',
    difficulty: "medium",
  },

  // ---- READING ----
  {
    section: "reading",
    passage_title: "The Role of Sleep in Memory Consolidation",
    passage_content: `Sleep plays a critical role in the consolidation of memory. During sleep, the brain transfers information from short-term to long-term storage through a process involving two main sleep stages: slow-wave sleep (SWS) and rapid eye movement (REM) sleep. Researchers have found that SWS is particularly important for declarative memory — facts and events — while REM sleep appears to strengthen procedural memory, such as motor skills and habits.

Studies conducted at major universities have demonstrated that students who sleep after learning new material retain significantly more information than those who remain awake. A 2019 meta-analysis of over 200 studies confirmed that a night of sleep following initial learning produces an average retention improvement of 20–40 percent. This effect is compounded when sleep includes multiple complete cycles of 90 minutes each.

Practical implications of this research have begun to reshape academic schedules. Some institutions have experimented with later start times to ensure adolescents complete the biologically required 8–10 hours of sleep. Initial results suggest that academic performance metrics, including standardized test scores, improve measurably when students are adequately rested.`,
    question_text:
      "According to the passage, which type of memory is primarily strengthened during slow-wave sleep?",
    options: {
      A: "Procedural memory",
      B: "Motor skill memory",
      C: "Declarative memory",
      D: "Habitual memory",
    },
    correct_answer: "C",
    explanation:
      'The passage explicitly states: "SWS is particularly important for declarative memory — facts and events."',
    difficulty: "easy",
  },
  {
    section: "reading",
    passage_title: "The Role of Sleep in Memory Consolidation",
    question_text:
      "What does the 2019 meta-analysis cited in the passage indicate?",
    options: {
      A: "REM sleep alone accounts for memory improvement",
      B: "Sleeping after learning improves retention by 20–40 percent",
      C: "Students should sleep for exactly 90 minutes after studying",
      D: "Memory consolidation only occurs during the first sleep cycle",
    },
    correct_answer: "B",
    explanation:
      'The passage states the meta-analysis "confirmed that a night of sleep following initial learning produces an average retention improvement of 20–40 percent."',
    difficulty: "medium",
  },
  {
    section: "reading",
    passage_title: "The Role of Sleep in Memory Consolidation",
    question_text:
      "The word 'compounded' in paragraph two is closest in meaning to:",
    options: {
      A: "Diminished",
      B: "Isolated",
      C: "Multiplied",
      D: "Interrupted",
    },
    correct_answer: "C",
    explanation:
      '"Compounded" means increased or intensified, closest in meaning to "multiplied" in this context.',
    difficulty: "hard",
  },
]

async function seedQuestions(adminUserId: string) {
  log("\n▶ Sample questions")

  // Fetch or create the reading passage.
  const passageTitles = [
    ...new Set(
      SAMPLE_QUESTIONS.filter((q) => q.passage_title).map((q) => q.passage_title!)
    ),
  ]

  const passageIdByTitle = new Map<string, string>()

  for (const title of passageTitles) {
    const { data: existing } = await supabase
      .from("passages")
      .select("id")
      .eq("title", title)
      .maybeSingle()

    if (existing) {
      passageIdByTitle.set(title, existing.id)
      skip(`Passage "${title}"`)
    } else {
      const content =
        SAMPLE_QUESTIONS.find((q) => q.passage_title === title)?.passage_content ?? ""
      const { data, error } = await supabase
        .from("passages")
        .insert({ title, content, created_by: adminUserId })
        .select("id")
        .single()

      if (error || !data) {
        fail(`Create passage "${title}": ${error?.message ?? "unknown"}`)
        continue
      }
      passageIdByTitle.set(title, data.id)
      ok(`Passage "${title}"`)
    }
  }

  for (const q of SAMPLE_QUESTIONS) {
    const { data: existing } = await supabase
      .from("questions")
      .select("id")
      .eq("question_text", q.question_text)
      .maybeSingle()

    if (existing) {
      skip(`Question "${q.question_text.slice(0, 60)}…"`)
      continue
    }

    const passageId = q.passage_title ? passageIdByTitle.get(q.passage_title) : null

    const { error } = await supabase.from("questions").insert({
      section: q.section,
      question_text: q.question_text,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation ?? null,
      difficulty: q.difficulty,
      passage_id: passageId ?? null,
      is_active: true,
      created_by: adminUserId,
    })

    if (error) {
      fail(
        `Insert question "${q.question_text.slice(0, 40)}…": ${error.message}`
      )
    } else {
      ok(`[${q.section}] "${q.question_text.slice(0, 60)}…"`)
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  log("🌱  PTESOL seed script")
  log(`    URL: ${SUPABASE_URL}`)
  log(`    Admin email: ${ADMIN_EMAIL}`)

  const adminUserId = await seedAdmin()
  await seedQuestions(adminUserId)

  log("\n✅  Seed complete.\n")
  log(`    Admin login: ${ADMIN_EMAIL}`)
  log(`    Password:    ${ADMIN_PASSWORD}`)
  log(
    "    ⚠️  Change the admin password after first login if using defaults.\n"
  )
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err)
  console.error(`\n❌  Seed failed: ${message}`)
  process.exit(1)
})
