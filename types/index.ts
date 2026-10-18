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
  /** `false` leaves this version out of the version picker. Defaults to `true`. */
  displayedStatus?: boolean;
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
  /** `false` hides the deck from every list and 404s its page. Defaults to `true`. */
  displayedStatus?: boolean;
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
 * Chips on deck cards are neutral. The /topics grid colours tiles by
 * position from five swatches in assets/css/tokens.css, not per topic.
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

/**
 * Class for a topic chip. Chips are neutral for every topic (#71); kept as a
 * function so call sites don't change if chips ever regain per-topic styling.
 */
export function tagClass(_tag: string): string {
  return 'sw-tag';
}
