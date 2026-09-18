"use client";
import { useState, useEffect } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('diary');
  const [saveStatus, setSaveStatus] = useState(false);

  // State for inputs
  const [inputs, setInputs] = useState({
    'diary-title': 'Evening Skate, Feeder Buses, and System Tweaks',
    'diary-date': 'September 18, 2026',
    'diary-content': 'School was alright today, though JC1 classes are definitely starting to pick up. Took the Wira Wiri FD06 feeder bus back home to West Surabaya after class. Tap-and-go with e-money makes getting through afternoon traffic way less stressful than sitting in a car. Got home, ate a quick snack, and hit a 45-minute dumbbell workout on the flat bench to clear my head. Once the weather cooled down around sunset, I grabbed my 31-inch board and zipped up my Hikemore jacket to cruise around the neighborhood for a bit. My balance on quick turns is getting way smoother. Spent the rest of the night in my room with my IEMs on, listening to music while updating a few configurations on Debian and finishing up this English project. It feels good when everything runs fast and clean without clutter.',
    'blog1-title': 'How Atmosphere Shapes Horror and Isolation in Storytelling',
    'blog1-content': 'In narrative fiction and psychological horror, atmosphere isn\'t just background detail—it acts like an extra character. When an author or storyteller isolates a protagonist, they rely heavily on environmental cues to build tension rather than just jumping straight to action. Environmental quiet highlights small, everyday sounds—footsteps on damp pavement, flickering streetlights, or cold rain against glass. Keeping the perspective strictly limited forces the audience to experience the same uncertainty. Setting a story in familiar, mundane spaces makes the horror feel far more realistic and unsettling.',
    'blog2-title': 'Frame by Frame Through the Bus Window',
    'blog2-content': 'The glass of the feeder bus window was cold against my forehead as we idle at the red light. Outside, gray clouds sat low over the street, reflecting off wet asphalt while evening traffic slowly crawled past. Watching people rush past under streetlights, I realized how every single person out there is living a full, complex story you\'ll never actually read. The motorbikes filtering between lanes, the shop owners pulling down their shutters, the students walking home with heavy backpacks—everyone has their own routine, their own goals, and their own problems.',
    'blog3-title': 'How Tech and Minimalist Design Sharpened My English Writing Skills',
    'blog3-content': 'I used to think that writing good English meant using long, complex words and giant paragraphs. But working with tech, writing system documentation, and building minimalist web user interfaces completely changed how I think about language. Clarity comes first—when you write code, configure system files, or structure a clean UI, fluff only gets in the way. Writing works the exact same way. Expressing an idea in three sharp sentences is almost always better than hiding it inside a paragraph of filler. Using bullet points and clear structure helps readers understand your point immediately.'
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = {};
    let hasSaved = false;
    Object.keys(inputs).forEach(key => {
      const val = localStorage.getItem(`portfolio_${key}`);
      if (val !== null) {
        saved[key] = val;
        hasSaved = true;
      }
    });
    if (hasSaved) {
        setInputs(prev => ({ ...prev, ...saved }));
    }
  }, []);

  // Handle auto-save
  const handleInput = (e, key) => {
    const val = e.target.value;
    setInputs(prev => ({ ...prev, [key]: val }));
    localStorage.setItem(`portfolio_${key}`, val);
    
    // Auto-resize
    if (e.target.tagName.toLowerCase() === 'textarea') {
      e.target.style.height = 'auto';
      e.target.style.height = e.target.scrollHeight + 'px';
    }

    // Show status
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 1500);
  };

  return (
    <>
      <header>
          <div className="header-container">
              <h1 className="header-title">English Project Portfolio</h1>
              <div className="tabs">
                  <button className={`tab-btn ${activeTab === 'diary' ? 'active' : ''}`} onClick={() => setActiveTab('diary')}>Diary</button>
                  <button className={`tab-btn ${activeTab === 'blogs' ? 'active' : ''}`} onClick={() => setActiveTab('blogs')}>Blogs</button>
              </div>
          </div>
      </header>

      <main>
          {activeTab === 'diary' && (
            <div className="section active">
                <div className="section-title">Daily Project Log</div>
                <div className="mat-card">
                    <input 
                        type="text" 
                        className="editable-title" 
                        placeholder="Diary Title..."
                        value={inputs['diary-title']}
                        onChange={(e) => handleInput(e, 'diary-title')}
                    />
                    <input 
                        type="text" 
                        className="editable-title" 
                        style={{ fontSize: '1rem', color: '#666', marginBottom: '16px' }}
                        placeholder="Date..."
                        value={inputs['diary-date']}
                        onChange={(e) => handleInput(e, 'diary-date')}
                    />
                    <textarea 
                        className="editable-content" 
                        placeholder="Type your diary entry here..." 
                        value={inputs['diary-content']}
                        onChange={(e) => handleInput(e, 'diary-content')}
                    />
                </div>
            </div>
          )}

          {activeTab === 'blogs' && (
            <div className="section active">
                <div className="section-title">Blog Drafts</div>
                
                {[1, 2, 3].map(num => (
                    <div className="mat-card" key={num}>
                        <input 
                            type="text" 
                            className="editable-title" 
                            placeholder={`Blog ${num} Title...`}
                            value={inputs[`blog${num}-title`]}
                            onChange={(e) => handleInput(e, `blog${num}-title`)}
                        />
                        <textarea 
                            className="editable-content" 
                            placeholder="Write your blog post here..."
                            value={inputs[`blog${num}-content`]}
                            onChange={(e) => handleInput(e, `blog${num}-content`)}
                        />
                    </div>
                ))}
            </div>
          )}
      </main>

      <div className={`save-status ${saveStatus ? 'show' : ''}`}>Saved</div>
    </>
  );
}
