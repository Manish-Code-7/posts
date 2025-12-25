import { useContext, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { PostContext } from "../store/Postcontext";
import { fetchPosts, fetchUsers } from "../services/api";

function Home() {
  const { posts, setPosts, users, setUsers } = useContext(PostContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showUsers, setShowUsers] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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

  const processedPosts = useMemo(() => {
    let result = [...posts];

    // Search filter with debounced term
    if (debouncedSearch) {
      const lowerTerm = debouncedSearch.toLowerCase();
      result = result.filter(post =>
        post.title.toLowerCase().includes(lowerTerm) ||
        post.body.toLowerCase().includes(lowerTerm) ||
        getUserName(post.userId).toLowerCase().includes(lowerTerm)
      );
    }

    // Sorting with more options
    if (sortConfig.key) {
      result.sort((a, b) => {
        let valA, valB;
        if (sortConfig.key === 'author') {
          valA = getUserName(a.userId).toLowerCase();
          valB = getUserName(b.userId).toLowerCase();
        } else if (sortConfig.key === 'titleLength') {
          valA = a.title.length;
          valB = b.title.length;
        } else if (sortConfig.key === 'title') {
          valA = a.title.toLowerCase();
          valB = b.title.toLowerCase();
        } else if (sortConfig.key === 'id') {
          valA = a.id;
          valB = b.id;
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [posts, debouncedSearch, sortConfig, users]);

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
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
      <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
        <h3 style={{ marginTop: 0, fontSize: "1.1rem", color: "#2c3e50" }}>🔍 Search & Filter</h3>
        <input
          type="text"
          placeholder="Search by title, content, or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px 15px",
            width: "100%",
            boxSizing: "border-box",
            marginBottom: "15px",
            border: "2px solid #ddd",
            borderRadius: "6px",
            fontSize: "1rem"
          }}
        />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <strong style={{ marginRight: '5px' }}>Sort by:</strong>
          <button
            onClick={() => handleSort('title')}
            style={{
              padding: "8px 14px",
              cursor: 'pointer',
              border: sortConfig.key === 'title' ? '2px solid #3498db' : '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: sortConfig.key === 'title' ? '#e3f2fd' : 'white'
            }}
          >
            Title {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('author')}
            style={{
              padding: "8px 14px",
              cursor: 'pointer',
              border: sortConfig.key === 'author' ? '2px solid #3498db' : '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: sortConfig.key === 'author' ? '#e3f2fd' : 'white'
            }}
          >
            Author {sortConfig.key === 'author' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('titleLength')}
            style={{
              padding: "8px 14px",
              cursor: 'pointer',
              border: sortConfig.key === 'titleLength' ? '2px solid #3498db' : '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: sortConfig.key === 'titleLength' ? '#e3f2fd' : 'white'
            }}
          >
            Length {sortConfig.key === 'titleLength' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('id')}
            style={{
              padding: "8px 14px",
              cursor: 'pointer',
              border: sortConfig.key === 'id' ? '2px solid #3498db' : '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: sortConfig.key === 'id' ? '#e3f2fd' : 'white'
            }}
          >
            ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => setShowUsers(!showUsers)}
            style={{
              padding: "8px 14px",
              cursor: 'pointer',
              marginLeft: 'auto',
              backgroundColor: showUsers ? '#3498db' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            {showUsers ? '👥 Hide Users' : '👥 Show Users'}
          </button>
        </div>
      </div>

      {showUsers && (
        <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
          <h3>User Directory</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {users.map(user => (
              <li key={user.id} style={{ padding: '8px', background: '#fff', border: '1px solid #eee' }}>
                <strong>{user.name}</strong><br />
                <small>{user.email}</small>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2>Posts ({processedPosts.length})</h2>

      {processedPosts.length === 0 ? (
        <p>No posts match your search.</p>
      ) : (
        processedPosts.map((post) => (
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