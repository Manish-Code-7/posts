import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PostProvider } from './store/Postcontext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<PostProvider>
  <App />
</PostProvider>
);


