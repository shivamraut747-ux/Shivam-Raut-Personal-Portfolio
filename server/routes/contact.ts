/**
 * ============================================================================
 * SECURE BACKEND ROUTE HANDLER (server/routes/contact.ts)
 * ============================================================================
 * Handles POST /api/contact with 8 production-grade security layers:
 * 1. Input Validation (name 2-100 chars, email regex, message 10-2000 chars)
 * 2. Invisible Google reCAPTCHA v3 Verification (Score threshold > 0.5)
 * 3. Honeypot Trap Detection (Catches automated spam bots silently)
 * 4. In-Memory Sliding-Window Rate Limiting (5 submissions per IP per hour)
 * 5. Multi-Factor Spam Filter (Keywords, URL count, Disposable domains)
 * 6. HTML Entity Escaping & Strict XSS Sanitization
 * 7. Privacy-Preserving Security Logging (IP anonymization, zero secrets in logs)
 * 8. Reliable Email Dispatch via Nodemailer (Gmail SMTP)
 * ============================================================================
 */

import { Router, Request, Response } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// ============================================================================
// SECURITY LAYER 7: PRIVACY-PRESERVING SECURITY LOGGING
// ============================================================================
/**
 * Anonymizes client IP addresses for privacy compliance (e.g., GDPR).
 * Example: 192.168.1.50 -> 192.168.1.xxx
 */
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

function logSecurityEvent(
  level: "info" | "warn" | "error",
  eventName: string,
  details: Record<string, unknown> = {}
) {
  const timestamp = new Date().toISOString();
  const safeDetails: Record<string, unknown> = {
    ...details,
    ip: anonymizeIp(String(details["ip"] || "")),
  };

  // Exclude sensitive user information and credentials from log files
  delete safeDetails["password"];
  delete safeDetails["message"];

  const logMessage = `[SECURITY][${level.toUpperCase()}][${timestamp}] ${eventName}: ${JSON.stringify(
    safeDetails
  )}`;

  if (level === "error" || level === "warn") {
    console.warn(logMessage);
  } else {
    console.log(logMessage);
  }
}

// ============================================================================
// SECURITY LAYER 4: IN-MEMORY SLIDING-WINDOW RATE LIMITING
// Max 5 submissions per IP per 60 minutes
// ============================================================================
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW = parseInt(process.env["RATE_LIMIT_WINDOW"] || "3600000", 10); // 1 hour
const RATE_LIMIT_MAX = parseInt(process.env["RATE_LIMIT_MAX_REQUESTS"] || "5", 10);

// Cleanup expired IP records every 10 minutes to maintain memory efficiency
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(ip);
    }
  }
}, 10 * 60 * 1000).unref();

function checkRateLimit(ip: string): { limited: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW,
    });
    return { limited: false };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return {
      limited: true,
      retryAfter: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count += 1;
  return { limited: false };
}

// ============================================================================
// SECURITY LAYER 6: HTML ENTITY ESCAPING (XSS INJECTION PREVENTION)
// ============================================================================
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

// ============================================================================
// SECURITY LAYER 5: MULTI-FACTOR SPAM FILTERING
// ============================================================================
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

function evaluateSpam(
  name: string,
  email: string,
  message: string
): { isSpam: boolean; reason?: string } {
  const combinedText = `${name} ${message}`.toLowerCase();

  // 1. Keyword check
  for (const keyword of SPAM_KEYWORDS) {
    if (combinedText.includes(keyword)) {
      return { isSpam: true, reason: `Keyword rejected: "${keyword}"` };
    }
  }

  // 2. URL count constraint (> 2 URLs)
  const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
  const urlMatches = message.match(urlPattern) || [];
  if (urlMatches.length > 2) {
    return {
      isSpam: true,
      reason: `Excessive links detected (${urlMatches.length} URLs)`,
    };
  }

  // 3. Disposable email domain check
  const domain = email.split("@")[1]?.toLowerCase();
  if (domain && DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return { isSpam: true, reason: `Disposable email domain rejected: ${domain}` };
  }

  return { isSpam: false };
}

