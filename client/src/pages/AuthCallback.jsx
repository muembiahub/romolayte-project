import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard");
  }, []);

  return(
  <p className="  text-center mt-5 text-2xl">Confirmation en cours...</p>
  );

}