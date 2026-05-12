import { redirect } from 'next/navigation';

/** Legacy URL — all audit requests use the contact form. */
export default function FreeAuditRedirectPage() {
  redirect('/contact?intent=free-audit');
}
