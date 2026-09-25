/**
 * ============================================================================
 * SECURE CONTACT API ROUTE (POST /api/contact)
 * ============================================================================
 * Implements All 8 Production Security Layers:
 * 1. Client-Side Contract & Schema Verification
 * 2. Invisible Google reCAPTCHA v3 Verification (Score threshold > 0.5)
 * 3. Strict Server-Side Input Validation & Sanitization
 * 4. Honeypot Bot Trap Detection (Silent 200 OK decoy)
 * 5. In-Memory Sliding-Window Rate Limiting (5 requests per IP per hour)
 * 6. Multi-Factor Spam Filtering (Keywords, URL count, Disposable domains)
 * 7. HTML Entity Escaping & Strict XSS Sanitization
 * 8. Privacy-Compliant Security Logging (IP anonymization, zero credential leak)
 * ============================================================================
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ----------------------------------------------------------------------------
// SECURITY HEADERS & CORS HARDENING
// ----------------------------------------------------------------------------
app.use(helmet());

// Limit payload size to mitigate DoS / Memory exhaustion attacks
app.use(express.json({ limit: "25kb" }));

// Whitelist allowed origins
const allowedOrigins = [
  "https://shivamraut.me",
  "https://www.shivamraut.me",
  process.env.CLIENT_ORIGIN || "http://localhost:3000",
  "http://localhost:4321", // Astro default dev server
  "http://localhost:5173", // Vite default dev server
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g., curl) only in development
      if (!origin && process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin forbidden by security policy"), false);
    },
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept"],
    credentials: true,
  })
);

// ----------------------------------------------------------------------------
// SECURITY LAYER 8: PRIVACY-PRESERVING SECURITY LOGGING
// ----------------------------------------------------------------------------
/**
 * Anonymizes client IP addresses for GDPR/privacy compliance
 * Example: 192.168.1.45 -> 192.168.1.xxx
 */
function anonymizeIp(ip = "") {
  if (!ip) return "unknown";
  if (ip.includes(".")) {
    return ip.replace(/\.\d+$/, ".xxx");
  }
  if (ip.includes(":")) {
    return ip.replace(/:[^:]+$/, ":xxxx");
  }
  return ip;
}

function logSecurityEvent(level, eventName, details = {}) {
  const timestamp = new Date().toISOString();
  const safeDetails = {
    ...details,
    ip: anonymizeIp(details.ip),
  };

  // Prevent credentials, passwords, or raw message text from leaking to logs
  delete safeDetails.password;
  delete safeDetails.message;

  const logLine = `[SECURITY][${level.toUpperCase()}][${timestamp}] ${eventName}: ${JSON.stringify(
    safeDetails
  )}`;

  if (level === "error" || level === "warn") {
    console.warn(logLine);
  } else {
    console.log(logLine);
  }
}

// ----------------------------------------------------------------------------
// SECURITY LAYER 5: IN-MEMORY SLIDING-WINDOW RATE LIMITING
// Max 5 submissions per IP per 60 minutes
// ----------------------------------------------------------------------------
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 5;

// Routine cleanup every 10 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}, 10 * 60 * 1000).unref();

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { limited: false, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      limited: true,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return { limited: false, remaining: RATE_LIMIT_MAX_REQUESTS - entry.count };
}

// ----------------------------------------------------------------------------
// SECURITY LAYER 7: HTML ENTITY ESCAPING / XSS PREVENTION
// ----------------------------------------------------------------------------
function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\//g, "&#x2F;");
}

// ----------------------------------------------------------------------------
// SECURITY LAYER 6: MULTI-FACTOR SPAM FILTER
// ----------------------------------------------------------------------------
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

