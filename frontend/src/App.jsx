import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import './App.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import TheoryPracticePage from './pages/TheoryPracticePage';
import ExamBListPage from './pages/ExamBListPage';
import ExamBPage from './pages/ExamBPage';
import ExamA1ListPage from './pages/ExamA1ListPage';
import ExamA1Page from './pages/ExamA1Page';
import MaterialsListPage from './pages/MaterialsListPage';
import MaterialDetailPage from './pages/MaterialDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import AdminDashboard from './components/mvpblocks';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  return (
    <div className={isAdmin ? "w-full min-h-screen bg-gray-50 text-gray-900" : "w-full min-h-screen bg-slate-950 text-slate-100"}>
      {!isAdmin && <Header />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lienhe" element={<ContactPage />} />
        <Route path="/lythuyet/1" element={<TheoryPracticePage />} />
          <Route path="/lythuyet/hang-b" element={<ExamBListPage />} />
          <Route path="/lythuyet/hang-b/de/:variant" element={<ExamBPage />} />
          <Route path="/lythuyet/hang-a1" element={<ExamA1ListPage />} />
          <Route path="/lythuyet/hang-a1/de/:variant" element={<ExamA1Page />} />
          <Route path="/tailieu" element={<MaterialsListPage />} />
          <Route path="/tailieu/:id" element={<MaterialDetailPage />} />
        <Route path="/khoahoc" element={<CoursesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      {!isAdmin && <Footer />}
      </div>
  );
}

function App() {
  useSmoothScroll();
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
