import React, { useState, useEffect } from 'react';
import { SectionContainer } from '../components/layout/SectionContainer';
import { blogPosts } from '../config/content';
import '../styles/Blog.css';

const GUESTBOOK_STORAGE_KEY = 'portfolio-guestbook-entries';

type GuestbookEntry = {
  id: number;
  name: string;
  message: string;
  date: string;
  time: string;
};

export function BlogSection(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<'posts' | 'guestbook'>('posts');
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);
  const [newEntry, setNewEntry] = useState({ name: '', message: '' });

  useEffect(() => {
    const saved = localStorage.getItem(GUESTBOOK_STORAGE_KEY);
    if (saved) {
      try {
        setGuestbookEntries(JSON.parse(saved));
      } catch {
        // ignore invalid JSON
      }
    }
  }, []);

  const saveGuestbookEntries = (entries: GuestbookEntry[]): void => {
    localStorage.setItem(GUESTBOOK_STORAGE_KEY, JSON.stringify(entries));
    setGuestbookEntries(entries);
  };

  const handleGuestbookSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (newEntry.name.trim() && newEntry.message.trim()) {
      const entry: GuestbookEntry = {
        id: Date.now(),
        name: newEntry.name.trim(),
        message: newEntry.message.trim(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      };
      const updated = [entry, ...guestbookEntries];
      saveGuestbookEntries(updated);
      setNewEntry({ name: '', message: '' });
    }
  };

  const deleteEntry = (id: number): void => {
    saveGuestbookEntries(guestbookEntries.filter((entry) => entry.id !== id));
  };

  return (
    <SectionContainer id="blog" title="Tech Blog & Guestbook">
      <div className="blog-container">
        <p className="blog-subtitle">Sharing insights from my journey in tech and biotech</p>
        <div className="blog-tabs">
          <button
            type="button"
            className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            📝 Blog Posts
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === 'guestbook' ? 'active' : ''}`}
            onClick={() => setActiveTab('guestbook')}
          >
            💬 Guestbook
          </button>
        </div>

        {activeTab === 'posts' && (
          <div className="blog-posts">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className={`blog-post ${post.featured ? 'featured' : ''}`}
              >
                {post.featured && <div className="featured-badge">Featured</div>}
                <div className="post-meta">
                  <span className="post-date">{post.date}</span>
                  <span className="post-read-time">{post.readTime}</span>
                </div>
                <h3 className="post-title">
                  <a href={post.link} target="_blank" rel="noopener noreferrer">
                    {post.title}
                  </a>
                </h3>
                <p className="post-excerpt">{post.excerpt}</p>
                <div className="post-tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="post-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="read-more-btn"
                >
                  Read Full Article →
                </a>
              </article>
            ))}
          </div>
        )}

        {activeTab === 'guestbook' && (
          <div className="guestbook">
            <div className="guestbook-form">
              <h3>Leave a Message</h3>
              <form onSubmit={handleGuestbookSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={newEntry.name}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    value={newEntry.message}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, message: e.target.value }))}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn">
                  Post Message
                </button>
              </form>
            </div>
            <div className="guestbook-entries">
              <h3>Messages ({guestbookEntries.length})</h3>
              {guestbookEntries.length === 0 ? (
                <div className="no-entries">
                  <p>No messages yet. Be the first to leave a message!</p>
                </div>
              ) : (
                guestbookEntries.map((entry) => (
                  <div key={entry.id} className="guestbook-entry">
                    <div className="entry-header">
                      <strong className="entry-name">{entry.name}</strong>
                      <span className="entry-date">
                        {entry.date} at {entry.time}
                      </span>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => deleteEntry(entry.id)}
                        title="Delete message"
                        aria-label="Delete message"
                      >
                        ×
                      </button>
                    </div>
                    <p className="entry-message">{entry.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