// ============================================================================
// SECURITY LAYER 2: GOOGLE reCAPTCHA v3 VERIFICATION
// ============================================================================
async function verifyRecaptcha(
  token: string | undefined,
  remoteIp: string
): Promise<{ valid: boolean; score?: number; reason?: string }> {
  const secretKey = process.env["RECAPTCHA_SECRET_KEY"];
  const minScore = 0.5;

  // In non-production environments, allow pass-through if secret is omitted
  if (!secretKey) {
    if (process.env["NODE_ENV"] !== "production") {
      logSecurityEvent("warn", "RECAPTCHA_BYPASSED_DEV", {
        reason: "RECAPTCHA_SECRET_KEY not set in development mode",
      });
      return { valid: true, score: 1.0 };
    }
    return { valid: false, reason: "Server reCAPTCHA configuration missing" };
  }

  if (!token) {
    return { valid: false, reason: "Missing reCAPTCHA token" };
  }

  try {
    const params = new URLSearchParams({
      secret: secretKey,
      response: token,
      remoteip: remoteIp,
    });

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = (await response.json()) as any;

    if (!data.success) {
      return {
        valid: false,
        reason: `reCAPTCHA API failure: ${data["error-codes"]?.join(", ") || "Unknown error"}`,
      };
    }

    if (typeof data.score === "number" && data.score < minScore) {
      return {
        valid: false,
        score: data.score,
        reason: `Bot score threshold not met (Score: ${data.score}, Threshold: ${minScore})`,
      };
    }

    return { valid: true, score: data.score };
  } catch (err: any) {
    logSecurityEvent("error", "RECAPTCHA_FETCH_ERROR", { message: err?.message });
    return { valid: false, reason: "Unable to connect to verification service" };
  }
}

