import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import FormField from "../components/FormField.jsx";
import "./AuthForm.css";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Update form state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.password) {
      setError("Username and password are required.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "/api/user/login",
        {
          username: formData.username,
          password: formData.password,
        },
        {
          withCredentials: true, // REQUIRED for cookies
        }
      );

      // Login successful
      navigate("/games");
    } catch (err) {
      if (err.response?.data) {
        setError(err.response.data);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const goRegister = () => {
    navigate("/register");
  };

  return (
    <Layout title="Log in" subtitle="Welcome Back!">
      <form className="form" onSubmit={handleSubmit}>
        <FormField
          id="login-username"
          name="username"
          label="Username"
          placeholder="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
        />

        <FormField
          id="login-password"
          name="password"
          label="Password"
          placeholder="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        {error && <div className="error-message">{error}</div>}

        <div className="submit-row">
          <button
            className="btn"
            type="submit"
            disabled={loading || !formData.username || !formData.password}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </div>

        <div className="submit-row">
          <span className="small">
            Don&apos;t have an account?{" "}
            <button type="button" className="link-btn" onClick={goRegister}>
              Sign up
            </button>
          </span>
        </div>
      </form>
    </Layout>
  );
}
