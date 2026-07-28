import { Context } from "https://edge.netlify.com";

const SUPABASE_URL = Netlify.env.get("SUPABASE_URL");
const SUPABASE_KEY = Netlify.env.get("SUPABASE_ANON_KEY");

interface DeckView {
  deck_id: string;
  timestamp: string;
  user_agent: string;
  referrer: string;
  country?: string;
  city?: string;
}

export default async (req: Request, context: Context) => {
  // Only handle POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json() as { deckId: string };
    const deckId = body.deckId;

    if (!deckId) {
      return new Response(JSON.stringify({ error: "Missing deckId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error("Missing Supabase credentials");
      return new Response(JSON.stringify({ error: "Service unavailable" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    const geo = context.geo;
    const view: DeckView = {
      deck_id: deckId,
      timestamp: new Date().toISOString(),
      user_agent: req.headers.get("user-agent") || "unknown",
      referrer: req.headers.get("referer") || "direct",
      country: geo?.country?.name,
      city: geo?.city,
    };

    // Insert into Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/deck_views`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_KEY}`,
        apikey: SUPABASE_KEY,
      },
      body: JSON.stringify(view),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Supabase error:", error);
      // Don't fail user request if analytics fails
      return new Response(JSON.stringify({ tracked: false }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ tracked: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    // Don't fail user request if analytics fails
    return new Response(JSON.stringify({ tracked: false }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config = {
  path: "/.netlify/functions/track-deck-view",
};
