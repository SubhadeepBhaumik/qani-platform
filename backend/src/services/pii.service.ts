// Best-effort PII redaction applied to free text before it is sent to a
// third-party AI provider. This is defense-in-depth, not a guarantee — it
// targets the fields we can reliably pattern-match (email, phone) plus the
// specific candidate's own name (exact match, since we already know it).

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
// Matches common phone formats: optional +country code, spaces/dashes/parens,
// 8-15 digits total. Deliberately broad to favour catching real numbers.
const PHONE_RE = /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?){2,5}\d{2,4}/g;

export function extractPhoneLocally(text: string): string | null {
  const candidates = text.match(PHONE_RE) || [];
  for (const c of candidates) {
    const digits = c.replace(/\D/g, '');
    if (digits.length >= 8 && digits.length <= 15) return c.trim();
  }
  return null;
}

export function stripPII(text: string, firstName?: string | null, lastName?: string | null): string {
  let cleaned = text.replace(EMAIL_RE, '[REDACTED_EMAIL]').replace(PHONE_RE, '[REDACTED_PHONE]');
  const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (firstName && firstName.trim().length > 1) {
    cleaned = cleaned.replace(new RegExp(escapeRe(firstName.trim()), 'gi'), '[CANDIDATE]');
  }
  if (lastName && lastName.trim().length > 1) {
    cleaned = cleaned.replace(new RegExp(escapeRe(lastName.trim()), 'gi'), '[CANDIDATE]');
  }
  return cleaned;
}
