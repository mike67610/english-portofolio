"use client";
import { useState } from 'react';

const DIARY = {
  title: 'Evening Skate, Feeder Buses, and System Tweaks',
  date: 'September 18, 2026',
  content: `School was alright today, though JC1 classes are definitely starting to pick up. Took the Wira Wiri FD06 feeder bus back home to West Surabaya after class. Tap-and-go with e-money makes getting through afternoon traffic way less stressful than sitting in a car. Got home, ate a quick snack, and hit a 45-minute dumbbell workout on the flat bench to clear my head. Once the weather cooled down around sunset, I grabbed my 31-inch board and zipped up my Hikemore jacket to cruise around the neighborhood for a bit. My balance on quick turns is getting way smoother. Spent the rest of the night in my room with my IEMs on, listening to music while updating a few configurations on Debian and finishing up this English project. It feels good when everything runs fast and clean without clutter.`,
};

const BLOGS = [
  {
    title: 'How Atmosphere Shapes Horror and Isolation in Storytelling',
    content: `In narrative fiction and psychological horror, atmosphere isn't just background detail—it acts like an extra character. When an author or storyteller isolates a protagonist, they rely heavily on environmental cues to build tension rather than just jumping straight to action. Environmental quiet highlights small, everyday sounds—footsteps on damp pavement, flickering streetlights, or cold rain against glass. Keeping the perspective strictly limited forces the audience to experience the same uncertainty. Setting a story in familiar, mundane spaces makes the horror feel far more realistic and unsettling.`,
  },
  {
    title: 'Frame by Frame Through the Bus Window',
    content: `The glass of the feeder bus window was cold against my forehead as we idle at the red light. Outside, gray clouds sat low over the street, reflecting off wet asphalt while evening traffic slowly crawled past. Watching people rush past under streetlights, I realized how every single person out there is living a full, complex story you'll never actually read. The motorbikes filtering between lanes, the shop owners pulling down their shutters, the students walking home with heavy backpacks—everyone has their own routine, their own goals, and their own problems.`,
  },
  {
    title: 'How Tech and Minimalist Design Sharpened My English Writing Skills',
    content: `I used to think that writing good English meant using long, complex words and giant paragraphs. But working with tech, writing system documentation, and building minimalist web user interfaces completely changed how I think about language. Clarity comes first—when you write code, configure system files, or structure a clean UI, fluff only gets in the way. Writing works the exact same way. Expressing an idea in three sharp sentences is almost always better than hiding it inside a paragraph of filler. Using bullet points and clear structure helps readers understand your point immediately.`,
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('diary');

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
        {activeTab === 'diary' && (
          <div className="section active">
            <div className="section-title">Daily Project Log</div>
            <div className="mat-card">
              <div className="editable-title">{DIARY.title}</div>
              <div className="editable-title" style={{ fontSize: '1rem', color: '#666', marginBottom: '16px' }}>
                {DIARY.date}
              </div>
              <div className="editable-content">{DIARY.content}</div>
            </div>
          </div>
        )}

        {activeTab === 'blogs' && (
          <div className="section active">
            <div className="section-title">Blog Drafts</div>
            {BLOGS.map((blog, i) => (
              <div className="mat-card" key={i}>
                <div className="editable-title">{blog.title}</div>
                <div className="editable-content">{blog.content}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
