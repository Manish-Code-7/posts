import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import AboutPage from './pages/PostDetails';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:id" element={<AboutPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
