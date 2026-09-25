export type Language = 'en' | 'fr';

export interface DashboardCopy {
  language: { label: string; english: string; french: string };
  theme: { label: string; midnight: string; daylight: string };
  navigation: { environment: string; utc: string; profile: string };
  footer: { product: string; tagline: string };
  hero: { section: string; view: string; title: string; description: string; live: string };
  filters: {
    label: string;
    service: string;
    allServices: string;
    timeWindow: string;
    lastMinute: string;
    lastFiveMinutes: string;
    lastFifteenMinutes: string;
  };
  connection: {
    connecting: string;
    live: string;
    paused: string;
    reconnecting: string;
    error: string;
    resume: string;
    pause: string;
    waiting: string;
    loadingHint: string;
    updatedNow: string;
    updatedSecondsAgo: (seconds: number) => string;
  };
  metrics: {
    summary: string;
    events: string;
    eventsHelper: string;
    eventsTarget: (max: number) => string;
    requestRate: string;
    requestRateHelper: string;
    requestRateTarget: string;
    p95Latency: string;
    p95Helper: string;
    p95Target: string;
    healthyDelivery: string;
    healthyHelper: string;
    healthyTarget: string;
  };
  chart: {
    eyebrow: string;
    title: string;
    description: string;
    average: string;
    waiting: string;
  };
  events: {
    eyebrow: string;
    title: string;
    retained: (count: number) => string;
    incoming: string;
    max: (max: number) => string;
    noMatches: string;
    healthy: string;
    warning: string;
    critical: string;
  };
  status: {
    title: string;
    description: string;
    accepted: (count: string) => string;
    rejected: (count: number) => string;
  };
  github: {
    eyebrow: string;
    title: string;
    description: string;
    source: string;
    loading: string;
    unavailable: string;
    empty: string;
    updated: string;
  };
}

export const translations: Record<Language, DashboardCopy> = {
  en: {
    language: { label: 'Language', english: 'English', french: 'French' },
    theme: { label: 'Theme', midnight: 'Dark', daylight: 'Light' },
    navigation: { environment: 'Local', utc: 'UTC', profile: 'Account' },
    footer: {
      product: 'Stream Board',
      tagline: 'Live monitoring dashboard',
    },
    hero: {
      section: 'Monitoring',
      view: 'Overview',
      title: 'Live dashboard',
      description: 'Watch latency, health, and recent events as they come in.',
      live: 'Live',
    },
    filters: {
      label: 'Filters',
      service: 'Service',
      allServices: 'All services',
      timeWindow: 'Time range',
      lastMinute: 'Last minute',
      lastFiveMinutes: 'Last 5 minutes',
      lastFifteenMinutes: 'Last 15 minutes',
    },
    connection: {
      connecting: 'Connecting…',
      live: 'Connected',
      paused: 'Paused',
      reconnecting: 'Reconnecting…',
      error: 'Disconnected',
      resume: 'Resume',
      pause: 'Pause',
      waiting: 'Waiting for data',
      loadingHint: 'This usually takes a second.',
      updatedNow: 'Just now',
      updatedSecondsAgo: (seconds) => `${seconds}s ago`,
    },
    metrics: {
      summary: 'Summary',
      events: 'Events',
      eventsHelper: 'in this range',
      eventsTarget: (max) => `${max} max`,
      requestRate: 'Rate',
      requestRateHelper: 'per minute',
      requestRateTarget: 'this range',
      p95Latency: 'p95 latency',
      p95Helper: 'this range',
      p95Target: 'under 250 ms',
      healthyDelivery: 'Healthy',
      healthyHelper: 'ok events',
      healthyTarget: '99% target',
    },
    chart: {
      eyebrow: 'Latency',
      title: 'Response time',
      description: 'How long requests are taking in the current range.',
      average: 'Avg',
      waiting: 'No data yet',
    },
    events: {
      eyebrow: 'Feed',
      title: 'Recent events',
      retained: (count) => `${count} events`,
      incoming: 'Events will show up here.',
      max: (max) => `${max} max`,
      noMatches: 'Nothing in this range.',
      healthy: 'Healthy',
      warning: 'Warning',
      critical: 'Critical',
    },
    status: {
      title: 'Services',
      description: 'Latest status for each service.',
      accepted: (count) => `${count} received`,
      rejected: (count) => `${count} skipped`,
    },
    github: {
      eyebrow: 'GitHub',
      title: 'Public activity',
      description: 'Recent public events from GitHub.',
      source: 'GitHub',
      loading: 'Loading…',
      unavailable: 'Couldn’t load GitHub events.',
      empty: 'No events right now.',
      updated: 'Updated',
    },
  },
  fr: {
    language: { label: 'Langue', english: 'Anglais', french: 'Français' },
    theme: { label: 'Thème', midnight: 'Sombre', daylight: 'Clair' },
    navigation: { environment: 'Local', utc: 'UTC', profile: 'Compte' },
    footer: {
      product: 'Stream Board',
      tagline: 'Tableau de suivi en direct',
    },
    hero: {
      section: 'Suivi',
      view: 'Aperçu',
      title: 'Tableau de bord',
      description: 'Latence, santé des services et événements récents.',
      live: 'Direct',
    },
    filters: {
      label: 'Filtres',
      service: 'Service',
      allServices: 'Tous les services',
      timeWindow: 'Période',
      lastMinute: 'Dernière minute',
      lastFiveMinutes: '5 dernières minutes',
      lastFifteenMinutes: '15 dernières minutes',
    },
    connection: {
      connecting: 'Connexion…',
      live: 'Connecté',
      paused: 'En pause',
      reconnecting: 'Reconnexion…',
      error: 'Déconnecté',
      resume: 'Reprendre',
      pause: 'Pause',
      waiting: 'En attente',
      loadingHint: 'Cela ne prend en général qu’une seconde.',
      updatedNow: 'À l’instant',
      updatedSecondsAgo: (seconds) => `Il y a ${seconds} s`,
    },
    metrics: {
      summary: 'Résumé',
      events: 'Événements',
      eventsHelper: 'sur cette période',
      eventsTarget: (max) => `${max} max`,
      requestRate: 'Débit',
      requestRateHelper: 'par minute',
      requestRateTarget: 'cette période',
      p95Latency: 'Latence p95',
      p95Helper: 'cette période',
      p95Target: 'sous 250 ms',
      healthyDelivery: 'Sains',
      healthyHelper: 'événements ok',
      healthyTarget: 'objectif 99 %',
    },
    chart: {
      eyebrow: 'Latence',
      title: 'Temps de réponse',
      description: 'Durée des requêtes sur la période choisie.',
      average: 'Moy.',
      waiting: 'Pas encore de données',
    },
    events: {
      eyebrow: 'Flux',
      title: 'Événements récents',
      retained: (count) => `${count} événements`,
      incoming: 'Les événements apparaîtront ici.',
      max: (max) => `${max} max`,
      noMatches: 'Rien sur cette période.',
      healthy: 'Sain',
      warning: 'Alerte',
      critical: 'Critique',
    },
    status: {
      title: 'Services',
      description: 'Dernier état de chaque service.',
      accepted: (count) => `${count} reçus`,
      rejected: (count) => `${count} ignorés`,
    },
    github: {
      eyebrow: 'GitHub',
      title: 'Activité publique',
      description: 'Événements publics récents sur GitHub.',
      source: 'GitHub',
      loading: 'Chargement…',
      unavailable: 'Impossible de charger GitHub.',
      empty: 'Aucun événement pour le moment.',
      updated: 'Mis à jour',
    },
  },
};