// ============================================================================
// EMAIL TRANSPORTER CONFIGURATION (Nodemailer + Gmail)
// ============================================================================
function getTransporter() {
  const user = process.env["EMAIL_USER"] || "shivamraut747@gmail.com";
  const pass = process.env["EMAIL_PASSWORD"] || process.env["EMAIL_PASS"] || "dkxohwirkdzrrlzs";

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

// ============================================================================
// MAIN POST /api/contact HANDLER
// ============================================================================
export async function handleContactPost(req: Request, res: Response) {
  const clientIp =
    (req.headers["cf-connecting-ip"] as string) ||
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  try {
    // ------------------------------------------------------------------------
    // 1. RATE LIMITING CHECK (HTTP 429)
    // ------------------------------------------------------------------------
    const rateStatus = checkRateLimit(clientIp);
    if (rateStatus.limited) {
      logSecurityEvent("warn", "RATE_LIMIT_EXCEEDED", { ip: clientIp });
      if (rateStatus.retryAfter) {
        res.setHeader("Retry-After", rateStatus.retryAfter);
      }
      return res.status(429).json({
        success: false,
        error: `Too many contact requests from this IP. Please try again in ${Math.ceil(
          (rateStatus.retryAfter || 3600) / 60
        )} minutes.`,
      });
    }

    const { name, email, message, website, recaptchaToken } = req.body || {};

    // ------------------------------------------------------------------------
    // 2. HONEYPOT TRAP CHECK (HTTP 200 Silent Decoy)
    // ------------------------------------------------------------------------
    if (website && typeof website === "string" && website.trim() !== "") {
      logSecurityEvent("warn", "HONEYPOT_TRIGGERED", {
        ip: clientIp,
        trapValue: website.slice(0, 50),
      });
      // Respond with 200 OK so automated scrapers don't retry with altered payloads
      return res.status(200).json({
        success: true,
        message: "Thank you! Your message has been received.",
      });
    }

    // ------------------------------------------------------------------------
    // 3. SERVER-SIDE INPUT VALIDATION (HTTP 400)
    // ------------------------------------------------------------------------
    const errors: Record<string, string> = {};

    const trimmedName = typeof name === "string" ? name.trim() : "";
    if (!trimmedName || trimmedName.length < 2) {
      errors["name"] = "Name must be at least 2 characters long.";
    } else if (trimmedName.length > 100) {
      errors["name"] = "Name cannot exceed 100 characters.";
    }

    const trimmedEmail = typeof email === "string" ? email.trim() : "";
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      errors["email"] = "Please provide a valid email address.";
    } else if (trimmedEmail.length > 254) {
      errors["email"] = "Email address is too long.";
    }

    const trimmedMessage = typeof message === "string" ? message.trim() : "";
    if (!trimmedMessage || trimmedMessage.length < 10) {
      errors["message"] = "Message must be at least 10 characters long.";
    } else if (trimmedMessage.length > 2000) {
      errors["message"] = "Message cannot exceed 2000 characters.";
    }

    if (Object.keys(errors).length > 0) {
      logSecurityEvent("info", "VALIDATION_FAILED", {
        ip: clientIp,
        fields: Object.keys(errors),
      });
      return res.status(400).json({
        success: false,
        error: "Validation failed. Please verify the submitted data.",
        validationErrors: errors,
      });
    }

    // ------------------------------------------------------------------------
    // 4. SPAM FILTERING (HTTP 400)
    // ------------------------------------------------------------------------
    const spamCheck = evaluateSpam(trimmedName, trimmedEmail, trimmedMessage);
    if (spamCheck.isSpam) {
      logSecurityEvent("warn", "SPAM_REJECTED", { ip: clientIp, reason: spamCheck.reason });
      return res.status(400).json({
        success: false,
        error: "Message flagged as spam by automated security filter.",
      });
    }

    // ------------------------------------------------------------------------
    // 5. reCAPTCHA v3 VERIFICATION (HTTP 403)
    // ------------------------------------------------------------------------
    const recaptchaResult = await verifyRecaptcha(recaptchaToken, clientIp);
    if (!recaptchaResult.valid) {
      logSecurityEvent("warn", "RECAPTCHA_FAILED", {
        ip: clientIp,
        reason: recaptchaResult.reason,
        score: recaptchaResult.score,
      });
      return res.status(403).json({
        success: false,
        error: "Security verification failed. Please refresh and try again.",
      });
    }

    // ------------------------------------------------------------------------
    // 6. HTML ESCAPING & XSS SANITIZATION
    // ------------------------------------------------------------------------
    const safeName = escapeHtml(trimmedName);
    const safeEmail = escapeHtml(trimmedEmail);
    const safeMessage = escapeHtml(trimmedMessage).replace(/\n/g, "<br/>");

    // ------------------------------------------------------------------------
    // 7. EMAIL DISPATCH VIA NODEMAILER (Gmail)
    // ------------------------------------------------------------------------
    const sender = process.env["EMAIL_USER"] || "shivamraut747@gmail.com";
    const recipient = process.env["ADMIN_EMAIL"] || process.env["RECIPIENT_EMAIL"] || sender;
    const timestampFormatted = new Date().toLocaleString("en-US", { timeZoneName: "short" });

    const transporter = getTransporter();

    const mailOptions = {
      from: `"Portfolio Contact Form" <${sender}>`,
      to: recipient,
      replyTo: trimmedEmail,
      subject: `New Contact Submission - [${timestampFormatted}]`,
      // Plain text fallback
      text: `New Portfolio Inquiry\n\nName: ${trimmedName}\nEmail: ${trimmedEmail}\nClient IP: ${anonymizeIp(
        clientIp
      )}\nreCAPTCHA Score: ${recaptchaResult.score ?? 1.0}\n\nMessage:\n${trimmedMessage}`,
      // Sanitized HTML format
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; margin-top: 0; border-bottom: 2px solid #0f172a; padding-bottom: 12px;">New Contact Submission</h2>
          <p style="margin: 8px 0;"><strong>Name:</strong> ${safeName}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <p style="margin: 8px 0;"><strong>Client IP:</strong> ${anonymizeIp(clientIp)}</p>
          <p style="margin: 8px 0;"><strong>reCAPTCHA Score:</strong> ${recaptchaResult.score ?? 1.0}</p>
          <p style="margin: 8px 0;"><strong>Received:</strong> ${timestampFormatted}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <h3 style="color: #334155; margin-bottom: 10px;">Message:</h3>
          <div style="background-color: #f8fafc; border-left: 4px solid #38bdf8; padding: 16px; border-radius: 4px; color: #1e293b; line-height: 1.6;">
            ${safeMessage}
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    logSecurityEvent("info", "EMAIL_DISPATCH_SUCCESS", {
      ip: clientIp,
      score: recaptchaResult.score,
    });

    return res.status(200).json({
      success: true,
      message: "Thank you! Your message has been sent successfully.",
    });
  } catch (error: any) {
    // ------------------------------------------------------------------------
    // 8. SERVER ERROR HANDLING (HTTP 500)
    // ------------------------------------------------------------------------
    logSecurityEvent("error", "SERVER_EXCEPTION", {
      ip: clientIp,
      message: error?.message || String(error),
    });
    return res.status(500).json({
      success: false,
      error: "An internal server error occurred while sending your message. Please try again later.",
    });
  }
}

router.post("/contact", handleContactPost);
router.post("/api/contact", handleContactPost);

export default router;
