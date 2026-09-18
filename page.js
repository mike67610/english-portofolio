"use client";
import { useState, useEffect } from 'react';

// ─── Hardcoded default content ────────────────────────────────────────────────
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

// ── AI action bar component ─────────────────────────────────────────────────
function ActionBar({ targetKey, loadingAction, saving, handleAI }) {
  return (
    <div className="ai-action-bar" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
      <button className="ai-btn" disabled={!!loadingAction || saving} onClick={() => handleAI('grammar', targetKey)}>
        <span className="material-icons">auto_fix_high</span>
        {loadingAction === 'grammar' ? 'Fixing…' : 'Fix Grammar'}
      </button>
      <button className="ai-btn" disabled={!!loadingAction || saving} onClick={() => handleAI('summarize', targetKey)}>
        <span className="material-icons">short_text</span>
        {loadingAction === 'summarize' ? 'Working…' : 'Summarize'}
      </button>
      <button className="ai-btn" disabled={!!loadingAction || saving} onClick={() => handleAI('ideas', targetKey)}>
        <span className="material-icons">lightbulb</span>
        {loadingAction === 'ideas' ? 'Thinking…' : 'Generate Ideas'}
      </button>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab]   = useState('diary');
  const [fields, setFields]         = useState(DEFAULTS);
  
  // Storage state
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [saveMsg, setSaveMsg]       = useState(''); // '' | 'saved' | error text

  // AI state
  const [aiOutput, setAiOutput]     = useState('');
  const [loadingAction, setLoadingAction] = useState(null); // null | 'grammar' | 'summarize' | 'ideas'

  const set = (key, val) => setFields(prev => ({ ...prev, [key]: val }));

  // ── Fetch from KV on mount ──────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) {
          setFields(prev => ({ ...prev, ...data }));
        }
      })
      .catch(() => {}) // On fetch failure, UI gracefully continues with DEFAULTS
      .finally(() => setLoading(false));
  }, []);

  // ── Save to KV ──────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to save to KV');
      setSaveMsg('saved');
    } catch (e) {
      setSaveMsg(e.message);
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 4000);
    }
  };

  // ── Call Gemini AI ──────────────────────────────────────────────────────────
  const handleAI = async (action, targetKey) => {
    const text = fields[targetKey]?.trim();
    if (!text && action !== 'ideas') {
      setAiOutput('Please type something first!');
      return;
    }
    setLoadingAction(action);
    setAiOutput('');
    
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, text }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'AI Failed');

      if (action === 'grammar') {
        set(targetKey, data.result);
        setAiOutput('✓ Grammar fixed and applied to the text box!');
      } else {
        setAiOutput(data.result);
      }
    } catch (e) {
      setAiOutput('Error: ' + e.message);
    } finally {
      setLoadingAction(null);
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
              onClick={() => { setActiveTab('diary'); setAiOutput(''); }}
            >
              Diary
            </button>
            <button
              className={`tab-btn ${activeTab === 'blogs' ? 'active' : ''}`}
              onClick={() => { setActiveTab('blogs'); setAiOutput(''); }}
            >
              Blogs
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ── Global Save Status ────────────────────────────────────────────── */}
        {!loading && (
          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', padding: '16px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <button className="ai-btn" onClick={handleSave} disabled={saving || !!loadingAction} style={{ fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>
              <span className="material-icons" style={{ marginRight: '6px' }}>cloud_upload</span>
              {saving ? 'Saving to Cloud…' : 'Save for Everyone'}
            </button>
            {saveMsg === 'saved' && (
              <span style={{ color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="material-icons">check_circle</span> Saved globally!
              </span>
            )}
            {saveMsg && saveMsg !== 'saved' && (
              <span style={{ color: '#dc2626', fontWeight: 600 }}>⚠ {saveMsg}</span>
            )}
          </div>
        )}

        {/* ── Loading Overlay ───────────────────────────────────────────────── */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748b' }}>
            <span className="material-icons" style={{ fontSize: '32px', animation: 'spin 1s linear infinite' }}>sync</span>
            <p style={{ marginTop: '12px' }}>Loading live content…</p>
          </div>
        )}

        {/* ── AI response display ───────────────────────────────────────────── */}
        {aiOutput && (
          <div className="ai-output-box fade-in">
            <strong>AI Response:</strong>
            <p style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>{aiOutput}</p>
            <button
              onClick={() => setAiOutput('')}
              style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', padding: 0, marginTop: '12px', fontWeight: 600 }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ── Diary UI ──────────────────────────────────────────────────────── */}
        {!loading && activeTab === 'diary' && (
          <div className="section active">
            <div className="section-title">Daily Project Log</div>
            <div className="mat-card">
              <ActionBar targetKey="diary-content" loadingAction={loadingAction} saving={saving} handleAI={handleAI} />
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
                style={{ minHeight: '200px' }}
              />
            </div>
          </div>
        )}

        {/* ── Blogs UI ──────────────────────────────────────────────────────── */}
        {!loading && activeTab === 'blogs' && (
          <div className="section active">
            <div className="section-title">Blog Drafts</div>
            {[1, 2, 3].map(n => (
              <div className="mat-card" key={n}>
                <ActionBar targetKey={`blog${n}-content`} loadingAction={loadingAction} saving={saving} handleAI={handleAI} />
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
                  style={{ minHeight: '150px' }}
                />
              </div>
            ))}
          </div>
        )}

      </main>
    </>
  );
}
