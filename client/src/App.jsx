import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import  CreateService from "./pages/CreateService.jsx";
import About from "./pages/About.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Contact from "./pages/Contact.jsx";
import Auth from "./pages/Auth.jsx";
import NotFound from "./pages/NotFound.jsx";
import CategoryDetails from "./pages/CategoryDetails.jsx";
import OrderService from "./pages/OrderService.jsx";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/services" element={<Services />} />
            <Route path="/service/create" element={<CreateService/>} />

            {/* Nouvelle route */}
            <Route
              path="/categories/:id/services"
              element={<CategoryDetails />}
            />
            <Route
                path="/services/:id/order"
                element={<OrderService />}
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-right" />
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;