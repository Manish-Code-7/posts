import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import AboutPage from './pages/PostDetails';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:id" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
