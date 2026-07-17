import { NextRequest, NextResponse } from "next/server";
import { getEmailBotConfig } from "@/lib/email-bot/config";
import { runEmailBot } from "@/lib/email-bot/runner";

export const runtime = "nodejs";
export const maxDuration = 60;

function isAuthorized(request: NextRequest) {
  const config = getEmailBotConfig();
  if (!config.secret) return false;

  const authorization = request.headers.get("authorization");
  const querySecret = request.nextUrl.searchParams.get("secret");

  return authorization === `Bearer ${config.secret}` || querySecret === config.secret;
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

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        ok: true,
        message: "D&G email bot endpoint is installed. Add ?secret=EMAIL_BOT_SECRET or use POST with Authorization bearer token to run it.",
      },
      { status: 200 }
    );
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