function evaluateSpam(name, email, message) {
  const combinedText = `${name} ${message}`.toLowerCase();

  // 1. Keyword detection
  for (const keyword of SPAM_KEYWORDS) {
    if (combinedText.includes(keyword)) {
      return { isSpam: true, reason: `Forbidden keyword detected: "${keyword}"` };
    }
  }

  // 2. URL count constraint (> 2 URLs is strong spam signal)
  const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
  const urlMatches = message.match(urlPattern) || [];
  if (urlMatches.length > 2) {
    return {
      isSpam: true,
      reason: `Excessive URLs detected (${urlMatches.length} URLs)`,
    };
  }

  // 3. Disposable email domain check
  const domain = email.split("@")[1]?.toLowerCase();
  if (domain && DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return { isSpam: true, reason: `Disposable email provider rejected: ${domain}` };
  }

  return { isSpam: false };
}

// ----------------------------------------------------------------------------
// SECURITY LAYER 2: GOOGLE reCAPTCHA v3 VERIFICATION
// ----------------------------------------------------------------------------
async function verifyRecaptcha(token, remoteIp) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const minScore = parseFloat(process.env.RECAPTCHA_MIN_SCORE || "0.5");

  // In local development, if secret key is missing, allow bypass with warning
  if (!secretKey) {
    if (process.env.NODE_ENV !== "production") {
      logSecurityEvent("warn", "RECAPTCHA_BYPASSED_DEV", {
        reason: "RECAPTCHA_SECRET_KEY not set in non-production",
      });
      return { valid: true, score: 1.0 };
    }
    return { valid: false, reason: "Server reCAPTCHA configuration missing" };
  }

  if (!token) {
    return { valid: false, reason: "Missing reCAPTCHA verification token" };
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

    const data = await response.json();

    if (!data.success) {
      return {
        valid: false,
        reason: `reCAPTCHA API failure: ${data["error-codes"]?.join(", ") || "Validation failed"}`,
      };
    }

    if (typeof data.score === "number" && data.score < minScore) {
      return {
        valid: false,
        score: data.score,
        reason: `Bot score threshold rejected (Score: ${data.score}, Required: >= ${minScore})`,
      };
    }

    return { valid: true, score: data.score };
  } catch (error) {
    logSecurityEvent("error", "RECAPTCHA_NETWORK_EXCEPTION", { message: error.message });
    return { valid: false, reason: "Verification service temporarily unreachable" };
  }
}

// ----------------------------------------------------------------------------
// EMAIL TRANSPORTER (Nodemailer + Gmail App Password)
// ----------------------------------------------------------------------------
function createMailer() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error("Missing EMAIL_USER or EMAIL_PASS environment variables.");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

