import { redirect } from 'next/navigation';

/** Legacy route — unified admin lives at `/admin`, `/admin/blogs`, `/admin/services`. */
export default function AdminDashboardLegacyRedirect() {
  redirect('/admin');
}
