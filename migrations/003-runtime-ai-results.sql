BEGIN;
CREATE TABLE IF NOT EXISTS coaching_runtime_ai_results (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES coaching_tenants(id),
  subject text NOT NULL,
  prompt text NOT NULL,
  content text NOT NULL,
  provider text NOT NULL CHECK(provider='openrouter'),
  model text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY(tenant_id,subject) REFERENCES coaching_identities(tenant_id,subject) ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS coaching_runtime_ai_identity_idx ON coaching_runtime_ai_results(tenant_id,subject,created_at DESC);
COMMIT;
