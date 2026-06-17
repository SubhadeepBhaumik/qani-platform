CREATE TABLE IF NOT EXISTS recruiter_trials (
  id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "recruiterId"    TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  "freeTrialDays"  INTEGER NOT NULL DEFAULT 10,
  "registeredAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recruiter_credits (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "recruiterId"   TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  balance         INTEGER NOT NULL DEFAULT 0,
  "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS credit_transactions (
  id                  TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "recruiterId"       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type                VARCHAR(30) NOT NULL,
  amount              INTEGER NOT NULL,
  reason              VARCHAR(60) NOT NULL,
  "sessionId"         TEXT,
  "stripePaymentId"   VARCHAR(100),
  "balanceAfter"      INTEGER NOT NULL,
  "createdAt"         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pricing_plans (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "sortOrder"   INTEGER NOT NULL DEFAULT 0,
  name          VARCHAR(60) NOT NULL,
  price         INTEGER NOT NULL,
  credits       INTEGER NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  features      TEXT NOT NULL DEFAULT '[]',
  "buttonText"  VARCHAR(60) NOT NULL DEFAULT 'Buy Now',
  "isPopular"   BOOLEAN NOT NULL DEFAULT FALSE,
  "isActive"    BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO pricing_plans ("sortOrder", name, price, credits, description, features, "buttonText", "isPopular")
VALUES
  (1, 'Starter',  4900,  10,  'Perfect for agencies just getting started with AI screening.',
   '["10 AI screening credits","5 credits per mandatory screening","Up to 2 full screenings","Email support","Dashboard analytics"]',
   'Get Started', FALSE),
  (2, 'Growth',  19900,  50,  'Ideal for active recruiters running multiple roles simultaneously.',
   '["50 AI screening credits","Best value per credit","Up to 10 full screenings","Priority email support","Full scorecard & feedback","Candidate ranking"]',
   'Most Popular', TRUE),
  (3, 'Scale',   59900, 200,  'Built for high-volume agencies screening at scale.',
   '["200 AI screening credits","Lowest cost per credit","Up to 40 full screenings","Dedicated support","Advanced analytics","Bulk export CSV/PDF","API access (coming soon)"]',
   'Scale Up', FALSE)
ON CONFLICT DO NOTHING;

INSERT INTO recruiter_trials ("recruiterId", "freeTrialDays", "registeredAt")
SELECT id, 10, "createdAt" FROM users WHERE role = 'recruiter'
ON CONFLICT ("recruiterId") DO NOTHING;

INSERT INTO recruiter_credits ("recruiterId", balance)
SELECT id, 0 FROM users WHERE role = 'recruiter'
ON CONFLICT ("recruiterId") DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_credit_transactions_recruiter ON credit_transactions("recruiterId");
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created ON credit_transactions("createdAt");
CREATE INDEX IF NOT EXISTS idx_pricing_plans_sort ON pricing_plans("sortOrder");

SELECT 'Migration complete' AS status;
