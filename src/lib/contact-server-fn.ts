import { createServerFn } from "@tanstack/react-start";
import { WorkerMailer } from "worker-mailer";

const DEFAULT_GMAIL_USER = "shivamraut747@gmail.com";
const DEFAULT_GMAIL_PASS = typeof atob !== "undefined" ? atob("ZGt4b2h3aXJrZHpycmx6cw==") : "dkxohwirkdzrrlzs";

// In-memory rate limiting map for edge runtime
interface RateLimitEntry {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  entry.count += 1;
  return false;
}

function anonymizeIp(ip = ""): string {
  if (!ip) return "unknown";
  if (ip.includes(".")) {
    return ip.replace(/\.\d+$/, ".xxx");
  }
  if (ip.includes(":")) {
    return ip.replace(/:[^:]+$/, ":xxxx");
  }
  return ip;
}

function escapeHtml(str: string): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\//g, "&#x2F;");
}

const SPAM_KEYWORDS = [
  "viagra",
  "cialis",
  "casino",
  "poker",
  "crypto investment",
  "bitcoin doubling",
  "forex trade",
  "free money",
  "fast cash",
  "loan offer",
  "increase website traffic",
  "guaranteed google ranking",
  "backlinks package",
  "seo service",
  "weight loss pill",
  "adult dating",
  "escort service",
  "telegram:@",
  "whatsapp:+",
];

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "throwawaymail.com",
  "sharklasers.com",
  "yopmail.com",
  "dispostable.com",
  "getairmail.com",
  "trashmail.com",
  "burnermail.io",
]);

function evaluateSpam(name: string, email: string, message: string): { isSpam: boolean; reason?: string } {
  const combinedText = `${name} ${message}`.toLowerCase();

  for (const keyword of SPAM_KEYWORDS) {
    if (combinedText.includes(keyword)) {
      return { isSpam: true, reason: `Keyword match: "${keyword}"` };
    }
  }

  const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
  const urlMatches = message.match(urlPattern) || [];
  if (urlMatches.length > 2) {
    return {
      isSpam: true,
      reason: `Exceeded max allowed URLs (${urlMatches.length} URLs detected)`,
    };
  }

  const emailDomain = email.split("@")[1]?.toLowerCase();
  if (emailDomain && DISPOSABLE_EMAIL_DOMAINS.has(emailDomain)) {
    return { isSpam: true, reason: `Disposable email domain rejected (${emailDomain})` };
  }

  return { isSpam: false };
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  website?: string;
  recaptchaToken?: string;
}

export interface ContactFormResult {
  success: boolean;
  message?: string;
  error?: string;
}

export const submitContactForm = createServerFn({ method: "POST" })
  .validator((data: unknown): ContactFormData => {
    if (typeof data !== "object" || data === null) {
      throw new Error("Invalid request payload");
    }
    const d = data as Record<string, unknown>;
    return {
      name: String(d["name"] || "").trim(),
      email: String(d["email"] || "").trim(),
      message: String(d["message"] || "").trim(),
      website: typeof d["website"] === "string" ? d["website"].trim() : "",
      recaptchaToken: typeof d["recaptchaToken"] === "string" ? d["recaptchaToken"] : "",
    };
  })
  .handler(async ({ data }): Promise<ContactFormResult> => {
    const { name, email, message, website, recaptchaToken } = data;

    // 1. Honeypot trap check
    if (website && website.length > 0) {
      return {
        success: true,
        message: "Your message has been received.",
      };
    }

    // 2. Server-side validation
    if (!name || name.length < 2) {
      return { success: false, error: "Name must be at least 2 characters long." };
    }
    if (name.length > 100) {
      return { success: false, error: "Name cannot exceed 100 characters." };
    }

    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!email || !emailRegex.test(email)) {
      return { success: false, error: "Please provide a valid email address." };
    }
    if (email.length > 254) {
      return { success: false, error: "Email address is too long." };
    }

    if (!message || message.length < 10) {
      return { success: false, error: "Message must be at least 10 characters long." };
    }
    if (message.length > 2000) {
      return { success: false, error: "Message cannot exceed 2000 characters." };
    }

    // 3. Spam filtering
    const spamCheck = evaluateSpam(name, email, message);
    if (spamCheck.isSpam) {
      return { success: false, error: "Message flagged by automated spam filter." };
    }

    // 4. reCAPTCHA verification if secret configured
    const recaptchaSecret = process.env["RECAPTCHA_SECRET_KEY"];
    if (recaptchaSecret && recaptchaToken) {
      try {
        const params = new URLSearchParams({
          secret: recaptchaSecret,
          response: recaptchaToken,
        });
        const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        });
        const verifyData = (await res.json()) as any;
        if (!verifyData.success || (typeof verifyData.score === "number" && verifyData.score < 0.5)) {
          return { success: false, error: "Security verification failed. Please refresh and try again." };
        }
      } catch {
        // Continue if verification service temporarily unreachable
      }
    }

    // 5. HTML escaping
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

    // 6. Gmail SMTP Dispatch
    const gmailUser = process.env["EMAIL_USER"] || DEFAULT_GMAIL_USER;
    const gmailPass = process.env["EMAIL_PASS"] || DEFAULT_GMAIL_PASS;
    const recipient = process.env["RECIPIENT_EMAIL"] || gmailUser;

    try {
      await WorkerMailer.send(
        {
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          credentials: {
            username: gmailUser,
            password: gmailPass,
          },
        },
        {
          from: { name: "Portfolio Contact Form", email: gmailUser },
          to: { name: "Shivam Raut", email: recipient },
          reply: { name: safeName, email },
          subject: `New Portfolio Inquiry from ${safeName}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #111; margin-top: 0; border-bottom: 2px solid #111; padding-bottom: 10px;">New Portfolio Inquiry</h2>
              <p><strong>Name:</strong> ${safeName}</p>
              <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <h3 style="color: #333;">Message:</h3>
              <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; color: #222; line-height: 1.6;">
                ${safeMessage}
              </div>
              <p style="font-size: 11px; color: #999; margin-top: 25px;">
                Sent from portfolio contact form at shivamraut.me
              </p>
            </div>
          `,
        }
      );

      return {
        success: true,
        message: "Thank you! Your message has been sent successfully.",
      };
    } catch (error: any) {
      console.error("[CONTACT_ERROR]", error?.message || error);
      return {
        success: false,
        error: "Unable to dispatch email directly. Please reach out to shivamraut747@gmail.com directly.",
      };
    }
  });
