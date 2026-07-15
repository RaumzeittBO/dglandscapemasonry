import { assertGmailConfigured, getEmailBotConfig } from "./config";
import { GmailClient } from "./gmail";
import { createLeadDecision } from "./responder";

const PROCESSED_LABEL = "Bot Processed";
const LEAD_LABEL = "Website Leads";
const REVIEW_LABEL = "Needs Human Review";
const DRAFT_READY_LABEL = "Draft Reply Ready";

export type EmailBotResult = {
  mode: string;
  checked: number;
  processed: number;
  draftsCreated: number;
  sent: number;
  skipped: number;
  results: Array<{
    messageId: string;
    subject: string;
    from: string;
    action: "drafted" | "sent" | "skipped";
    summary: string;
    needsHumanReview: boolean;
    draftId?: string;
  }>;
};

function buildSearchQuery(lookbackDays: number) {
  return [
    "in:inbox",
    "-in:spam",
    "-in:trash",
    `newer_than:${lookbackDays}d`,
    `-label:"${PROCESSED_LABEL}"`,
  ].join(" ");
}

function buildNotificationBody(result: EmailBotResult["results"][number]) {
  return [
    "D&G email bot processed a lead.",
    "",
    `Action: ${result.action}`,
    `From: ${result.from}`,
    `Subject: ${result.subject}`,
    `Needs human review: ${result.needsHumanReview ? "yes" : "no"}`,
    "",
    "Summary:",
    result.summary,
  ].join("\n");
}

export async function runEmailBot(): Promise<EmailBotResult> {
  const config = getEmailBotConfig();
  assertGmailConfigured(config);

  const gmail = new GmailClient(config);
  const messages = await gmail.searchLeadMessages(buildSearchQuery(config.lookbackDays), config.maxMessages);

  const output: EmailBotResult = {
    mode: config.mode,
    checked: messages.length,
    processed: 0,
    draftsCreated: 0,
    sent: 0,
    skipped: 0,
    results: [],
  };

  for (const messageRef of messages) {
    const message = await gmail.getMessage(messageRef.id);
    const email = gmail.parseMessage(message);
    const decision = await createLeadDecision(email, config);

    if (!decision.isLead) {
      await gmail.applyLabels(email.id, [PROCESSED_LABEL, REVIEW_LABEL]);
      output.skipped += 1;
      output.results.push({
        messageId: email.id,
        subject: email.subject,
        from: email.from,
        action: "skipped",
        summary: decision.summary,
        needsHumanReview: true,
      });
      continue;
    }

    const labels = [PROCESSED_LABEL, LEAD_LABEL, decision.needsHumanReview ? REVIEW_LABEL : DRAFT_READY_LABEL];

    if (config.mode === "send" && !decision.needsHumanReview) {
      await gmail.sendReply(email, decision.reply);
      await gmail.applyLabels(email.id, labels);
      output.sent += 1;
      output.processed += 1;
      output.results.push({
        messageId: email.id,
        subject: email.subject,
        from: email.from,
        action: "sent",
        summary: decision.summary,
        needsHumanReview: decision.needsHumanReview,
      });
      continue;
    }

    const draft = await gmail.createReplyDraft(email, decision.reply);
    await gmail.applyLabels(email.id, labels);
    output.draftsCreated += 1;
    output.processed += 1;
    const result = {
      messageId: email.id,
      subject: email.subject,
      from: email.from,
      action: "drafted" as const,
      summary: decision.summary,
      needsHumanReview: decision.needsHumanReview,
      draftId: draft.id,
    };
    output.results.push(result);

    if (config.notifyEmail) {
      await gmail.sendInternalNotification(config.notifyEmail, `New D&G lead: ${email.subject}`, buildNotificationBody(result));
    }
  }

  return output;
}
