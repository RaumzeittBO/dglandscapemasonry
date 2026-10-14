import { Pool, type PoolClient } from "pg";
import type { EstimateLead } from "./schema";

let pool: Pool | undefined;

function database() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
  return pool;
}

export type StoredRequest = { id: string; created: boolean; limited: boolean };

async function recentCount(client: PoolClient, ipHash: string) {
  const result = await client.query<{ count: string }>(
    "SELECT count(*)::text AS count FROM estimate_requests WHERE ip_hash = $1 AND created_at > now() - interval '10 minutes'",
    [ipHash],
  );
  return Number(result.rows[0]?.count || 0);
}

export async function storeEstimate(lead: EstimateLead, ipHash: string, fingerprint: string, eventId: string): Promise<StoredRequest> {
  const client = await database().connect();
  try {
    await client.query("BEGIN");
    // A transaction lock serializes requests from the same IP across all function instances.
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [ipHash]);
    if (await recentCount(client, ipHash) >= 4) {
      await client.query("ROLLBACK");
      return { id: "", created: false, limited: true };
    }
    const duplicate = await client.query<{ id: string }>(
      "SELECT id FROM estimate_requests WHERE fingerprint = $1 AND created_at > now() - interval '15 minutes' LIMIT 1",
      [fingerprint],
    );
    if (duplicate.rowCount) {
      await client.query("ROLLBACK");
      return { id: duplicate.rows[0].id, created: false, limited: false };
    }
    await client.query(
      `INSERT INTO estimate_requests
       (id, full_name, phone, email, city_or_zip, project_type, project_details,
        preferred_contact_method, preferred_estimate_timing, attribution, ip_hash, fingerprint)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,$12)`,
      [eventId, lead.fullName, lead.phone, lead.email, lead.cityOrZip, lead.projectType,
        lead.projectDetails, lead.preferredContactMethod, lead.preferredEstimateTiming,
        JSON.stringify(lead.attribution), ipHash, fingerprint],
    );
    await client.query("COMMIT");
    return { id: eventId, created: true, limited: false };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function setNotificationStatus(id: string, status: "sent" | "failed") {
  await database().query("UPDATE estimate_requests SET notification_status = $2 WHERE id = $1", [id, status]);
}
