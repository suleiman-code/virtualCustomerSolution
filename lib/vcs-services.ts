import { SERVICES_PAGE_CATEGORIES } from '@/lib/services-page-data';

export type VcsServiceOption = {
  value: string;
  label: string;
};

export type VcsServiceGroup = {
  id: string;
  title: string;
  options: VcsServiceOption[];
};

/** Grouped services VCS provides (from services page catalog). */
export const VCS_SERVICE_GROUPS: VcsServiceGroup[] = SERVICES_PAGE_CATEGORIES.map((cat) => ({
  id: cat.id,
  title: cat.title,
  options: cat.items.map((item) => ({
    value: item.name,
    label: item.name,
  })),
}));

/** Flat list of all service names for forms and validation. */
export const VCS_SERVICE_LABELS = VCS_SERVICE_GROUPS.flatMap((g) =>
  g.options.map((o) => o.label)
) as readonly string[];

export const VCS_SERVICE_OTHER_OPTIONS: readonly VcsServiceOption[] = [
  { value: 'Multiple Services', label: 'Multiple Services' },
  { value: 'Not Sure Yet', label: 'Not Sure Yet' },
];
