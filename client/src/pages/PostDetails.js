import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { PostContext } from "../store/Postcontext";
import {
  fetchPostById,
  fetchCommentsByPostId,
  fetchUsers,
} from "../services/api";

function PostDetails() {
  const { id } = useParams();
  const { users, setUsers } = useContext(PostContext);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    const loadPostDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const postData = await fetchPostById(id);
        setPost(postData);

        const commentsData = await fetchCommentsByPostId(id);
        setComments(commentsData);

        // Load users only if not already loaded
        if (users.length === 0) {
          const usersData = await fetchUsers();
          setUsers(usersData);
          const foundUser = usersData.find(
            (u) => u.id === postData.userId
          );
          setAuthor(foundUser);
        } else {
          const foundUser = users.find(
            (u) => u.id === postData.userId
          );
          setAuthor(foundUser);
        }
      } catch (err) {
        setError(err.message || "Failed to load post details");
      } finally {
        setLoading(false);
      }
    };

    loadPostDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Update author when users change
  useEffect(() => {
    if (post && users.length > 0) {
      const foundUser = users.find((u) => u.id === post.userId);
      setAuthor(foundUser);
    }
  }, [post, users]);

  if (loading) {
    return <h3 style={{ padding: "20px" }}>Loading...</h3>;
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <h3>Error: {error}</h3>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ padding: "20px" }}>
        <h3>Post not found</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 20px 40px" }}>
      {/* Post Content - Primary Focus */}
      <article style={{ marginBottom: "30px" }}>
        <h1 style={{
          fontSize: "2rem",
          color: "#2c3e50",
          marginBottom: "10px",
          lineHeight: "1.3"
        }}>
          {post.title}
        </h1>

        {/* Author inline with post */}
        {author && (
          <p style={{
            color: "#7f8c8d",
            fontSize: "0.95rem",
            marginBottom: "20px",
            borderLeft: "3px solid #3498db",
            paddingLeft: "12px"
          }}>
            <strong>By {author.name}</strong> ({author.email})
          </p>
        )}

        <p style={{
          fontSize: "1.05rem",
          lineHeight: "1.7",
          color: "#34495e",
          marginBottom: "30px"
        }}>
          {post.body}
        </p>
      </article>

      {/* Analytics Section - Collapsible */}
      <div style={{ marginBottom: "30px" }}>
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          style={{
            padding: "10px 20px",
            backgroundColor: showAnalytics ? "#95a5a6" : "#3498db",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.95rem",
            fontWeight: "500",
            transition: "background-color 0.2s"
          }}
          onMouseEnter={(e) => e.target.style.opacity = "0.9"}
          onMouseLeave={(e) => e.target.style.opacity = "1"}
        >
          {showAnalytics ? "📊 Hide Analytics" : "📊 View Analytics"}
        </button>

        {showAnalytics && (
          <div style={{
            padding: "20px",
            backgroundColor: "#f4f6f8",
            borderRadius: "8px",
            marginTop: "15px",
            border: "1px solid #e0e0e0"
          }}>
            <h3 style={{ color: "#2c3e50", marginTop: 0, marginBottom: "20px" }}>
              Comment Analytics Dashboard
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
              <div style={{ background: "white", padding: "15px", borderRadius: "6px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "0.9rem", color: "#7f8c8d" }}>📧 Top Email Domains</h4>
                <ul style={{ paddingLeft: "20px", margin: 0 }}>
                  {Object.entries(comments.reduce((acc, curr) => {
                    const domain = curr.email.split('@')[1];
                    acc[domain] = (acc[domain] || 0) + 1;
                    return acc;
                  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([domain, count]) => (
                    <li key={domain} style={{ marginBottom: '4px' }}>
                      <strong>{domain}</strong>: {count} comment{count > 1 ? 's' : ''}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ background: "white", padding: "15px", borderRadius: "6px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "0.9rem", color: "#7f8c8d" }}>💬 Engagement Metrics</h4>
                <div style={{ fontSize: "0.85rem" }}>
                  <p style={{ margin: "5px 0" }}>
                    <strong>Avg Length:</strong> {Math.round(comments.reduce((sum, c) => sum + c.body.length, 0) / (comments.length || 1))} chars
                  </p>
                  <p style={{ margin: "5px 0" }}>
                    <strong>Detailed (&gt;100):</strong> {comments.filter(c => c.body.length > 100).length} ({Math.round(comments.filter(c => c.body.length > 100).length / (comments.length || 1) * 100)}%)
                  </p>
                  <p style={{ margin: "5px 0" }}>
                    <strong>Brief (&lt;50):</strong> {comments.filter(c => c.body.length < 50).length} ({Math.round(comments.filter(c => c.body.length < 50).length / (comments.length || 1) * 100)}%)
                  </p>
                </div>
              </div>
              <div style={{ background: "white", padding: "15px", borderRadius: "6px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "0.9rem", color: "#7f8c8d" }}>😊 Sentiment Analysis</h4>
                <div>
                  {(() => {
                    const positiveWords = ['good', 'great', 'excellent', 'love', 'wonderful', 'thanks', 'thank'];
                    const negativeWords = ['bad', 'poor', 'issue', 'error', 'problem', 'hate', 'terrible'];
                    const positive = comments.filter(c =>
                      positiveWords.some(word => c.body.toLowerCase().includes(word))
                    ).length;
                    const negative = comments.filter(c =>
                      negativeWords.some(word => c.body.toLowerCase().includes(word))
                    ).length;
                    const neutral = comments.length - positive - negative;
                    return (
                      <div style={{ fontSize: "0.85rem" }}>
                        <p style={{ margin: "5px 0", color: "#27ae60" }}>✅ Positive: {positive} ({Math.round(positive / (comments.length || 1) * 100)}%)</p>
                        <p style={{ margin: "5px 0", color: "#e74c3c" }}>❌ Negative: {negative} ({Math.round(negative / (comments.length || 1) * 100)}%)</p>
                        <p style={{ margin: "5px 0", color: "#95a5a6" }}>⚪ Neutral: {neutral} ({Math.round(neutral / (comments.length || 1) * 100)}%)</p>
                      </div>
                    );
                  })()}
                </div>
              </div>
              <div style={{ background: "white", padding: "15px", borderRadius: "6px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "0.9rem", color: "#7f8c8d" }}>🔤 Top Keywords</h4>
                <div style={{ fontSize: "0.75rem", display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {(() => {
                    const words = comments.flatMap(c =>
                      c.body.toLowerCase().split(/\s+/).filter(w => w.length > 4)
                    );
                    const freq = words.reduce((acc, word) => {
                      acc[word] = (acc[word] || 0) + 1;
                      return acc;
                    }, {});
                    return Object.entries(freq)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 8)
                      .map(([word, count]) => (
                        <span key={word} style={{
                          padding: '4px 8px',
                          backgroundColor: '#e3f2fd',
                          borderRadius: '12px',
                          border: '1px solid #90caf9'
                        }}>
                          {word} ({count})
                        </span>
                      ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <section>
        <h3 style={{
          color: "#2c3e50",
          marginBottom: "15px",
          borderBottom: "2px solid #ecf0f1",
          paddingBottom: "10px"
        }}>
          Comments ({comments.length})
        </h3>
        {comments.length === 0 ? (
          <p style={{ color: "#95a5a6", fontStyle: "italic" }}>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                border: "1px solid #e0e0e0",
                padding: "15px",
                marginBottom: "12px",
                borderRadius: "6px",
                backgroundColor: "#ffffff",
                transition: "box-shadow 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
            >
              <p style={{
                fontWeight: "600",
                color: "#2c3e50",
                marginBottom: "8px",
                fontSize: "0.95rem"
              }}>
                {comment.name}
              </p>
              <p style={{
                color: "#555",
                lineHeight: "1.6",
                marginBottom: "8px"
              }}>
                {comment.body}
              </p>
              <small style={{ color: "#7f8c8d", fontSize: "0.85rem" }}>
                {comment.email}
              </small>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default PostDetails;