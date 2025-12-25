import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
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
        <Link to="/">⬅ Back to Posts</Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ padding: "20px" }}>
        <h3>Post not found</h3>
        <Link to="/">⬅ Back to Posts</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/">⬅ Back to Posts</Link>

      <h2>{post.title}</h2>
      <p>{post.body}</p>

      {author && (
        <div style={{ marginTop: "10px" }}>
          <h4>Author Details</h4>
          <p><strong>Name:</strong> {author.name}</p>
          <p><strong>Email:</strong> {author.email}</p>
        </div>
      )}

      <hr />

      <h3>Comments</h3>
      {comments.map((comment) => (
        <div
          key={comment.id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "8px",
          }}
        >
          <p><strong>{comment.name}</strong></p>
          <p>{comment.body}</p>
          <small>{comment.email}</small>
        </div>
      ))}
    </div>
  );
}

export default PostDetails;