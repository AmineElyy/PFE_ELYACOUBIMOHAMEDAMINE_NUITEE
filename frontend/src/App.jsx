import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Details from './pages/Details';
import Checkout from './pages/Checkout';
import Success from './pages/Success';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-accent">BookingAPI</h1>
            <nav className="space-x-4">
              <a href="/" className="text-gray-600 hover:text-accent font-medium">Recherche</a>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hotel/:id" element={<Details />} />
            <Route path="/checkout/:prebookId" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
