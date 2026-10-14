CREATE TABLE IF NOT EXISTS estimate_requests (
  id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  city_or_zip text NOT NULL,
  project_type text NOT NULL,
  project_details text NOT NULL,
  preferred_contact_method text NOT NULL,
  preferred_estimate_timing text NOT NULL DEFAULT '',
  attribution jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_hash text NOT NULL,
  fingerprint text NOT NULL,
  notification_status text NOT NULL DEFAULT 'pending'
    CHECK (notification_status IN ('pending', 'sent', 'failed'))
);
CREATE INDEX IF NOT EXISTS estimate_requests_ip_created_idx ON estimate_requests (ip_hash, created_at DESC);
CREATE INDEX IF NOT EXISTS estimate_requests_fingerprint_created_idx ON estimate_requests (fingerprint, created_at DESC);
CREATE INDEX IF NOT EXISTS estimate_requests_created_idx ON estimate_requests (created_at DESC);
