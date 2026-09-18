"use client";
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('diary');
  const [saveStatus, setSaveStatus] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const [aiOutput, setAiOutput] = useState('');

  // State for inputs
  const [inputs, setInputs] = useState({
    'diary-content': '',
    'blog1-title': '', 'blog1-content': '',
    'blog2-title': '', 'blog2-content': '',
    'blog3-title': '', 'blog3-content': ''
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
      } else {
        saved[key] = '';
      }
    });
    if (hasSaved) setInputs(saved);
  }, []);

  // Handle auto-save
  const handleInput = (e, key) => {
    const val = e.target.value;
    setInputs(prev => ({ ...prev, [key]: val }));
    localStorage.setItem(`portfolio_${key}`, val);
    
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';

    // Show status
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 1500);
  };

  const handleAI = async (action, targetKey) => {
    setLoadingAction(action);
    setAiOutput('');
    const text = inputs[targetKey].trim();
    
    if (!text && action !== 'ideas') {
        setAiOutput("Please type something first!");
        setLoadingAction(null);
        return;
    }

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, text })
      });
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      if (action === 'grammar') {
        setInputs(prev => ({ ...prev, [targetKey]: data.result }));
        localStorage.setItem(`portfolio_${targetKey}`, data.result);
        setAiOutput("Successfully polished and updated the text box!");
        setSaveStatus(true);
        setTimeout(() => setSaveStatus(false), 1500);
      } else {
        setAiOutput(data.result);
      }
    } catch (e) {
      setAiOutput("Error: " + e.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const ActionBar = ({ targetKey }) => (
    <div className="ai-action-bar">
        <button className="ai-btn" disabled={loadingAction} onClick={() => handleAI('grammar', targetKey)}>
            <span className="material-icons">auto_fix_high</span> {loadingAction === 'grammar' ? 'Polishing...' : 'Polish'}
        </button>
        <button className="ai-btn" disabled={loadingAction} onClick={() => handleAI('summarize', targetKey)}>
            <span className="material-icons">short_text</span> {loadingAction === 'summarize' ? 'Working...' : 'Summarize'}
        </button>
        <button className="ai-btn" disabled={loadingAction} onClick={() => handleAI('ideas', targetKey)}>
            <span className="material-icons">lightbulb</span> {loadingAction === 'ideas' ? 'Thinking...' : 'Ideas'}
        </button>
    </div>
  );

  return (
    <>
      <header>
          <div className="header-container">
              <h1 className="header-title">English Project Portfolio</h1>
              <div className="tabs">
                  <button className={`tab-btn ${activeTab === 'diary' ? 'active' : ''}`} onClick={() => {setActiveTab('diary'); setAiOutput('');}}>Diary</button>
                  <button className={`tab-btn ${activeTab === 'blogs' ? 'active' : ''}`} onClick={() => {setActiveTab('blogs'); setAiOutput('');}}>Blogs</button>
              </div>
          </div>
      </header>

      <main>
          {aiOutput && (
              <div className="ai-output-box fade-in mb-8">
                  <strong>AI Response:</strong>
                  <p style={{whiteSpace: 'pre-wrap', marginTop: '8px'}}>{aiOutput}</p>
                  <button onClick={() => setAiOutput('')} style={{background:'none',border:'none',color:'#1a73e8',cursor:'pointer',padding:0,marginTop:'8px',fontWeight:500}}>Dismiss</button>
              </div>
          )}

          {activeTab === 'diary' && (
            <div className="section active">
                <div className="section-title">Daily Project Log</div>
                <div className="mat-card">
                    <ActionBar targetKey="diary-content" />
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
                        <ActionBar targetKey={`blog${num}-content`} />
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

