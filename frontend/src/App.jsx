import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import './App.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';

function App() {
  useSmoothScroll();

  return (
    <BrowserRouter>
      <div className="w-full min-h-screen bg-slate-950 text-slate-100">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lienhe" element={<ContactPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
