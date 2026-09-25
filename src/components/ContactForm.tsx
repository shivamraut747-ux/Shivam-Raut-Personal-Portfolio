import React, { useState, useEffect, useId } from "react";
import { submitContactForm } from "@/lib/contact-server-fn";

export interface ContactFormProps {
  className?: string;
  onSuccess?: () => void;
}

interface FormState {
  name: string;
  email: string;
  message: string;
  website: string; // Honeypot trap
}

interface FormErrors {
  name?: string | undefined;
  email?: string | undefined;
  message?: string | undefined;
}

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function ContactForm({ className = "", onSuccess }: ContactFormProps) {
  const formId = useId();
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    message: "",
    website: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Validate individual field
  const validateField = (field: keyof FormState, value: string): string | undefined => {
    const trimmed = value.trim();
    if (field === "name") {
      if (!trimmed) return "Name is required.";
      if (trimmed.length < 2) return "Name must be at least 2 characters.";
      if (trimmed.length > 100) return "Name cannot exceed 100 characters.";
    }
    if (field === "email") {
      if (!trimmed) return "Email address is required.";
      if (!EMAIL_REGEX.test(trimmed)) return "Please enter a valid email address.";
      if (trimmed.length > 254) return "Email address is too long.";
    }
    if (field === "message") {
      if (!trimmed) return "Message is required.";
      if (trimmed.length < 10) return "Message must be at least 10 characters.";
      if (trimmed.length > 2000) return "Message cannot exceed 2000 characters.";
    }
    return undefined;
  };

  // Real-time validation on change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name as keyof FormState, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Mark field as touched on blur and run validation
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name as keyof FormState, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Form validity check
  const isFormValid =
    formData.name.trim().length >= 2 &&
    formData.name.trim().length <= 100 &&
    EMAIL_REGEX.test(formData.email.trim()) &&
    formData.email.trim().length <= 254 &&
    formData.message.trim().length >= 10 &&
    formData.message.trim().length <= 2000 &&
    !errors.name &&
    !errors.email &&
    !errors.message;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // Run full validation check
    const nameErr = validateField("name", formData.name);
    const emailErr = validateField("email", formData.email);
    const messageErr = validateField("message", formData.message);

    setTouched({ name: true, email: true, message: true });
    setErrors({ name: nameErr, email: emailErr, message: messageErr });

    if (nameErr || emailErr || messageErr) {
      setStatusMessage({
        type: "error",
        text: "Please correct the highlighted fields before submitting.",
      });
      return;
    }

    // SECURITY LAYER 4: Honeypot trap check
    if (formData.website.trim() !== "") {
      setStatusMessage({
        type: "success",
        text: "Thank you! Your message has been sent successfully.",
      });
      setFormData({ name: "", email: "", message: "", website: "" });
      setTouched({});
      setErrors({});
      return;
    }

    setIsSubmitting(true);

    try {
      // SECURITY LAYER 2: Invisible reCAPTCHA v3 execution
      let recaptchaToken = "";
      const siteKey =
        (import.meta as any).env?.VITE_RECAPTCHA_SITE_KEY ||
        (window as any).__RECAPTCHA_SITE_KEY__;

      if (siteKey && typeof (window as any).grecaptcha !== "undefined") {
        try {
          recaptchaToken = await (window as any).grecaptcha.execute(siteKey, {
            action: "contact_submit",
          });
        } catch (recaptchaErr) {
          console.warn("reCAPTCHA v3 execution warning:", recaptchaErr);
        }
      }

      // First attempt: TanStack Start native RPC server function
      let handled = false;
      try {
        const result = await submitContactForm({
          data: {
            name: formData.name.trim(),
            email: formData.email.trim(),
            message: formData.message.trim(),
            website: formData.website,
            recaptchaToken,
          },
        });

        if (result.success) {
          setStatusMessage({
            type: "success",
            text: result.message || "Thank you! Your message has been sent successfully.",
          });
          setFormData({ name: "", email: "", message: "", website: "" });
          setTouched({});
          setErrors({});
          if (onSuccess) onSuccess();
          handled = true;
        } else if (result.error) {
          setStatusMessage({ type: "error", text: result.error });
          handled = true;
        }
      } catch {
        handled = false;
      }

      // Fallback attempt: HTTP POST /api/contact
      if (!handled) {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            message: formData.message.trim(),
            website: formData.website,
            recaptchaToken,
          }),
        });

        const data = await response.json().catch(() => null);

        if (response.ok && data?.success) {
          setStatusMessage({
            type: "success",
            text: data.message || "Thank you! Your message has been sent successfully.",
          });
          setFormData({ name: "", email: "", message: "", website: "" });
          setTouched({});
          setErrors({});
          if (onSuccess) onSuccess();
        } else {
          setStatusMessage({
            type: "error",
            text:
              data?.error ||
              "Failed to send message. Please try again or email shivamraut747@gmail.com directly.",
          });
        }
      }
    } catch {
      // Graceful client fallback to mailto if network completely fails
      setStatusMessage({
        type: "error",
        text: "Network error. Opening your email client as fallback...",
      });
      const mailtoUrl = `mailto:shivamraut747@gmail.com?subject=${encodeURIComponent(
        `Portfolio Inquiry from ${formData.name.trim()}`
      )}&body=${encodeURIComponent(formData.message.trim())}`;
      window.location.href = mailtoUrl;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`w-full max-w-xl mx-auto p-6 md:p-8 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 shadow-xl transition-colors duration-200 ${className}`}
    >
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Send me an email
        </h2>
        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-400">
          Have a question or project inquiry? Fill out the form below and I&apos;ll get back to you shortly.
        </p>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div
          role="alert"
          aria-live="polite"
          className={`mb-6 p-4 rounded-xl text-sm font-medium border transition-all ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
              : "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* SECURITY LAYER 4: Honeypot Field (Traps bots, invisible to humans) */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor={`${formId}-website`}>Website</label>
          <input
            id={`${formId}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name Field */}
          <div>
            <label
              htmlFor={`${formId}-name`}
              className="block text-sm font-semibold text-zinc-950 dark:text-zinc-200 mb-1.5"
            >
              Name
            </label>
            <input
              id={`${formId}-name`}
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={100}
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              className={`w-full px-3.5 py-2.5 rounded-lg text-sm bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 border transition-all outline-none ${
                errors.name && touched["name"]
                  ? "border-red-500 ring-2 ring-red-500/20"
                  : "border-zinc-300 dark:border-zinc-700 focus:border-zinc-950 dark:focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10"
              }`}
            />
            {errors.name && touched["name"] && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor={`${formId}-email`}
              className="block text-sm font-semibold text-zinc-950 dark:text-zinc-200 mb-1.5"
            >
              Email
            </label>
            <input
              id={`${formId}-email`}
              name="email"
              type="email"
              required
              maxLength={254}
              placeholder="Your email address"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              className={`w-full px-3.5 py-2.5 rounded-lg text-sm bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 border transition-all outline-none ${
                errors.email && touched["email"]
                  ? "border-red-500 ring-2 ring-red-500/20"
                  : "border-zinc-300 dark:border-zinc-700 focus:border-zinc-950 dark:focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10"
              }`}
            />
            {errors.email && touched["email"] && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400" role="alert">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Message Field */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label
              htmlFor={`${formId}-message`}
              className="block text-sm font-semibold text-zinc-950 dark:text-zinc-200"
            >
              Message
            </label>
            <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
              {formData.message.length} / 2000
            </span>
          </div>
          <textarea
            id={`${formId}-message`}
            name="message"
            rows={5}
            required
            minLength={10}
            maxLength={2000}
            placeholder="Your message..."
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            className={`w-full px-3.5 py-2.5 rounded-lg text-sm bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 border transition-all outline-none resize-y ${
              errors.message && touched["message"]
                ? "border-red-500 ring-2 ring-red-500/20"
                : "border-zinc-300 dark:border-zinc-700 focus:border-zinc-950 dark:focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10"
            }`}
          />
          {errors.message && touched["message"] && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400" role="alert">
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-sm text-white bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                <span>Sending...</span>
              </>
            ) : (
              <span>Send email</span>
            )}
          </button>
        </div>

        {/* reCAPTCHA Invisible Badge notice */}
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 text-center sm:text-left leading-relaxed">
          Protected by reCAPTCHA v3. Google{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-zinc-900 dark:hover:text-zinc-200"
          >
            Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-zinc-900 dark:hover:text-zinc-200"
          >
            Terms of Service
          </a>{" "}
          apply.
        </p>
      </form>
    </div>
  );
}

export default ContactForm;
