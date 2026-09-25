/**
 * ============================================================================
 * SECURE CONTACT FORM API HANDLER - shivamraut.me
 * ============================================================================
 * Implements 8 Production Security Layers:
 * 1. Client-Side Validation Support (schema contract)
 * 2. Google reCAPTCHA v3 Verification (score threshold >= 0.5)
 * 3. Server-Side Input Validation & Type Checking
 * 4. Honeypot Trap Detection (hidden field for bots)
 * 5. IP-Based Rate Limiting (5 requests per IP per hour)
 * 6. Multi-Factor Spam Filtering (keywords, URL count, disposable domains)
 * 7. HTML Entity Escaping & Strict XSS Sanitization
 * 8. Privacy-Compliant Security Logging (IP masking, no sensitive leaks)
 * ============================================================================
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ----------------------------------------------------------------------------
// SECURITY LAYER: HELMET (HTTP Headers Hardening)
// ----------------------------------------------------------------------------
app.use(helmet());

// ----------------------------------------------------------------------------
// SECURITY LAYER: CORS (Strict Origin Whitelisting)
// ----------------------------------------------------------------------------
const allowedOrigins = [
  "https://shivamraut.me",
  "https://www.shivamraut.me",
  process.env.CLIENT_ORIGIN || "http://localhost:3000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl during dev) only in non-production
      if (!origin && process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation: Origin not allowed"), false);
    },
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept"],
    credentials: true,
  })
);

// Body parser with strict payload size limit (mitigates memory exhaustion / DoS)
app.use(express.json({ limit: "20kb" }));

// ----------------------------------------------------------------------------
// SECURITY LAYER 8: PRIVACY-PRESERVING SECURITY LOGGING
// ----------------------------------------------------------------------------
/**
 * Anonymizes an IP address (e.g. 192.168.1.45 -> 192.168.1.xxx) for GDPR/privacy compliance.
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
  // Do NOT log message content or credentials
  delete safeDetails.message;
  delete safeDetails.password;

  const logMessage = `[SECURITY][${level.toUpperCase()}][${timestamp}] ${eventName}: ${JSON.stringify(
    safeDetails
  )}`;

  if (level === "error" || level === "warn") {
    console.warn(logMessage);
  } else {
    console.log(logMessage);
  }
}

// ----------------------------------------------------------------------------
// SECURITY LAYER 5: RATE LIMITING (Max 5 submissions per IP per hour)
// ----------------------------------------------------------------------------
const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // Limit each IP to 5 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    error: "Too many contact requests from this IP. Please try again in an hour.",
  },
  handler: (req, res, next, options) => {
    logSecurityEvent("warn", "RATE_LIMIT_EXCEEDED", {
      ip: req.ip || req.headers["x-forwarded-for"],
      path: req.originalUrl,
    });
    res.status(options.statusCode).json(options.message);
  },
});

// ----------------------------------------------------------------------------
// SECURITY LAYER 7: HTML ESCAPING / XSS PREVENTION
// ----------------------------------------------------------------------------
/**
 * Escapes HTML entities to neutralize script injection & HTML injection vectors
 */
function escapeHtml(string) {
  if (typeof string !== "string") return "";
  return string
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
// Known high-risk spam keywords across SEO, scams, and gambling
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

// Common disposable/burner email service domains
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

/**
 * Evaluates whether a submission is spam based on keywords, URLs, and disposable domains.
 */
function evaluateSpam(name, email, message) {
  const combinedText = `${name} ${message}`.toLowerCase();

  // 1. Keyword check
  for (const keyword of SPAM_KEYWORDS) {
    if (combinedText.includes(keyword)) {
      return { isSpam: true, reason: `Keyword match: "${keyword}"` };
    }
  }

  // 2. Excess URL count check (> 2 URLs is standard spam indicator)
  const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
  const urlMatches = message.match(urlPattern) || [];
  if (urlMatches.length > 2) {
    return {
      isSpam: true,
      reason: `Exceeded max allowed URLs (${urlMatches.length} URLs detected)`,
    };
  }

  // 3. Disposable email domain check
  const emailDomain = email.split("@")[1]?.toLowerCase();
  if (emailDomain && DISPOSABLE_EMAIL_DOMAINS.has(emailDomain)) {
    return { isSpam: true, reason: `Disposable email domain rejected (${emailDomain})` };
  }

  return { isSpam: false };
}

// ----------------------------------------------------------------------------
// SECURITY LAYER 2: reCAPTCHA v3 VERIFICATION
// ----------------------------------------------------------------------------
/**
 * Verifies invisible reCAPTCHA v3 token with Google's siteverify API.
 */
async function verifyRecaptcha(token, remoteIp) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    // If not configured in development, allow bypass with warning
    if (process.env.NODE_ENV !== "production") {
      logSecurityEvent("warn", "RECAPTCHA_BYPASSED", {
        reason: "RECAPTCHA_SECRET_KEY not set in development mode",
      });
      return { valid: true, score: 1.0 };
    }
    return { valid: false, reason: "reCAPTCHA server configuration missing" };
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

    const data = await response.json();
    const minScore = parseFloat(process.env.RECAPTCHA_MIN_SCORE || "0.5");

    if (!data.success) {
      return {
        valid: false,
        reason: `reCAPTCHA validation failed: ${data["error-codes"]?.join(", ") || "Unknown error"}`,
      };
    }

    if (typeof data.score === "number" && data.score < minScore) {
      return {
        valid: false,
        reason: `Bot score threshold not met (Score: ${data.score}, Threshold: ${minScore})`,
        score: data.score,
      };
    }

    return { valid: true, score: data.score, action: data.action };
  } catch (error) {
    logSecurityEvent("error", "RECAPTCHA_FETCH_EXCEPTION", { message: error.message });
    return { valid: false, reason: "Error connecting to verification service" };
  }
}

