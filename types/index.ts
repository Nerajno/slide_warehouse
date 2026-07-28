export type Tag =
  | 'vue'
  | 'nuxt'
  | 'javascript'
  | 'typescript'
  | 'career'
  | 'soft-skills'
  | 'fundamentals'
  | 'architecture'
  | 'accessibility'
  | 'community';

export interface DeckVersion {
  version: number;
  label: string;
  date: string;
  revealFile: string;
  changes?: string;
}

export interface DeckFrontmatter {
  id: string;
  title: string;
  description: string;
  tags: Tag[];
  slideCount: number;
  durationMinutes: number;
  createdAt: string;
  updatedAt: string;
  revealBasePath: string;
  currentVersion: number;
  versions: DeckVersion[];
  featured?: boolean;
  mostRecent?: boolean;
  resources?: Resource[];
  events?: string[];
  thumbnail?: string;
  tier?: '30min' | '45min' | '60min';
  conference?: string;
  location?: string;
  conferenceUrl?: string;
  videoUrl?: string;
  status?: 'upcoming' | 'delivered' | 'archived';
  downloadable?: boolean;
}

export interface Deck extends DeckFrontmatter {
  revealPath: string;
}

export interface SearchParams {
  q?: string;
  tags?: string;
  sort?: 'newest' | 'oldest' | 'az' | 'za' | 'recently-updated';
}

export interface Resource {
  label: string;
  url: string;
}
export interface TopicStat {
  tag: string;
  count: number;
}

export type TalkStatus = 'delivered' | 'confirmed' | 'cfp-open' | 'submitted';

export interface ConferencePipelineItem {
  name: string;
  location: string;
  date: string;
  status: TalkStatus;
}

export interface SpeakerData {
  name: string;
  bio: string;
  socialHandles: { x: string; github: string; devto: string };
  links: Resource[];
  stats: { totalTalks: number; conferencesCount: number; since: number };
  recentTalk: {
    title: string;
    conference: string;
    hashtag: string;
    location: string;
    date: string;
    durationMinutes: number;
    deckSlug: string;
    recordingUrl: string | null;
  };
  pipeline: ConferencePipelineItem[];
}

export interface ConferenceEvent {
  id: string;
  conference: string;
  date: string;
  location: string;
  status: 'delivered' | 'confirmed' | 'cfp-open';
  year: number;
}

/**
 * Every topic the site can render, in display order.
 *
 * Colour for each of these lives in one place — the `--tag-*` custom
 * properties in assets/css/tokens.css, surfaced as `.sw-tag--{tag}`. That
 * indirection is what makes tags theme-aware; the gradient map this replaced
 * was light-mode only and drifted out of sync with the token layer.
 */
export const TAG_LIST = [
  'vue',
  'nuxt',
  'javascript',
  'typescript',
  'career',
  'soft-skills',
  'fundamentals',
  'architecture',
  'accessibility',
  'community',
  'beginner',
  'css',
  'react',
  'design',
  'patterns',
  'workshop',
  'advanced',
] as const;

export type TagName = typeof TAG_LIST[number];

/** Resolve a topic to its `.sw-tag` modifier. Unknown tags fall back to neutral. */
export function tagClass(tag: string): string {
  return (TAG_LIST as readonly string[]).includes(tag)
    ? `sw-tag sw-tag--${tag}`
    : 'sw-tag sw-tag--patterns';
}
