import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./hooks/useAuth.jsx";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import CreateService from "./pages/dashboard/CreateService.jsx";
import EditService from "./pages/dashboard/EditService.jsx";
import Profile from "./pages/dashboard/Profile.jsx";
import About from "./pages/About.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Orders from "./pages/dashboard/Orders.jsx";
import Contact from "./pages/Contact.jsx";
import Auth from "./pages/Auth.jsx";
import NotFound from "./pages/NotFound.jsx";
import CategoryDetails from "./pages/CategoryDetails.jsx";
import OrderService from "./pages/OrderService.jsx";
import AuthCallback from './pages/AuthCallback.jsx';

/**
 * Composant interne pour sécuriser l'accès aux routes privées du Dashboard
 */
function ProtectedRoute() {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Si l'authentification a fini de charger et qu'aucun utilisateur n'est connecté
    if (!loading && !user) {
      toast.error("Veuillez vous connecter pour accéder au tableau de bord 🔒");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  // Si l'utilisateur est connecté, on affiche la page demandée, sinon redirection vers /login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <Navbar />

        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            {/* 🌐 Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/categories/:id/services" element={<CategoryDetails />} />
            <Route path="/services/:id/order" element={<OrderService />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Auth />} />

            {/* 🔒 Routes privées du Dashboard (Protégées par le middleware de routage React) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/orders" element={<Orders />} />
              <Route path="/dashboard/add-service" element={<CreateService />} />
              <Route path="/dashboard/edit-service/:id" element={<EditService />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* 🛑 Erreur 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Notification unifiée de l'application */}
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