// ----------------------------------------------------------------------------
// EMAIL TRANSPORT (Nodemailer with Gmail App Password)
// ----------------------------------------------------------------------------
function getMailer() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error("Email configuration missing: EMAIL_USER and EMAIL_PASS must be set");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

// ----------------------------------------------------------------------------
// POST /api/contact - SECURE ENDPOINT
// ----------------------------------------------------------------------------
app.post("/api/contact", contactRateLimiter, async (req, res) => {
  const clientIp = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  try {
    const { name, email, message, website, recaptchaToken } = req.body || {};

    // ------------------------------------------------------------------------
    // SECURITY LAYER 4: HONEYPOT CHECK
    // ------------------------------------------------------------------------
    // Bots automatically fill hidden fields. If 'website' has a value, reject immediately.
    if (website && website.trim() !== "") {
      logSecurityEvent("warn", "HONEYPOT_TRIGGERED", {
        ip: clientIp,
        trapValue: website.slice(0, 50),
      });
      // Respond with 200 OK so bots believe submission succeeded and don't retry with altered payloads
      return res.status(200).json({
        success: true,
        message: "Your message has been received.",
      });
    }

    // ------------------------------------------------------------------------
    // SECURITY LAYER 3: SERVER-SIDE INPUT VALIDATION
    // ------------------------------------------------------------------------
    const errors = {};

    // Validate Name (2 - 100 characters, trimmed)
    const trimmedName = typeof name === "string" ? name.trim() : "";
    if (!trimmedName || trimmedName.length < 2) {
      errors.name = "Name must be at least 2 characters long.";
    } else if (trimmedName.length > 100) {
      errors.name = "Name cannot exceed 100 characters.";
    }

    // Validate Email (RFC 5322 regex + length constraint)
    const trimmedEmail = typeof email === "string" ? email.trim() : "";
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      errors.email = "Please provide a valid email address.";
    } else if (trimmedEmail.length > 254) {
      errors.email = "Email address is too long.";
    }

    // Validate Message (10 - 2000 characters, trimmed)
    const trimmedMessage = typeof message === "string" ? message.trim() : "";
    if (!trimmedMessage || trimmedMessage.length < 10) {
      errors.message = "Message must be at least 10 characters long.";
    } else if (trimmedMessage.length > 2000) {
      errors.message = "Message cannot exceed 2000 characters.";
    }

    if (Object.keys(errors).length > 0) {
      logSecurityEvent("info", "VALIDATION_FAILED", { ip: clientIp, fields: Object.keys(errors) });
      return res.status(400).json({
        success: false,
        error: "Validation error. Please verify your inputs.",
        validationErrors: errors,
      });
    }

    // ------------------------------------------------------------------------
    // SECURITY LAYER 6: SPAM FILTER CHECK
    // ------------------------------------------------------------------------
    const spamCheck = evaluateSpam(trimmedName, trimmedEmail, trimmedMessage);
    if (spamCheck.isSpam) {
      logSecurityEvent("warn", "SPAM_REJECTED", {
        ip: clientIp,
        reason: spamCheck.reason,
      });
      return res.status(400).json({
        success: false,
        error: "Message flagged by automated spam filter.",
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

    const transporter = getMailer();
    const recipient = process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER;

    const mailOptions = {
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to: recipient,
      replyTo: trimmedEmail,
      subject: `New Portfolio Inquiry from ${safeName}`,
      // Plain text fallback (immune to HTML rendering vulnerabilities)
      text: `Name: ${trimmedName}\nEmail: ${trimmedEmail}\nIP: ${anonymizeIp(
        clientIp
      )}\n\nMessage:\n${trimmedMessage}`,
      // Sanitized HTML email
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #111; margin-top: 0; border-bottom: 2px solid #111; padding-bottom: 10px;">New Portfolio Inquiry</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <p><strong>Verified Security Score:</strong> ${recaptchaResult.score ?? "N/A"}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <h3 style="color: #333;">Message:</h3>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; color: #222; line-height: 1.6;">
            ${safeMessage}
          </div>
          <p style="font-size: 11px; color: #999; margin-top: 25px;">
            Sent from secure contact form at shivamraut.me (IP: ${anonymizeIp(clientIp)})
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    logSecurityEvent("info", "MESSAGE_SENT_SUCCESS", {
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

app.listen(PORT, () => {
  console.log(`[INFO] Secure Contact Form API running on port ${PORT}`);
});
