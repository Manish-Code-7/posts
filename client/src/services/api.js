const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

export const fetchPosts = async () => {
  const res = await fetch(`${BASE_URL}/posts`);
  return res.json();
};

export const fetchUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`);
  return res.json();
};

export const fetchPostById = async (id) => {
  const res = await fetch(`${BASE_URL}/posts/${id}`);
  return res.json();
};

export const fetchCommentsByPostId = async (id) => {
  const res = await fetch(`${BASE_URL}/posts/${id}/comments`);
  return res.json();
};