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

/** Tag → Tailwind gradient classes for card thumbnails */
export const TAG_COLORS: Record<Tag, string> = {
  vue: 'from-emerald-400 to-teal-700',
  nuxt: 'from-green-500 to-emerald-800',
  javascript: 'from-amber-400 to-orange-600',
  typescript: 'from-sky-400 to-blue-700',
  career: 'from-violet-500 to-purple-800',
  'soft-skills': 'from-rose-400 to-pink-700',
  fundamentals: 'from-slate-400 to-gray-700',
  architecture: 'from-cyan-400 to-indigo-700',
  accessibility: 'from-teal-400 to-cyan-700',
  community: 'from-orange-400 to-red-600',
};
