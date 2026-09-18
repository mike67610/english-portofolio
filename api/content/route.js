import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// ─── Hardcoded fallback content ───────────────────────────────────────────────
const DEFAULTS = {
  'diary-title':   'Evening Skate, Feeder Buses, and System Tweaks',
  'diary-date':    'September 18, 2026',
  'diary-content': 'School was alright today, though JC1 classes are definitely starting to pick up. Took the Wira Wiri FD06 feeder bus back home to West Surabaya after class. Tap-and-go with e-money makes getting through afternoon traffic way less stressful than sitting in a car. Got home, ate a quick snack, and hit a 45-minute dumbbell workout on the flat bench to clear my head. Once the weather cooled down around sunset, I grabbed my 31-inch board and zipped up my Hikemore jacket to cruise around the neighborhood for a bit. My balance on quick turns is getting way smoother. Spent the rest of the night in my room with my IEMs on, listening to music while updating a few configurations on Debian and finishing up this English project. It feels good when everything runs fast and clean without clutter.',
  'blog1-title':   'How Atmosphere Shapes Horror and Isolation in Storytelling',
  'blog1-content': "In narrative fiction and psychological horror, atmosphere isn't just background detail—it acts like an extra character. When an author or storyteller isolates a protagonist, they rely heavily on environmental cues to build tension rather than just jumping straight to action. Environmental quiet highlights small, everyday sounds—footsteps on damp pavement, flickering streetlights, or cold rain against glass. Keeping the perspective strictly limited forces the audience to experience the same uncertainty. Setting a story in familiar, mundane spaces makes the horror feel far more realistic and unsettling.",
  'blog2-title':   'Frame by Frame Through the Bus Window',
  'blog2-content': "The glass of the feeder bus window was cold against my forehead as we idle at the red light. Outside, gray clouds sat low over the street, reflecting off wet asphalt while evening traffic slowly crawled past. Watching people rush past under streetlights, I realized how every single person out there is living a full, complex story you'll never actually read. The motorbikes filtering between lanes, the shop owners pulling down their shutters, the students walking home with heavy backpacks—everyone has their own routine, their own goals, and their own problems.",
  'blog3-title':   'How Tech and Minimalist Design Sharpened My English Writing Skills',
  'blog3-content': 'I used to think that writing good English meant using long, complex words and giant paragraphs. But working with tech, writing system documentation, and building minimalist web user interfaces completely changed how I think about language. Clarity comes first—when you write code, configure system files, or structure a clean UI, fluff only gets in the way. Writing works the exact same way. Expressing an idea in three sharp sentences is almost always better than hiding it inside a paragraph of filler. Using bullet points and clear structure helps readers understand your point immediately.',
};

const KV_KEY = 'portfolio_content';

function getRedis() {
  // Support both Upstash directly and Vercel KV auto-injected vars
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }
  return new Redis({ url, token });
}

// GET /api/content
// Fetch latest saved content from Upstash Redis, falling back to DEFAULTS if empty/unconfigured.
export async function GET() {
  try {
    const redis = getRedis();
    if (!redis) {
      return NextResponse.json(DEFAULTS);
    }
    const stored = await redis.get(KV_KEY); 
    const content = stored ? { ...DEFAULTS, ...stored } : DEFAULTS;
    return NextResponse.json(content);
  } catch (e) {
    console.error('Redis GET Error:', e);
    return NextResponse.json(DEFAULTS);
  }
}

// POST /api/content
// Save current client fields into Upstash Redis globally.
export async function POST(request) {
  try {
    const { fields } = await request.json();
    const redis = getRedis();
    
    if (!redis) {
      return NextResponse.json(
        { error: 'KV/Redis environment variables are missing (KV_REST_API_URL or UPSTASH_REDIS_REST_URL).' },
        { status: 500 }
      );
    }

    const current = (await redis.get(KV_KEY)) || {};
    const updated = { ...current, ...fields };
    await redis.set(KV_KEY, updated);
    
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Redis POST Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
