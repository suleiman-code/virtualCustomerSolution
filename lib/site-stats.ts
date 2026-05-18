/** Public trust metrics — keep in sync across homepage, about, metadata, and schema. */
export const SITE_STATS = {
  years: { value: 3, suffix: '+', label: 'Years in Business', display: '3+' },
  clients: { value: 50, suffix: '+', label: 'Clients Served', display: '50+' },
  retention: { value: 92, suffix: '%', label: 'Client Retention', display: '92%' },
  countries: { value: 10, suffix: '+', label: 'Countries', display: '10+' },
  foundedYear: 2022,
} as const;

export const SITE_STATS_CLIENTS_COUNTRIES =
  `${SITE_STATS.clients.display} clients across ${SITE_STATS.countries.display} countries`;

export const SITE_STATS_META =
  `${SITE_STATS.years.display} years · ${SITE_STATS.clients.display} clients · ${SITE_STATS.retention.display} retention · ${SITE_STATS.countries.display} countries`;
