import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    decks: defineCollection({
      type: 'page',
      source: 'decks/*.md',
      schema: z.object({
        tags: z.array(z.string()).default([]),
        slideCount: z.number().optional(),
        durationMinutes: z.number().optional(),
        currentVersion: z.number().optional(),
        versions: z.array(z.object({
          version: z.number(),
          label: z.string(),
          date: z.string(),
          revealFile: z.string(),
        })).optional(),
        tier: z.string().optional(),
        conference: z.string().optional(),
        location: z.string().optional(),
        conferenceUrl: z.string().optional(),
        videoUrl: z.string().optional(),
        status: z.string().optional(),
        downloadable: z.boolean().optional(),
        featured: z.boolean().optional(),
        mostRecent: z.boolean().optional(),
        revealBasePath: z.string().optional(),
        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
      }),
    }),

    legacy: defineCollection({
      type: 'page',
      source: 'legacy/*.md',
      schema: z.object({
        tags: z.array(z.string()).default([]),
        format: z.string().optional(),
        fileUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        conference: z.string().optional(),
        date: z.string().optional(),
        downloadable: z.boolean().optional(),
      }),
    }),

    history: defineCollection({
      type: 'data',
      source: 'history/*.json',
      schema: z.object({
        id: z.string(),
        conference: z.string(),
        date: z.string(),
        location: z.string(),
        status: z.string(),
        year: z.number(),
      }),
    }),

    speaker: defineCollection({
      type: 'data',
      source: 'speaker.json',
      schema: z.object({
        name: z.string(),
        bio: z.string(),
        socialHandles: z.object({
          x: z.string().optional(),
          github: z.string().optional(),
          devto: z.string().optional(),
        }).optional(),
        links: z.array(z.object({
          label: z.string(),
          url: z.string(),
        })).optional(),
        stats: z.object({
          totalTalks: z.number(),
          conferencesCount: z.number(),
          since: z.number(),
        }).optional(),
        recentTalk: z.object({
          title: z.string(),
          conference: z.string(),
          hashtag: z.string().optional(),
          location: z.string().optional(),
          date: z.string(),
          durationMinutes: z.number().optional(),
          deckSlug: z.string().optional(),
          recordingUrl: z.string().nullable().optional(),
        }).optional(),
        pipeline: z.array(z.object({
          name: z.string(),
          location: z.string().optional(),
          date: z.string(),
          status: z.string(),
        })).optional(),
      }),
    }),
  },
})
