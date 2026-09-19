import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  constructor(private readonly config: ConfigService) {}

  async send(input: { to: string | string[]; subject: string; html: string }) {
    const apiKey = this.config.get<string>("RESEND_API_KEY");
    const from = this.config.get<string>("RESEND_FROM_EMAIL");
    if (!apiKey || !from) { this.logger.warn("Resend is not configured; skipping email notification."); return false; }
    try {
      const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: input.to, subject: input.subject, html: input.html }) });
      if (!response.ok) { this.logger.warn(`Resend rejected notification (${response.status}).`); return false; }
      return true;
    } catch (error) { this.logger.warn(`Resend notification failed: ${error instanceof Error ? error.message : "unknown error"}`); return false; }
  }

  operationsAddress() { return this.config.get<string>("RESEND_NOTIFY_EMAIL") ?? this.config.get<string>("RESEND_FROM_EMAIL") ?? ""; }
}
