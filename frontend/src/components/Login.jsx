import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialForm = {
  username: "",
  password: ""
};

const roleRoutes = {
  Admin: "/admin",
  Doctor: "/doctor",
  Patient: "/patient"
};

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setIsError(true);
      setMessage("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setMessage("");

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid credentials");
      }

      setMessage(data.message);
      setFormData(initialForm);
      navigate(roleRoutes[data.role]);
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Unable to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="auth-card auth-card-enhanced">
        <div className="auth-hero">
          <p className="eyebrow">Care Access Portal</p>
          <h1>Welcome</h1>
        </div>

        <div className="auth-form-shell">
          <form onSubmit={handleSubmit} className="panel-form">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />

            {message ? (
              <p className={isError ? "feedback error-message" : "feedback success-message"}>
                {message}
              </p>
            ) : null}

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="credentials-panel">
            <h2>Mock Credentials</h2>
            <p>Admin: admin / admin123</p>
            <p>Doctor: doctor1 / doc123</p>
            <p>Patient: patient1 / pat123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
