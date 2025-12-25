import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PostContext } from "../store/Postcontext";
import { fetchPosts, fetchUsers } from "../services/api";

function Home() {
  const { posts, setPosts, users, setUsers } = useContext(PostContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const postsData = await fetchPosts();
        const usersData = await fetchUsers();
        setPosts(postsData);
        setUsers(usersData);
      } catch (err) {
        setError(err.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [setPosts, setUsers]);

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown";
  };

  if (loading) {
    return <h3 style={{ padding: "20px" }}>Loading posts...</h3>;
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <h3>Error: {error}</h3>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Posts</h2>

      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{post.title}</h3>
          <p>{post.body}</p>
          <p>
            <strong>Author:</strong> {getUserName(post.userId)}
          </p>
          <Link to={`/post/${post.id}`}>View Details</Link>
        </div>
      ))
      )}
    </div>
  );
}

export default Home;