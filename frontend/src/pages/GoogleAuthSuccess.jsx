import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(user => {
        if (user && user.id) {
          localStorage.setItem("user", JSON.stringify(user));
          navigate("/dashboard");
        } else {
          navigate("/login");
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  return <div>Logging you in...</div>;
}