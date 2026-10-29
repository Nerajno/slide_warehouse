# Legacy Presentations

Older presentations from before the Reveal.js era, served as downloads on `/legacy`.

## File Structure

- `public/legacy-files/` - The presentation files (PDF preferred; PPTX, KEY, etc. also work)
- `public/legacy-thumbnails/` - A 1280×720 JPG of each deck's title slide
- `content/legacy/` - One Markdown file of metadata per presentation

## Adding a Legacy Presentation

1. Export the deck to PDF (Google Slides: File → Download → PDF) and place it here as `{id}.pdf`
2. Save the title slide as `public/legacy-thumbnails/{id}.jpg` (1280×720)
3. Create `content/legacy/{id}.md`:

```yaml
---
id: "my-talk-2025"
title: "My Talk"
description: "One sentence description."
tags: ["career", "community"]
format: "PDF"
fileUrl: "/legacy-files/my-talk-2025.pdf"
thumbnailUrl: "/legacy-thumbnails/my-talk-2025.jpg"
conference: "Some Conf 2025"
date: "2025-03-01"
downloadable: true
---
```

`tests/legacy-decks.test.ts` checks that every `fileUrl` and `thumbnailUrl` exists and stays under 25 MB.
A thumbnail that fails to load is hidden rather than shown broken.
