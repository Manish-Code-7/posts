import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PostContext } from "../store/Postcontext";

function ShowPosts() {
  const { userId } = useParams();
  const { posts, users } = useContext(PostContext);
  const [userPosts, setUserPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (userId && posts.length > 0 && users.length > 0) {
      const parsedUserId = parseInt(userId);
      const filteredPosts = posts.filter(post => post.userId === parsedUserId);
      const user = users.find(u => u.id === parsedUserId);

      setUserPosts(filteredPosts);
      setCurrentUser(user);
    }
  }, [userId, posts, users]);

  if (!currentUser) {
    return <div style={{ padding: "20px" }}>
      <h3>Loading user information...</h3>
    </div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{
        marginBottom: "30px",
        padding: "20px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        border: "1px solid #dee2e6"
      }}>
        <h2 style={{ marginTop: 0, color: "#2c3e50" }}>
          👤 {currentUser.name}
        </h2>
        <p style={{ margin: "5px 0", color: "#6c757d" }}>
          <strong>Email:</strong> {currentUser.email}
        </p>
        <p style={{ margin: "5px 0", color: "#6c757d" }}>
          <strong>Username:</strong> {currentUser.username}
        </p>
        <p style={{ margin: "5px 0", color: "#6c757d" }}>
          <strong>Phone:</strong> {currentUser.phone}
        </p>
        <p style={{ margin: "5px 0", color: "#6c757d" }}>
          <strong>Website:</strong> {currentUser.website}
        </p>
      </div>

      <h3 style={{ color: "#2c3e50" }}>
        Posts by {currentUser.name} ({userPosts.length})
      </h3>

      {userPosts.length === 0 ? (
        <p style={{ color: "#6c757d" }}>This user hasn't posted anything yet.</p>
      ) : (
        <div>
          {userPosts.map((post) => (
            <div
              key={post.id}
              style={{
                border: "1px solid #dee2e6",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "6px",
                backgroundColor: "#ffffff",
                transition: "box-shadow 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
            >
              <h4 style={{ marginTop: 0, color: "#2c3e50" }}>
                {post.title}
              </h4>
              <p style={{ color: "#495057", lineHeight: "1.6" }}>
                {post.body}
              </p>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "10px"
              }}>
                <span style={{ color: "#6c757d", fontSize: "0.9rem" }}>
                  💬 {post.commentsCount || 0} comments
                </span>
                <Link
                  to={`/post/${post.id}`}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#3498db",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "4px",
                    fontSize: "0.9rem"
                  }}
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShowPosts;