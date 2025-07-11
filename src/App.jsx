import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Winners from './pages/Winners';
import Header from './components/Header';
import Footer from './components/Footer';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import CompetitionDetails from './components/CompetitionDetails';
import CompetitionAllDetails from './components/CompetitionAllDetails';
import NotFound from './components/NotFound'; // Assuming you have a NotFound component

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/winners" element={<Winners />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/competition/:id" element={<CompetitionDetails />} />
            <Route path="/competition/:id/all-tickets" element={<CompetitionAllDetails />} />
            <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
