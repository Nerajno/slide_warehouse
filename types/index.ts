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
  | 'community'

export interface DeckVersion {
  version: number
  label: string
  date: string
  revealFile: string
  changes?: string
}

export interface DeckFrontmatter {
  id: string
  title: string
  description: string
  tags: Tag[]
  slideCount: number
  durationMinutes: number
  createdAt: string
  updatedAt: string
  revealBasePath: string
  currentVersion: number
  versions: DeckVersion[]
  featured?: boolean
  resources?: Resource[]
  events?: string[]
  thumbnail?: string
  tier?: '30min' | '45min' | '60min'
}

export interface Deck extends DeckFrontmatter {
  revealPath: string
}

export interface SearchParams {
  q?: string
  tags?: string
  sort?: 'newest' | 'oldest' | 'az' | 'za'
}

export interface Resource { label: string; url: string }
export interface TopicStat { tag: string; count: number }

export type TalkStatus = 'delivered' | 'confirmed' | 'cfp-open' | 'submitted'

export interface ConferencePipelineItem {
  name: string
  location: string
  date: string
  status: TalkStatus
}

export interface SpeakerData {
  name: string
  bio: string
  socialHandles: { x: string; github: string; devto: string }
  links: Resource[]
  stats: { totalTalks: number; conferencesCount: number; since: number }
  recentTalk: {
    title: string
    conference: string
    hashtag: string
    location: string
    date: string
    durationMinutes: number
    deckSlug: string
    recordingUrl: string | null
  }
  pipeline: ConferencePipelineItem[]
}

/** Tag → Tailwind gradient classes for card thumbnails */
export const TAG_COLORS: Record<Tag, string> = {
  vue:           'from-emerald-500 to-green-600',
  nuxt:          'from-green-600 to-teal-600',
  javascript:    'from-yellow-400 to-amber-500',
  typescript:    'from-blue-500 to-indigo-600',
  career:        'from-purple-500 to-violet-600',
  'soft-skills': 'from-pink-500 to-rose-500',
  fundamentals:  'from-gray-500 to-slate-600',
  architecture:  'from-cyan-500 to-sky-600',
  accessibility: 'from-teal-500 to-emerald-600',
  community:     'from-orange-400 to-amber-500',
}
