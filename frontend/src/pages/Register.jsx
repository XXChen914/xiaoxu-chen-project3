import axios from "axios";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import FormField from "../components/FormField.jsx";

export default function Register() {
  const { setUsername } = useOutletContext();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordVerify: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Update form state on input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.username || !formData.password || !formData.passwordVerify) {
      setError("All fields are required.");
      return;
    }
    if (formData.password !== formData.passwordVerify) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const username = formData.username.trim();
      const password = formData.password.trim();
      const verifyPassword = formData.passwordVerify.trim();

      const res = await axios.post(
        "/api/user/register",
        {
          username,
          password,
          verifyPassword,
        },
        {
          withCredentials: true, // important for cookies
        }
      );

      // Registration successful, redirect to /games
      setUsername(res.data.username);
      navigate("/games");
    } catch (err) {
      // Axios error handling
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const goLogin = () => {
    navigate("/login");
  };

  return (
    <Layout
      title="Create an account"
      subtitle={
        <>
          Already have an account?{" "}
          <button type="button" className="link-btn" onClick={goLogin}>
            Log in
          </button>
        </>
      }
    >
      <form className="form" onSubmit={handleSubmit}>
        <FormField
          id="reg-username"
          name="username"
          label="Username"
          placeholder="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
        />

        <FormField
          id="reg-password"
          name="password"
          label="Password"
          placeholder="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />

        <FormField
          id="reg-password-verify"
          name="passwordVerify"
          label="Verify Password"
          placeholder="retype password"
          type="password"
          value={formData.passwordVerify}
          onChange={handleChange}
        />
        {error && <div className="error-message">{error}</div>}
        <div className="submit-row">
          <button
            className="btn"
            type="submit"
            disabled={
              loading ||
              !formData.username ||
              !formData.password ||
              !formData.passwordVerify ||
              formData.password !== formData.passwordVerify
            }
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </div>
      </form>
    </Layout>
  );
}
