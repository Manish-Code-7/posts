import { createContext, useState } from "react";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  return (
    <PostContext.Provider value={{ posts, setPosts, users, setUsers }}>
      {children}
    </PostContext.Provider>
  );
};