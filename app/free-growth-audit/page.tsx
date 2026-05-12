import { redirect } from 'next/navigation';

/** Legacy URL — all audit CTAs now land on Contact with audit intent. */
export default function FreeGrowthAuditRedirect() {
  redirect('/contact?intent=free-audit');
}
