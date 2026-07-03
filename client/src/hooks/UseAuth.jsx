import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");

        // Si aucun jeton n'est présent, on arrête immédiatement le chargement
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Requête vers VOTRE serveur backend Node/Express uniquement
        const response = await fetch("/current-user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // data.data contient l'objet profil retourné par le contrôleur Express
          setUser(data.data);
        } else {
          // Si le jeton est expiré ou invalide côté Express, on nettoie le navigateur
          if (response.status === 401) {
            localStorage.removeItem("token");
          }
          setUser(null);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la session:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Déclenché par le handleSubmit de votre formulaire lors d'une connexion réussie
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  // Déconnexion complète côté client
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Lecture sécurisée du rôle utilisateur calculé depuis le backend
  const role = user?.roles?.name?.toLowerCase() || "";
  const isPrivileged = ["admin", "superadmin"].includes(role);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isPrivileged,
        role,
      }}
    >
      {/* 
        Empêche l'application de clignoter ou d'afficher des pages protégées 
        pendant que le serveur Express valide le token au démarrage
      */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
