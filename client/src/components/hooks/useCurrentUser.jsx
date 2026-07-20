// hooks/useCurrentUser.js
import { useEffect, useState } from "react";

export default function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      const res = await fetch("/auth/current-user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!data.success) {
        setUser(null);
        setRole(null);
      } else {
        setUser(data.user);
        setRole(data.user?.roles?.name || null);
      }
    } catch (err) {
      console.log(err);
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return {
    user,
    role,
    loading,
    reload: loadUser,
  };
}