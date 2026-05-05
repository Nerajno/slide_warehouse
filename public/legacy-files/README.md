# Legacy Presentations

This directory contains older presentation files in various formats from before the Reveal.js era.

## File Structure

- `legacy-files/` - Contains the actual presentation files (PPTX, PDF, KEY, etc.)
- `legacy-thumbnails/` - Contains thumbnail images for each presentation

## Adding Legacy Presentations

1. Place the presentation file in `public/legacy-files/`
2. Create a thumbnail image (16:9 aspect ratio recommended) in `public/legacy-thumbnails/`
3. Update the `legacyDecks` array in `components/LegacyDeckGrid.vue` with the new presentation metadata

## Supported Formats

- PowerPoint (.pptx, .ppt)
- PDF (.pdf)
- Keynote (.key, .keynote)
- Other presentation formats

## Metadata Fields

Each legacy presentation should include:

```typescript
{
  id: string,           // Unique identifier
  title: string,        // Presentation title
  description: string,  // Brief description
  format: string,       // File format (PowerPoint, PDF, Keynote, etc.)
  fileSize: string,     // Human-readable file size
  year: number,         // Presentation year
  event: string,        // Event/conference name
  tags: string[],       // Relevant tags
  downloadUrl: string,  // Path to the file in /legacy-files/
  thumbnailUrl: string  // Path to thumbnail in /legacy-thumbnails/
}
```
