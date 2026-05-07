import type { ConferencePipelineItem } from '~/types'

export const history: ConferencePipelineItem[] = [
  { name: 'Connect.Tech 2025',      location: 'Atlanta, GA',   date: '2025-10-01', status: 'delivered'  },
  { name: 'DevNexus 2026',          location: 'Atlanta, GA',   date: '2026-03-01', status: 'delivered'  },
  { name: 'Orlando Code Camp 2026', location: 'Orlando, FL',   date: '2026-04-01', status: 'delivered'  },
  { name: 'VueVerse April 2026',    location: 'Boise, ID',     date: '2026-04-01', status: 'delivered'  },
  { name: 'Boise Code Camp 2026',   location: 'Boise, ID',     date: '2026-05-02', status: 'delivered'  },
  { name: 'Nebraska.Code() 2026',   location: 'Lincoln, NE',   date: '2026-07-17', status: 'confirmed'  },
  { name: 'Connect.Tech 2026',      location: 'Atlanta, GA',   date: '2026-10-01', status: 'delivered'  },
]

export const mostRecentEvent = history
  .filter(e => e.status === 'delivered')
  .sort((a, b) => b.date.localeCompare(a.date))[0]
