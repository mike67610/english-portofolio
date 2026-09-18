"use client";
import { useState, useEffect } from 'react';

// ─── Your original text — used as fallback if the database is empty ──────────
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

export default function Home() {
  const [activeTab, setActiveTab] = useState('diary');
  const [fields, setFields]       = useState(DEFAULTS);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [saveMsg, setSaveMsg]     = useState(''); // '' | 'saved' | error string

  // ── On mount: fetch latest content from Supabase via API route ─────────────
  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(data => {
        if (data && !data.error && Object.keys(data).length > 0) {
          // Merge DB values over the defaults (DB always wins)
          setFields(prev => ({ ...prev, ...data }));
        }
      })
      .catch(() => { /* network error — silently keep defaults */ })
      .finally(() => setLoading(false));
  }, []);

  const set = (key, val) => setFields(prev => ({ ...prev, [key]: val }));

  // ── Save all current fields to Supabase ────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setSaveMsg('saved');
    } catch (e) {
      setSaveMsg(e.message);
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 4000);
    }
  };

  return (
    <>
      <header>
        <div className="header-container">
          <h1 className="header-title">English Project Portfolio</h1>
          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === 'diary' ? 'active' : ''}`}
              onClick={() => setActiveTab('diary')}
            >
              Diary
            </button>
            <button
              className={`tab-btn ${activeTab === 'blogs' ? 'active' : ''}`}
              onClick={() => setActiveTab('blogs')}
            >
              Blogs
            </button>
          </div>
        </div>
      </header>

      <main>

        {/* ── Loading state ──────────────────────────────────────────────── */}
        {loading && (
          <p style={{ textAlign: 'center', color: '#888', padding: '40px 0' }}>
            Loading latest content…
          </p>
        )}

        {/* ── Diary tab ─────────────────────────────────────────────────── */}
        {!loading && activeTab === 'diary' && (
          <div className="section active">
            <div className="section-title">Daily Project Log</div>
            <div className="mat-card">
              <input
                type="text"
                className="editable-title"
                value={fields['diary-title']}
                onChange={e => set('diary-title', e.target.value)}
              />
              <input
                type="text"
                className="editable-title"
                value={fields['diary-date']}
                onChange={e => set('diary-date', e.target.value)}
                style={{ fontSize: '1rem', color: '#666', marginBottom: '16px' }}
              />
              <textarea
                className="editable-content"
                value={fields['diary-content']}
                onChange={e => set('diary-content', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ── Blogs tab ─────────────────────────────────────────────────── */}
        {!loading && activeTab === 'blogs' && (
          <div className="section active">
            <div className="section-title">Blog Drafts</div>
            {[1, 2, 3].map(n => (
              <div className="mat-card" key={n}>
                <input
                  type="text"
                  className="editable-title"
                  value={fields[`blog${n}-title`]}
                  onChange={e => set(`blog${n}-title`, e.target.value)}
                />
                <textarea
                  className="editable-content"
                  value={fields[`blog${n}-content`]}
                  onChange={e => set(`blog${n}-content`, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        {/* ── Save bar (always visible once loaded) ─────────────────────── */}
        {!loading && (
          <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              className="ai-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? '⏳ Saving…' : '💾 Save Changes'}
            </button>
            {saveMsg === 'saved' && (
              <span style={{ color: '#2e7d32', fontWeight: 600 }}>
                ✓ Saved — all visitors now see your changes!
              </span>
            )}
            {saveMsg && saveMsg !== 'saved' && (
              <span style={{ color: '#c62828', fontWeight: 600 }}>
                ⚠ {saveMsg}
              </span>
            )}
          </div>
        )}

      </main>
    </>
  );
}
