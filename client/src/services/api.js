const BASE_URL = "https://jsonplaceholder.typicode.com";

const handleResponse = async (res) => {
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
};

export const fetchPosts = async () => {
  const res = await fetch(`${BASE_URL}/posts`);
  return handleResponse(res);
};

export const fetchUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`);
  return handleResponse(res);
};

export const fetchPostById = async (id) => {
  const res = await fetch(`${BASE_URL}/posts/${id}`);
  return handleResponse(res);
};

export const fetchCommentsByPostId = async (id) => {
  const res = await fetch(`${BASE_URL}/posts/${id}/comments`);
  return handleResponse(res);
};

export const fetchComments = async () => {
  const res = await fetch(`${BASE_URL}/comments`);
  return handleResponse(res);
};