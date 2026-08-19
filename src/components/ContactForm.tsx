"use client";

import { useState, type FormEvent } from "react";

/* REPLACE: Formspree form endpoint URL from formspree.io */
const FORMSPREE_ENDPOINT = "https://formspree.io/f/REPLACE_ME";

const projectTypes = [
  "Monthly Content Retainer",
  "Real Estate Shoot",
  "Cinematic Video",
  "Event Coverage",
  "Other",
];

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-fg/30 bg-panel p-8 text-center">
        <p className="font-serif text-2xl font-bold">Message sent.</p>
        <p className="mt-3 text-fg-muted">
          Thanks for reaching out — we&apos;ll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-fg-muted">Name *</span>
          <input
            required
            name="name"
            type="text"
            autoComplete="name"
            className="mt-2 w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm text-fg outline-none focus:border-fg/50"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-fg-muted">Email *</span>
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            className="mt-2 w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm text-fg outline-none focus:border-fg/50"
          />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-fg-muted">Phone (optional)</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            className="mt-2 w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm text-fg outline-none focus:border-fg/50"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-fg-muted">Project Type *</span>
          <select
            required
            name="project_type"
            defaultValue={projectTypes[0]}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-fg outline-none focus:border-fg/50"
          >
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-fg-muted">Message / Project Description *</span>
        <textarea
          required
          name="message"
          rows={5}
          className="mt-2 w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm text-fg outline-none focus:border-fg/50"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-fg-muted">
          Upload references, inspiration, or anything that helps describe your vision (optional)
        </span>
        <input
          name="attachments"
          type="file"
          multiple
          accept="image/*,video/*,application/pdf"
          className="mt-2 w-full rounded-lg border border-dashed border-border bg-transparent px-4 py-3 text-sm text-fg-muted file:mr-4 file:rounded-full file:border-0 file:bg-fg file:px-4 file:py-2 file:text-xs file:font-semibold file:text-bg"
        />
      </label>

      {status === "error" && (
        <p className="text-sm text-fg">
          Something went wrong sending your message. Please try again, or reach out directly
          using the info below.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-fg px-8 py-3.5 text-sm font-semibold tracking-wide text-bg transition-opacity hover:opacity-85 disabled:opacity-50 sm:w-auto"
      >
        {status === "submitting" ? "Sending…" : "Send It"}
      </button>

      <p className="text-xs leading-relaxed text-fg-faint">
        By submitting this form, you agree to be contacted about your project. We respect your
        privacy and never share your information.
      </p>
    </form>
  );
}
