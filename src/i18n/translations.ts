export type Language = 'en' | 'fr';

export interface DashboardCopy {
  language: { label: string; english: string; french: string };
  theme: { label: string; midnight: string; daylight: string };
  navigation: { production: string; liveClock: string; profile: string };
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
    updatedNow: string;
    updatedSecondsAgo: (seconds: number) => string;
  };
  metrics: {
    summary: string;
    events: string;
    eventsHelper: string;
    eventsTarget: string;
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
    max: string;
    noMatches: string;
    healthy: string;
    warning: string;
    critical: string;
  };
  guardrails: {
    title: string;
    description: string;
    accepted: (count: string) => string;
    rejected: (count: number) => string;
  };
  publicActivity: {
    eyebrow: string;
    title: string;
    description: string;
    source: string;
    cache: string;
    loading: string;
    unavailable: string;
    noActivity: string;
    refreshed: string;
  };
}

export const translations: Record<Language, DashboardCopy> = {
  en: {
    language: { label: 'Language', english: 'English', french: 'French' },
    theme: { label: 'Theme', midnight: 'Midnight', daylight: 'Daylight' },
    navigation: { production: 'Production', liveClock: 'UTC live', profile: 'Profile' },
    hero: {
      section: 'Observability',
      view: 'Live overview',
      title: 'Operational pulse',
      description: 'Live service signals, narrowed to the scope you care about.',
      live: 'Live',
    },
    filters: {
      label: 'Scope', service: 'Service', allServices: 'All services', timeWindow: 'Time window',
      lastMinute: 'Last minute', lastFiveMinutes: 'Last 5 minutes', lastFifteenMinutes: 'Last 15 minutes',
    },
    connection: {
      connecting: 'Establishing a secure stream', live: 'Stream is healthy', paused: 'Feed paused locally',
      reconnecting: 'Reconnecting with backoff', error: 'Stream needs attention', resume: 'Resume feed',
      pause: 'Pause feed', waiting: 'waiting for data', updatedNow: 'updated just now',
      updatedSecondsAgo: (seconds) => `updated ${seconds}s ago`,
    },
    metrics: {
      summary: 'Live performance summary', events: 'Events in scope', eventsHelper: 'validated and retained',
      eventsTarget: 'bounded live buffer', requestRate: 'Request rate', requestRateHelper: 'rolling traffic signal',
      requestRateTarget: 'current delivery volume', p95Latency: 'p95 latency', p95Helper: 'from selected events',
      p95Target: 'target under 250 ms', healthyDelivery: 'Healthy delivery', healthyHelper: 'successful events only',
      healthyTarget: 'target above 99%',
    },
    chart: {
      eyebrow: 'Live metric', title: 'Latency pulse', description: 'Request settlement time across the selected stream.',
      average: 'Avg', waiting: 'Waiting for validated events',
    },
    events: {
      eyebrow: 'Event trail', title: 'Recent activity', retained: (count) => `${count} retained events · virtualized list`,
      incoming: 'New events will appear here.', max: '360 max', noMatches: 'No events match this scope yet.',
      healthy: 'Healthy', warning: 'Watch', critical: 'Critical',
    },
    guardrails: {
      title: 'Guardrails active', description: 'Schema validation · 350 ms batch commits · 360 event memory cap',
      accepted: (count) => `${count} accepted`, rejected: (count) => `${count} rejected`,
    },
    publicActivity: {
      eyebrow: 'Public data source', title: 'Open-source activity',
      description: 'Recent public events from GitHub, cached locally for a calmer interface.',
      source: 'GitHub public events', cache: 'TanStack Query · 60 s cache', loading: 'Refreshing public activity',
      unavailable: 'Public activity is temporarily unavailable.', noActivity: 'No public activity was returned.', refreshed: 'Refreshed',
    },
  },
  fr: {
    language: { label: 'Langue', english: 'Anglais', french: 'Français' },
    theme: { label: 'Thème', midnight: 'Minuit', daylight: 'Lumière' },
    navigation: { production: 'Production', liveClock: 'UTC en direct', profile: 'Profil' },
    hero: {
      section: 'Observabilité', view: 'Vue en direct', title: 'Pouls opérationnel',
      description: 'Signaux de service en direct, limités au périmètre qui vous intéresse.', live: 'Direct',
    },
    filters: {
      label: 'Périmètre', service: 'Service', allServices: 'Tous les services', timeWindow: 'Période',
      lastMinute: 'Dernière minute', lastFiveMinutes: '5 dernières minutes', lastFifteenMinutes: '15 dernières minutes',
    },
    connection: {
      connecting: 'Connexion sécurisée au flux', live: 'Le flux est sain', paused: 'Flux interrompu localement',
      reconnecting: 'Reconnexion avec délai progressif', error: 'Le flux demande une attention', resume: 'Reprendre le flux',
      pause: 'Mettre le flux en pause', waiting: 'en attente de données', updatedNow: 'mis à jour à l’instant',
      updatedSecondsAgo: (seconds) => `mis à jour il y a ${seconds} s`,
    },
    metrics: {
      summary: 'Résumé des performances en direct', events: 'Événements du périmètre', eventsHelper: 'validés et conservés',
      eventsTarget: 'tampon de flux limité', requestRate: 'Rythme des requêtes', requestRateHelper: 'signal de trafic glissant',
      requestRateTarget: 'volume actuel', p95Latency: 'Latence p95', p95Helper: 'événements sélectionnés',
      p95Target: 'objectif sous 250 ms', healthyDelivery: 'Livraison saine', healthyHelper: 'événements réussis uniquement',
      healthyTarget: 'objectif au-dessus de 99 %',
    },
    chart: {
      eyebrow: 'Mesure en direct', title: 'Pouls de latence', description: 'Temps de traitement des requêtes du flux sélectionné.',
      average: 'Moy.', waiting: 'En attente d’événements validés',
    },
    events: {
      eyebrow: 'Fil des événements', title: 'Activité récente', retained: (count) => `${count} événements conservés · liste virtualisée`,
      incoming: 'Les nouveaux événements apparaîtront ici.', max: '360 max.', noMatches: 'Aucun événement ne correspond encore à ce périmètre.',
      healthy: 'Sain', warning: 'À surveiller', critical: 'Critique',
    },
    guardrails: {
      title: 'Protections actives', description: 'Validation du schéma · lots de 350 ms · mémoire limitée à 360 événements',
      accepted: (count) => `${count} acceptés`, rejected: (count) => `${count} rejetés`,
    },
    publicActivity: {
      eyebrow: 'Source publique', title: 'Activité open source',
      description: 'Événements GitHub publics récents, mis en cache localement pour une interface plus calme.',
      source: 'Événements GitHub publics', cache: 'TanStack Query · cache de 60 s', loading: 'Actualisation de l’activité publique',
      unavailable: 'L’activité publique est temporairement indisponible.', noActivity: 'Aucune activité publique reçue.', refreshed: 'Actualisé',
    },
  },
};