// ----------------------------------------------------------------------------
// POST /api/contact ENDPOINT
// ----------------------------------------------------------------------------
app.post("/api/contact", async (req, res) => {
  const clientIp =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  try {
    // ------------------------------------------------------------------------
    // SECURITY LAYER 5: RATE LIMITING (5 requests per hour)
    // ------------------------------------------------------------------------
    const rateCheck = checkRateLimit(clientIp);
    if (rateCheck.limited) {
      logSecurityEvent("warn", "RATE_LIMIT_EXCEEDED", { ip: clientIp });
      res.setHeader("Retry-After", rateCheck.retryAfterSeconds);
      return res.status(429).json({
        success: false,
        error: `Too many contact requests from this IP. Please retry in ${Math.ceil(
          rateCheck.retryAfterSeconds / 60
        )} minutes.`,
      });
    }

    const { name, email, message, website, recaptchaToken } = req.body || {};

    // ------------------------------------------------------------------------
    // SECURITY LAYER 4: HONEYPOT TRAP DETECTION
    // ------------------------------------------------------------------------
    if (website && typeof website === "string" && website.trim() !== "") {
      logSecurityEvent("warn", "HONEYPOT_TRIGGERED", {
        ip: clientIp,
        trapValue: website.slice(0, 50),
      });
      // Respond with 200 OK so automated bot stops without discovering trap
      return res.status(200).json({
        success: true,
        message: "Thank you! Your message has been received.",
      });
    }

    // ------------------------------------------------------------------------
    // SECURITY LAYER 3: SERVER-SIDE INPUT VALIDATION
    // ------------------------------------------------------------------------
    const errors = {};

    // Name Validation (2 to 100 characters)
    const trimmedName = typeof name === "string" ? name.trim() : "";
    if (!trimmedName || trimmedName.length < 2) {
      errors.name = "Name must be at least 2 characters long.";
    } else if (trimmedName.length > 100) {
      errors.name = "Name cannot exceed 100 characters.";
    }

    // Email Validation (RFC 5322 regex + max length 254)
    const trimmedEmail = typeof email === "string" ? email.trim() : "";
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      errors.email = "Please provide a valid email address.";
    } else if (trimmedEmail.length > 254) {
      errors.email = "Email address is too long.";
    }

    // Message Validation (10 to 2000 characters)
    const trimmedMessage = typeof message === "string" ? message.trim() : "";
    if (!trimmedMessage || trimmedMessage.length < 10) {
      errors.message = "Message must be at least 10 characters long.";
    } else if (trimmedMessage.length > 2000) {
      errors.message = "Message cannot exceed 2000 characters.";
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
    // SECURITY LAYER 6: MULTI-FACTOR SPAM FILTER
    // ------------------------------------------------------------------------
    const spamCheck = evaluateSpam(trimmedName, trimmedEmail, trimmedMessage);
    if (spamCheck.isSpam) {
      logSecurityEvent("warn", "SPAM_REJECTED", {
        ip: clientIp,
        reason: spamCheck.reason,
      });
      return res.status(400).json({
        success: false,
        error: "Message flagged as spam by automated security filter.",
      });
    }

    // ------------------------------------------------------------------------
    // SECURITY LAYER 2: reCAPTCHA v3 VERIFICATION
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
    // SECURITY LAYER 7: HTML ESCAPING FOR EMAIL DISPATCH
    // ------------------------------------------------------------------------
    const safeName = escapeHtml(trimmedName);
    const safeEmail = escapeHtml(trimmedEmail);
    const safeMessage = escapeHtml(trimmedMessage).replace(/\n/g, "<br/>");

    const transporter = createMailer();
    const recipient = process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER;

    const mailOptions = {
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to: recipient,
      replyTo: trimmedEmail,
      subject: `New Portfolio Inquiry from ${safeName}`,
      // Plain text fallback (immune to HTML injection rendering)
      text: `Name: ${trimmedName}\nEmail: ${trimmedEmail}\nIP: ${anonymizeIp(
        clientIp
      )}\nScore: ${recaptchaResult.score ?? 1.0}\n\nMessage:\n${trimmedMessage}`,
      // Sanitized HTML email
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; margin-top: 0; border-bottom: 2px solid #0f172a; padding-bottom: 12px;">New Portfolio Contact Inquiry</h2>
          <p style="margin: 8px 0;"><strong>Name:</strong> ${safeName}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <p style="margin: 8px 0;"><strong>Verified Security Score:</strong> ${recaptchaResult.score ?? "1.0"}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <h3 style="color: #334155; margin-bottom: 10px;">Message Content:</h3>
          <div style="background-color: #f8fafc; border-left: 4px solid #38bdf8; padding: 16px; border-radius: 4px; color: #1e293b; line-height: 1.6;">
            ${safeMessage}
          </div>
          <p style="font-size: 11px; color: #94a3b8; margin-top: 28px;">
            Submitted via contact form on shivamraut.me (Client IP: ${anonymizeIp(clientIp)})
          </p>
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
  } catch (error) {
    logSecurityEvent("error", "SERVER_EXCEPTION", {
      ip: clientIp,
      message: error.message,
    });
    return res.status(500).json({
      success: false,
      error: "An internal server error occurred while sending your message. Please try again later.",
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Start Express server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`[INFO] Secure Contact Form API running on http://localhost:${PORT}`);
  });
}

export default app;
