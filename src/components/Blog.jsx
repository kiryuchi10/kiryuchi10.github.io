import React, { useState, useEffect } from "react";
import "./Blog.css";

const Blog = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [guestbookEntries, setGuestbookEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ name: "", message: "" });

  // Sample blog posts
  const blogPosts = [
    {
      id: 1,
      title:
        "From Bank JSON to Beautiful Insights: Building an Expenditure Tracker as a New Parent",
      excerpt:
        "How I built a family expenditure tracker to manage household finances using React and Python, with bank JSON import and spending analytics.",
      date: "2024-12-15",
      readTime: "8 min read",
      tags: ["React", "Python", "Finance", "Data Analysis"],
      link: "https://medium.com/@donghyeunlee1/from-bank-json-to-beautiful-insights-building-an-expenditure-tracker-as-a-new-parent-junior-2213cc96074e",
      featured: true,
    },
  ];

  // Load guestbook entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("guestbook-entries");
    if (saved) {
      setGuestbookEntries(JSON.parse(saved));
    }
  }, []);

  // Save guestbook entries to localStorage
  const saveGuestbookEntries = (entries) => {
    localStorage.setItem("guestbook-entries", JSON.stringify(entries));
    setGuestbookEntries(entries);
  };

  const handleGuestbookSubmit = (e) => {
    e.preventDefault();
    if (newEntry.name.trim() && newEntry.message.trim()) {
      const entry = {
        id: Date.now(),
        name: newEntry.name.trim(),
        message: newEntry.message.trim(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      };

      const updatedEntries = [entry, ...guestbookEntries];
      saveGuestbookEntries(updatedEntries);
      setNewEntry({ name: "", message: "" });
    }
  };

  const deleteEntry = (id) => {
    const updatedEntries = guestbookEntries.filter((entry) => entry.id !== id);
    saveGuestbookEntries(updatedEntries);
  };

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1>Tech Blog & Guestbook</h1>
        <p>Sharing insights from my journey in tech and biotech</p>
      </div>

      <div className="blog-tabs">
        <button
          className={`tab-button ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          📝 Blog Posts
        </button>
        <button
          className={`tab-button ${activeTab === "guestbook" ? "active" : ""}`}
          onClick={() => setActiveTab("guestbook")}
        >
          💬 Guestbook
        </button>
      </div>

      {activeTab === "posts" && (
        <div className="blog-posts">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className={`blog-post ${post.featured ? "featured" : ""}`}
            >
              {post.featured && <div className="featured-badge">Featured</div>}

              <div className="post-meta">
                <span className="post-date">{post.date}</span>
                <span className="post-read-time">{post.readTime}</span>
              </div>

              <h2 className="post-title">
                <a href={post.link} target="_blank" rel="noopener noreferrer">
                  {post.title}
                </a>
              </h2>

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

      {activeTab === "guestbook" && (
        <div className="guestbook">
          <div className="guestbook-form">
            <h3>Leave a Message</h3>
            <form onSubmit={handleGuestbookSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={newEntry.name}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Your Message"
                  rows="4"
                  value={newEntry.message}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, message: e.target.value })
                  }
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
                      className="delete-btn"
                      onClick={() => deleteEntry(entry.id)}
                      title="Delete message"
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
  );
};

export default Blog;
