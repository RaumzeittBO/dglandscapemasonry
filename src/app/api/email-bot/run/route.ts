import { NextRequest, NextResponse } from "next/server";
import { getEmailBotConfig } from "@/lib/email-bot/config";
import { runEmailBot } from "@/lib/email-bot/runner";

export const runtime = "nodejs";
export const maxDuration = 60;

function isAuthorized(request: NextRequest) {
  const config = getEmailBotConfig();
  if (!config.secret) return false;

  const authorization = request.headers.get("authorization");
  return authorization === `Bearer ${config.secret}`;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runEmailBot();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown email bot error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      message: "D&G email bot endpoint is installed. Use POST with Authorization bearer token to run it.",
    },
    { status: 200 }
  );
}
