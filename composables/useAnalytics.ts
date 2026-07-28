export function useAnalytics() {
  const trackDeckView = async (deckId: string) => {
    try {
      // Don't block page load on analytics
      if (import.meta.client) {
        const response = await fetch("/.netlify/functions/track-deck-view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deckId }),
        });

        if (!response.ok) {
          console.warn("Analytics tracking failed:", response.statusText);
        }
      }
    } catch (error) {
      // Silently fail - don't break user experience for analytics
      console.warn("Analytics tracking error:", error);
    }
  };

  return { trackDeckView };
}
